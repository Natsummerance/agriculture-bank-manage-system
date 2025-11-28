package com.agriverse.buyer;

import com.agriverse.BaseTest;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.buyer.repository.BuyerAddressRepository;
import com.agriverse.entity.BuyerAddress;
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
 * 买家收货地址模块完整测试
 * 覆盖地址的增删改查、设置默认地址等功能
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class BuyerAddressControllerTest extends BaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BuyerAddressRepository addressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String buyerId;
    private String buyerToken;
    private String addressId;

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
    @DisplayName("测试获取收货地址列表 - 空列表")
    public void testGetAddressesEmpty() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/addresses",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(2)
    @DisplayName("测试添加收货地址 - 成功")
    public void testAddAddressSuccess() {
        Map<String, Object> request = new HashMap<>();
        request.put("receiverName", "测试收货人");
        request.put("receiverPhone", "13800138000");
        request.put("province", "广东省");
        request.put("city", "深圳市");
        request.put("district", "南山区");
        request.put("detail", "测试街道123号");
        request.put("postalCode", "518000");
        request.put("isDefault", false);

        HttpHeaders headers = getAuthHeaders(buyerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/addresses",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("data")) {
            Map<String, Object> data = (Map<String, Object>) body.get("data");
            if (data.containsKey("id")) {
                addressId = data.get("id").toString();
            }
        }
    }

    @Test
    @Order(3)
    @DisplayName("测试添加收货地址 - 缺少必填字段")
    public void testAddAddressMissingFields() {
        Map<String, Object> request = new HashMap<>();
        request.put("receiverName", "测试收货人");
        // 缺少其他必填字段

        HttpHeaders headers = getAuthHeaders(buyerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/addresses",
            HttpMethod.POST,
            entity,
            typeRef
        );

        // 应该返回验证错误
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST || 
                   response.getStatusCode() == HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Test
    @Order(4)
    @DisplayName("测试获取收货地址列表 - 有数据")
    public void testGetAddressesWithData() {
        // 先添加地址
        testAddAddressSuccess();

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/addresses",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(5)
    @DisplayName("测试更新收货地址")
    public void testUpdateAddress() {
        // 先添加地址
        testAddAddressSuccess();

        Map<String, Object> request = new HashMap<>();
        request.put("receiverName", "更新后的收货人");
        request.put("receiverPhone", "13900139000");
        request.put("province", "广东省");
        request.put("city", "广州市");
        request.put("district", "天河区");
        request.put("detail", "更新后的地址");
        request.put("postalCode", "510000");

        HttpHeaders headers = getAuthHeaders(buyerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/addresses/" + addressId,
            HttpMethod.PUT,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(6)
    @DisplayName("测试更新收货地址 - 地址不存在")
    public void testUpdateAddressNotFound() {
        Map<String, Object> request = new HashMap<>();
        request.put("receiverName", "测试");

        HttpHeaders headers = getAuthHeaders(buyerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/addresses/999999",
            HttpMethod.PUT,
            entity,
            typeRef
        );

        // 应该返回错误
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST || 
                   response.getStatusCode() == HttpStatus.NOT_FOUND);
    }

    @Test
    @Order(7)
    @DisplayName("测试设置默认地址")
    public void testSetDefaultAddress() {
        // 先添加地址
        testAddAddressSuccess();

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/addresses/" + addressId + "/default",
            HttpMethod.PUT,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(8)
    @DisplayName("测试删除收货地址")
    public void testDeleteAddress() {
        // 先添加地址
        testAddAddressSuccess();

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/addresses/" + addressId,
            HttpMethod.DELETE,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(9)
    @DisplayName("测试删除收货地址 - 地址不存在")
    public void testDeleteAddressNotFound() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/addresses/999999",
            HttpMethod.DELETE,
            entity,
            typeRef
        );

        // 应该返回错误
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST || 
                   response.getStatusCode() == HttpStatus.NOT_FOUND);
    }

    @Test
    @Order(10)
    @DisplayName("测试未认证访问")
    public void testUnauthenticatedAccess() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/addresses",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    @Order(11)
    @DisplayName("测试多个地址管理")
    public void testMultipleAddresses() {
        // 添加多个地址
        for (int i = 0; i < 3; i++) {
            Map<String, Object> request = new HashMap<>();
            request.put("receiverName", "收货人" + i);
            request.put("receiverPhone", "1380013800" + i);
            request.put("province", "广东省");
            request.put("city", "深圳市");
            request.put("district", "南山区");
            request.put("detail", "地址" + i);
            request.put("postalCode", "518000");
            request.put("isDefault", i == 0);

            HttpHeaders headers = getAuthHeaders(buyerToken);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            ParameterizedTypeReference<Map<String, Object>> typeRef = 
                new ParameterizedTypeReference<Map<String, Object>>() {};

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                getBaseUrl() + "/buyer/addresses",
                HttpMethod.POST,
                entity,
                typeRef
            );

            assertEquals(HttpStatus.OK, response.getStatusCode());
        }

        // 验证可以获取所有地址
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/addresses",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}

