package com.agriverse.finance.repository;

import com.agriverse.finance.entity.FinancingApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 融资申请Repository
 */
@Repository
public interface FinancingApplicationRepository extends JpaRepository<FinancingApplication, String> {
    /**
     * 根据农户ID查询申请列表
     */
    List<FinancingApplication> findByFarmerId(String farmerId);
    
    /**
     * 根据农户ID和状态查询申请列表
     */
    List<FinancingApplication> findByFarmerIdAndStatus(String farmerId, 
                                                       FinancingApplication.FinancingStatus status);
    
    /**
     * 根据状态查询申请列表
     */
    List<FinancingApplication> findByStatus(FinancingApplication.FinancingStatus status);
    
    /**
     * 根据多个状态查询申请列表
     */
    @Query("SELECT f FROM FinancingApplication f WHERE f.status IN :statuses " +
           "ORDER BY f.createdAt DESC")
    List<FinancingApplication> findByStatusIn(@Param("statuses") List<FinancingApplication.FinancingStatus> statuses);
    
    /**
     * 统计农户的活跃贷款数量
     */
    @Query("SELECT COUNT(f) FROM FinancingApplication f WHERE f.farmerId = :farmerId " +
           "AND f.status = 'REPAYING'")
    Long countActiveLoans(@Param("farmerId") String farmerId);
    
    /**
     * 根据状态统计申请数量
     */
    @Query("SELECT COUNT(f) FROM FinancingApplication f WHERE f.status = :status")
    Long countByStatus(@Param("status") FinancingApplication.FinancingStatus status);
}

