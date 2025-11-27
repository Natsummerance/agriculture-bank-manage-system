package com.agriverse.expert.repository;

import com.agriverse.expert.entity.FarmerReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FarmerReviewRepository extends JpaRepository<FarmerReview, String> {
    List<FarmerReview> findByExpertId(String expertId);
    
    Page<FarmerReview> findByExpertId(String expertId, Pageable pageable);
    
    List<FarmerReview> findByExpertIdOrderByCreatedAtDesc(String expertId);
    
    @Query("SELECT AVG(r.rating) FROM FarmerReview r WHERE r.expertId = :expertId")
    BigDecimal getAverageRating(@Param("expertId") String expertId);
    
    @Query("SELECT COUNT(r) FROM FarmerReview r WHERE r.expertId = :expertId")
    Long getReviewCount(@Param("expertId") String expertId);
}



