package com.agriverse.buyer.service;

import com.agriverse.dto.BuyerProductDetailResponse;
import com.agriverse.dto.BuyerProductListRequest;
import com.agriverse.dto.BuyerProductListResponse;
import com.agriverse.entity.FarmerProduct;
import com.agriverse.entity.User;
import com.agriverse.farmer.repository.FarmerProductRepository;
import com.agriverse.auth.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 买家商品服务
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class BuyerProductService {

    @Autowired
    private FarmerProductRepository farmerProductRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * 获取商品列表（仅显示已上架商品）
     */
    public BuyerProductListResponse getProductList(BuyerProductListRequest request) {
        log.info("获取买家商品列表: search={}, category={}, page={}, pageSize={}",
                request.getSearch(), request.getCategory(), request.getPage(), request.getPageSize());

        // 构建分页参数
        Pageable pageable = PageRequest.of(
                request.getPage() - 1,
                request.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        // 查询已上架商品
        Page<FarmerProduct> productPage;

        if (request.getCategory() != null && !request.getCategory().isEmpty()) {
            // 有类别筛选
            productPage = farmerProductRepository.findByStatusAndCategoryAndSearch(
                    FarmerProduct.ProductStatus.ON,
                    request.getCategory(),
                    request.getSearch(),
                    pageable);
        } else {
            // 无类别筛选
            productPage = farmerProductRepository.findByStatusAndSearch(
                    FarmerProduct.ProductStatus.ON,
                    request.getSearch(),
                    pageable);
        }

        // 转换为DTO
        List<BuyerProductListResponse.ProductItem> productItems = productPage.getContent().stream()
                .map(this::convertToProductItem)
                .collect(Collectors.toList());

        return BuyerProductListResponse.builder()
                .products(productItems)
                .total(productPage.getTotalElements())
                .page(request.getPage())
                .pageSize(request.getPageSize())
                .build();
    }

    /**
     * 获取商品详情
     */
    public BuyerProductDetailResponse getProductDetail(String productId) {
        log.info("获取商品详情: productId={}", productId);

        FarmerProduct product = farmerProductRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("商品不存在"));

        // 检查商品是否已上架
        if (product.getStatus() != FarmerProduct.ProductStatus.ON) {
            throw new RuntimeException("商品未上架");
        }

        // 增加浏览量
        product.setViewCount((product.getViewCount() != null ? product.getViewCount() : 0) + 1);
        farmerProductRepository.save(product);

        // 获取农户信息
        User farmer = userRepository.findById(product.getFarmerId()).orElse(null);
        String farmerName = farmer != null && farmer.getName() != null ? farmer.getName() : "未知农户";
        String farmerPhone = farmer != null && farmer.getPhone() != null ? farmer.getPhone() : "";

        return BuyerProductDetailResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory())
                .price(product.getPrice())
                .stock(product.getStock())
                .origin(product.getOrigin())
                .description(product.getDescription())
                .farmerId(product.getFarmerId())
                .farmerName(farmerName)
                .farmerPhone(farmerPhone)
                .viewCount(product.getViewCount())
                .favoriteCount(product.getFavoriteCount())
                .shareCount(product.getShareCount())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    /**
     * 将实体转换为DTO
     */
    private BuyerProductListResponse.ProductItem convertToProductItem(FarmerProduct product) {
        // 获取农户信息
        User farmer = userRepository.findById(product.getFarmerId()).orElse(null);
        String farmerName = farmer != null && farmer.getName() != null ? farmer.getName() : "未知农户";

        return BuyerProductListResponse.ProductItem.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory())
                .price(product.getPrice())
                .stock(product.getStock())
                .origin(product.getOrigin())
                .description(product.getDescription())
                .farmerId(product.getFarmerId())
                .farmerName(farmerName)
                .viewCount(product.getViewCount() != null ? product.getViewCount() : 0)
                .favoriteCount(product.getFavoriteCount() != null ? product.getFavoriteCount() : 0)
                .shareCount(product.getShareCount() != null ? product.getShareCount() : 0)
                .createdAt(product.getCreatedAt())
                .build();
    }
}
