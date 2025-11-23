@echo off
REM 启动后端服务（使用MySQL数据库）
echo ========================================
echo 启动田心农场后端服务（MySQL数据库模式）
echo ========================================
echo.
echo 提示：请确保MySQL服务已启动
echo 默认连接：localhost:3306/agriverse
echo 用户名：root，密码：root
echo.
pause
echo.
set SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run

