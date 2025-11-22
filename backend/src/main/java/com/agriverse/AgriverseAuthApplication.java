package com.agriverse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * AgriVerse 认证服务启动类
 */
@SpringBootApplication
@EnableScheduling
public class AgriverseAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgriverseAuthApplication.class, args);
    }

}
