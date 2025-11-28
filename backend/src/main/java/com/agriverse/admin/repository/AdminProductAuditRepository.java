package com.agriverse.admin.repository;

import com.agriverse.admin.entity.AdminProductAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminProductAuditRepository extends JpaRepository<AdminProductAudit, String>, JpaSpecificationExecutor<AdminProductAudit> {
    Optional<AdminProductAudit> findByProductId(String productId);
    
    List<AdminProductAudit> findByAuditStatus(AdminProductAudit.AuditStatus auditStatus);
    
    List<AdminProductAudit> findByFarmerId(String farmerId);
    
    @Query("SELECT a FROM AdminProductAudit a WHERE a.auditStatus = 'PENDING' ORDER BY a.submittedAt ASC")
    List<AdminProductAudit> findPendingAudits();
}



