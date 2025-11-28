package com.agriverse.buyer.controller;

import com.agriverse.dto.ApiResponse;
import com.agriverse.buyer.service.BuyerRefundService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

/**
 * 买家退款控制器
 */
@Slf4j
@RestController
@RequestMapping("/buyer/refunds")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BUYER')")
@Tag(name = "买家退款", description = "退款管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BuyerRefundController {
    private final BuyerRefundService refundService;
    
    /**
     * 获取退款列表
     */
    @Operation(summary = "获取退款列表", description = "获取当前买家的退款申请列表")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Object>>> getRefunds(
            @Parameter(description = "状态筛选") @RequestParam(required = false) String status,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        try {
            String buyerId = principal.getName();
            Page<Object> refunds = refundService.getRefunds(buyerId, status, page, size);
            return ResponseEntity.ok(ApiResponse.success("获取成功", refunds));
        } catch (Exception e) {
            log.error("获取退款列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}

