package com.agriverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 买家商品详情响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerProductDetailResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String category;
    private Double price;
    private Integer stock;
    private String origin;
    private String description;
    private String farmerId;
    private String farmerName;
    private String farmerPhone;
    private Integer viewCount;
    private Integer favoriteCount;
    private Integer shareCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
