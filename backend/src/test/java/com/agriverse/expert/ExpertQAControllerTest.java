package com.agriverse.expert;

import com.agriverse.BaseTest;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.entity.User;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 专家问答模块完整测试
 * 覆盖问题搜索、回答、管理等功能
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ExpertQAControllerTest extends BaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String expertId;
    private String expertToken;

    @BeforeEach
    public void setUpTest() {
        super.setUp();
        // 创建测试专家用户
        User expert = new User();
        expert.setPhone("136" + String.format("%08d", System.currentTimeMillis() % 100000000));
        expert.setPassword(passwordEncoder.encode("Test@123456"));
        expert.setRole(User.UserRole.EXPERT);
        expert.setName("测试专家");
        expert.setEmail(expert.getPhone() + "@test.com");
        expert.setEnabled(true);
        expert = userRepository.save(expert);
        expertId = expert.getId().toString();

        // 登录获取token
        Map<String, Object> loginRequest = new HashMap<>();
        loginRequest.put("phone", expert.getPhone());
        loginRequest.put("password", "Test@123456");
        loginRequest.put("role", "expert");

        HttpHeaders loginHeaders = new HttpHeaders();
        loginHeaders.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> loginEntity = new HttpEntity<>(loginRequest, loginHeaders);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> loginResponse = restTemplate.exchange(
            getBaseUrl() + "/auth/login",
            HttpMethod.POST,
            loginEntity,
            typeRef
        );

        if (loginResponse.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> loginBody = loginResponse.getBody();
            if (loginBody != null && loginBody.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) loginBody.get("data");
                if (data.containsKey("token")) {
                    expertToken = (String) data.get("token");
                }
            }
        }
    }

    @Test
    @Order(1)
    @DisplayName("测试搜索问题")
    public void testSearchQuestions() {
        Map<String, Object> request = new HashMap<>();
        request.put("keyword", "测试");
        request.put("status", "pending");
        request.put("page", 1);
        request.put("pageSize", 20);

        HttpHeaders headers = getAuthHeaders(expertToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/expert/qa/questions/search",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(2)
    @DisplayName("测试获取待回答问题列表")
    public void testGetPendingQuestions() {
        HttpHeaders headers = getAuthHeaders(expertToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/expert/qa/questions/pending?page=1&pageSize=20",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(3)
    @DisplayName("测试回答问题")
    public void testAnswerQuestion() {
        Map<String, Object> request = new HashMap<>();
        request.put("questionId", "1");
        request.put("content", "这是测试回答内容");
        request.put("attachments", new String[]{});

        HttpHeaders headers = getAuthHeaders(expertToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/expert/qa/questions/answer",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertNotNull(response.getBody());
    }

    @Test
    @Order(4)
    @DisplayName("测试获取我的回答列表")
    public void testGetMyAnswers() {
        HttpHeaders headers = getAuthHeaders(expertToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/expert/qa/answers/my?page=1&pageSize=20",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(5)
    @DisplayName("测试未认证访问")
    public void testUnauthenticatedAccess() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/expert/qa/questions/pending",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}

