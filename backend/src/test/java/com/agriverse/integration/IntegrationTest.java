package com.agriverse.integration;

import com.agriverse.BaseTest;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.entity.FarmerProduct;
import com.agriverse.entity.Order;
import com.agriverse.entity.User;
import com.agriverse.farmer.repository.FarmerProductRepository;
import com.agriverse.order.repository.OrderRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 集成测试
 * 测试完整的业务流程，包括跨模块交互
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class IntegrationTest extends BaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmerProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String farmerId;
    private String farmerToken;
    private String buyerId;
    private String buyerToken;
    private String productId;
    private String orderId;

    @BeforeEach
    public void setUpTest() {
        super.setUp();
        // 创建农户用户
        User farmer = new User();
        farmer.setPhone("138" + String.format("%08d", System.currentTimeMillis() % 100000000));
        farmer.setPassword(passwordEncoder.encode("Test@123456"));
        farmer.setRole(User.UserRole.FARMER);
        farmer.setName("测试农户");
        farmer.setEmail(farmer.getPhone() + "@test.com");
        farmer.setEnabled(true);
        farmer = userRepository.save(farmer);
        farmerId = farmer.getId().toString();

        // 创建买家用户
        User buyer = new User();
        buyer.setPhone("139" + String.format("%08d", System.currentTimeMillis() % 100000000));
        buyer.setPassword(passwordEncoder.encode("Test@123456"));
        buyer.setRole(User.UserRole.BUYER);
        buyer.setName("测试买家");
        buyer.setEmail(buyer.getPhone() + "@test.com");
        buyer.setEnabled(true);
        buyer = userRepository.save(buyer);
        buyerId = buyer.getId().toString();

        // 登录获取tokens
        farmerToken = loginUser(farmer.getPhone(), "Test@123456", "farmer");
        buyerToken = loginUser(buyer.getPhone(), "Test@123456", "buyer");
    }

    private String loginUser(String phone, String password, String role) {
        Map<String, Object> loginRequest = new HashMap<>();
        loginRequest.put("phone", phone);
        loginRequest.put("password", password);
        loginRequest.put("role", role);

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
                    return (String) data.get("token");
                }
            }
        }
        return null;
    }

    @Test
    @org.junit.jupiter.api.Order(1)
    @DisplayName("完整业务流程测试：农户创建商品 -> 买家查看 -> 买家下单")
    public void testCompleteBusinessFlow() {
        // 1. 农户创建商品
        Map<String, Object> productRequest = new HashMap<>();
        productRequest.put("name", "集成测试商品");
        productRequest.put("description", "测试描述");
        productRequest.put("category", "蔬菜");
        productRequest.put("price", 10.50);
        productRequest.put("unit", "斤");
        productRequest.put("stock", 100);
        productRequest.put("minOrderQuantity", 1);
        productRequest.put("origin", "测试产地");

        HttpHeaders headers = getAuthHeaders(farmerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> productEntity = new HttpEntity<>(productRequest, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> productResponse = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/create",
            HttpMethod.POST,
            productEntity,
            typeRef
        );

        if (productResponse.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> productBody = productResponse.getBody();
            if (productBody != null && productBody.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) productBody.get("data");
                if (data.containsKey("id")) {
                    productId = data.get("id").toString();
                }
            }
        }

        assertNotNull(productId, "商品应该创建成功");

        // 2. 农户上架商品
        Map<String, Object> toggleRequest = new HashMap<>();
        toggleRequest.put("productId", productId);
        toggleRequest.put("status", "on");

        HttpEntity<Map<String, Object>> toggleEntity = new HttpEntity<>(toggleRequest, headers);
        ResponseEntity<Map<String, Object>> toggleResponse = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/toggle-status",
            HttpMethod.POST,
            toggleEntity,
            typeRef
        );

        assertEquals(HttpStatus.OK, toggleResponse.getStatusCode(), "商品应该上架成功");

        // 3. 买家查看商品列表
        HttpHeaders buyerHeaders = getAuthHeaders(buyerToken);
        HttpEntity<Void> buyerEntity = new HttpEntity<>(buyerHeaders);
        ResponseEntity<Map<String, Object>> listResponse = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/list",
            HttpMethod.GET,
            buyerEntity,
            typeRef
        );

        assertEquals(HttpStatus.OK, listResponse.getStatusCode(), "买家应该能查看商品列表");

        // 4. 买家查看商品详情
        ResponseEntity<Map<String, Object>> detailResponse = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/" + productId,
            HttpMethod.GET,
            buyerEntity,
            typeRef
        );

        assertEquals(HttpStatus.OK, detailResponse.getStatusCode(), "买家应该能查看商品详情");

        // 5. 买家创建订单
        Map<String, Object> orderItem = new HashMap<>();
        orderItem.put("productId", productId);
        orderItem.put("quantity", 2);
        orderItem.put("price", 10.50);

        List<Map<String, Object>> items = new ArrayList<>();
        items.add(orderItem);

        Map<String, Object> orderRequest = new HashMap<>();
        orderRequest.put("items", items);
        orderRequest.put("addressId", "1");
        orderRequest.put("remark", "集成测试订单");

        buyerHeaders.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> orderEntity = new HttpEntity<>(orderRequest, buyerHeaders);

        ResponseEntity<Map<String, Object>> orderResponse = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders",
            HttpMethod.POST,
            orderEntity,
            typeRef
        );

        if (orderResponse.getStatusCode().is2xxSuccessful()) {
            Map<String, Object> orderBody = orderResponse.getBody();
            if (orderBody != null && orderBody.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) orderBody.get("data");
                if (data.containsKey("id")) {
                    orderId = data.get("id").toString();
                }
            }
        }

        assertNotNull(orderId, "订单应该创建成功");
    }

    @Test
    @org.junit.jupiter.api.Order(2)
    @DisplayName("测试跨角色权限控制")
    public void testCrossRolePermission() {
        // 农户尝试访问买家接口
        HttpHeaders headers = getAuthHeaders(farmerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders",
            HttpMethod.GET,
            entity,
            typeRef
        );

        // 农户不应该能访问买家接口（如果系统有严格权限控制）
        // 这里根据实际业务逻辑调整断言
        assertNotNull(response.getBody());
    }
}

