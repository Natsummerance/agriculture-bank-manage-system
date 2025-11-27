package com.agriverse.finance.repository;

import com.agriverse.finance.entity.RepaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * 还款记录Repository
 */
@Repository
public interface RepaymentRecordRepository extends JpaRepository<RepaymentRecord, String> {
    /**
     * 根据融资申请ID查询还款记录，按还款时间降序
     */
    List<RepaymentRecord> findByFinancingIdOrderByPaidAtDesc(String financingId);
    
    /**
     * 计算已还款总金额
     */
    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM RepaymentRecord r WHERE r.financingId = :financingId")
    BigDecimal getTotalRepaidAmount(@Param("financingId") String financingId);
}

