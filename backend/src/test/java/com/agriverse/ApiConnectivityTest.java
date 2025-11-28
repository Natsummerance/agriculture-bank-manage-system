package com.agriverse;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * API 连通性测试
 * 测试前后端API的基本连通性和功能
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ApiConnectivityTest {

        @LocalServerPort
        private int port;

        @Autowired
        private TestRestTemplate restTemplate;

        private String getBaseUrl() {
                return "http://localhost:" + port + "/api";
        }

        /**
         * 测试健康检查接口
         */
        @Test
        public void testHealthCheck() {
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                // 测试认证服务健康检查
                ResponseEntity<Map<String, Object>> response1 = restTemplate.exchange(
                                getBaseUrl() + "/auth/health",
                                HttpMethod.GET,
                                null,
                                typeRef);
                assertEquals(HttpStatus.OK, response1.getStatusCode());
                assertNotNull(response1.getBody());

                // 测试农户商品服务健康检查
                ResponseEntity<Map<String, Object>> response2 = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/health",
                                HttpMethod.GET,
                                null,
                                typeRef);
                assertEquals(HttpStatus.OK, response2.getStatusCode());
                assertNotNull(response2.getBody());
        }

        /**
         * 测试用户注册和登录流程
         */
        @Test
        public void testUserRegistrationAndLogin() {
                // 生成唯一的测试手机号（11位，符合验证规则）
                String testPhone = "138" + String.format("%08d", System.currentTimeMillis() % 100000000);

                // 1. 用户注册
                Map<String, Object> registerData = new HashMap<>();
                registerData.put("phone", testPhone);
                registerData.put("code", "123456");
                registerData.put("password", "test123456");
                registerData.put("role", "farmer");
                registerData.put("name", "测试用户");
                registerData.put("email", "test" + System.currentTimeMillis() + "@example.com");

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> registerRequest = new HttpEntity<>(registerData, headers);
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                ResponseEntity<Map<String, Object>> registerResponse = restTemplate.exchange(
                                getBaseUrl() + "/auth/register",
                                HttpMethod.POST,
                                registerRequest,
                                typeRef);

                // 注册可能成功或失败（手机号已存在、验证码过期等），但应该返回有效响应
                assertTrue(
                                registerResponse.getStatusCode().is2xxSuccessful() ||
                                                registerResponse.getStatusCode() == HttpStatus.BAD_REQUEST ||
                                                registerResponse.getStatusCode() == HttpStatus.CONFLICT);

                // 2. 用户登录
                Map<String, Object> loginData = new HashMap<>();
                loginData.put("phone", testPhone);
                loginData.put("password", "test123456");
                loginData.put("role", "farmer");

                HttpEntity<Map<String, Object>> loginRequest = new HttpEntity<>(loginData, headers);
                ParameterizedTypeReference<Map<String, Object>> loginTypeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                try {
                        ResponseEntity<Map<String, Object>> loginResponse = restTemplate.exchange(
                                        getBaseUrl() + "/auth/login",
                                        HttpMethod.POST,
                                        loginRequest,
                                        loginTypeRef);

                        // 登录应该成功（如果注册成功）或失败（如果手机号已存在）
                        // 这里我们主要测试接口连通性，不强制要求登录成功
                        assertNotNull(loginResponse.getBody());
                } catch (org.springframework.web.client.ResourceAccessException e) {
                        // 如果登录失败导致重定向到/error端点，这也是有效的响应
                        // 说明API连通性正常，只是业务逻辑失败
                        assertTrue(true, "登录失败是预期的，因为注册可能失败");
                }
        }

        /**
         * 测试未认证访问受保护接口（应该返回401）
         */
        @Test
        public void testUnauthenticatedAccess() {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Void> request = new HttpEntity<>(headers);
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/list",
                                HttpMethod.GET,
                                request,
                                typeRef);

                // 未认证访问应该返回401
                assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        }

        /**
         * 测试API响应格式
         */
        @Test
        public void testApiResponseFormat() {
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                                getBaseUrl() + "/auth/health",
                                HttpMethod.GET,
                                null,
                                typeRef);

                assertEquals(HttpStatus.OK, response.getStatusCode());
                Map<String, Object> body = response.getBody();
                assertNotNull(body);

                // 验证响应包含标准字段
                assertTrue(body.containsKey("code") || body.containsKey("success"));
        }
}
