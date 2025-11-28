package com.agriverse.expert.repository;

import com.agriverse.expert.entity.ExpertIncomeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExpertIncomeRecordRepository extends JpaRepository<ExpertIncomeRecord, String>, JpaSpecificationExecutor<ExpertIncomeRecord> {
    List<ExpertIncomeRecord> findByExpertId(String expertId);
    
    List<ExpertIncomeRecord> findByExpertIdAndIncomeType(String expertId, ExpertIncomeRecord.IncomeType incomeType);
    
    List<ExpertIncomeRecord> findByExpertIdAndStatus(String expertId, ExpertIncomeRecord.IncomeStatus status);
    
    @Query("SELECT SUM(r.amount) FROM ExpertIncomeRecord r WHERE r.expertId = :expertId " +
           "AND r.incomeType = :incomeType AND r.status = 'SETTLED'")
    BigDecimal getTotalIncomeByType(@Param("expertId") String expertId,
                                    @Param("incomeType") ExpertIncomeRecord.IncomeType incomeType);
    
    @Query("SELECT r FROM ExpertIncomeRecord r WHERE r.expertId = :expertId " +
           "AND r.createdAt >= :startDate AND r.createdAt <= :endDate")
    List<ExpertIncomeRecord> findByExpertIdAndDateRange(
        @Param("expertId") String expertId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate);
}

