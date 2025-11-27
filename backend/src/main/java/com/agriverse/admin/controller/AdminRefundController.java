package com.agriverse.admin.controller;

import com.agriverse.admin.dto.RefundArbitrationRequest;
import com.agriverse.admin.dto.RefundDisputeResponse;
import com.agriverse.admin.service.AdminRefundService;
import com.agriverse.dto.ApiResponse;
import com.agriverse.entity.Order;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/admin/refunds")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "退款仲裁", description = "退款纠纷处理和仲裁接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class AdminRefundController {
    private final AdminRefundService refundService;

    /**
     * 获取退款纠纷列表
     */
    @Operation(summary = "获取退款纠纷列表", description = "获取所有需要仲裁的退款纠纷")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/disputes")
    public ResponseEntity<ApiResponse<List<RefundDisputeResponse>>> getRefundDisputes() {
        try {
            List<RefundDisputeResponse> disputes = refundService.getRefundDisputes();
            return ResponseEntity.ok(ApiResponse.success("获取成功", disputes));
        } catch (Exception e) {
            log.error("获取退款纠纷列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }

    /**
     * 获取退款详情
     */
    @Operation(summary = "获取退款详情", description = "根据订单ID获取退款详细信息")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "订单不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<RefundDisputeResponse>> getRefundDetail(@PathVariable String orderId) {
        try {
            RefundDisputeResponse detail = refundService.getRefundDetail(orderId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", detail));
        } catch (Exception e) {
            log.error("获取退款详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }

    /**
     * 处理退款仲裁
     */
    @Operation(summary = "处理退款仲裁", description = "管理员对退款纠纷进行仲裁处理")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "处理成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "请求参数错误"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "订单不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/arbitration")
    public ResponseEntity<ApiResponse<Order>> processRefundArbitration(
            @Valid @RequestBody RefundArbitrationRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            Order order = refundService.processRefundArbitration(request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("处理成功", order));
        } catch (Exception e) {
            log.error("处理退款仲裁异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "处理失败，请稍后重试"));
        }
    }
}



