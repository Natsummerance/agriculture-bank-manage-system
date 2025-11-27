package com.agriverse.admin.service;

import com.agriverse.admin.dto.CouponRequest;
import com.agriverse.admin.entity.AdminCoupon;
import com.agriverse.admin.entity.AdminOperationLog;
import com.agriverse.admin.repository.AdminCouponRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminCouponService {
    private final AdminCouponRepository couponRepository;
    private final AdminOperationLogService operationLogService;
    
    /**
     * 创建优惠券
     */
    public AdminCoupon createCoupon(CouponRequest request, String createdBy) {
        AdminCoupon coupon = AdminCoupon.builder()
            .id(UUID.randomUUID().toString())
            .name(request.getName())
            .couponType(AdminCoupon.CouponType.valueOf(request.getCouponType()))
            .value(request.getValue())
            .minAmount(request.getMinAmount() != null ? request.getMinAmount() : BigDecimal.ZERO)
            .totalCount(request.getTotalCount())
            .usedCount(0)
            .validFrom(request.getValidFrom())
            .validTo(request.getValidTo())
            .targetRole(request.getTargetRole() != null && !request.getTargetRole().isEmpty() ? 
                AdminCoupon.TargetRole.valueOf(request.getTargetRole()) : 
                AdminCoupon.TargetRole.ALL)
            .enabled(request.getEnabled() != null ? request.getEnabled() : true)
            .description(request.getDescription())
            .createdBy(createdBy)
            .build();
        
        AdminCoupon saved = couponRepository.save(coupon);
        
        // 记录操作日志
        operationLogService.logOperation(
            createdBy,
            AdminOperationLog.ActionType.COUPON_MANAGE,
            "创建优惠券: " + request.getName(),
            AdminOperationLog.TargetType.COUPON,
            saved.getId(),
            request.getName()
        );
        
        return saved;
    }
    
    /**
     * 更新优惠券
     */
    public AdminCoupon updateCoupon(String couponId, CouponRequest request, String updatedBy) {
        AdminCoupon coupon = couponRepository.findById(couponId)
            .orElseThrow(() -> new EntityNotFoundException("优惠券不存在"));
        
        coupon.setName(request.getName());
        if (request.getCouponType() != null && !request.getCouponType().isEmpty()) {
            coupon.setCouponType(AdminCoupon.CouponType.valueOf(request.getCouponType()));
        }
        if (request.getValue() != null) {
            coupon.setValue(request.getValue());
        }
        if (request.getMinAmount() != null) {
            coupon.setMinAmount(request.getMinAmount());
        }
        if (request.getTotalCount() != null) {
            coupon.setTotalCount(request.getTotalCount());
        }
        if (request.getValidFrom() != null) {
            coupon.setValidFrom(request.getValidFrom());
        }
        if (request.getValidTo() != null) {
            coupon.setValidTo(request.getValidTo());
        }
        if (request.getTargetRole() != null && !request.getTargetRole().isEmpty()) {
            coupon.setTargetRole(AdminCoupon.TargetRole.valueOf(request.getTargetRole()));
        }
        if (request.getEnabled() != null) {
            coupon.setEnabled(request.getEnabled());
        }
        if (request.getDescription() != null) {
            coupon.setDescription(request.getDescription());
        }
        
        AdminCoupon saved = couponRepository.save(coupon);
        
        // 记录操作日志
        operationLogService.logOperation(
            updatedBy,
            AdminOperationLog.ActionType.COUPON_MANAGE,
            "更新优惠券: " + request.getName(),
            AdminOperationLog.TargetType.COUPON,
            couponId,
            request.getName()
        );
        
        return saved;
    }
    
    /**
     * 获取优惠券列表
     */
    public List<AdminCoupon> getCoupons(Boolean enabled, String targetRole) {
        if (enabled != null && targetRole != null && !targetRole.isEmpty()) {
            return couponRepository.findByTargetRoleAndEnabled(
                AdminCoupon.TargetRole.valueOf(targetRole), enabled);
        } else if (enabled != null) {
            return couponRepository.findByEnabled(enabled);
        }
        return couponRepository.findAll();
    }
    
    /**
     * 获取有效优惠券
     */
    public List<AdminCoupon> getValidCoupons() {
        return couponRepository.findValidCoupons(java.time.LocalDateTime.now());
    }
}



