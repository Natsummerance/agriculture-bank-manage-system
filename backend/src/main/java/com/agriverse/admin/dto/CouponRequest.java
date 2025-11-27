package com.agriverse.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponRequest {
    @NotBlank(message = "优惠券名称不能为空")
    private String name;
    
    @NotBlank(message = "优惠券类型不能为空")
    private String couponType; // DISCOUNT, CASH
    
    @NotNull(message = "优惠值不能为空")
    private BigDecimal value;
    
    private BigDecimal minAmount;
    
    @NotNull(message = "发放总数不能为空")
    private Integer totalCount;
    
    @NotNull(message = "有效期开始时间不能为空")
    private LocalDateTime validFrom;
    
    @NotNull(message = "有效期结束时间不能为空")
    private LocalDateTime validTo;
    
    private String targetRole; // ALL, BUYER, FARMER
    private Boolean enabled;
    private String description;
}



