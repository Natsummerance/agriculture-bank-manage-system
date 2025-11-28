package com.agriverse.admin.repository;

import com.agriverse.admin.entity.AdminContentAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminContentAuditRepository extends JpaRepository<AdminContentAudit, String>, JpaSpecificationExecutor<AdminContentAudit> {
    Optional<AdminContentAudit> findByContentId(String contentId);
    
    List<AdminContentAudit> findByAuditStatus(AdminContentAudit.AuditStatus auditStatus);
    
    List<AdminContentAudit> findByContentType(AdminContentAudit.ContentType contentType);
    
    @Query("SELECT a FROM AdminContentAudit a WHERE a.auditStatus = 'PENDING' ORDER BY a.submittedAt ASC")
    List<AdminContentAudit> findPendingAudits();
}



