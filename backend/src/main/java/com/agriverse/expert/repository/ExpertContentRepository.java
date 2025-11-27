package com.agriverse.expert.repository;

import com.agriverse.expert.entity.ExpertContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpertContentRepository extends JpaRepository<ExpertContent, String>, JpaSpecificationExecutor<ExpertContent> {
    List<ExpertContent> findByExpertId(String expertId);
    
    List<ExpertContent> findByExpertIdAndContentType(String expertId, ExpertContent.ContentType contentType);
    
    List<ExpertContent> findByExpertIdAndStatus(String expertId, ExpertContent.ContentStatus status);
    
    @Query(value = "SELECT * FROM expert_contents WHERE status = 'PUBLISHED' " +
           "AND audit_status = 'APPROVED' " +
           "ORDER BY published_at DESC LIMIT :limit", nativeQuery = true)
    List<ExpertContent> findPublishedContents(@Param("limit") int limit);
}

