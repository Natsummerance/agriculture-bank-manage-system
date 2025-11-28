package com.agriverse.buyer.controller;

import com.agriverse.dto.*;
import com.agriverse.buyer.service.BuyerOrderService;
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
 * 买家订单控制器
 * 处理订单创建、查询、更新等请求
 */
@Slf4j
@RestController
@RequestMapping("/buyer/orders")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class BuyerOrderController {

    @Autowired
    private BuyerOrderService buyerOrderService;

    /**
     * 创建订单
     * POST /api/buyer/orders
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BuyerOrderResponse>> createOrder(
            Principal principal,
            @Valid @RequestBody CreateOrderRequest request) {
        try {
            String buyerId = principal.getName();
            log.info("创建订单请求: buyerId={}, items={}", buyerId, request.getItems().size());

            BuyerOrderResponse response = buyerOrderService.createOrder(buyerId, request);
            return ResponseEntity.ok(ApiResponse.success("订单创建成功", response));
        } catch (RuntimeException e) {
            log.error("创建订单失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("创建订单异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "创建订单失败，请稍后重试"));
        }
    }

    /**
     * 获取订单列表
     * GET /api/buyer/orders
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BuyerOrderListResponse>> getOrderList(
            Principal principal,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "20") Integer pageSize) {
        try {
            String buyerId = principal.getName();
            log.info("获取订单列表请求: buyerId={}, status={}, page={}, pageSize={}",
                    buyerId, status, page, pageSize);

            BuyerOrderListResponse response = buyerOrderService.getOrderList(buyerId, status, page, pageSize);
            return ResponseEntity.ok(ApiResponse.success("获取成功", response));
        } catch (Exception e) {
            log.error("获取订单列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "获取订单列表失败，请稍后重试"));
        }
    }

    /**
     * 获取订单详情
     * GET /api/buyer/orders/{orderId}
     */
    @GetMapping("/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BuyerOrderResponse>> getOrderDetail(
            Principal principal,
            @PathVariable String orderId) {
        try {
            String buyerId = principal.getName();
            log.info("获取订单详情请求: buyerId={}, orderId={}", buyerId, orderId);

            BuyerOrderResponse response = buyerOrderService.getOrderDetail(buyerId, orderId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", response));
        } catch (RuntimeException e) {
            log.error("获取订单详情失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("获取订单详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "获取订单详情失败，请稍后重试"));
        }
    }

    /**
     * 更新订单状态
     * PUT /api/buyer/orders/{orderId}/status
     */
    @PutMapping("/{orderId}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Object>> updateOrderStatus(
            Principal principal,
            @PathVariable String orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        try {
            String buyerId = principal.getName();
            log.info("更新订单状态请求: buyerId={}, orderId={}, status={}",
                    buyerId, orderId, request.getStatus());

            buyerOrderService.updateOrderStatus(buyerId, orderId, request);
            return ResponseEntity.ok(ApiResponse.success("订单状态已更新", null));
        } catch (RuntimeException e) {
            log.error("更新订单状态失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("更新订单状态异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "更新订单状态失败，请稍后重试"));
        }
    }

    /**
     * 取消订单
     * POST /api/buyer/orders/{orderId}/cancel
     */
    @PostMapping("/{orderId}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Object>> cancelOrder(
            Principal principal,
            @PathVariable String orderId) {
        try {
            String buyerId = principal.getName();
            log.info("取消订单请求: buyerId={}, orderId={}", buyerId, orderId);

            buyerOrderService.cancelOrder(buyerId, orderId);
            return ResponseEntity.ok(ApiResponse.success("订单已取消", null));
        } catch (RuntimeException e) {
            log.error("取消订单失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("取消订单异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "取消订单失败，请稍后重试"));
        }
    }

    /**
     * 申请退款
     * POST /api/buyer/orders/{orderId}/refund
     */
    @PostMapping("/{orderId}/refund")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Object>> applyRefund(
            Principal principal,
            @PathVariable String orderId,
            @RequestParam(required = false) String reason) {
        try {
            String buyerId = principal.getName();
            log.info("申请退款请求: buyerId={}, orderId={}, reason={}", buyerId, orderId, reason);

            buyerOrderService.applyRefund(buyerId, orderId, reason);
            return ResponseEntity.ok(ApiResponse.success("退款申请已提交", null));
        } catch (RuntimeException e) {
            log.error("申请退款失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("申请退款异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "申请退款失败，请稍后重试"));
        }
    }

    /**
     * 获取退款详情
     * GET /api/buyer/orders/{orderId}/refund
     */
    @GetMapping("/{orderId}/refund")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Object>> getRefundDetail(
            Principal principal,
            @PathVariable String orderId) {
        try {
            String buyerId = principal.getName();
            log.info("获取退款详情请求: buyerId={}, orderId={}", buyerId, orderId);

            Object refundDetail = buyerOrderService.getRefundDetail(buyerId, orderId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", refundDetail));
        } catch (RuntimeException e) {
            log.error("获取退款详情失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("获取退款详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "获取退款详情失败，请稍后重试"));
        }
    }

    /**
     * 健康检查
     * GET /api/buyer/orders/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Object>> health() {
        return ResponseEntity.ok(ApiResponse.success("OK", null));
    }
}
