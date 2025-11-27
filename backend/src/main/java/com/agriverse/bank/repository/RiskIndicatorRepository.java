package com.agriverse.bank.repository;

import com.agriverse.bank.entity.RiskIndicator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 风险指标Repository
 */
@Repository
public interface RiskIndicatorRepository extends JpaRepository<RiskIndicator, String> {
    Optional<RiskIndicator> findByIndicatorDate(LocalDate date);
    
    @Query("SELECT r FROM RiskIndicator r WHERE r.indicatorDate >= :startDate " +
           "AND r.indicatorDate <= :endDate ORDER BY r.indicatorDate ASC")
    List<RiskIndicator> findByDateRange(@Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);
    
    @Query(value = "SELECT * FROM risk_indicators ORDER BY indicator_date DESC LIMIT 1", nativeQuery = true)
    Optional<RiskIndicator> findLatest();
}



