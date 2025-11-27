package com.agriverse.bank.repository;

import com.agriverse.bank.entity.CreditScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 信用评分Repository
 */
@Repository
public interface CreditScoreRepository extends JpaRepository<CreditScore, String> {
    /**
     * 根据融资申请ID查询信用评分
     */
    Optional<CreditScore> findByFinancingId(String financingId);
    
    /**
     * 根据农户ID查询信用评分列表，按创建时间降序
     */
    List<CreditScore> findByFarmerIdOrderByCreatedAtDesc(String farmerId);
}

