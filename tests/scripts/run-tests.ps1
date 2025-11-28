# AgriVerse 测试运行脚本
# 运行所有测试并生成报告

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AgriVerse 完整测试套件" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Java和Maven
Write-Host "检查环境..." -ForegroundColor Yellow
$javaVersion = java -version 2>&1 | Select-String "version"
$mavenVersion = mvn -version 2>&1 | Select-String "Apache Maven"

if (-not $javaVersion) {
    Write-Host "❌ 未找到Java，请先安装JDK 21+" -ForegroundColor Red
    exit 1
}

if (-not $mavenVersion) {
    Write-Host "⚠️  未找到Maven，将跳过后端测试" -ForegroundColor Yellow
    $skipBackend = $true
} else {
    $skipBackend = $false
}

Write-Host "✓ Java: $javaVersion" -ForegroundColor Green
if (-not $skipBackend) {
    Write-Host "✓ Maven: $mavenVersion" -ForegroundColor Green
}
Write-Host ""

# 运行后端测试
if (-not $skipBackend) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "运行后端测试..." -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    $projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
    $backendDir = Join-Path $projectRoot "backend"
    Push-Location $backendDir
    try {
        mvn clean test
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✓ 后端测试通过" -ForegroundColor Green
            Write-Host ""
            Write-Host "测试报告位置: backend/target/site/surefire-report.html" -ForegroundColor Cyan
        } else {
            Write-Host ""
            Write-Host "❌ 后端测试失败" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ 运行后端测试时出错: $_" -ForegroundColor Red
    } finally {
        Pop-Location
    }
    Write-Host ""
}

# 检查Node.js和npm
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "运行前端测试..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$nodeVersion = node -v 2>&1
$npmVersion = npm -v 2>&1

if (-not $nodeVersion) {
    Write-Host "❌ 未找到Node.js，请先安装Node.js" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
Write-Host ""

# 运行前端测试
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$frontendDir = Join-Path $projectRoot "frontend"

# 检查是否安装了测试依赖
if (-not (Test-Path (Join-Path $frontendDir "node_modules\vitest"))) {
    Write-Host "安装测试依赖..." -ForegroundColor Yellow
    Push-Location $frontendDir
    npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/ui @vitest/coverage-v8 jsdom
    Pop-Location
}

Push-Location $frontendDir
try {
    npm run test
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ 前端测试通过" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ 前端测试失败" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 运行前端测试时出错: $_" -ForegroundColor Red
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 测试报告:" -ForegroundColor Yellow
if (-not $skipBackend) {
    Write-Host "  后端: backend/target/site/surefire-report.html" -ForegroundColor White
}
Write-Host "  前端: frontend/coverage/index.html" -ForegroundColor White
Write-Host ""

