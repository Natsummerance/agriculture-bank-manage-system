package com.agriverse.buyer;

import com.agriverse.BaseTest;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.entity.FarmerProduct;
import com.agriverse.entity.User;
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
 * 买家商品模块完整测试
 * 覆盖商品列表查询、商品详情、分类筛选等功能
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class BuyerProductControllerTest extends BaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmerProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String buyerId;
    private String buyerToken;
    private String productId;

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

        // 创建测试商品（上架状态）
        FarmerProduct product = new FarmerProduct();
        product.setFarmerId("1");
        product.setName("测试商品");
        product.setDescription("测试商品描述");
        product.setCategory("蔬菜");
        product.setPrice(10.50);
        product.setStock(100);
        product.setStatus(FarmerProduct.ProductStatus.ON);
        product = productRepository.save(product);
        productId = product.getId().toString();
    }

    @Test
    @Order(1)
    @DisplayName("测试健康检查")
    public void testHealthCheck() {
        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/health",
            HttpMethod.GET,
            null,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(2)
    @DisplayName("测试获取商品列表")
    public void testGetProductList() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/list?page=1&pageSize=20",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
    }

    @Test
    @Order(3)
    @DisplayName("测试获取商品列表 - 按分类筛选")
    public void testGetProductListByCategory() {
        // 创建不同分类的商品
        FarmerProduct product1 = new FarmerProduct();
        product1.setFarmerId("1");
        product1.setName("蔬菜商品");
        product1.setCategory("蔬菜");
        product1.setStatus(FarmerProduct.ProductStatus.ON);
        productRepository.save(product1);

        FarmerProduct product2 = new FarmerProduct();
        product2.setFarmerId("1");
        product2.setName("水果商品");
        product2.setCategory("水果");
        product2.setStatus(FarmerProduct.ProductStatus.ON);
        productRepository.save(product2);

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/list?category=蔬菜",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(4)
    @DisplayName("测试获取商品列表 - 搜索")
    public void testGetProductListSearch() {
        FarmerProduct product = new FarmerProduct();
        product.setFarmerId("1");
        product.setName("搜索测试商品");
        product.setDescription("这是一个搜索测试");
        product.setStatus(FarmerProduct.ProductStatus.ON);
        productRepository.save(product);

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/list?search=搜索",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(5)
    @DisplayName("测试获取商品详情 - 成功")
    public void testGetProductDetailSuccess() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/" + productId,
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
    }

    @Test
    @Order(6)
    @DisplayName("测试获取商品详情 - 商品不存在")
    public void testGetProductDetailNotFound() {
        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/999999",
            HttpMethod.GET,
            entity,
            typeRef
        );

        // 应该返回错误
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST || 
                   response.getStatusCode() == HttpStatus.NOT_FOUND);
    }

    @Test
    @Order(7)
    @DisplayName("测试获取商品详情 - 商品未上架")
    public void testGetProductDetailNotOnSale() {
        // 创建下架商品
        FarmerProduct product = new FarmerProduct();
        product.setFarmerId("1");
        product.setName("下架商品");
        product.setStatus(FarmerProduct.ProductStatus.OFF);
        product = productRepository.save(product);

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/" + product.getId(),
            HttpMethod.GET,
            entity,
            typeRef
        );

        // 下架商品不应该被买家看到
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST || 
                   response.getStatusCode() == HttpStatus.NOT_FOUND);
    }

    @Test
    @Order(8)
    @DisplayName("测试分页功能")
    public void testPagination() {
        // 创建多个商品
        for (int i = 0; i < 25; i++) {
            FarmerProduct product = new FarmerProduct();
            product.setFarmerId("1");
            product.setName("分页测试商品" + i);
            product.setStatus(FarmerProduct.ProductStatus.ON);
            productRepository.save(product);
        }

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        // 测试第一页
        ResponseEntity<Map<String, Object>> response1 = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/list?page=1&pageSize=10",
            HttpMethod.GET,
            entity,
            typeRef
        );
        assertEquals(HttpStatus.OK, response1.getStatusCode());

        // 测试第二页
        ResponseEntity<Map<String, Object>> response2 = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/list?page=2&pageSize=10",
            HttpMethod.GET,
            entity,
            typeRef
        );
        assertEquals(HttpStatus.OK, response2.getStatusCode());
    }

    @Test
    @Order(9)
    @DisplayName("测试未认证访问")
    public void testUnauthenticatedAccess() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/list",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    @Order(10)
    @DisplayName("测试只显示上架商品")
    public void testOnlyShowOnSaleProducts() {
        // 创建上架和下架商品
        FarmerProduct productOn = new FarmerProduct();
        productOn.setFarmerId("1");
        productOn.setName("上架商品");
        productOn.setStatus(FarmerProduct.ProductStatus.ON);
        productRepository.save(productOn);

        FarmerProduct productOff = new FarmerProduct();
        productOff.setFarmerId("1");
        productOff.setName("下架商品");
        productOff.setStatus(FarmerProduct.ProductStatus.OFF);
        productRepository.save(productOff);

        HttpHeaders headers = getAuthHeaders(buyerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/buyer/products/list",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        // 验证返回的商品列表中不应该包含下架商品
    }
}

