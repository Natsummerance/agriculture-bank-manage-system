# 多阶段构建
# 第一阶段：构建
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# 复制 pom.xml
COPY pom.xml .

# 下载依赖
RUN mvn dependency:go-offline

# 复制源代码
COPY src/ src/

# 构建应用
RUN mvn clean package -DskipTests

# 第二阶段：运行
FROM eclipse-temurin:21-jre

WORKDIR /app

# 从构建阶段复制构建好的 JAR 文件
COPY --from=builder /app/target/*.jar app.jar

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/auth/health || exit 1

# 运行应用
CMD ["java", "-Xms512m", "-Xmx1024m", "-XX:+UseG1GC", "-jar", "app.jar"]
