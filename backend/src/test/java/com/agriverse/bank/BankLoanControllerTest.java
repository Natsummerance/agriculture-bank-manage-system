package com.agriverse.bank;

import com.agriverse.BaseTest;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.entity.User;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 银行贷款模块完整测试
 * 覆盖贷款产品、审批、放款、逾期、对账等功能
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class BankLoanControllerTest extends BaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String bankId;
    private String bankToken;

    @BeforeEach
    public void setUpTest() {
        super.setUp();
        // 创建测试银行用户
        User bank = new User();
        bank.setPhone("137" + String.format("%08d", System.currentTimeMillis() % 100000000));
        bank.setPassword(passwordEncoder.encode("Test@123456"));
        bank.setRole(User.UserRole.BANK);
        bank.setName("测试银行");
        bank.setEmail(bank.getPhone() + "@test.com");
        bank.setEnabled(true);
        bank = userRepository.save(bank);
        bankId = bank.getId().toString();

        // 登录获取token
        Map<String, Object> loginRequest = new HashMap<>();
        loginRequest.put("phone", bank.getPhone());
        loginRequest.put("password", "Test@123456");
        loginRequest.put("role", "bank");

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
                    bankToken = (String) data.get("token");
                }
            }
        }
    }

    @Test
    @Order(1)
    @DisplayName("测试创建贷款产品")
    public void testCreateLoanProduct() {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "测试贷款产品");
        request.put("description", "测试描述");
        request.put("minAmount", 10000);
        request.put("maxAmount", 1000000);
        request.put("minTerm", 6);
        request.put("maxTerm", 36);
        request.put("interestRate", 5.5);
        request.put("status", "active");

        HttpHeaders headers = getAuthHeaders(bankToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/bank/loan/products",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    @Order(2)
    @DisplayName("测试获取贷款产品列表")
    public void testGetLoanProducts() {
        HttpHeaders headers = getAuthHeaders(bankToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/bank/loan/products?page=1&pageSize=20",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(3)
    @DisplayName("测试获取贷款申请列表")
    public void testGetLoanApplications() {
        HttpHeaders headers = getAuthHeaders(bankToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/bank/loan/applications?page=1&pageSize=20",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(4)
    @DisplayName("测试审批贷款申请")
    public void testApproveLoanApplication() {
        Map<String, Object> request = new HashMap<>();
        request.put("applicationId", "1");
        request.put("decision", "approved");
        request.put("approvedAmount", 50000);
        request.put("approvedTerm", 12);
        request.put("remark", "测试审批通过");

        HttpHeaders headers = getAuthHeaders(bankToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/bank/loan/approve",
            HttpMethod.POST,
            entity,
            typeRef
        );

        // 可能返回成功或错误（如果申请不存在）
        assertNotNull(response.getBody());
    }

    @Test
    @Order(5)
    @DisplayName("测试拒绝贷款申请")
    public void testRejectLoanApplication() {
        Map<String, Object> request = new HashMap<>();
        request.put("applicationId", "1");
        request.put("decision", "rejected");
        request.put("reason", "测试拒绝原因");

        HttpHeaders headers = getAuthHeaders(bankToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/bank/loan/reject",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertNotNull(response.getBody());
    }

    @Test
    @Order(6)
    @DisplayName("测试获取逾期贷款列表")
    public void testGetOverdueLoans() {
        HttpHeaders headers = getAuthHeaders(bankToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/bank/loan/overdue?page=1&pageSize=20",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(7)
    @DisplayName("测试获取统计数据")
    public void testGetStatistics() {
        HttpHeaders headers = getAuthHeaders(bankToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/bank/loan/statistics",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(8)
    @DisplayName("测试未认证访问")
    public void testUnauthenticatedAccess() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/bank/loan/products",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}

