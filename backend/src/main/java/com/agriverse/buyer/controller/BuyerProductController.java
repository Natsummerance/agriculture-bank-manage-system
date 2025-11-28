package com.agriverse.buyer.controller;

import com.agriverse.dto.*;
import com.agriverse.buyer.service.BuyerProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 买家商品控制器
 * 处理买家查看商品列表、商品详情等请求
 */
@Slf4j
@RestController
@RequestMapping("/buyer/products")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class BuyerProductController {

    @Autowired
    private BuyerProductService buyerProductService;

    /**
     * 获取商品列表（仅显示已上架商品）
     * GET /api/buyer/products/list
     */
    @GetMapping("/list")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BuyerProductListResponse>> getProductList(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "20") Integer pageSize) {
        try {
            log.info("获取买家商品列表请求: search={}, category={}, page={}, pageSize={}",
                    search, category, page, pageSize);

            BuyerProductListRequest request = BuyerProductListRequest.builder()
                    .search(search)
                    .category(category)
                    .page(page)
                    .pageSize(pageSize)
                    .build();

            BuyerProductListResponse response = buyerProductService.getProductList(request);
            return ResponseEntity.ok(ApiResponse.success("获取成功", response));
        } catch (Exception e) {
            log.error("获取买家商品列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "获取商品列表失败，请稍后重试"));
        }
    }

    /**
     * 获取商品详情
     * GET /api/buyer/products/{productId}
     */
    @GetMapping("/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BuyerProductDetailResponse>> getProductDetail(
            @PathVariable String productId) {
        try {
            log.info("获取商品详情请求: productId={}", productId);

            BuyerProductDetailResponse response = buyerProductService.getProductDetail(productId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", response));
        } catch (RuntimeException e) {
            log.error("获取商品详情失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("获取商品详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "获取商品详情失败，请稍后重试"));
        }
    }

    /**
     * 健康检查
     * GET /api/buyer/products/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Object>> health() {
        return ResponseEntity.ok(ApiResponse.success("OK", null));
    }
}
