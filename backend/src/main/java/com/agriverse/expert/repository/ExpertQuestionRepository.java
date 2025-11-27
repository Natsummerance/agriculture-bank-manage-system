package com.agriverse.expert.repository;

import com.agriverse.expert.entity.ExpertQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpertQuestionRepository extends JpaRepository<ExpertQuestion, String>, JpaSpecificationExecutor<ExpertQuestion> {
    List<ExpertQuestion> findByFarmerId(String farmerId);
    
    List<ExpertQuestion> findByStatus(ExpertQuestion.QuestionStatus status);
    
    @Query("SELECT q FROM ExpertQuestion q WHERE q.status = 'PENDING' " +
           "ORDER BY q.createdAt ASC")
    List<ExpertQuestion> findPendingQuestions();
    
    @Query("SELECT q FROM ExpertQuestion q WHERE q.status = 'PENDING' " +
           "AND (q.title LIKE CONCAT('%', :keyword, '%') OR q.content LIKE CONCAT('%', :keyword, '%'))")
    List<ExpertQuestion> searchPendingQuestions(@Param("keyword") String keyword);
}

