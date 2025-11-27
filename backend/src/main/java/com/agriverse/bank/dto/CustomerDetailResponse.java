package com.agriverse.bank.dto;

import com.agriverse.bank.entity.CustomerContactRecord;
import com.agriverse.bank.entity.CreditScore;
import com.agriverse.finance.entity.FinancingApplication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 客户详情响应
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDetailResponse {
    private String id;
    private String customerId;
    private String customerName;
    private String customerPhone;
    private String customerLocation;
    private String customerType;
    private String status;
    private Integer totalLoans;
    private BigDecimal totalAmount;
    private Integer currentLoans;
    private BigDecimal currentAmount;
    private List<String> tags;
    private String notes;
    private LocalDateTime lastContactAt;
    private List<FinancingApplication> loanHistory; // 贷款历史
    private List<CreditScore> creditHistory;        // 信用评分历史
    private List<CustomerContactRecord> contactRecords; // 联系记录
}



