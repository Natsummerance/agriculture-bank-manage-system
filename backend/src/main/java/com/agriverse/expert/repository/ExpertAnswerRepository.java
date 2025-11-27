package com.agriverse.expert.repository;

import com.agriverse.expert.entity.ExpertAnswer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpertAnswerRepository extends JpaRepository<ExpertAnswer, String> {
    List<ExpertAnswer> findByQuestionId(String questionId);
    
    List<ExpertAnswer> findByExpertId(String expertId);
    
    Page<ExpertAnswer> findByExpertId(String expertId, Pageable pageable);
    
    List<ExpertAnswer> findByQuestionIdOrderByCreatedAtAsc(String questionId);
    
    Optional<ExpertAnswer> findByQuestionIdAndIsAdopted(String questionId, Boolean isAdopted);
}

