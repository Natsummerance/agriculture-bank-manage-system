package com.agriverse.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI (Swagger) 配置类
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AgriVerse API 文档")
                        .version("1.0.0")
                        .description("农业产品融销平台 - 贷款管理API文档\n\n" +
                                "包含以下模块：\n" +
                                "- 农户融资管理\n" +
                                "- 银行贷款管理\n" +
                                "- 产品管理\n" +
                                "- 审批管理\n" +
                                "- 合同管理\n" +
                                "- 放款管理\n" +
                                "- 还款管理\n" +
                                "- 逾期管理\n" +
                                "- 对账中心\n" +
                                "- 贷后管理")
                        .contact(new Contact()
                                .name("AgriVerse Team")
                                .email("support@agriverse.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080/api")
                                .description("本地开发环境"),
                        new Server()
                                .url("https://api.agriverse.com/api")
                                .description("生产环境")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("请输入JWT Token，格式：Bearer {token}")));
    }
}



