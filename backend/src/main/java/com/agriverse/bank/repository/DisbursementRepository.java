package com.agriverse.bank.repository;

import com.agriverse.bank.entity.Disbursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 放款记录Repository
 */
@Repository
public interface DisbursementRepository extends JpaRepository<Disbursement, String> {
    /**
     * 根据融资申请ID查询放款记录
     */
    Optional<Disbursement> findByFinancingId(String financingId);
    
    /**
     * 根据状态查询放款记录列表
     */
    List<Disbursement> findByStatus(Disbursement.DisbursementStatus status);
    
    /**
     * 计算指定时间范围内的放款总金额
     */
    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Disbursement d WHERE d.status = 'SUCCESS' " +
           "AND d.disbursedAt >= :startDate AND d.disbursedAt <= :endDate")
    BigDecimal getTotalDisbursedAmount(@Param("startDate") LocalDateTime startDate,
                                      @Param("endDate") LocalDateTime endDate);
    
    /**
     * 根据状态和时间范围查询放款记录
     */
    @Query("SELECT d FROM Disbursement d WHERE d.status = :status " +
           "AND d.disbursedAt >= :startDate AND d.disbursedAt <= :endDate")
    List<Disbursement> findByStatusAndDisbursedAtBetween(
            @Param("status") Disbursement.DisbursementStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}

