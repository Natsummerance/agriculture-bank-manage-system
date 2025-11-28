# AgriVerse System - Functional Test Script
# Usage: .\test-system.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AgriVerse System - Functional Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 配置
$API_BASE = "http://localhost:8080/api"
$FRONTEND_URL = "http://localhost:5173"
$TEST_PHONE = "13800138000"
$TEST_PASSWORD = "password123"
$TEST_ROLE = "farmer"

# 测试结果
$testResults = @()

function Test-Service {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET"
    )
    
    Write-Host "测试: $Name" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $Url -Method $Method -TimeoutSec 5 -ErrorAction Stop
        Write-Host "  ✓ 成功 (状态码: $($response.StatusCode))" -ForegroundColor Green
        return @{ Success = $true; StatusCode = $response.StatusCode; Content = $response.Content }
    }
    catch {
        Write-Host "  ✗ 失败: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

function Test-API {
    param(
        [string]$Name,
        [string]$Endpoint,
        [string]$Method = "GET",
        [object]$Body = $null,
        [hashtable]$Headers = @{}
    )
    
    Write-Host "测试API: $Name" -ForegroundColor Yellow
    try {
        $params = @{
            Uri = "$API_BASE$Endpoint"
            Method = $Method
            TimeoutSec = 10
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
            $params.ContentType = "application/json"
        }
        
        if ($Headers.Count -gt 0) {
            $params.Headers = $Headers
        }
        
        $response = Invoke-WebRequest @params
        $content = $response.Content | ConvertFrom-Json
        
        if ($content.success -or $content.code -eq 0) {
            Write-Host "  ✓ 成功" -ForegroundColor Green
            Write-Host "    响应: $($content.message)" -ForegroundColor Gray
            return @{ Success = $true; Data = $content.data; Response = $content }
        }
        else {
            Write-Host "  ✗ API返回错误: $($content.message)" -ForegroundColor Red
            return @{ Success = $false; Error = $content.message }
        }
    }
    catch {
        Write-Host "  ✗ 请求失败: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# Start Testing
Write-Host "1. Checking Service Status" -ForegroundColor Cyan
Write-Host ""

# Check Backend Service
$backendTest = Test-Service "Backend Health Check" "$API_BASE/auth/health"
if (-not $backendTest.Success) {
    Write-Host ""
    Write-Host "Warning: Backend service is not running" -ForegroundColor Yellow
    Write-Host "   Please start backend service (port 8080)" -ForegroundColor Yellow
    Write-Host "   Command: cd ../backend && mvn spring-boot:run" -ForegroundColor Yellow
    Write-Host ""
}

# Check Frontend Service
$frontendTest = Test-Service "Frontend Service" $FRONTEND_URL
if (-not $frontendTest.Success) {
    Write-Host ""
    Write-Host "Warning: Frontend service is not running" -ForegroundColor Yellow
    Write-Host "   Please start frontend service (port 5173)" -ForegroundColor Yellow
    Write-Host "   Command: cd ../frontend && npm run dev" -ForegroundColor Yellow
    Write-Host ""
}

if (-not $backendTest.Success) {
    Write-Host "Backend service is not running, cannot continue API tests" -ForegroundColor Red
    Write-Host "Please start backend service first" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "2. Authentication Tests" -ForegroundColor Cyan
Write-Host ""

# 2.1 Health Check
$healthTest = Test-API "Health Check" "/auth/health"
$testResults += @{ Test = "Health Check"; Success = $healthTest.Success }

# 2.2 Send Verification Code
$sendCodeBody = @{
    phone = $TEST_PHONE
    type = "register"
    role = $TEST_ROLE
}
$sendCodeTest = Test-API "Send Verification Code" "/auth/send-code" "POST" $sendCodeBody
$testResults += @{ Test = "Send Verification Code"; Success = $sendCodeTest.Success }

# 2.3 User Registration
Write-Host "Testing API: User Registration" -ForegroundColor Yellow
$registerBody = @{
    phone = $TEST_PHONE
    code = "123456"
    password = $TEST_PASSWORD
    role = $TEST_ROLE
    name = "Test User"
    email = "test@example.com"
}
$registerTest = Test-API "User Registration" "/auth/register" "POST" $registerBody
$testResults += @{ Test = "User Registration"; Success = $registerTest.Success }

# 2.4 User Login
Write-Host ""
$loginBody = @{
    phone = $TEST_PHONE
    password = $TEST_PASSWORD
    role = $TEST_ROLE
}
$loginTest = Test-API "User Login" "/auth/login" "POST" $loginBody
$testResults += @{ Test = "User Login"; Success = $loginTest.Success }

$token = $null
if ($loginTest.Success -and $loginTest.Data.token) {
    $token = $loginTest.Data.token
    Write-Host "  ✓ 获取到Token: $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Green
}

# 2.5 Get Current User Info (requires token)
if ($token) {
    Write-Host ""
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $meTest = Test-API "Get User Info" "/auth/me" "GET" $null $headers
    $testResults += @{ Test = "Get User Info"; Success = $meTest.Success }
}

Write-Host ""
Write-Host "3. Farmer Product Management Tests" -ForegroundColor Cyan
Write-Host ""

if ($token) {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    # 3.1 Create Product
    $createProductBody = @{
        name = "Test Product-$(Get-Date -Format 'yyyyMMddHHmmss')"
        category = "Grain"
        price = 58.00
        stock = 1000
        origin = "Test Origin"
        description = "This is a test product created by automation"
    }
    $createProductTest = Test-API "Create Product" "/farmer/products/create" "POST" $createProductBody $headers
    $testResults += @{ Test = "Create Product"; Success = $createProductTest.Success }
    
    $productId = $null
    if ($createProductTest.Success -and $createProductTest.Data.id) {
        $productId = $createProductTest.Data.id
        Write-Host "  Success: Created product ID: $productId" -ForegroundColor Green
    }
    
    # 3.2 Get Product List
    Write-Host ""
    $listProductsTest = Test-API "Get Product List" "/farmer/products/list" "GET" $null $headers
    $testResults += @{ Test = "Get Product List"; Success = $listProductsTest.Success }
    
    if ($listProductsTest.Success -and $listProductsTest.Data.products) {
        $productCount = $listProductsTest.Data.products.Count
        Write-Host "  Success: Product count: $productCount" -ForegroundColor Green
    }
}
else {
    Write-Host "  Skipped: Requires login token" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "4. Buyer Function Tests" -ForegroundColor Cyan
Write-Host ""

if ($token) {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    # 4.1 Get Product List (Buyer Market)
    $buyerListTest = Test-API "Get Buyer Product List" "/buyer/products/list" "GET" $null $headers
    $testResults += @{ Test = "Get Buyer Product List"; Success = $buyerListTest.Success }
}
else {
    Write-Host "  Skipped: Requires login token" -ForegroundColor Yellow
}

# Test Results Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Success }).Count
$failedTests = $totalTests - $passedTests

foreach ($result in $testResults) {
    $status = if ($result.Success) { "[PASS]" } else { "[FAIL]" }
    $color = if ($result.Success) { "Green" } else { "Red" }
    Write-Host "$status $($result.Test)" -ForegroundColor $color
}

Write-Host ""
Write-Host "Total: $totalTests tests" -ForegroundColor Cyan
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor $(if ($failedTests -gt 0) { "Red" } else { "Green" })

Write-Host ""
Write-Host "Testing completed!" -ForegroundColor Cyan
Write-Host ""

# Tips
if (-not $frontendTest.Success) {
    Write-Host "Tip: Frontend service is not running, please run 'cd ../frontend && npm run dev' to start it" -ForegroundColor Yellow
}

