package com.agriverse.expert.repository;

import com.agriverse.expert.entity.ExpertWithdrawal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpertWithdrawalRepository extends JpaRepository<ExpertWithdrawal, String>, JpaSpecificationExecutor<ExpertWithdrawal> {
    List<ExpertWithdrawal> findByExpertId(String expertId);
    
    List<ExpertWithdrawal> findByExpertIdAndStatus(String expertId, ExpertWithdrawal.WithdrawalStatus status);
    
    @Query("SELECT SUM(w.amount) FROM ExpertWithdrawal w WHERE w.expertId = :expertId " +
           "AND w.status = 'SUCCESS'")
    BigDecimal getTotalWithdrawnAmount(@Param("expertId") String expertId);
}

