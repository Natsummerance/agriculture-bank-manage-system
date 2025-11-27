package com.agriverse.bank.repository;

import com.agriverse.bank.entity.ReconciliationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 对账记录Repository
 */
@Repository
public interface ReconciliationRecordRepository extends JpaRepository<ReconciliationRecord, String> {
    /**
     * 根据融资申请ID和对账日期查询
     */
    Optional<ReconciliationRecord> findByFinancingIdAndReconciliationDate(String financingId, LocalDate date);
    
    /**
     * 根据对账日期查询
     */
    List<ReconciliationRecord> findByReconciliationDate(LocalDate date);
    
    /**
     * 根据状态查询
     */
    List<ReconciliationRecord> findByStatus(ReconciliationRecord.ReconciliationStatus status);
    
    /**
     * 根据日期范围查询
     */
    List<ReconciliationRecord> findByReconciliationDateBetween(LocalDate startDate, LocalDate endDate);
}



