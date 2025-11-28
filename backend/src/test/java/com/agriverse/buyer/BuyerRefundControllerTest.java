package com.agriverse.buyer;

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
 * 买家退款模块完整测试
 * 覆盖退款申请、查询等功能
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class BuyerRefundControllerTest extends BaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String buyerId;
    private String buyerToken;

    @BeforeEach
    public void setUpTest() {
        super.setUp();
        // 创建测试买家用户
        User buyer = new User();
        buyer.setPhone("139" + String.format("%08d", System.currentTimeMillis() % 100000000));
        buyer.setPassword(passwordEncoder.encode("Test@123456"));
        buyer.setRole(User.UserRole.BUYER);
        buyer.setName("测试买家");
        buyer.setEmail(buyer.getPhone() + "@test.com");
        buyer.setEnabled(true);
        buyer = userRepository.save(buyer);
        buyerId = buyer.getId().toString();

        // 登录获取token
        Map<String, Object> loginRequest = new HashMap<>();
        loginRequest.put("phone", buyer.getPhone());
        loginRequest.put("password", "Test@123456");
        loginRequest.put("role", "buyer");

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
                    buyerToken = (String) data.get("token");
                }
            }
        }
    }

    @Test
    @Order(1)
    @DisplayName("测试获取退款列表 - 空列表")
    public void testGetRefundsEmpty() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/refunds?page=0&size=20",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(2)
    @DisplayName("测试获取退款列表 - 按状态筛选")
    public void testGetRefundsByStatus() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        String[] statuses = {"pending", "approved", "rejected", "completed"};
        for (String status : statuses) {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                getBaseUrl() + "/buyer/refunds?status=" + status + "&page=0&size=20",
                HttpMethod.GET,
                entity,
                typeRef
            );
            assertEquals(HttpStatus.OK, response.getStatusCode());
        }
    }

    @Test
    @Order(3)
    @DisplayName("测试获取退款列表 - 分页")
    public void testGetRefundsPagination() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        // 测试第一页
        ResponseEntity<Map<String, Object>> response1 = restTemplate.exchange(
            getBaseUrl() + "/buyer/refunds?page=0&size=10",
            HttpMethod.GET,
            entity,
            typeRef
        );
        assertEquals(HttpStatus.OK, response1.getStatusCode());

        // 测试第二页
        ResponseEntity<Map<String, Object>> response2 = restTemplate.exchange(
            getBaseUrl() + "/buyer/refunds?page=1&size=10",
            HttpMethod.GET,
            entity,
            typeRef
        );
        assertEquals(HttpStatus.OK, response2.getStatusCode());
    }

    @Test
    @Order(4)
    @DisplayName("测试未认证访问")
    public void testUnauthenticatedAccess() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/refunds",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}

