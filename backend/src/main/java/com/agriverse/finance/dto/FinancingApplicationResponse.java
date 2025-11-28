package com.agriverse.finance.dto;

import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.entity.FinancingTimeline;
import com.agriverse.finance.entity.RepaymentSchedule;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 融资申请响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancingApplicationResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String farmerId;
    private String productId;
    private BigDecimal amount;
    private Integer termMonths;
    private String purpose;
    private String status;
    private BigDecimal interestRate;
    private Integer creditScore;
    private String reviewerId;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reviewedAt;
    
    private String reviewComment;
    private String contractId;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime signedAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime disbursedAt;
    
    private BigDecimal disbursedAmount;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // 关联数据
    private List<FinancingTimeline> timeline;
    private List<RepaymentSchedule> repaymentSchedules;
    
    public static FinancingApplicationResponse fromEntity(FinancingApplication application) {
        return FinancingApplicationResponse.builder()
            .id(application.getId())
            .farmerId(application.getFarmerId())
            .productId(application.getProductId())
            .amount(application.getAmount())
            .termMonths(application.getTermMonths())
            .purpose(application.getPurpose())
            .status(application.getStatus() != null ? application.getStatus().name() : null)
            .interestRate(application.getInterestRate())
            .creditScore(application.getCreditScore())
            .reviewerId(application.getReviewerId())
            .reviewedAt(application.getReviewedAt())
            .reviewComment(application.getReviewComment())
            .contractId(application.getContractId())
            .signedAt(application.getSignedAt())
            .disbursedAt(application.getDisbursedAt())
            .disbursedAmount(application.getDisbursedAmount())
            .createdAt(application.getCreatedAt())
            .updatedAt(application.getUpdatedAt())
            .build();
    }
}



