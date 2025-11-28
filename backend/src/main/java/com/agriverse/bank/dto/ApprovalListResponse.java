package com.agriverse.bank.dto;

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
 * 审批列表响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalListResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<ApprovalItem> approvals;
    private Long total;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApprovalItem implements Serializable {
        private static final long serialVersionUID = 1L;
        
        private String id;
        private String farmerId;
        private String farmerName;
        private BigDecimal amount;
        private Integer termMonths;
        private String purpose;
        private String status;
        private Integer creditScore;
        
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;
        
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime reviewedAt;
    }
}

