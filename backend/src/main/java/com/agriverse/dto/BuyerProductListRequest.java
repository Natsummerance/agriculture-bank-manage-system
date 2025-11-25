package com.agriverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 买家商品列表查询请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerProductListRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 搜索关键词（商品名称或产地）
     */
    private String search;

    /**
     * 类别筛选
     */
    private String category;

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
