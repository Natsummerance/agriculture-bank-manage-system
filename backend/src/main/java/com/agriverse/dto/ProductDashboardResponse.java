package com.agriverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * 商品数据看板响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDashboardResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 总浏览量
     */
    private Long totalView;

    /**
     * 总收藏数
     */
    private Long totalFavorite;

    /**
     * 总分享数
     */
    private Long totalShare;

    /**
     * 平均浏览量
     */
    private Long avgView;

    /**
     * 热门商品TOP5
     */
    private List<TopProduct> topProducts;

    /**
     * 近7日浏览趋势数据
     */
    private List<TrendData> trendData;

    /**
     * 热门商品DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProduct implements Serializable {
        private static final long serialVersionUID = 1L;

        private String id;
        private String name;
        private Integer viewCount;
        private Integer favoriteCount;
        private Integer shareCount;
    }

    /**
     * 趋势数据DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendData implements Serializable {
        private static final long serialVersionUID = 1L;

        private String name; // 日期名称，如"近5天前"、"今天"
        private Integer value; // 浏览量
    }
}
