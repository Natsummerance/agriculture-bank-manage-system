package com.agriverse.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperationLogSearchRequest {
    private String actionType;    // 操作类型
    private String targetType;    // 目标类型
    private String operatorId;    // 操作人ID
    private String result;        // 操作结果
    private LocalDateTime startTime; // 开始时间
    private LocalDateTime endTime;   // 结束时间
    private Integer page = 0;
    private Integer size = 20;
}



