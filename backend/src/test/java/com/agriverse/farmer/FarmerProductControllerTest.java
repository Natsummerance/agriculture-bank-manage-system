package com.agriverse.farmer;

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
 * 农户商品模块完整测试
 * 覆盖商品创建、列表查询、上下架、数据看板等功能
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class FarmerProductControllerTest extends BaseTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmerProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String farmerId;
    private String farmerToken;
    private String productId;

    @BeforeEach
    public void setUpTest() {
        super.setUp();
        // 创建测试农户用户
        User farmer = new User();
        farmer.setPhone("138" + String.format("%08d", System.currentTimeMillis() % 100000000));
        farmer.setPassword(passwordEncoder.encode("Test@123456"));
        farmer.setRole(User.UserRole.FARMER);
        farmer.setName("测试农户");
        farmer.setEmail(farmer.getPhone() + "@test.com");
        farmer.setEnabled(true);
        farmer = userRepository.save(farmer);
        farmerId = farmer.getId().toString();

        // 登录获取token
        Map<String, Object> loginRequest = new HashMap<>();
        loginRequest.put("phone", farmer.getPhone());
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

        if (loginResponse.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> loginBody = loginResponse.getBody();
            if (loginBody != null && loginBody.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) loginBody.get("data");
                if (data.containsKey("token")) {
                    farmerToken = (String) data.get("token");
                }
            }
        }
    }

    @Test
    @Order(1)
    @DisplayName("测试健康检查")
    public void testHealthCheck() {
        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/health",
            HttpMethod.GET,
            null,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(2)
    @DisplayName("测试获取商品列表 - 空列表")
    public void testGetProductListEmpty() {
        HttpHeaders headers = getAuthHeaders(farmerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/list?page=1&pageSize=20",
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
    @DisplayName("测试创建商品 - 成功")
    public void testCreateProductSuccess() {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "测试商品" + System.currentTimeMillis());
        request.put("description", "这是一个测试商品描述");
        request.put("category", "蔬菜");
        request.put("price", 10.50);
        request.put("unit", "斤");
        request.put("stock", 100);
        request.put("minOrderQuantity", 1);
        request.put("origin", "测试产地");
        request.put("images", new String[]{"https://example.com/image1.jpg"});

        HttpHeaders headers = getAuthHeaders(farmerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/create",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        
        if (body.containsKey("data")) {
            Map<String, Object> data = (Map<String, Object>) body.get("data");
            if (data.containsKey("id")) {
                productId = data.get("id").toString();
            }
        }
    }

    @Test
    @Order(4)
    @DisplayName("测试创建商品 - 缺少必填字段")
    public void testCreateProductMissingFields() {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "测试商品");
        // 缺少price等必填字段

        HttpHeaders headers = getAuthHeaders(farmerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/create",
            HttpMethod.POST,
            entity,
            typeRef
        );

        // 应该返回验证错误
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST || 
                   response.getStatusCode() == HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Test
    @Order(5)
    @DisplayName("测试获取商品列表 - 有数据")
    public void testGetProductListWithData() {
        // 先创建商品
        FarmerProduct product = new FarmerProduct();
        product.setFarmerId(farmerId);
        product.setName("测试商品列表");
        product.setDescription("测试描述");
        product.setCategory("蔬菜");
        product.setPrice(10.50);
        product.setStock(100);
        product.setStatus(FarmerProduct.ProductStatus.ON);
        productRepository.save(product);

        HttpHeaders headers = getAuthHeaders(farmerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/list?page=1&pageSize=20&status=all",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(6)
    @DisplayName("测试获取商品列表 - 按状态筛选")
    public void testGetProductListByStatus() {
        // 创建上架商品
        FarmerProduct productOn = new FarmerProduct();
        productOn.setFarmerId(farmerId);
        productOn.setName("上架商品");
        productOn.setStatus(FarmerProduct.ProductStatus.ON);
        productRepository.save(productOn);

        // 创建下架商品
        FarmerProduct productOff = new FarmerProduct();
        productOff.setFarmerId(farmerId);
        productOff.setName("下架商品");
        productOff.setStatus(FarmerProduct.ProductStatus.OFF);
        productRepository.save(productOff);

        HttpHeaders headers = getAuthHeaders(farmerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        // 测试获取上架商品
        ResponseEntity<Map<String, Object>> responseOn = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/list?status=on",
            HttpMethod.GET,
            entity,
            typeRef
        );
        assertEquals(HttpStatus.OK, responseOn.getStatusCode());

        // 测试获取下架商品
        ResponseEntity<Map<String, Object>> responseOff = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/list?status=off",
            HttpMethod.GET,
            entity,
            typeRef
        );
        assertEquals(HttpStatus.OK, responseOff.getStatusCode());
    }

    @Test
    @Order(7)
    @DisplayName("测试获取商品列表 - 搜索")
    public void testGetProductListSearch() {
        // 创建测试商品
        FarmerProduct product = new FarmerProduct();
        product.setFarmerId(farmerId);
        product.setName("搜索测试商品");
        product.setDescription("这是一个搜索测试");
        product.setStatus(FarmerProduct.ProductStatus.ON);
        productRepository.save(product);

        HttpHeaders headers = getAuthHeaders(farmerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/list?search=搜索",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(8)
    @DisplayName("测试商品上架")
    public void testToggleProductStatusOn() {
        // 先创建下架商品
        FarmerProduct product = new FarmerProduct();
        product.setFarmerId(farmerId);
        product.setName("测试上架商品");
        product.setStatus(FarmerProduct.ProductStatus.OFF);
        product = productRepository.save(product);

        Map<String, Object> request = new HashMap<>();
        request.put("productId", product.getId().toString());
        request.put("status", "on");

        HttpHeaders headers = getAuthHeaders(farmerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/toggle-status",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(9)
    @DisplayName("测试商品下架")
    public void testToggleProductStatusOff() {
        // 先创建上架商品
        FarmerProduct product = new FarmerProduct();
        product.setFarmerId(farmerId);
        product.setName("测试下架商品");
        product.setStatus(FarmerProduct.ProductStatus.ON);
        product = productRepository.save(product);

        Map<String, Object> request = new HashMap<>();
        request.put("productId", product.getId().toString());
        request.put("status", "off");

        HttpHeaders headers = getAuthHeaders(farmerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/toggle-status",
            HttpMethod.POST,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(10)
    @DisplayName("测试商品上下架 - 商品不存在")
    public void testToggleProductStatusNotFound() {
        Map<String, Object> request = new HashMap<>();
        request.put("productId", "999999");
        request.put("status", "on");

        HttpHeaders headers = getAuthHeaders(farmerToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/toggle-status",
            HttpMethod.POST,
            entity,
            typeRef
        );

        // 应该返回错误
        assertTrue(response.getStatusCode() == HttpStatus.BAD_REQUEST || 
                   response.getStatusCode() == HttpStatus.NOT_FOUND);
    }

    @Test
    @Order(11)
    @DisplayName("测试获取商品数据看板")
    public void testGetProductDashboard() {
        // 创建一些测试商品
        for (int i = 0; i < 5; i++) {
            FarmerProduct product = new FarmerProduct();
            product.setFarmerId(farmerId);
            product.setName("看板测试商品" + i);
            product.setStatus(i % 2 == 0 ? FarmerProduct.ProductStatus.ON : FarmerProduct.ProductStatus.OFF);
            product.setPrice(10.50);
            product.setStock(100);
            productRepository.save(product);
        }

        HttpHeaders headers = getAuthHeaders(farmerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/dashboard",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = response.getBody();
        assertNotNull(body);
    }

    @Test
    @Order(12)
    @DisplayName("测试未认证访问")
    public void testUnauthenticatedAccess() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/list",
            HttpMethod.GET,
            entity,
            typeRef
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    @Order(13)
    @DisplayName("测试分页功能")
    public void testPagination() {
        // 创建多个商品
        for (int i = 0; i < 25; i++) {
            FarmerProduct product = new FarmerProduct();
            product.setFarmerId(farmerId);
            product.setName("分页测试商品" + i);
            product.setStatus(FarmerProduct.ProductStatus.ON);
            productRepository.save(product);
        }

        HttpHeaders headers = getAuthHeaders(farmerToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ParameterizedTypeReference<Map<String, Object>> typeRef = 
            new ParameterizedTypeReference<Map<String, Object>>() {};

        // 测试第一页
        ResponseEntity<Map<String, Object>> response1 = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/list?page=1&pageSize=10",
            HttpMethod.GET,
            entity,
            typeRef
        );
        assertEquals(HttpStatus.OK, response1.getStatusCode());

        // 测试第二页
        ResponseEntity<Map<String, Object>> response2 = restTemplate.exchange(
            getBaseUrl() + "/farmer/products/list?page=2&pageSize=10",
            HttpMethod.GET,
            entity,
            typeRef
        );
        assertEquals(HttpStatus.OK, response2.getStatusCode());
    }
}

