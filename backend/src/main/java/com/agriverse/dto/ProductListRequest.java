package com.agriverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 商品列表查询请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductListRequest {
    /**
     * 搜索关键词（商品名称或产地）
     */
    private String search;

    /**
     * 状态筛选：all-全部, on-已上架, off-已下架
     */
    private String status;

    /**
     * 页码（从1开始）
     */
    @Builder.Default
    private Integer page = 1;

    /**
     * 每页数量
     */
    @Builder.Default
    private Integer pageSize = 20;
}
