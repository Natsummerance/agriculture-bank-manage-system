package com.agriverse.bank.repository;

import com.agriverse.bank.entity.ApplicationDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 申请资料Repository
 */
@Repository
public interface ApplicationDocumentRepository extends JpaRepository<ApplicationDocument, String> {
    List<ApplicationDocument> findByFinancingId(String financingId);
    
    List<ApplicationDocument> findByFinancingIdAndDocumentType(String financingId, 
                                                                ApplicationDocument.DocumentType documentType);
    
    List<ApplicationDocument> findByFinancingIdAndVerifyStatus(String financingId,
                                                                ApplicationDocument.VerifyStatus verifyStatus);
    
    @Query("SELECT COALESCE(SUM(d.fileSize), 0) FROM ApplicationDocument d WHERE d.financingId = :financingId")
    Long getTotalFileSize(@Param("financingId") String financingId);
}



