@echo off
REM AgriVerse 后端API连通性测试脚本 (Windows)
REM 使用方法: test-api.bat [base_url]
REM 默认base_url: http://localhost:8080/api

setlocal enabledelayedexpansion

set BASE_URL=%1
if "%BASE_URL%"=="" set BASE_URL=http://localhost:8080/api

echo ==========================================
echo AgriVerse 后端API连通性测试
echo ==========================================
echo 测试服务器: %BASE_URL%
echo.

set PASSED=0
set FAILED=0

REM 1. 健康检查
echo ----------------------------------------
echo 1. 健康检查测试
echo ----------------------------------------
call :test_get "/auth/health" "认证服务健康检查"
call :test_get "/farmer/products/health" "农户商品服务健康检查"
echo.

REM 2. 用户注册测试
echo ----------------------------------------
echo 2. 用户注册测试
echo ----------------------------------------
set TIMESTAMP=%time:~0,2%%time:~3,2%%time:~6,2%
set TEST_PHONE=1380000%TIMESTAMP:~-4%
set REGISTER_DATA={"phone":"%TEST_PHONE%","code":"123456","password":"test123456","role":"farmer","name":"测试用户"}

call :test_post "/auth/register" "%REGISTER_DATA%" "用户注册"
echo.

REM 3. 用户登录测试
echo ----------------------------------------
echo 3. 用户登录测试
echo ----------------------------------------
set LOGIN_DATA={"phone":"%TEST_PHONE%","password":"test123456","role":"farmer"}

echo 测试: 用户登录 ...
curl -s -X POST "%BASE_URL%/auth/login" -H "Content-Type: application/json" -d "%LOGIN_DATA%" > temp_login.json
for /f "tokens=*" %%a in ('curl -s -o nul -w "%%{http_code}" -X POST "%BASE_URL%/auth/login" -H "Content-Type: application/json" -d "%LOGIN_DATA%"') do set HTTP_CODE=%%a

if !HTTP_CODE! geq 200 if !HTTP_CODE! lss 300 (
    echo [√] 通过 (HTTP !HTTP_CODE!)
    for /f "tokens=*" %%a in ('powershell -Command "(Get-Content temp_login.json) -replace '.*\"token\":\"([^\"]+)\".*', '$1'"') do set TOKEN=%%a
    if defined TOKEN (
        echo   Token已获取
        set /a PASSED+=1
    ) else (
        echo   [警告] 未获取到Token
        set /a FAILED+=1
    )
) else (
    echo [×] 失败 (HTTP !HTTP_CODE!)
    type temp_login.json
    set TOKEN=
    set /a FAILED+=1
)
del temp_login.json 2>nul
echo.

REM 4. 获取当前用户信息（需要认证）
echo ----------------------------------------
echo 4. 认证接口测试
echo ----------------------------------------
if defined TOKEN (
    call :test_get_auth "/auth/me" "获取当前用户信息" "%TOKEN%"
) else (
    echo [警告] 跳过: 需要Token，但登录失败
    set /a FAILED+=1
)
echo.

REM 5. 农户商品管理接口测试（需要认证）
echo ----------------------------------------
echo 5. 农户商品管理接口测试
echo ----------------------------------------
if defined TOKEN (
    call :test_get_auth "/farmer/products/list" "获取商品列表" "%TOKEN%"
    call :test_get_auth "/farmer/products/list?status=on&page=1&pageSize=10" "获取已上架商品列表" "%TOKEN%"
    call :test_get_auth "/farmer/products/list?search=大米" "搜索商品" "%TOKEN%"
    call :test_get_auth "/farmer/products/dashboard" "获取商品数据看板" "%TOKEN%"
) else (
    echo [警告] 跳过: 需要Token，但登录失败
    set /a FAILED+=1
)
echo.

REM 6. 测试未认证访问（应该返回401）
echo ----------------------------------------
echo 6. 安全测试（未认证访问）
echo ----------------------------------------
echo 测试: 未认证访问受保护接口 ...
for /f "tokens=*" %%a in ('curl -s -o nul -w "%%{http_code}" -X GET "%BASE_URL%/farmer/products/list" -H "Content-Type: application/json"') do set UNAUTH_CODE=%%a

if !UNAUTH_CODE! equ 401 (
    echo [√] 通过 (正确返回401未授权)
    set /a PASSED+=1
) else (
    echo [×] 失败 (HTTP !UNAUTH_CODE!，应该返回401)
    set /a FAILED+=1
)
echo.

REM 测试结果汇总
echo ==========================================
echo 测试结果汇总
echo ==========================================
echo 通过: !PASSED!
echo 失败: !FAILED!
set /a TOTAL=!PASSED!+!FAILED!
if !TOTAL! gtr 0 (
    set /a SUCCESS_RATE=!PASSED!*100/!TOTAL!
    echo 成功率: !SUCCESS_RATE!%%
)
echo.

if !FAILED! equ 0 (
    echo 所有测试通过！√
    exit /b 0
) else (
    echo 部分测试失败，请检查后端服务
    exit /b 1
)

REM 测试函数
:test_get
set ENDPOINT=%~1
set DESC=%~2
echo 测试: %DESC% ...
for /f "tokens=*" %%a in ('curl -s -o nul -w "%%{http_code}" -X GET "%BASE_URL%%ENDPOINT%" -H "Content-Type: application/json"') do set HTTP_CODE=%%a
if !HTTP_CODE! geq 200 if !HTTP_CODE! lss 300 (
    echo [√] 通过 (HTTP !HTTP_CODE!)
    set /a PASSED+=1
) else (
    echo [×] 失败 (HTTP !HTTP_CODE!)
    set /a FAILED+=1
)
exit /b

:test_post
set ENDPOINT=%~1
set DATA=%~2
set DESC=%~3
echo 测试: %DESC% ...
for /f "tokens=*" %%a in ('curl -s -o nul -w "%%{http_code}" -X POST "%BASE_URL%%ENDPOINT%" -H "Content-Type: application/json" -d "%DATA%"') do set HTTP_CODE=%%a
if !HTTP_CODE! geq 200 if !HTTP_CODE! lss 300 (
    echo [√] 通过 (HTTP !HTTP_CODE!)
    set /a PASSED+=1
) else (
    echo [×] 失败 (HTTP !HTTP_CODE!)
    set /a FAILED+=1
)
exit /b

:test_get_auth
set ENDPOINT=%~1
set DESC=%~2
set TOKEN=%~3
echo 测试: %DESC% ...
for /f "tokens=*" %%a in ('curl -s -o nul -w "%%{http_code}" -X GET "%BASE_URL%%ENDPOINT%" -H "Content-Type: application/json" -H "Authorization: Bearer %TOKEN%"') do set HTTP_CODE=%%a
if !HTTP_CODE! geq 200 if !HTTP_CODE! lss 300 (
    echo [√] 通过 (HTTP !HTTP_CODE!)
    set /a PASSED+=1
) else (
    echo [×] 失败 (HTTP !HTTP_CODE!)
    set /a FAILED+=1
)
exit /b

