package com.agriverse.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundDisputeResponse {
    private String orderId;
    private String buyerId;
    private String buyerName;
    private String farmerId;
    private String farmerName;
    private BigDecimal totalAmount;
    private String refundStatus;
    private String refundReason;
    private LocalDateTime createdAt;
    private List<RefundHistoryItem> refundHistory;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RefundHistoryItem {
        private String action;
        private String actor;
        private String note;
        private LocalDateTime createdAt;
    }
}



