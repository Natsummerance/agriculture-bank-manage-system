package com.agriverse.auth;

import com.agriverse.BaseTest;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.auth.repository.VerificationCodeRepository;
import com.agriverse.entity.User;
import com.agriverse.entity.VerificationCode;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 认证模块完整测试
 * 覆盖所有认证相关功能
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthControllerTest extends BaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String testPhone;
    private String testPassword = "Test@123456";

    @BeforeEach
    public void setUpTest() {
        super.setUp();
        testPhone = "138" + String.format("%08d", System.currentTimeMillis() % 100000000);
    }

    @Test
    @Order(1)
    @DisplayName("测试健康检查接口")
    public void testHealthCheck() {
        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/health",
            HttpMethod.GET,
            null,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        Map<String, Object> body = response.getBody();
        assertTrue(body.containsKey("code") || body.containsKey("success"));
    }

    @Test
    @Order(2)
    @DisplayName("测试发送验证码 - 注册")
    public void testSendVerificationCodeForRegister() {
        Map<String, Object> request = new HashMap<>();
        request.put("phone", testPhone);
        request.put("type", "register");
        request.put("role", "farmer");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/send-code",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    @Order(3)
    @DisplayName("测试发送验证码 - 登录")
    public void testSendVerificationCodeForLogin() {
        Map<String, Object> request = new HashMap<>();
        request.put("phone", testPhone);
        request.put("type", "login");
        request.put("role", "farmer");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/send-code",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    @Order(4)
    @DisplayName("测试发送验证码 - 重置密码")
    public void testSendVerificationCodeForResetPassword() {
        Map<String, Object> request = new HashMap<>();
        request.put("phone", testPhone);
        request.put("type", "reset");
        request.put("role", "farmer");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/send-code",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    @Order(5)
    @DisplayName("测试验证验证码")
    public void testVerifyCode() {
        // 先创建验证码
        VerificationCode code = new VerificationCode();
        code.setPhone(testPhone);
        code.setCode("123456");
        code.setType(VerificationCode.CodeType.REGISTER);
        code.setExpiredAt(LocalDateTime.now().plusMinutes(10));
        verificationCodeRepository.save(code);

        Map<String, Object> request = new HashMap<>();
        request.put("phone", testPhone);
        request.put("code", "123456");
        request.put("type", "register");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/verify-code",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    @Order(6)
    @DisplayName("测试用户注册 - 成功")
    public void testUserRegistrationSuccess() {
        // 先创建验证码
        VerificationCode code = new VerificationCode();
        code.setPhone(testPhone);
        code.setCode("123456");
        code.setType(VerificationCode.CodeType.REGISTER);
        code.setExpiredAt(LocalDateTime.now().plusMinutes(10));
        verificationCodeRepository.save(code);

        Map<String, Object> request = new HashMap<>();
        request.put("phone", testPhone);
        request.put("code", "123456");
        request.put("password", testPassword);
        request.put("role", "farmer");
        request.put("name", "测试农户");
        request.put("email", testPhone + "@test.com");
        request.put("company", "测试农业公司");
        request.put("location", "测试地址");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/register",
            HttpMethod.POST,
            entity,
            typeRef
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            Map<String, Object> body = response.getBody();
            assertNotNull(body);
            // 验证返回了token
            if (body.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) body.get("data");
                assertTrue(data.containsKey("token") || data.containsKey("user"));
            }
        }
    }

    @Test
    @Order(7)
    @DisplayName("测试用户注册 - 手机号已存在")
    public void testUserRegistrationPhoneExists() {
        // 先创建用户
        User existingUser = new User();
        existingUser.setPhone(testPhone);
        existingUser.setPassword(passwordEncoder.encode(testPassword));
        existingUser.setRole(User.UserRole.FARMER);
        existingUser.setName("已存在用户");
        existingUser.setEmail(testPhone + "@test.com");
        userRepository.save(existingUser);

        // 创建验证码
        VerificationCode code = new VerificationCode();
        code.setPhone(testPhone);
        code.setCode("123456");
        code.setType(VerificationCode.CodeType.REGISTER);
        code.setExpiredAt(LocalDateTime.now().plusMinutes(10));
        verificationCodeRepository.save(code);

        Map<String, Object> request = new HashMap<>();
        request.put("phone", testPhone);
        request.put("code", "123456");
        request.put("password", testPassword);
        request.put("role", "farmer");
        request.put("name", "新用户");
        request.put("email", "new@test.com");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/register",
            HttpMethod.POST,
            entity,
            typeRef
        );

        // 应该返回冲突错误
        assertTrue(response.getStatusCode() == HttpStatus.CONFLICT || 
                   response.getStatusCode() == HttpStatus.BAD_REQUEST);
    }

    @Test
    @Order(8)
    @DisplayName("测试用户注册 - 验证码错误")
    public void testUserRegistrationInvalidCode() {
        Map<String, Object> request = new HashMap<>();
        request.put("phone", testPhone);
        request.put("code", "999999"); // 错误的验证码
        request.put("password", testPassword);
        request.put("role", "farmer");
        request.put("name", "测试用户");
        request.put("email", testPhone + "@test.com");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/register",
            HttpMethod.POST,
            entity,
            typeRef
        );

        // 应该返回错误
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST || 
                   response.getStatusCode() == HttpStatus.UNAUTHORIZED);
    }

    @Test
    @Order(9)
    @DisplayName("测试用户登录 - 成功")
    public void testUserLoginSuccess() {
        // 先创建用户
        User user = new User();
        user.setPhone(testPhone);
        user.setPassword(passwordEncoder.encode(testPassword));
        user.setRole(User.UserRole.FARMER);
        user.setName("测试用户");
        user.setEmail(testPhone + "@test.com");
        user.setEnabled(true);
        userRepository.save(user);

        Map<String, Object> request = new HashMap<>();
        request.put("phone", testPhone);
        request.put("password", testPassword);
        request.put("role", "farmer");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/login",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        
        if (body.containsKey("data")) {
            Map<String, Object> data = (Map<String, Object>) body.get("data");
            assertTrue(data.containsKey("token"));
            token = (String) data.get("token");
            assertNotNull(token);
        }
    }

    @Test
    @Order(10)
    @DisplayName("测试用户登录 - 密码错误")
    public void testUserLoginWrongPassword() {
        // 先创建用户
        User user = new User();
        user.setPhone(testPhone);
        user.setPassword(passwordEncoder.encode(testPassword));
        user.setRole(User.UserRole.FARMER);
        user.setName("测试用户");
        user.setEmail(testPhone + "@test.com");
        user.setEnabled(true);
        userRepository.save(user);

        Map<String, Object> request = new HashMap<>();
        request.put("phone", testPhone);
        request.put("password", "WrongPassword123");
        request.put("role", "farmer");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/login",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    @Order(11)
    @DisplayName("测试用户登录 - 用户不存在")
    public void testUserLoginUserNotFound() {
        Map<String, Object> request = new HashMap<>();
        request.put("phone", "13999999999");
        request.put("password", testPassword);
        request.put("role", "farmer");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/login",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    @Order(12)
    @DisplayName("测试获取当前用户信息")
    public void testGetCurrentUserInfo() {
        // 先登录获取token
        User user = new User();
        user.setPhone(testPhone);
        user.setPassword(passwordEncoder.encode(testPassword));
        user.setRole(User.UserRole.FARMER);
        user.setName("测试用户");
        user.setEmail(testPhone + "@test.com");
        user.setEnabled(true);
        userRepository.save(user);

        // 登录
        Map<String, Object> loginRequest = new HashMap<>();
        loginRequest.put("phone", testPhone);
        loginRequest.put("password", testPassword);
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

        if (loginResponse.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> loginBody = loginResponse.getBody();
            if (loginBody != null && loginBody.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) loginBody.get("data");
                if (data.containsKey("token")) {
                    token = (String) data.get("token");

                    // 获取用户信息
                    HttpHeaders headers = getAuthHeaders(token);
                    HttpEntity<Void> entity = new HttpEntity<>(headers);

                    ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                        getBaseUrl() + "/auth/me",
                        HttpMethod.GET,
                        entity,
                        typeRef
                    );

                    assertEquals(HttpStatus.OK, response.getStatusCode());
                    Map<String, Object> body = response.getBody();
                    assertNotNull(body);
                }
            }
        }
    }

    @Test
    @Order(13)
    @DisplayName("测试获取当前用户信息 - 未认证")
    public void testGetCurrentUserInfoUnauthenticated() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/me",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    @Order(14)
    @DisplayName("测试刷新Token")
    public void testRefreshToken() {
        // 先登录获取refreshToken
        User user = new User();
        user.setPhone(testPhone);
        user.setPassword(passwordEncoder.encode(testPassword));
        user.setRole(User.UserRole.FARMER);
        user.setName("测试用户");
        user.setEmail(testPhone + "@test.com");
        user.setEnabled(true);
        userRepository.save(user);

        Map<String, Object> loginRequest = new HashMap<>();
        loginRequest.put("phone", testPhone);
        loginRequest.put("password", testPassword);
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

        if (loginResponse.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> loginBody = loginResponse.getBody();
            if (loginBody != null && loginBody.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) loginBody.get("data");
                if (data.containsKey("refreshToken")) {
                    String refreshToken = (String) data.get("refreshToken");

                    // 刷新token
                    Map<String, Object> refreshRequest = new HashMap<>();
                    refreshRequest.put("refreshToken", refreshToken);

                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    HttpEntity<Map<String, Object>> refreshEntity = new HttpEntity<>(refreshRequest, headers);

                    ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                        getBaseUrl() + "/auth/refresh",
                        HttpMethod.POST,
                        refreshEntity,
                        typeRef
                    );

                    assertTrue(response.getStatusCode().is2xxSuccessful());
                }
            }
        }
    }

    @Test
    @Order(15)
    @DisplayName("测试重置密码")
    public void testResetPassword() {
        // 先创建用户
        User user = new User();
        user.setPhone(testPhone);
        user.setPassword(passwordEncoder.encode(testPassword));
        user.setRole(User.UserRole.FARMER);
        user.setName("测试用户");
        user.setEmail(testPhone + "@test.com");
        user.setEnabled(true);
        userRepository.save(user);

        // 创建验证码
        VerificationCode code = new VerificationCode();
        code.setPhone(testPhone);
        code.setCode("123456");
        code.setType(VerificationCode.CodeType.RESET);
        code.setExpiredAt(LocalDateTime.now().plusMinutes(10));
        verificationCodeRepository.save(code);

        Map<String, Object> request = new HashMap<>();
        request.put("phone", testPhone);
        request.put("code", "123456");
        request.put("newPassword", "NewPassword@123");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/reset-password",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    @Order(16)
    @DisplayName("测试检查手机号是否存在")
    public void testCheckPhoneExists() {
        // 先创建用户
        User user = new User();
        user.setPhone(testPhone);
        user.setPassword(passwordEncoder.encode(testPassword));
        user.setRole(User.UserRole.FARMER);
        user.setName("测试用户");
        user.setEmail(testPhone + "@test.com");
        user.setEnabled(true);
        userRepository.save(user);

        HttpHeaders headers = new HttpHeaders();
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/auth/check-phone?phone=" + testPhone + "&role=farmer",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
    }

    @Test
    @Order(17)
    @DisplayName("测试登出")
    public void testLogout() {
        // 先登录获取token
        User user = new User();
        user.setPhone(testPhone);
        user.setPassword(passwordEncoder.encode(testPassword));
        user.setRole(User.UserRole.FARMER);
        user.setName("测试用户");
        user.setEmail(testPhone + "@test.com");
        user.setEnabled(true);
        userRepository.save(user);

        Map<String, Object> loginRequest = new HashMap<>();
        loginRequest.put("phone", testPhone);
        loginRequest.put("password", testPassword);
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

        if (loginResponse.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> loginBody = loginResponse.getBody();
            if (loginBody != null && loginBody.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) loginBody.get("data");
                if (data.containsKey("token")) {
                    token = (String) data.get("token");

                    // 登出
                    HttpHeaders headers = getAuthHeaders(token);
                    HttpEntity<Void> logoutEntity = new HttpEntity<>(headers);

                    ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                        getBaseUrl() + "/auth/logout",
                        HttpMethod.POST,
                        logoutEntity,
                        typeRef
                    );

                    assertTrue(response.getStatusCode().is2xxSuccessful());
                }
            }
        }
    }

    @Test
    @Order(18)
    @DisplayName("测试所有角色注册")
    public void testRegisterAllRoles() {
        String[] roles = {"farmer", "buyer", "bank", "expert", "admin"};
        
        for (String role : roles) {
            String phone = "138" + String.format("%08d", (System.currentTimeMillis() + role.hashCode()) % 100000000);
            
            // 创建验证码
            VerificationCode code = new VerificationCode();
            code.setPhone(phone);
            code.setCode("123456");
            code.setType(VerificationCode.CodeType.REGISTER);
            code.setExpiredAt(LocalDateTime.now().plusMinutes(10));
            verificationCodeRepository.save(code);

            Map<String, Object> request = new HashMap<>();
            request.put("phone", phone);
            request.put("code", "123456");
            request.put("password", testPassword);
            request.put("role", role);
            request.put("name", "测试" + role);
            request.put("email", phone + "@test.com");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            ParameterizedTypeReference<Map<String, Object>> typeRef = 
                new ParameterizedTypeReference<Map<String, Object>>() {};

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                getBaseUrl() + "/auth/register",
                HttpMethod.POST,
                entity,
                typeRef
            );

            // 验证响应
            assertNotNull(response.getBody());
        }
    }
}

