package com.agriverse.admin.dto;

import com.agriverse.finance.entity.FinancingApplication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinanceMonitorResponse {
    private Integer totalApplications;    // 融资申请总数
    private Integer pendingApprovals;     // 待审批数量
    private Integer approvedCount;        // 已批准数量
    private BigDecimal totalAmount;        // 融资总额
    private BigDecimal repayingAmount;    // 还款中金额
    private List<FinancingApplication> applications; // 融资申请列表
}



