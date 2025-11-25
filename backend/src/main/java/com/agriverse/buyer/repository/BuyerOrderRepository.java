package com.agriverse.buyer.repository;

import com.agriverse.entity.BuyerOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 买家订单Repository
 */
@Repository
public interface BuyerOrderRepository extends JpaRepository<BuyerOrder, String> {

    /**
     * 根据买家ID查询订单列表
     */
    Page<BuyerOrder> findByBuyerIdOrderByCreatedAtDesc(String buyerId, Pageable pageable);

    /**
     * 根据买家ID和状态查询订单列表
     */
    Page<BuyerOrder> findByBuyerIdAndStatusOrderByCreatedAtDesc(
            String buyerId, BuyerOrder.OrderStatus status, Pageable pageable);

    /**
     * 根据买家ID和日期范围查询订单列表
     */
    @Query("SELECT o FROM BuyerOrder o WHERE " +
            "o.buyerId = :buyerId AND " +
            "o.createdAt >= :startDate AND o.createdAt <= :endDate " +
            "ORDER BY o.createdAt DESC")
    Page<BuyerOrder> findByBuyerIdAndDateRange(
            @Param("buyerId") String buyerId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    /**
     * 根据买家ID和订单ID查询订单（确保订单属于该买家）
     */
    Optional<BuyerOrder> findByIdAndBuyerId(String id, String buyerId);

    /**
     * 根据买家ID查询所有订单
     */
    List<BuyerOrder> findByBuyerIdOrderByCreatedAtDesc(String buyerId);
}
