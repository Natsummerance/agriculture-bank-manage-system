package com.agriverse.farmer.service;

import com.agriverse.dto.*;
import com.agriverse.entity.FarmerProduct;
import com.agriverse.farmer.repository.FarmerProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 农户商品服务
 */
@Slf4j
@Service
@Transactional
public class FarmerProductService {

        @Autowired
        private FarmerProductRepository farmerProductRepository;

        /**
         * 获取商品列表（支持搜索和状态筛选）
         */
        public ProductListResponse getProductList(String farmerId, ProductListRequest request) {
                log.info("获取商品列表: farmerId={}, search={}, status={}, page={}, pageSize={}",
                                farmerId, request.getSearch(), request.getStatus(), request.getPage(),
                                request.getPageSize());

                // 构建分页参数
                Pageable pageable = PageRequest.of(
                                request.getPage() - 1,
                                request.getPageSize(),
                                Sort.by(Sort.Direction.DESC, "createdAt"));

                // 查询商品
                Page<FarmerProduct> productPage;

                // 处理状态参数：将"on"/"off"转换为枚举值
                if (request.getStatus() != null && !request.getStatus().isEmpty()
                                && !"all".equals(request.getStatus())) {
                        // 有状态筛选
                        FarmerProduct.ProductStatus productStatus = "on".equalsIgnoreCase(request.getStatus())
                                        ? FarmerProduct.ProductStatus.ON
                                        : FarmerProduct.ProductStatus.OFF;
                        productPage = farmerProductRepository.findByFarmerIdAndSearchAndStatus(
                                        farmerId,
                                        request.getSearch(),
                                        productStatus,
                                        pageable);
                } else {
                        // 无状态筛选，查询全部
                        productPage = farmerProductRepository.findByFarmerIdAndSearch(
                                        farmerId,
                                        request.getSearch(),
                                        pageable);
                }

                // 转换为DTO
                List<ProductListResponse.ProductItem> productItems = productPage.getContent().stream()
                                .map(this::convertToProductItem)
                                .collect(Collectors.toList());

                return ProductListResponse.builder()
                                .products(productItems)
                                .total(productPage.getTotalElements())
                                .page(request.getPage())
                                .pageSize(request.getPageSize())
                                .build();
        }

        /**
         * 切换商品上下架状态
         */
        public void toggleProductStatus(String farmerId, ToggleStatusRequest request) {
                log.info("切换商品状态: farmerId={}, productId={}, status={}",
                                farmerId, request.getProductId(), request.getStatus());

                // 查询商品（确保是当前农户的商品）
                FarmerProduct product = farmerProductRepository.findByIdAndFarmerId(
                                request.getProductId(), farmerId).orElseThrow(() -> new RuntimeException("商品不存在或无权操作"));

                // 更新状态
                FarmerProduct.ProductStatus newStatus = "on".equals(request.getStatus())
                                ? FarmerProduct.ProductStatus.ON
                                : FarmerProduct.ProductStatus.OFF;
                product.setStatus(newStatus);
                product.setUpdatedAt(LocalDateTime.now());

                farmerProductRepository.save(product);
                log.info("商品状态已更新: productId={}, newStatus={}", request.getProductId(), newStatus);
        }

        /**
         * 获取商品数据看板
         */
        public ProductDashboardResponse getProductDashboard(String farmerId) {
                log.info("获取商品数据看板: farmerId={}", farmerId);

                // 查询该农户的所有商品
                List<FarmerProduct> products = farmerProductRepository.findByFarmerId(farmerId);

                // 计算统计数据
                long totalView = products.stream()
                                .mapToLong(p -> p.getViewCount() != null ? p.getViewCount() : 0L)
                                .sum();

                long totalFavorite = products.stream()
                                .mapToLong(p -> p.getFavoriteCount() != null ? p.getFavoriteCount() : 0L)
                                .sum();

                long totalShare = products.stream()
                                .mapToLong(p -> p.getShareCount() != null ? p.getShareCount() : 0L)
                                .sum();

                long avgView = products.isEmpty() ? 0 : totalView / products.size();

                // 获取热门商品TOP5（按浏览量排序）
                List<ProductDashboardResponse.TopProduct> topProducts = products.stream()
                                .sorted((a, b) -> {
                                        int viewA = a.getViewCount() != null ? a.getViewCount() : 0;
                                        int viewB = b.getViewCount() != null ? b.getViewCount() : 0;
                                        return Integer.compare(viewB, viewA);
                                })
                                .limit(5)
                                .map(p -> ProductDashboardResponse.TopProduct.builder()
                                                .id(p.getId())
                                                .name(p.getName())
                                                .viewCount(p.getViewCount() != null ? p.getViewCount() : 0)
                                                .favoriteCount(p.getFavoriteCount() != null ? p.getFavoriteCount() : 0)
                                                .shareCount(p.getShareCount() != null ? p.getShareCount() : 0)
                                                .build())
                                .collect(Collectors.toList());

                // 生成近7日浏览趋势数据（模拟数据，实际应从统计数据表获取）
                List<ProductDashboardResponse.TrendData> trendData = generateTrendData(products);

                return ProductDashboardResponse.builder()
                                .totalView(totalView)
                                .totalFavorite(totalFavorite)
                                .totalShare(totalShare)
                                .avgView(avgView)
                                .topProducts(topProducts)
                                .trendData(trendData)
                                .build();
        }

        /**
         * 将实体转换为DTO
         */
        private ProductListResponse.ProductItem convertToProductItem(FarmerProduct product) {
                return ProductListResponse.ProductItem.builder()
                                .id(product.getId())
                                .name(product.getName())
                                .category(product.getCategory())
                                .price(product.getPrice())
                                .stock(product.getStock())
                                .origin(product.getOrigin())
                                .description(product.getDescription())
                                .status(product.getStatus().name().toLowerCase()) // "ON" -> "on"
                                .viewCount(product.getViewCount() != null ? product.getViewCount() : 0)
                                .favoriteCount(product.getFavoriteCount() != null ? product.getFavoriteCount() : 0)
                                .shareCount(product.getShareCount() != null ? product.getShareCount() : 0)
                                .createdAt(product.getCreatedAt())
                                .updatedAt(product.getUpdatedAt())
                                .build();
        }

        /**
         * 生成近7日浏览趋势数据（模拟）
         * 实际项目中应该从统计数据表或日志中获取真实数据
         */
        private List<ProductDashboardResponse.TrendData> generateTrendData(List<FarmerProduct> products) {
                List<ProductDashboardResponse.TrendData> trendData = new ArrayList<>();

                // 计算总浏览量作为基础值
                long totalView = products.stream()
                                .mapToLong(p -> p.getViewCount() != null ? p.getViewCount() : 0L)
                                .sum();

                // 生成近7天的数据（模拟递增趋势）
                for (int i = 6; i >= 0; i--) {
                        String name;
                        if (i == 0) {
                                name = "今天";
                        } else if (i == 1) {
                                name = "昨天";
                        } else {
                                name = "近" + i + "天前";
                        }

                        // 模拟数据：基于总浏览量生成趋势（实际应从统计数据获取）
                        int value = 0;
                        if (!products.isEmpty()) {
                                value = (int) (totalView / products.size() * (0.3 + (7 - i) * 0.1)
                                                + Math.random() * 10);
                        }

                        trendData.add(ProductDashboardResponse.TrendData.builder()
                                        .name(name)
                                        .value(value)
                                        .build());
                }

                return trendData;
        }
}
