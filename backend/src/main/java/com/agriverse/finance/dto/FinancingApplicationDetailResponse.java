package com.agriverse.finance.dto;

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
 * 融资申请详情响应DTO（包含关联数据）
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancingApplicationDetailResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String farmerId;
    private String farmerName;
    private String productId;
    private String productName;
    private BigDecimal amount;
    private Integer termMonths;
    private String purpose;
    private String status;
    private BigDecimal interestRate;
    private Integer creditScore;
    private String reviewerId;
    private String reviewerName;
    
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
    private RepaymentSummaryResponse repaymentSummary;
}

