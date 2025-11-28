package com.agriverse.admin.controller;

import com.agriverse.admin.dto.CouponRequest;
import com.agriverse.admin.entity.AdminCoupon;
import com.agriverse.admin.service.AdminCouponService;
import com.agriverse.dto.ApiResponse;
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

@Slf4j
@RestController
@RequestMapping("/admin/coupons")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "优惠券管理", description = "优惠券创建、编辑、发放管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminCouponController {
    private final AdminCouponService couponService;
    
    /**
     * 创建优惠券
     */
    @Operation(summary = "创建优惠券", description = "创建新的优惠券")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "创建成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<AdminCoupon>> createCoupon(
            @Valid @RequestBody CouponRequest request,
            Principal principal) {
        try {
            String createdBy = principal.getName();
            AdminCoupon coupon = couponService.createCoupon(request, createdBy);
            return ResponseEntity.ok(ApiResponse.success("创建成功", coupon));
        } catch (Exception e) {
            log.error("创建优惠券异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "创建失败，请稍后重试"));
        }
    }
    
    /**
     * 更新优惠券
     */
    @Operation(summary = "更新优惠券", description = "更新优惠券信息")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "更新成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PutMapping("/{couponId}")
    public ResponseEntity<ApiResponse<AdminCoupon>> updateCoupon(
            @PathVariable String couponId,
            @Valid @RequestBody CouponRequest request,
            Principal principal) {
        try {
            String updatedBy = principal.getName();
            AdminCoupon coupon = couponService.updateCoupon(couponId, request, updatedBy);
            return ResponseEntity.ok(ApiResponse.success("更新成功", coupon));
        } catch (Exception e) {
            log.error("更新优惠券异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 获取优惠券列表
     */
    @Operation(summary = "获取优惠券列表", description = "获取所有优惠券")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminCoupon>>> getCoupons(
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(required = false) String targetRole) {
        try {
            List<AdminCoupon> coupons = couponService.getCoupons(enabled, targetRole);
            return ResponseEntity.ok(ApiResponse.success("获取成功", coupons));
        } catch (Exception e) {
            log.error("获取优惠券列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}



