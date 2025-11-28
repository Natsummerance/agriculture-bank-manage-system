package com.agriverse.admin;

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
 * 管理员用户管理模块完整测试
 * 覆盖用户查询、状态更新、角色管理等功能
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AdminUserControllerTest extends BaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String adminId;
    private String adminToken;

    @BeforeEach
    public void setUpTest() {
        super.setUp();
        // 创建测试管理员用户
        User admin = new User();
        admin.setPhone("135" + String.format("%08d", System.currentTimeMillis() % 100000000));
        admin.setPassword(passwordEncoder.encode("Test@123456"));
        admin.setRole(User.UserRole.ADMIN);
        admin.setName("测试管理员");
        admin.setEmail(admin.getPhone() + "@test.com");
        admin.setEnabled(true);
        admin = userRepository.save(admin);
        adminId = admin.getId().toString();

        // 登录获取token
        Map<String, Object> loginRequest = new HashMap<>();
        loginRequest.put("phone", admin.getPhone());
        loginRequest.put("password", "Test@123456");
        loginRequest.put("role", "admin");

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
                    adminToken = (String) data.get("token");
                }
            }
        }
    }

    @Test
    @Order(1)
    @DisplayName("测试获取用户列表")
    public void testGetUserList() {
        HttpHeaders headers = getAuthHeaders(adminToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/admin/users?page=1&pageSize=20",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(2)
    @DisplayName("测试搜索用户")
    public void testSearchUsers() {
        Map<String, Object> request = new HashMap<>();
        request.put("keyword", "测试");
        request.put("role", "farmer");
        request.put("status", "active");
        request.put("page", 1);
        request.put("pageSize", 20);

        HttpHeaders headers = getAuthHeaders(adminToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/admin/users/search",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(3)
    @DisplayName("测试获取用户详情")
    public void testGetUserDetail() {
        // 创建测试用户
        User testUser = new User();
        testUser.setPhone("138" + String.format("%08d", System.currentTimeMillis() % 100000000));
        testUser.setPassword(passwordEncoder.encode("Test@123456"));
        testUser.setRole(User.UserRole.FARMER);
        testUser.setName("测试用户");
        testUser.setEmail(testUser.getPhone() + "@test.com");
        testUser = userRepository.save(testUser);

        HttpHeaders headers = getAuthHeaders(adminToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/admin/users/" + testUser.getId(),
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(4)
    @DisplayName("测试更新用户状态")
    public void testUpdateUserStatus() {
        // 创建测试用户
        User testUser = new User();
        testUser.setPhone("138" + String.format("%08d", System.currentTimeMillis() % 100000000));
        testUser.setPassword(passwordEncoder.encode("Test@123456"));
        testUser.setRole(User.UserRole.FARMER);
        testUser.setName("测试用户");
        testUser.setEmail(testUser.getPhone() + "@test.com");
        testUser.setEnabled(true);
        testUser = userRepository.save(testUser);

        Map<String, Object> request = new HashMap<>();
        request.put("userId", testUser.getId().toString());
        request.put("status", "disabled");

        HttpHeaders headers = getAuthHeaders(adminToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/admin/users/status",
            HttpMethod.PUT,
            entity,
            typeRef
        );

        assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    @Order(5)
    @DisplayName("测试更新用户角色")
    public void testUpdateUserRole() {
        // 创建测试用户
        User testUser = new User();
        testUser.setPhone("138" + String.format("%08d", System.currentTimeMillis() % 100000000));
        testUser.setPassword(passwordEncoder.encode("Test@123456"));
        testUser.setRole(User.UserRole.FARMER);
        testUser.setName("测试用户");
        testUser.setEmail(testUser.getPhone() + "@test.com");
        testUser = userRepository.save(testUser);

        Map<String, Object> request = new HashMap<>();
        request.put("userId", testUser.getId().toString());
        request.put("role", "buyer");

        HttpHeaders headers = getAuthHeaders(adminToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/admin/users/role",
            HttpMethod.PUT,
            entity,
            typeRef
        );

        assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    @Order(6)
    @DisplayName("测试获取用户统计")
    public void testGetUserStatistics() {
        HttpHeaders headers = getAuthHeaders(adminToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/admin/users/statistics",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(7)
    @DisplayName("测试未认证访问")
    public void testUnauthenticatedAccess() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/admin/users",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    @Order(8)
    @DisplayName("测试非管理员访问")
    public void testNonAdminAccess() {
        // 创建普通用户并登录
        User user = new User();
        user.setPhone("138" + String.format("%08d", System.currentTimeMillis() % 100000000));
        user.setPassword(passwordEncoder.encode("Test@123456"));
        user.setRole(User.UserRole.FARMER);
        user.setName("普通用户");
        user.setEmail(user.getPhone() + "@test.com");
        user.setEnabled(true);
        user = userRepository.save(user);

        Map<String, Object> loginRequest = new HashMap<>();
        loginRequest.put("phone", user.getPhone());
        loginRequest.put("password", "Test@123456");
        loginRequest.put("role", "farmer");

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

        String userToken = null;
        if (loginResponse.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> loginBody = loginResponse.getBody();
            if (loginBody != null && loginBody.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) loginBody.get("data");
                if (data.containsKey("token")) {
                    userToken = (String) data.get("token");
                }
            }
        }

        // 尝试访问管理员接口
        HttpHeaders headers = getAuthHeaders(userToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/admin/users",
            HttpMethod.GET,
            entity,
            typeRef
        );

        // 应该返回403禁止访问
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }
}

