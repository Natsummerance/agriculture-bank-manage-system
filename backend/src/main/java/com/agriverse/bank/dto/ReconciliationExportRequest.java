package com.agriverse.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 对账导出请求DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReconciliationExportRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private String format; // EXCEL, CSV, T1
}



