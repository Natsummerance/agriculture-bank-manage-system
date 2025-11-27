package com.agriverse.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchRequest {
    private String keyword;      // 搜索关键词（姓名、电话）
    private String role;          // 角色筛选
    private String status;        // 状态筛选
    private Integer page = 0;
    private Integer size = 20;
}



