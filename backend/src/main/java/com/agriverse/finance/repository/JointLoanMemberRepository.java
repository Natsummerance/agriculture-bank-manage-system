package com.agriverse.finance.repository;

import com.agriverse.finance.entity.JointLoanMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * 拼单成员Repository
 */
@Repository
public interface JointLoanMemberRepository extends JpaRepository<JointLoanMember, String> {
    /**
     * 根据拼单组ID查询成员列表
     */
    List<JointLoanMember> findByGroupId(String groupId);
    
    /**
     * 根据农户ID查询成员列表
     */
    List<JointLoanMember> findByFarmerId(String farmerId);
    
    /**
     * 计算拼单组已确认的总金额
     */
    @Query("SELECT COALESCE(SUM(m.amount), 0) FROM JointLoanMember m WHERE m.groupId = :groupId " +
           "AND m.status = 'CONFIRMED'")
    BigDecimal getTotalConfirmedAmount(@Param("groupId") String groupId);
}

