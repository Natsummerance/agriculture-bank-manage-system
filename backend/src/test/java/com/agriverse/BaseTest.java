package com.agriverse;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * 基础测试类
 * 提供通用的测试方法和工具
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Transactional
public abstract class BaseTest {

    @LocalServerPort
    protected int port;

    @Autowired
    protected TestRestTemplate restTemplate;

    protected String baseUrl;
    protected String token;
    protected String userId;
    protected Map<String, String> testUsers = new HashMap<>();

    @BeforeEach
    public void setUp() {
        baseUrl = "http://localhost:" + port + "/api";
        testUsers.clear();
    }

    /**
     * 获取基础URL
     */
    protected String getBaseUrl() {
        return baseUrl;
    }

    /**
     * 创建测试用户并登录
     */
    protected String createAndLoginUser(String role) {
        String phone = "138" + String.format("%08d", System.currentTimeMillis() % 100000000);
        String password = "Test@123456";
        
        // 注册用户
        Map<String, Object> registerData = new HashMap<>();
        registerData.put("phone", phone);
        registerData.put("code", "123456");
        registerData.put("password", password);
        registerData.put("role", role);
        registerData.put("name", "测试" + role);
        registerData.put("email", phone + "@test.com");

        // 登录获取token
        Map<String, Object> loginData = new HashMap<>();
        loginData.put("phone", phone);
        loginData.put("password", password);
        loginData.put("role", role);

        // 这里简化处理，实际应该调用注册和登录接口
        testUsers.put(role, phone);
        return phone;
    }

    /**
     * 获取认证头
     */
    @SuppressWarnings("null")
    protected HttpHeaders getAuthHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        if (token != null) {
            headers.set("Authorization", "Bearer " + token);
        }
        headers.set("Content-Type", "application/json");
        return headers;
    }

    /**
     * 生成唯一测试数据
     */
    protected String generateUniqueId() {
        return String.valueOf(System.currentTimeMillis());
    }
}

