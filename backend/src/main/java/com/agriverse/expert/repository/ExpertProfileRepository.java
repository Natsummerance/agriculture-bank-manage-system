package com.agriverse.expert.repository;

import com.agriverse.expert.entity.ExpertProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpertProfileRepository extends JpaRepository<ExpertProfile, String> {
    Optional<ExpertProfile> findByExpertId(String expertId);
    
    List<ExpertProfile> findByStatus(ExpertProfile.ExpertStatus status);
    
    @Query(value = "SELECT * FROM expert_profiles WHERE status = 'APPROVED' " +
           "ORDER BY rating DESC, total_consultations DESC LIMIT :limit", nativeQuery = true)
    List<ExpertProfile> findTopExperts(@Param("limit") int limit);
}

