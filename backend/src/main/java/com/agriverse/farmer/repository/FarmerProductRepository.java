package com.agriverse.farmer.repository;

import com.agriverse.entity.FarmerProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 农户商品Repository
 */
@Repository
public interface FarmerProductRepository extends JpaRepository<FarmerProduct, String> {

        /**
         * 根据农户ID和搜索关键词查询商品列表
         */
        @Query("SELECT p FROM FarmerProduct p WHERE " +
                        "p.farmerId = :farmerId AND " +
                        "(:search IS NULL OR :search = '' OR p.name LIKE %:search% OR p.origin LIKE %:search%)")
        Page<FarmerProduct> findByFarmerIdAndSearch(
                        @Param("farmerId") String farmerId,
                        @Param("search") String search,
                        Pageable pageable);

        /**
         * 根据农户ID、搜索关键词和状态查询商品列表
         */
        @Query("SELECT p FROM FarmerProduct p WHERE " +
                        "p.farmerId = :farmerId AND " +
                        "(:search IS NULL OR :search = '' OR p.name LIKE %:search% OR p.origin LIKE %:search%) AND " +
                        "p.status = :status")
        Page<FarmerProduct> findByFarmerIdAndSearchAndStatus(
                        @Param("farmerId") String farmerId,
                        @Param("search") String search,
                        @Param("status") FarmerProduct.ProductStatus status,
                        Pageable pageable);

        /**
         * 根据农户ID查询所有商品
         */
        List<FarmerProduct> findByFarmerId(String farmerId);

        /**
         * 根据农户ID和商品ID查询商品
         */
        Optional<FarmerProduct> findByIdAndFarmerId(String id, String farmerId);

        /**
         * 根据农户ID统计商品数量
         */
        long countByFarmerId(String farmerId);

        /**
         * 根据状态和搜索关键词查询商品列表（买家市场用）
         */
        @Query("SELECT p FROM FarmerProduct p WHERE " +
                        "p.status = :status AND " +
                        "(:search IS NULL OR :search = '' OR p.name LIKE %:search% OR p.origin LIKE %:search%)")
        Page<FarmerProduct> findByStatusAndSearch(
                        @Param("status") FarmerProduct.ProductStatus status,
                        @Param("search") String search,
                        Pageable pageable);

        /**
         * 根据状态、类别和搜索关键词查询商品列表（买家市场用）
         */
        @Query("SELECT p FROM FarmerProduct p WHERE " +
                        "p.status = :status AND " +
                        "(:category IS NULL OR :category = '' OR p.category = :category) AND " +
                        "(:search IS NULL OR :search = '' OR p.name LIKE %:search% OR p.origin LIKE %:search%)")
        Page<FarmerProduct> findByStatusAndCategoryAndSearch(
                        @Param("status") FarmerProduct.ProductStatus status,
                        @Param("category") String category,
                        @Param("search") String search,
                        Pageable pageable);
}
