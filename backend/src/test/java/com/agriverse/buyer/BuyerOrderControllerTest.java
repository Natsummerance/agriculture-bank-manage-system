package com.agriverse.buyer;

import com.agriverse.BaseTest;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.entity.*;
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
 * 买家订单模块完整测试
 * 覆盖订单创建、查询、详情、状态更新等功能
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SuppressWarnings("unused")
public class BuyerOrderControllerTest extends BaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmerProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String buyerId;
    private String buyerToken;
    private String productId;
    private String orderId;

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

        // 创建测试商品
        FarmerProduct product = new FarmerProduct();
        product.setFarmerId("1");
        product.setName("测试商品");
        product.setPrice(10.50);
        product.setStock(100);
        product.setStatus(FarmerProduct.ProductStatus.ON);
        product = productRepository.save(product);
        productId = product.getId().toString();
    }

    @Test
    @org.junit.jupiter.api.Order(1)
    @DisplayName("测试创建订单 - 成功")
    public void testCreateOrderSuccess() {
        Map<String, Object> item = new HashMap<>();
        item.put("productId", productId);
        item.put("quantity", 2);
        item.put("price", 10.50);

        List<Map<String, Object>> items = new ArrayList<>();
        items.add(item);

        Map<String, Object> request = new HashMap<>();
        request.put("items", items);
        request.put("addressId", "1");
        request.put("remark", "测试订单备注");

        HttpHeaders headers = getAuthHeaders(buyerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders",
            HttpMethod.POST,
            entity,
            typeRef
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) body.get("data");
                if (data.containsKey("id")) {
                    orderId = data.get("id").toString();
                }
            }
        }
    }

    @Test
    @org.junit.jupiter.api.Order(2)
    @DisplayName("测试创建订单 - 商品不存在")
    public void testCreateOrderProductNotFound() {
        Map<String, Object> item = new HashMap<>();
        item.put("productId", "999999");
        item.put("quantity", 2);
        item.put("price", 10.50);

        List<Map<String, Object>> items = new ArrayList<>();
        items.add(item);

        Map<String, Object> request = new HashMap<>();
        request.put("items", items);
        request.put("addressId", "1");

        HttpHeaders headers = getAuthHeaders(buyerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders",
            HttpMethod.POST,
            entity,
            typeRef
        );

        // 应该返回错误
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST || 
                   response.getStatusCode() == HttpStatus.NOT_FOUND);
    }

    @Test
    @org.junit.jupiter.api.Order(3)
    @DisplayName("测试创建订单 - 库存不足")
    public void testCreateOrderInsufficientStock() {
        // 创建库存为0的商品
        FarmerProduct product = new FarmerProduct();
        product.setFarmerId("1");
        product.setName("无库存商品");
        product.setPrice(10.50);
        product.setStock(0);
        product.setStatus(FarmerProduct.ProductStatus.ON);
        product = productRepository.save(product);

        Map<String, Object> item = new HashMap<>();
        item.put("productId", product.getId().toString());
        item.put("quantity", 1);
        item.put("price", 10.50);

        List<Map<String, Object>> items = new ArrayList<>();
        items.add(item);

        Map<String, Object> request = new HashMap<>();
        request.put("items", items);
        request.put("addressId", "1");

        HttpHeaders headers = getAuthHeaders(buyerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders",
            HttpMethod.POST,
            entity,
            typeRef
        );

        // 应该返回错误
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST);
    }

    @Test
    @org.junit.jupiter.api.Order(4)
    @DisplayName("测试获取订单列表")
    public void testGetOrderList() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders?page=1&pageSize=20",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @org.junit.jupiter.api.Order(5)
    @DisplayName("测试获取订单列表 - 按状态筛选")
    public void testGetOrderListByStatus() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        String[] statuses = {"pending", "paid", "shipped", "completed", "cancelled"};
        for (String status : statuses) {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                getBaseUrl() + "/buyer/orders?status=" + status,
                HttpMethod.GET,
                entity,
                typeRef
            );
            assertEquals(HttpStatus.OK, response.getStatusCode());
        }
    }

    @Test
    @org.junit.jupiter.api.Order(6)
    @DisplayName("测试获取订单详情")
    public void testGetOrderDetail() {
        // 先创建订单
        com.agriverse.entity.Order order = new com.agriverse.entity.Order();
        order.setBuyerId(buyerId);
        order.setStatus(com.agriverse.entity.Order.OrderStatus.PENDING);
        order.setTotalAmount(new BigDecimal("21.00"));
        order = orderRepository.save(order);

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders/" + order.getId(),
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @org.junit.jupiter.api.Order(7)
    @DisplayName("测试获取订单详情 - 订单不存在")
    public void testGetOrderDetailNotFound() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders/999999",
            HttpMethod.GET,
            entity,
            typeRef
        );

        // 应该返回错误
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST || 
                   response.getStatusCode() == HttpStatus.NOT_FOUND);
    }

    @Test
    @org.junit.jupiter.api.Order(8)
    @DisplayName("测试取消订单")
    public void testCancelOrder() {
        // 先创建订单
        com.agriverse.entity.Order order = new com.agriverse.entity.Order();
        order.setBuyerId(buyerId);
        order.setStatus(com.agriverse.entity.Order.OrderStatus.PENDING);
        order.setTotalAmount(new BigDecimal("21.00"));
        order = orderRepository.save(order);

        Map<String, Object> request = new HashMap<>();
        request.put("orderId", order.getId().toString());
        request.put("status", "cancelled");
        request.put("reason", "测试取消原因");

        HttpHeaders headers = getAuthHeaders(buyerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders/cancel",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    @org.junit.jupiter.api.Order(9)
    @DisplayName("测试确认收货")
    public void testConfirmReceipt() {
        // 先创建已发货订单
        com.agriverse.entity.Order order = new com.agriverse.entity.Order();
        order.setBuyerId(buyerId);
        order.setStatus(com.agriverse.entity.Order.OrderStatus.SHIPPED);
        order.setTotalAmount(new BigDecimal("21.00"));
        order = orderRepository.save(order);

        Map<String, Object> request = new HashMap<>();
        request.put("orderId", order.getId().toString());

        HttpHeaders headers = getAuthHeaders(buyerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders/confirm",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    @org.junit.jupiter.api.Order(10)
    @DisplayName("测试未认证访问")
    public void testUnauthenticatedAccess() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    @org.junit.jupiter.api.Order(11)
    @DisplayName("测试分页功能")
    public void testPagination() {
        // 创建多个订单
        for (int i = 0; i < 25; i++) {
            com.agriverse.entity.Order order = new com.agriverse.entity.Order();
            order.setBuyerId(buyerId);
            order.setStatus(com.agriverse.entity.Order.OrderStatus.PENDING);
            order.setTotalAmount(new BigDecimal("21.00"));
            orderRepository.save(order);
        }

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        // 测试第一页
        ResponseEntity<Map<String, Object>> response1 = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders?page=1&pageSize=10",
            HttpMethod.GET,
            entity,
            typeRef
        );
        assertEquals(HttpStatus.OK, response1.getStatusCode());

        // 测试第二页
        ResponseEntity<Map<String, Object>> response2 = restTemplate.exchange(
            getBaseUrl() + "/buyer/orders?page=2&pageSize=10",
            HttpMethod.GET,
            entity,
            typeRef
        );
        assertEquals(HttpStatus.OK, response2.getStatusCode());
    }
}

