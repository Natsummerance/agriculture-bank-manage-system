package com.agriverse.expert.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionSearchRequest {
    private String keyword;      // 搜索关键词
    private String status;        // 状态筛选
    private Integer page = 0;
    private Integer size = 20;
}



