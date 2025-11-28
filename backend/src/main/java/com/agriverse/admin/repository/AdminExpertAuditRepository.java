package com.agriverse.admin.repository;

import com.agriverse.admin.entity.AdminExpertAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminExpertAuditRepository extends JpaRepository<AdminExpertAudit, String>, JpaSpecificationExecutor<AdminExpertAudit> {
    Optional<AdminExpertAudit> findByExpertId(String expertId);
    
    List<AdminExpertAudit> findByAuditStatus(AdminExpertAudit.AuditStatus auditStatus);
    
    @Query("SELECT a FROM AdminExpertAudit a WHERE a.auditStatus = 'PENDING' ORDER BY a.submittedAt ASC")
    List<AdminExpertAudit> findPendingAudits();
}



