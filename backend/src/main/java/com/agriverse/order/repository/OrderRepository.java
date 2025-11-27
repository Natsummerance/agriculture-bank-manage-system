package com.agriverse.order.repository;

import com.agriverse.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {
    List<Order> findByBuyerId(String buyerId);
    
    List<Order> findByFarmerId(String farmerId);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    List<Order> findByRefundStatus(Order.RefundStatus refundStatus);
    
    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startTime AND o.createdAt <= :endTime")
    List<Order> findByCreatedAtBetween(@Param("startTime") LocalDateTime startTime, 
                                        @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(@Param("status") Order.OrderStatus status);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = :status")
    java.math.BigDecimal sumAmountByStatus(@Param("status") Order.OrderStatus status);
    
    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countByStatusGroup();
}

