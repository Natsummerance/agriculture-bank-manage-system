package com.agriverse.farmer.controller;

import com.agriverse.dto.*;
import com.agriverse.farmer.service.FarmerProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.Principal;

/**
 * 农户商品控制器
 * 处理商品列表、上下架、数据看板等请求
 */
@Slf4j
@RestController
@RequestMapping("/farmer/products")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class FarmerProductController {

    @Autowired
    private FarmerProductService farmerProductService;

    /**
     * 获取商品列表
     * GET /api/farmer/products/list
     */
    @GetMapping("/list")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ProductListResponse>> getProductList(
            Principal principal,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "20") Integer pageSize) {
        try {
            String farmerId = principal.getName();
            log.info("获取商品列表请求: farmerId={}, search={}, status={}, page={}, pageSize={}",
                    farmerId, search, status, page, pageSize);

            ProductListRequest request = ProductListRequest.builder()
                    .search(search)
                    .status(status)
                    .page(page)
                    .pageSize(pageSize)
                    .build();

            ProductListResponse response = farmerProductService.getProductList(farmerId, request);
            return ResponseEntity.ok(ApiResponse.success("获取成功", response));
        } catch (Exception e) {
            log.error("获取商品列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "获取商品列表失败，请稍后重试"));
        }
    }

    /**
     * 创建商品
     * POST /api/farmer/products/create
     */
    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ProductListResponse.ProductItem>> createProduct(
            Principal principal,
            @Valid @RequestBody CreateProductRequest request) {
        try {
            String farmerId = principal.getName();
            log.info("创建商品请求: farmerId={}, name={}", farmerId, request.getName());

            ProductListResponse.ProductItem created = farmerProductService.createProduct(farmerId, request);
            return ResponseEntity.ok(ApiResponse.success("商品创建成功", created));
        } catch (RuntimeException e) {
            log.error("商品创建失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("商品创建异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "创建商品失败，请稍后重试"));
        }
    }

    /**
     * 商品上下架
     * POST /api/farmer/products/toggle-status
     */
    @PostMapping("/toggle-status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Object>> toggleProductStatus(
            Principal principal,
            @Valid @RequestBody ToggleStatusRequest request) {
        try {
            String farmerId = principal.getName();
            log.info("商品上下架请求: farmerId={}, productId={}, status={}",
                    farmerId, request.getProductId(), request.getStatus());

            farmerProductService.toggleProductStatus(farmerId, request);
            String message = "on".equals(request.getStatus()) ? "商品已上架" : "商品已下架";
            return ResponseEntity.ok(ApiResponse.success(message, null));
        } catch (RuntimeException e) {
            log.error("商品上下架失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("商品上下架异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "操作失败，请稍后重试"));
        }
    }

    /**
     * 获取商品数据看板
     * GET /api/farmer/products/dashboard
     */
    @GetMapping("/dashboard")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ProductDashboardResponse>> getProductDashboard(Principal principal) {
        try {
            String farmerId = principal.getName();
            log.info("获取商品数据看板请求: farmerId={}", farmerId);

            ProductDashboardResponse response = farmerProductService.getProductDashboard(farmerId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", response));
        } catch (Exception e) {
            log.error("获取商品数据看板异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "获取数据看板失败，请稍后重试"));
        }
    }

    /**
     * 健康检查
     * GET /api/farmer/products/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Object>> health() {
        return ResponseEntity.ok(ApiResponse.success("OK", null));
    }
}
