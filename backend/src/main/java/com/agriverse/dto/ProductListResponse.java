package com.agriverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 商品列表响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductListResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 商品列表
     */
    private List<ProductItem> products;

    /**
     * 总数量
     */
    private Long total;

    /**
     * 当前页码
     */
    private Integer page;

    /**
     * 每页数量
     */
    private Integer pageSize;

    /**
     * 商品项DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductItem implements Serializable {
        private static final long serialVersionUID = 1L;

        private String id;
        private String name;
        private String category;
        private Double price;
        private Integer stock;
        private String origin;
        private String description;
        private String status; // "on" 或 "off"
        private Integer viewCount;
        private Integer favoriteCount;
        private Integer shareCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
