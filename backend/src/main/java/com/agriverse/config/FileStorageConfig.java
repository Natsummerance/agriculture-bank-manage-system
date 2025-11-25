package com.agriverse.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Configuration
public class FileStorageConfig implements WebMvcConfigurer {

    @Value("${app.file-upload.base-dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        String resourceLocation = uploadPath.toUri().toString();
        log.info("静态资源映射: /uploads/** -> {}", resourceLocation);
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation);
    }
}
