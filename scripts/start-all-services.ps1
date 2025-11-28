# Start All Services Script
# Usage: .\start-all-services.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AgriVerse System - Start All Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is running
Write-Host "1. Checking MySQL Database..." -ForegroundColor Yellow
try {
    $mysqlService = Get-Service -Name "*mysql*" -ErrorAction SilentlyContinue
    if ($mysqlService) {
        Write-Host "   MySQL service found: $($mysqlService.Name)" -ForegroundColor Green
        if ($mysqlService.Status -eq "Running") {
            Write-Host "   MySQL is running" -ForegroundColor Green
        } else {
            Write-Host "   MySQL is not running. Please start MySQL service manually." -ForegroundColor Yellow
            Write-Host "   Command: Start-Service -Name '$($mysqlService.Name)'" -ForegroundColor Gray
        }
    } else {
        Write-Host "   MySQL service not found. Please ensure MySQL is installed and running." -ForegroundColor Yellow
    }
} catch {
    Write-Host "   Could not check MySQL service status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2. Starting Backend Service..." -ForegroundColor Yellow
Write-Host "   This will start Spring Boot on port 8080" -ForegroundColor Gray
Write-Host "   Press Ctrl+C to stop the service" -ForegroundColor Gray
Write-Host ""

# Check if Maven is available
try {
    $mvnVersion = mvn -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   Maven found, starting backend..." -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; mvn spring-boot:run"
        Write-Host "   Backend service starting in new window..." -ForegroundColor Green
    } else {
        Write-Host "   Maven not found in PATH" -ForegroundColor Red
        Write-Host "   Please start backend manually:" -ForegroundColor Yellow
        Write-Host "   1. Open IDE (IntelliJ IDEA / Eclipse)" -ForegroundColor Gray
        Write-Host "   2. Open backend project" -ForegroundColor Gray
        Write-Host "   3. Run AgriverseAuthApplication.java" -ForegroundColor Gray
    }
} catch {
    Write-Host "   Maven not found. Please install Maven or use IDE to run backend." -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Starting Frontend Service..." -ForegroundColor Yellow
Write-Host "   This will start Vite dev server on port 5173" -ForegroundColor Gray
Write-Host ""

# Check if frontend node_modules exists
$frontendDir = Join-Path $PWD "frontend"
if (Test-Path (Join-Path $frontendDir "node_modules")) {
    Write-Host "   Dependencies installed, starting frontend..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev"
    Write-Host "   Frontend service starting in new window..." -ForegroundColor Green
} else {
    Write-Host "   Dependencies not found. Installing..." -ForegroundColor Yellow
    Push-Location $frontendDir
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   Dependencies installed, starting frontend..." -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev"
        Write-Host "   Frontend service starting in new window..." -ForegroundColor Green
    } else {
        Write-Host "   Failed to install dependencies" -ForegroundColor Red
    }
    Pop-Location
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Services Starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please wait 30-60 seconds for services to start" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend: http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "To test services, run: .\tests\scripts\test-system.ps1" -ForegroundColor Yellow
Write-Host ""

