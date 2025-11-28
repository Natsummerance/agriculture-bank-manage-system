# AgriVerse E2E集成测试运行脚本
# 自动启动服务并运行完整E2E测试

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AgriVerse E2E 集成测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Node.js
Write-Host "检查环境..." -ForegroundColor Yellow
$nodeVersion = node -v 2>&1
if (-not $nodeVersion) {
    Write-Host "❌ 未找到Node.js，请先安装Node.js" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host ""

# 检查端口占用
Write-Host "检查端口占用..." -ForegroundColor Yellow
$frontendPort = 5173
$backendPort = 8080

$frontendProcess = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue
$backendProcess = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue

if ($frontendProcess) {
    Write-Host "⚠️  前端服务已在运行 (端口 $frontendPort)" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  前端服务未运行，将自动启动" -ForegroundColor Cyan
}

if ($backendProcess) {
    Write-Host "⚠️  后端服务已在运行 (端口 $backendPort)" -ForegroundColor Yellow
} else {
    Write-Host "❌ 后端服务未运行，请先启动后端服务" -ForegroundColor Red
    Write-Host "   运行命令: cd ../backend && mvn spring-boot:run" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 检查E2E测试依赖
Write-Host "检查E2E测试依赖..." -ForegroundColor Yellow
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$e2eDir = Join-Path $projectRoot "tests\e2e"
$frontendDir = Join-Path $projectRoot "frontend"

if (-not (Test-Path (Join-Path $e2eDir "node_modules"))) {
    Write-Host "安装E2E测试依赖..." -ForegroundColor Yellow
    Push-Location $e2eDir
    npm install
    Pop-Location
}

# 安装Playwright浏览器（如果需要）
if (-not (Test-Path (Join-Path $e2eDir "node_modules\@playwright\test\.local-browsers"))) {
    Write-Host "安装Playwright浏览器..." -ForegroundColor Yellow
    Push-Location $e2eDir
    npx playwright install
    Pop-Location
}

Write-Host ""

# 启动前端服务（如果未运行）
if (-not $frontendProcess) {
    Write-Host "启动前端服务..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev"
    Write-Host "等待前端服务启动..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # 检查前端服务是否启动成功
    $maxRetries = 30
    $retryCount = 0
    $frontendReady = $false
    
    while ($retryCount -lt $maxRetries -and -not $frontendReady) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$frontendPort" -TimeoutSec 2 -ErrorAction Stop
            $frontendReady = $true
            Write-Host "✓ 前端服务已启动" -ForegroundColor Green
        } catch {
            $retryCount++
            Start-Sleep -Seconds 2
        }
    }
    
    if (-not $frontendReady) {
        Write-Host "❌ 前端服务启动失败" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# 运行E2E测试
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "运行E2E测试..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Push-Location $e2eDir
try {
    # 运行测试
    npm run test
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ E2E测试通过" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 测试报告位置:" -ForegroundColor Yellow
        Write-Host "   HTML报告: tests/e2e/test-results/index.html" -ForegroundColor White
        Write-Host "   JSON报告: tests/e2e/test-results/results.json" -ForegroundColor White
        Write-Host "   截图目录: tests/e2e/test-results/*.png" -ForegroundColor White
        Write-Host ""
        Write-Host "查看报告: cd ../tests/e2e && npm run test:report" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ E2E测试失败" -ForegroundColor Red
        Write-Host "   请查看测试报告和截图了解详情" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ 运行E2E测试时出错: $_" -ForegroundColor Red
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

