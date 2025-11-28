package com.agriverse.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatisticsResponse {
    private Long totalUsers;              // 总用户数
    private Long activeUsers;             // 活跃用户数
    private Long disabledUsers;           // 禁用用户数
    private Map<String, Long> usersByRole; // 按角色统计用户数
    private Long todayNewUsers;           // 今日新增用户数
    private Long verifiedUsers;           // 已验证邮箱用户数
}



