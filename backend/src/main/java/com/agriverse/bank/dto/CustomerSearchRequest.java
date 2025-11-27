package com.agriverse.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 客户搜索请求
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerSearchRequest {
    private String keyword;      // 搜索关键词（姓名、电话）
    private String status;        // 状态筛选
    private String location;      // 地区筛选
    private Integer minLoans;     // 最小贷款次数
    private Integer maxLoans;     // 最大贷款次数
    private Integer page = 0;
    private Integer size = 20;
}



