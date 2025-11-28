# AgriVerse 前后端连通性测试脚本
# 使用虚拟测试方法测试所有API端点和连通性

param(
    [string]$BackendUrl = "http://localhost:8080",
    [string]$FrontendUrl = "http://localhost:5173",
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

# 颜色输出函数
function Write-Success { param($msg) Write-Host $msg -ForegroundColor Green }
function Write-Error { param($msg) Write-Host $msg -ForegroundColor Red }
function Write-Info { param($msg) Write-Host $msg -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host $msg -ForegroundColor Yellow }

# 测试结果统计
$script:TotalTests = 0
$script:PassedTests = 0
$script:FailedTests = 0
$script:TestResults = @()

# 测试结果记录
function Record-Test {
    param(
        [string]$Name,
        [bool]$Passed,
        [string]$Message = "",
        [int]$StatusCode = 0,
        [string]$ResponseTime = ""
    )
    
    $script:TotalTests++
    if ($Passed) {
        $script:PassedTests++
        Write-Success "  ✓ $Name"
        if ($Verbose -and $Message) { Write-Host "    $Message" -ForegroundColor Gray }
    } else {
        $script:FailedTests++
        Write-Error "  ✗ $Name"
        if ($Message) { Write-Host "    $Message" -ForegroundColor Red }
    }
    
    $script:TestResults += [PSCustomObject]@{
        Name = $Name
        Passed = $Passed
        Message = $Message
        StatusCode = $StatusCode
        ResponseTime = $ResponseTime
    }
}

# 测试API端点
function Test-ApiEndpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [int[]]$ExpectedStatusCodes = @(200, 401, 403)
    )
    
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            TimeoutSec = 10
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        $stopwatch.Stop()
        $responseTime = "$($stopwatch.ElapsedMilliseconds)ms"
        
        $passed = $ExpectedStatusCodes -contains $response.StatusCode
        $message = "Status: $($response.StatusCode), Time: $responseTime"
        
        Record-Test -Name $Name -Passed $passed -Message $message -StatusCode $response.StatusCode -ResponseTime $responseTime
        
        return @{
            Success = $passed
            StatusCode = $response.StatusCode
            ResponseTime = $responseTime
            Content = $response.Content
        }
    } catch {
        $statusCode = 0
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode.value__
        }
        
        $passed = $ExpectedStatusCodes -contains $statusCode
        $message = "Error: $($_.Exception.Message) (Status: $statusCode)"
        
        Record-Test -Name $Name -Passed $passed -Message $message -StatusCode $statusCode
        
        return @{
            Success = $passed
            StatusCode = $statusCode
            ResponseTime = "N/A"
            Content = ""
        }
    }
}

# 生成虚拟测试数据
function Get-VirtualTestData {
    return @{
        # 虚拟用户数据
        VirtualUser = @{
            phone = "138" + (Get-Random -Minimum 10000000 -Maximum 99999999)
            password = "VirtualTest@123456"
            email = "virtual.test@example.com"
            name = "虚拟测试用户"
            role = "farmer"
        }
        
        # 虚拟商品数据
        VirtualProduct = @{
            name = "虚拟测试商品_" + (Get-Random -Minimum 1000 -Maximum 9999)
            description = "这是一个虚拟测试商品"
            category = "蔬菜"
            price = (Get-Random -Minimum 10 -Maximum 100)
            stock = (Get-Random -Minimum 50 -Maximum 500)
            unit = "斤"
            origin = "虚拟产地"
        }
        
        # 虚拟订单数据
        VirtualOrder = @{
            items = @(
                @{
                    productId = "virtual-product-id"
                    quantity = 2
                    price = 10.50
                }
            )
            addressId = "virtual-address-id"
            remark = "虚拟测试订单"
        }
        
        # 虚拟融资申请数据
        VirtualFinance = @{
            amount = 50000
            termMonths = 12
            purpose = "虚拟测试融资用途"
            productId = "virtual-loan-product-id"
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AgriVerse 前后端连通性测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Info "后端地址: $BackendUrl"
Write-Info "前端地址: $FrontendUrl"
Write-Host ""

# 1. 测试服务可用性
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "1. 服务可用性测试" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# 测试后端服务
Write-Info "测试后端服务..."
$backendTest = Test-ApiEndpoint -Name "后端服务健康检查" -Url "$BackendUrl/api/auth/health" -ExpectedStatusCodes @(200)
if (-not $backendTest.Success) {
    Write-Error "后端服务不可用，请确保后端服务正在运行"
    Write-Host "启动命令: cd ../backend && mvn spring-boot:run" -ForegroundColor Yellow
    exit 1
}

# 测试前端服务
Write-Info "测试前端服务..."
try {
    $frontendResponse = Invoke-WebRequest -Uri $FrontendUrl -TimeoutSec 5 -ErrorAction Stop
    Record-Test -Name "前端服务健康检查" -Passed ($frontendResponse.StatusCode -eq 200) -Message "Status: $($frontendResponse.StatusCode)"
} catch {
    Write-Warning "前端服务不可用，但可以继续测试API"
    Record-Test -Name "前端服务健康检查" -Passed $false -Message "Error: $($_.Exception.Message)"
}

Write-Host ""

# 2. 测试认证API
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "2. 认证API测试" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

$testData = Get-VirtualTestData

# 健康检查
Test-ApiEndpoint -Name "认证服务健康检查" -Url "$BackendUrl/api/auth/health" -ExpectedStatusCodes @(200)

# 发送验证码（虚拟测试）
$sendCodeBody = @{
    phone = $testData.VirtualUser.phone
    type = "register"
    role = "farmer"
}
Test-ApiEndpoint -Name "发送验证码API" -Url "$BackendUrl/api/auth/send-code" -Method "POST" -Body $sendCodeBody -ExpectedStatusCodes @(200, 400, 429)

# 检查手机号是否存在
Test-ApiEndpoint -Name "检查手机号API" -Url "$BackendUrl/api/auth/check-phone?phone=$($testData.VirtualUser.phone)&role=farmer" -ExpectedStatusCodes @(200)

# 用户注册（虚拟测试）
$registerBody = @{
    phone = $testData.VirtualUser.phone
    code = "123456"
    password = $testData.VirtualUser.password
    role = "farmer"
    name = $testData.VirtualUser.name
    email = $testData.VirtualUser.email
}
Test-ApiEndpoint -Name "用户注册API" -Url "$BackendUrl/api/auth/register" -Method "POST" -Body $registerBody -ExpectedStatusCodes @(200, 400, 409)

# 用户登录（虚拟测试）
$loginBody = @{
    phone = $testData.VirtualUser.phone
    password = $testData.VirtualUser.password
    role = "farmer"
}
$loginResult = Test-ApiEndpoint -Name "用户登录API" -Url "$BackendUrl/api/auth/login" -Method "POST" -Body $loginBody -ExpectedStatusCodes @(200, 401)

# 提取token（如果登录成功）
$token = $null
if ($loginResult.Success -and $loginResult.StatusCode -eq 200) {
    try {
        $loginData = $loginResult.Content | ConvertFrom-Json
        if ($loginData.data -and $loginData.data.token) {
            $token = $loginData.data.token
            Write-Success "  获取到Token: $($token.Substring(0, [Math]::Min(20, $token.Length)))..."
        }
    } catch {
        # Token提取失败，继续测试
    }
}

Write-Host ""

# 3. 测试农户API（需要认证）
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "3. 农户API测试" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

$farmerHeaders = @{}
if ($token) {
    $farmerHeaders["Authorization"] = "Bearer $token"
}

# 农户商品健康检查
Test-ApiEndpoint -Name "农户商品服务健康检查" -Url "$BackendUrl/api/farmer/products/health" -Headers $farmerHeaders -ExpectedStatusCodes @(200)

# 获取商品列表（需要认证）
Test-ApiEndpoint -Name "获取商品列表API" -Url "$BackendUrl/api/farmer/products/list?page=1&pageSize=20" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 401)

# 创建商品（虚拟测试）
$productBody = $testData.VirtualProduct
Test-ApiEndpoint -Name "创建商品API" -Url "$BackendUrl/api/farmer/products/create" -Method "POST" -Headers $farmerHeaders -Body $productBody -ExpectedStatusCodes @(200, 400, 401)

# 获取商品数据看板
Test-ApiEndpoint -Name "获取商品数据看板API" -Url "$BackendUrl/api/farmer/products/dashboard" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 401)

Write-Host ""

# 4. 测试买家API（需要认证）
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "4. 买家API测试" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# 买家商品健康检查
Test-ApiEndpoint -Name "买家商品服务健康检查" -Url "$BackendUrl/api/buyer/products/health" -Headers $farmerHeaders -ExpectedStatusCodes @(200)

# 获取商品列表
Test-ApiEndpoint -Name "买家获取商品列表API" -Url "$BackendUrl/api/buyer/products/list?page=1&pageSize=20" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 401)

# 获取购物车
Test-ApiEndpoint -Name "获取购物车API" -Url "$BackendUrl/api/buyer/cart" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 401)

# 获取订单列表
Test-ApiEndpoint -Name "获取订单列表API" -Url "$BackendUrl/api/buyer/orders?page=1&pageSize=20" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 401)

# 获取收货地址列表
Test-ApiEndpoint -Name "获取收货地址列表API" -Url "$BackendUrl/api/buyer/addresses" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 401)

Write-Host ""

# 5. 测试银行API（需要认证）
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "5. 银行API测试" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# 获取贷款产品列表
Test-ApiEndpoint -Name "获取贷款产品列表API" -Url "$BackendUrl/api/bank/loan/products?page=1&pageSize=20" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 401, 403)

# 获取贷款申请列表
Test-ApiEndpoint -Name "获取贷款申请列表API" -Url "$BackendUrl/api/bank/loan/applications?page=1&pageSize=20" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 401, 403)

# 获取统计数据
Test-ApiEndpoint -Name "获取银行统计数据API" -Url "$BackendUrl/api/bank/loan/statistics" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 401, 403)

Write-Host ""

# 6. 测试专家API（需要认证）
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "6. 专家API测试" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# 搜索问题
$qaSearchBody = @{
    keyword = "测试"
    status = "pending"
    page = 1
    pageSize = 20
}
Test-ApiEndpoint -Name "搜索问题API" -Url "$BackendUrl/api/expert/qa/questions/search" -Method "POST" -Headers $farmerHeaders -Body $qaSearchBody -ExpectedStatusCodes @(200, 401, 403)

# 获取待回答问题列表
Test-ApiEndpoint -Name "获取待回答问题列表API" -Url "$BackendUrl/api/expert/qa/questions/pending?page=1&pageSize=20" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 401, 403)

Write-Host ""

# 7. 测试管理员API（需要认证）
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "7. 管理员API测试" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# 获取用户列表
Test-ApiEndpoint -Name "获取用户列表API" -Url "$BackendUrl/api/admin/users?page=1&pageSize=20" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 401, 403)

# 获取订单统计
Test-ApiEndpoint -Name "获取订单统计API" -Url "$BackendUrl/api/admin/orders/statistics" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 401, 403)

Write-Host ""

# 8. 测试文件上传API
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "8. 文件上传API测试" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# 文件上传（需要认证，但可能因为缺少文件而失败）
Test-ApiEndpoint -Name "文件上传API" -Url "$BackendUrl/api/files/upload" -Method "POST" -Headers $farmerHeaders -ExpectedStatusCodes @(200, 400, 401)

Write-Host ""

# 9. 测试前端页面连通性
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "9. 前端页面连通性测试" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

if ($frontendResponse -and $frontendResponse.StatusCode -eq 200) {
    $frontendPages = @(
        @{ Name = "首页"; Path = "/" }
        @{ Name = "角色选择页"; Path = "/select-role" }
        @{ Name = "农户应用"; Path = "/farmer-app" }
        @{ Name = "买家应用"; Path = "/buyer-app" }
        @{ Name = "银行应用"; Path = "/bank-app" }
        @{ Name = "专家应用"; Path = "/expert-app" }
        @{ Name = "管理员应用"; Path = "/admin-app" }
    )
    
    foreach ($page in $frontendPages) {
        try {
            $pageResponse = Invoke-WebRequest -Uri "$FrontendUrl$($page.Path)" -TimeoutSec 5 -ErrorAction Stop
            Record-Test -Name "前端页面: $($page.Name)" -Passed ($pageResponse.StatusCode -eq 200) -Message "Status: $($pageResponse.StatusCode)"
        } catch {
            Record-Test -Name "前端页面: $($page.Name)" -Passed $false -Message "Error: $($_.Exception.Message)"
        }
    }
} else {
    Write-Warning "前端服务不可用，跳过前端页面测试"
}

Write-Host ""

# 10. 测试API响应时间
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "10. API响应时间测试" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

$performanceTests = @(
    @{ Name = "认证健康检查"; Url = "$BackendUrl/api/auth/health" }
    @{ Name = "农户商品健康检查"; Url = "$BackendUrl/api/farmer/products/health" }
    @{ Name = "买家商品健康检查"; Url = "$BackendUrl/api/buyer/products/health" }
)

foreach ($perfTest in $performanceTests) {
    $times = @()
    for ($i = 1; $i -le 5; $i++) {
        try {
            $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
            $response = Invoke-WebRequest -Uri $perfTest.Url -TimeoutSec 5 -ErrorAction Stop
            $stopwatch.Stop()
            $times += $stopwatch.ElapsedMilliseconds
        } catch {
            # 忽略错误
        }
    }
    
    if ($times.Count -gt 0) {
        $avgTime = ($times | Measure-Object -Average).Average
        $maxTime = ($times | Measure-Object -Maximum).Maximum
        $minTime = ($times | Measure-Object -Minimum).Minimum
        
        $passed = $avgTime -lt 1000  # 平均响应时间小于1秒
        $message = "平均: $([math]::Round($avgTime, 2))ms, 最大: ${maxTime}ms, 最小: ${minTime}ms"
        Record-Test -Name "性能测试: $($perfTest.Name)" -Passed $passed -Message $message -ResponseTime "${avgTime}ms"
    }
}

Write-Host ""

# 输出测试总结
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试总结" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "总测试数: $script:TotalTests" -ForegroundColor White
Write-Success "通过: $script:PassedTests"
Write-Error "失败: $script:FailedTests"
$passRate = if ($script:TotalTests -gt 0) { [math]::Round(($script:PassedTests / $script:TotalTests) * 100, 2) } else { 0 }
Write-Host "通过率: $passRate%" -ForegroundColor $(if ($passRate -ge 80) { "Green" } elseif ($passRate -ge 60) { "Yellow" } else { "Red" })
Write-Host ""

# 输出失败测试详情
if ($script:FailedTests -gt 0) {
    Write-Host "失败的测试:" -ForegroundColor Red
    $script:TestResults | Where-Object { -not $_.Passed } | ForEach-Object {
        Write-Host "  ✗ $($_.Name)" -ForegroundColor Red
        if ($_.Message) {
            Write-Host "    $($_.Message)" -ForegroundColor Gray
        }
    }
    Write-Host ""
}

# 生成测试报告
$reportPath = "test-results/connectivity-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$reportDir = Split-Path -Parent $reportPath
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}

$report = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    BackendUrl = $BackendUrl
    FrontendUrl = $FrontendUrl
    Summary = @{
        Total = $script:TotalTests
        Passed = $script:PassedTests
        Failed = $script:FailedTests
        PassRate = $passRate
    }
    Results = $script:TestResults
}

$report | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportPath -Encoding UTF8
Write-Info "测试报告已保存: $reportPath"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 返回退出码
if ($script:FailedTests -eq 0) {
    exit 0
} else {
    exit 1
}

