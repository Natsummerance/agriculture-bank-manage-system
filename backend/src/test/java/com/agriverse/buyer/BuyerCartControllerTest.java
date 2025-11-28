package com.agriverse.buyer;

import com.agriverse.BaseTest;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.buyer.repository.BuyerCartItemRepository;
import com.agriverse.entity.*;
import com.agriverse.farmer.repository.FarmerProductRepository;
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
 * 买家购物车模块完整测试
 * 覆盖购物车添加、查询、更新、删除等功能
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SuppressWarnings("unused")
public class BuyerCartControllerTest extends BaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmerProductRepository productRepository;

    @Autowired
    private BuyerCartItemRepository cartItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String buyerId;
    private String buyerToken;
    private String productId;
    private String cartItemId;

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
    @DisplayName("测试获取购物车 - 空购物车")
    public void testGetCartEmpty() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/cart",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @org.junit.jupiter.api.Order(2)
    @DisplayName("测试添加商品到购物车 - 成功")
    public void testAddItemToCartSuccess() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/cart/items?productId=" + productId + "&quantity=2",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = response.getBody();
        if (body != null && body.containsKey("data")) {
            Map<String, Object> data = (Map<String, Object>) body.get("data");
            if (data.containsKey("id")) {
                cartItemId = data.get("id").toString();
            }
        }
    }

    @Test
    @org.junit.jupiter.api.Order(3)
    @DisplayName("测试添加商品到购物车 - 商品不存在")
    public void testAddItemToCartProductNotFound() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/cart/items?productId=999999&quantity=1",
            HttpMethod.POST,
            entity,
            typeRef
        );

        // 应该返回错误
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST || 
                   response.getStatusCode() == HttpStatus.NOT_FOUND);
    }

    @Test
    @org.junit.jupiter.api.Order(4)
    @DisplayName("测试添加商品到购物车 - 数量为0")
    public void testAddItemToCartInvalidQuantity() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/cart/items?productId=" + productId + "&quantity=0",
            HttpMethod.POST,
            entity,
            typeRef
        );

        // 应该返回验证错误
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST);
    }

    @Test
    @org.junit.jupiter.api.Order(5)
    @DisplayName("测试添加商品到购物车 - 已存在则更新数量")
    public void testAddItemToCartUpdateQuantity() {
        // 先添加一次
        testAddItemToCartSuccess();
        
        // 再次添加相同商品
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/cart/items?productId=" + productId + "&quantity=3",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @org.junit.jupiter.api.Order(6)
    @DisplayName("测试获取购物车 - 有商品")
    public void testGetCartWithItems() {
        // 先添加商品
        testAddItemToCartSuccess();

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/cart",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @org.junit.jupiter.api.Order(7)
    @DisplayName("测试更新购物车商品数量")
    public void testUpdateCartItemQuantity() {
        // 先添加商品
        testAddItemToCartSuccess();

        Map<String, Object> request = new HashMap<>();
        request.put("quantity", 5);
        request.put("selected", true);

        HttpHeaders headers = getAuthHeaders(buyerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/cart/items/" + cartItemId,
            HttpMethod.PUT,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @org.junit.jupiter.api.Order(8)
    @DisplayName("测试删除购物车商品")
    public void testDeleteCartItem() {
        // 先添加商品
        testAddItemToCartSuccess();

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/cart/items/" + cartItemId,
            HttpMethod.DELETE,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @org.junit.jupiter.api.Order(9)
    @DisplayName("测试清空购物车")
    public void testClearCart() {
        // 先添加商品
        testAddItemToCartSuccess();

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/cart/clear",
            HttpMethod.DELETE,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
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
            getBaseUrl() + "/buyer/cart",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    @org.junit.jupiter.api.Order(11)
    @DisplayName("测试购物车商品选中状态")
    public void testCartItemSelection() {
        // 先添加商品
        testAddItemToCartSuccess();

        Map<String, Object> request = new HashMap<>();
        request.put("selected", true);

        HttpHeaders headers = getAuthHeaders(buyerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/cart/items/" + cartItemId,
            HttpMethod.PUT,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}

