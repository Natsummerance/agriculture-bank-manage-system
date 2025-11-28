package com.agriverse.admin.repository;

import com.agriverse.admin.entity.AdminOperationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminOperationLogRepository extends JpaRepository<AdminOperationLog, String>, JpaSpecificationExecutor<AdminOperationLog> {
    List<AdminOperationLog> findByOperatorId(String operatorId);
    
    List<AdminOperationLog> findByActionType(AdminOperationLog.ActionType actionType);
    
    List<AdminOperationLog> findByTargetTypeAndTargetId(AdminOperationLog.TargetType targetType, String targetId);
    
    @Query("SELECT l FROM AdminOperationLog l WHERE l.createdAt >= :startTime AND l.createdAt <= :endTime")
    List<AdminOperationLog> findByDateRange(@Param("startTime") LocalDateTime startTime,
                                            @Param("endTime") LocalDateTime endTime);
}



