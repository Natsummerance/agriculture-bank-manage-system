package com.agriverse.admin.controller;

import com.agriverse.admin.dto.OrderSearchRequest;
import com.agriverse.admin.dto.OrderStatisticsResponse;
import com.agriverse.admin.service.AdminOrderService;
import com.agriverse.dto.ApiResponse;
import com.agriverse.entity.Order;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "订单监控", description = "订单统计、查询、详情管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class AdminOrderController {
    private final AdminOrderService orderService;

    /**
     * 获取订单统计
     */
    @Operation(summary = "获取订单统计", description = "获取订单总数、总额、今日订单、状态分布等统计数据")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<OrderStatisticsResponse>> getOrderStatistics() {
        try {
            OrderStatisticsResponse statistics = orderService.getOrderStatistics();
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取订单统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }

    /**
     * 搜索订单
     */
    @Operation(summary = "搜索订单", description = "根据条件搜索订单列表")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "搜索成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<Order>>> searchOrders(
            @Valid @RequestBody OrderSearchRequest request) {
        try {
            Page<Order> orders = orderService.searchOrders(request);
            return ResponseEntity.ok(ApiResponse.success("搜索成功", orders));
        } catch (Exception e) {
            log.error("搜索订单异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "搜索失败，请稍后重试"));
        }
    }

    /**
     * 获取订单详情
     */
    @Operation(summary = "获取订单详情", description = "根据订单ID获取订单详细信息")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "订单不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Order>> getOrderDetail(@PathVariable String orderId) {
        try {
            Order order = orderService.getOrderDetail(orderId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", order));
        } catch (Exception e) {
            log.error("获取订单详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}



