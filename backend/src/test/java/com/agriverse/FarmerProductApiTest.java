package com.agriverse;

import com.agriverse.entity.FarmerProduct;
import com.agriverse.entity.User;
import com.agriverse.farmer.repository.FarmerProductRepository;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.util.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.test.annotation.Commit;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 农户田心市场API测试
 * 测试商品列表、上下架、数据看板等功能的前后端连通性
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class FarmerProductApiTest {

        @LocalServerPort
        private int port;

        @Autowired
        private TestRestTemplate restTemplate;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private FarmerProductRepository farmerProductRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private JwtTokenProvider jwtTokenProvider;

        @Autowired
        private EntityManager entityManager;

        @Autowired
        private PlatformTransactionManager transactionManager;

        private String farmerId;
        private String jwtToken;
        private String productId1;
        private String productId2;

        private String getBaseUrl() {
                return "http://localhost:" + port + "/api";
        }

        /**
         * 测试前准备：创建测试用户和测试商品
         * 使用独立事务并提交，确保数据在HTTP请求前已提交到数据库
         */
        @BeforeEach
        public void setUp() {
                // 使用独立事务并提交，确保HTTP请求能看到数据
                DefaultTransactionDefinition def = new DefaultTransactionDefinition();
                def.setPropagationBehavior(Propagation.REQUIRES_NEW.ordinal());
                TransactionStatus status = transactionManager.getTransaction(def);

                try {
                        // 创建测试农户用户
                        String testPhone = "139" + String.format("%08d", System.currentTimeMillis() % 100000000);
                        User farmer = User.builder()
                                        .phone(testPhone)
                                        .password(passwordEncoder.encode("test123456"))
                                        .role(User.UserRole.FARMER)
                                        .name("测试农户")
                                        .email("farmer" + System.currentTimeMillis() + "@test.com")
                                        .enabled(true)
                                        .emailVerified(false)
                                        .loginAttempts(0)
                                        .createdAt(LocalDateTime.now())
                                        .updatedAt(LocalDateTime.now())
                                        .build();
                        farmer = userRepository.save(farmer);
                        farmerId = farmer.getId();

                        // 生成JWT token
                        jwtToken = jwtTokenProvider.generateAccessToken(farmerId, testPhone, "FARMER");

                        // 创建测试商品
                        FarmerProduct product1 = FarmerProduct.builder()
                                        .farmerId(farmerId)
                                        .name("测试苹果")
                                        .category("水果")
                                        .price(10.5)
                                        .stock(100)
                                        .origin("山东烟台")
                                        .description("新鲜苹果")
                                        .status(FarmerProduct.ProductStatus.ON)
                                        .viewCount(50)
                                        .favoriteCount(10)
                                        .shareCount(5)
                                        .createdAt(LocalDateTime.now())
                                        .updatedAt(LocalDateTime.now())
                                        .build();
                        product1 = farmerProductRepository.save(product1);
                        productId1 = product1.getId();

                        FarmerProduct product2 = FarmerProduct.builder()
                                        .farmerId(farmerId)
                                        .name("测试橙子")
                                        .category("水果")
                                        .price(8.0)
                                        .stock(80)
                                        .origin("江西赣州")
                                        .description("新鲜橙子")
                                        .status(FarmerProduct.ProductStatus.OFF)
                                        .viewCount(30)
                                        .favoriteCount(5)
                                        .shareCount(2)
                                        .createdAt(LocalDateTime.now())
                                        .updatedAt(LocalDateTime.now())
                                        .build();
                        product2 = farmerProductRepository.save(product2);
                        productId2 = product2.getId();

                        // 提交事务，确保数据已写入数据库
                        transactionManager.commit(status);
                } catch (Exception e) {
                        transactionManager.rollback(status);
                        throw e;
                }
        }

        /**
         * 创建带认证的HTTP头
         */
        private HttpHeaders createAuthHeaders() {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(jwtToken);
                return headers;
        }

        /**
         * 测试1：获取商品列表（基础功能）
         */
        @Test
        public void testGetProductList() {
                HttpHeaders headers = createAuthHeaders();
                HttpEntity<Void> request = new HttpEntity<>(headers);
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/list",
                                HttpMethod.GET,
                                request,
                                typeRef);

                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertNotNull(response.getBody());

                Map<String, Object> body = response.getBody();
                assertTrue(body.containsKey("success") || body.containsKey("code"));

                // 验证响应数据结构
                if (body.containsKey("data")) {
                        Map<String, Object> data = (Map<String, Object>) body.get("data");
                        assertNotNull(data);
                        assertTrue(data.containsKey("products"));
                        assertTrue(data.containsKey("total"));
                        assertTrue(data.containsKey("page"));
                        assertTrue(data.containsKey("pageSize"));
                }
        }

        /**
         * 测试2：商品列表搜索功能
         */
        @Test
        public void testProductListSearch() {
                HttpHeaders headers = createAuthHeaders();
                HttpEntity<Void> request = new HttpEntity<>(headers);
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                // 搜索"苹果"
                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/list?search=苹果",
                                HttpMethod.GET,
                                request,
                                typeRef);

                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertNotNull(response.getBody());
        }

        /**
         * 测试3：商品列表状态过滤
         */
        @Test
        public void testProductListStatusFilter() {
                HttpHeaders headers = createAuthHeaders();
                HttpEntity<Void> request = new HttpEntity<>(headers);
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                // 测试查询已上架商品
                ResponseEntity<Map<String, Object>> responseOn = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/list?status=on",
                                HttpMethod.GET,
                                request,
                                typeRef);

                assertEquals(HttpStatus.OK, responseOn.getStatusCode());

                // 测试查询已下架商品
                ResponseEntity<Map<String, Object>> responseOff = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/list?status=off",
                                HttpMethod.GET,
                                request,
                                typeRef);

                assertEquals(HttpStatus.OK, responseOff.getStatusCode());

                // 测试查询全部商品
                ResponseEntity<Map<String, Object>> responseAll = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/list?status=all",
                                HttpMethod.GET,
                                request,
                                typeRef);

                assertEquals(HttpStatus.OK, responseAll.getStatusCode());
        }

        /**
         * 测试4：商品列表分页
         */
        @Test
        public void testProductListPagination() {
                HttpHeaders headers = createAuthHeaders();
                HttpEntity<Void> request = new HttpEntity<>(headers);
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                // 测试第一页，每页1条
                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/list?page=1&pageSize=1",
                                HttpMethod.GET,
                                request,
                                typeRef);

                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertNotNull(response.getBody());
        }

        /**
         * 测试5：商品上架操作
         */
        @Test
        @Transactional
        public void testToggleProductStatusOn() {
                HttpHeaders headers = createAuthHeaders();

                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("productId", productId2); // 使用下架的商品
                requestBody.put("status", "on");

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/toggle-status",
                                HttpMethod.POST,
                                request,
                                typeRef);

                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertNotNull(response.getBody());

                // 验证商品状态已更新
                FarmerProduct product = farmerProductRepository.findById(productId2).orElse(null);
                assertNotNull(product);
                assertEquals(FarmerProduct.ProductStatus.ON, product.getStatus());
        }

        /**
         * 测试6：商品下架操作
         */
        @Test
        @Transactional
        public void testToggleProductStatusOff() {
                HttpHeaders headers = createAuthHeaders();

                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("productId", productId1); // 使用上架的商品
                requestBody.put("status", "off");

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/toggle-status",
                                HttpMethod.POST,
                                request,
                                typeRef);

                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertNotNull(response.getBody());

                // 验证商品状态已更新
                FarmerProduct product = farmerProductRepository.findById(productId1).orElse(null);
                assertNotNull(product);
                assertEquals(FarmerProduct.ProductStatus.OFF, product.getStatus());
        }

        /**
         * 测试7：获取商品数据看板
         */
        @Test
        public void testGetProductDashboard() {
                HttpHeaders headers = createAuthHeaders();
                HttpEntity<Void> request = new HttpEntity<>(headers);
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/dashboard",
                                HttpMethod.GET,
                                request,
                                typeRef);

                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertNotNull(response.getBody());

                Map<String, Object> body = response.getBody();
                assertTrue(body.containsKey("success") || body.containsKey("code"));

                // 验证响应数据结构
                if (body.containsKey("data")) {
                        Map<String, Object> data = (Map<String, Object>) body.get("data");
                        assertNotNull(data);
                        assertTrue(data.containsKey("totalView"));
                        assertTrue(data.containsKey("totalFavorite"));
                        assertTrue(data.containsKey("totalShare"));
                        assertTrue(data.containsKey("avgView"));
                        assertTrue(data.containsKey("topProducts"));
                        assertTrue(data.containsKey("trendData"));
                }
        }

        /**
         * 测试8：未认证访问应该返回401
         */
        @Test
        public void testUnauthenticatedAccess() {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Void> request = new HttpEntity<>(headers);
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/list",
                                HttpMethod.GET,
                                request,
                                typeRef);

                assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        }

        /**
         * 测试9：操作其他农户的商品应该失败
         */
        @Test
        public void testAccessOtherFarmerProduct() {
                // 创建另一个农户
                String otherPhone = "138" + String.format("%08d", System.currentTimeMillis() % 100000000);
                User otherFarmer = User.builder()
                                .phone(otherPhone)
                                .password(passwordEncoder.encode("test123456"))
                                .role(User.UserRole.FARMER)
                                .name("其他农户")
                                .email("other" + System.currentTimeMillis() + "@test.com")
                                .enabled(true)
                                .emailVerified(false)
                                .loginAttempts(0)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build();
                otherFarmer = userRepository.save(otherFarmer);
                String otherToken = jwtTokenProvider.generateAccessToken(otherFarmer.getId(), otherPhone, "FARMER");

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(otherToken);

                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("productId", productId1); // 尝试操作第一个农户的商品
                requestBody.put("status", "off");

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/toggle-status",
                                HttpMethod.POST,
                                request,
                                typeRef);

                // 应该返回400或403，因为无权操作其他农户的商品
                assertTrue(
                                response.getStatusCode() == HttpStatus.BAD_REQUEST ||
                                                response.getStatusCode() == HttpStatus.FORBIDDEN ||
                                                response.getStatusCode() == HttpStatus.UNAUTHORIZED);
        }

        /**
         * 测试10：综合测试 - 完整的商品管理流程
         */
        @Test
        @Transactional
        public void testCompleteProductManagementFlow() {
                HttpHeaders headers = createAuthHeaders();

                // 1. 获取商品列表
                HttpEntity<Void> listRequest = new HttpEntity<>(headers);
                ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {
                };

                ResponseEntity<Map<String, Object>> listResponse = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/list",
                                HttpMethod.GET,
                                listRequest,
                                typeRef);

                assertEquals(HttpStatus.OK, listResponse.getStatusCode());

                // 2. 下架一个商品
                Map<String, Object> toggleRequest = new HashMap<>();
                toggleRequest.put("productId", productId1);
                toggleRequest.put("status", "off");

                HttpEntity<Map<String, Object>> toggleRequestEntity = new HttpEntity<>(toggleRequest, headers);
                ResponseEntity<Map<String, Object>> toggleResponse = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/toggle-status",
                                HttpMethod.POST,
                                toggleRequestEntity,
                                typeRef);

                assertEquals(HttpStatus.OK, toggleResponse.getStatusCode());

                // 3. 查询已下架商品，确认状态已更新
                ResponseEntity<Map<String, Object>> offListResponse = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/list?status=off",
                                HttpMethod.GET,
                                listRequest,
                                typeRef);

                assertEquals(HttpStatus.OK, offListResponse.getStatusCode());

                // 4. 获取数据看板
                ResponseEntity<Map<String, Object>> dashboardResponse = restTemplate.exchange(
                                getBaseUrl() + "/farmer/products/dashboard",
                                HttpMethod.GET,
                                listRequest,
                                typeRef);

                assertEquals(HttpStatus.OK, dashboardResponse.getStatusCode());
        }
}
