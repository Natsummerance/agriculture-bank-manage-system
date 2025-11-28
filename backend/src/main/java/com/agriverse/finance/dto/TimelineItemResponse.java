package com.agriverse.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 时间线项响应DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimelineItemResponse {
    private String id;
    private String actor; // FARMER, BANK, ADMIN
    private String actorId;
    private String action;
    private String note;
    private LocalDateTime createdAt;
}



