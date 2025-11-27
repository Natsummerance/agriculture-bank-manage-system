package com.agriverse.finance.repository;

import com.agriverse.finance.entity.JointLoanGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 智能拼单组Repository
 */
@Repository
public interface JointLoanGroupRepository extends JpaRepository<JointLoanGroup, String> {
    /**
     * 根据状态查询拼单组列表
     */
    List<JointLoanGroup> findByStatus(JointLoanGroup.GroupStatus status);
    
    /**
     * 根据创建人ID查询拼单组列表
     */
    List<JointLoanGroup> findByCreatedBy(String createdBy);
}

