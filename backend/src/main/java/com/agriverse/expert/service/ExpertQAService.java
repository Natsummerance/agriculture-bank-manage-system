package com.agriverse.expert.service;

import com.agriverse.expert.dto.AnswerRequest;
import com.agriverse.expert.dto.QuestionSearchRequest;
import com.agriverse.expert.entity.*;
import com.agriverse.expert.repository.*;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.entity.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpertQAService {
    private final ExpertQuestionRepository questionRepository;
    private final ExpertAnswerRepository answerRepository;
    private final ExpertProfileRepository profileRepository;
    private final ExpertIncomeRecordRepository incomeRecordRepository;
    private final UserRepository userRepository;
    
    /**
     * 搜索问题
     */
    public Page<ExpertQuestion> searchQuestions(QuestionSearchRequest request) {
        Specification<ExpertQuestion> spec = Specification.where(null);
        
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            String keyword = "%" + request.getKeyword() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                cb.like(root.get("title"), keyword),
                cb.like(root.get("content"), keyword)
            ));
        }
        
        if (request.getStatus() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), 
                    ExpertQuestion.QuestionStatus.valueOf(request.getStatus())));
        }
        
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(),
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return questionRepository.findAll(spec, pageable);
    }
    
    /**
     * 回答问题
     */
    public ExpertAnswer answerQuestion(AnswerRequest request, String expertId) {
        ExpertQuestion question = questionRepository.findById(request.getQuestionId())
            .orElseThrow(() -> new EntityNotFoundException("问题不存在"));
        
        if (question.getStatus() != ExpertQuestion.QuestionStatus.PENDING) {
            throw new IllegalStateException("问题已被回答或已采纳");
        }
        
        User expert = userRepository.findById(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家不存在"));
        
        ExpertAnswer answer = ExpertAnswer.builder()
            .id(UUID.randomUUID().toString())
            .questionId(request.getQuestionId())
            .expertId(expertId)
            .expertName(expert.getName())
            .content(request.getContent())
            .isAdopted(false)
            .reward(question.getBounty())
            .build();
        
        ExpertAnswer saved = answerRepository.save(answer);
        
        // 更新问题状态
        question.setStatus(ExpertQuestion.QuestionStatus.ANSWERED);
        questionRepository.save(question);
        
        // 创建收入记录
        ExpertIncomeRecord incomeRecord = ExpertIncomeRecord.builder()
            .id(UUID.randomUUID().toString())
            .expertId(expertId)
            .incomeType(ExpertIncomeRecord.IncomeType.QA)
            .sourceId(request.getQuestionId())
            .amount(question.getBounty())
            .description("回答问题奖励")
            .status(ExpertIncomeRecord.IncomeStatus.SETTLED)
            .settledAt(LocalDateTime.now())
            .build();
        incomeRecordRepository.save(incomeRecord);
        
        // 更新专家收入
        updateExpertIncome(expertId, question.getBounty());
        
        return saved;
    }
    
    /**
     * 采纳答案（农户操作，专家查看）
     */
    public void adoptAnswer(String questionId, String answerId) {
        ExpertQuestion question = questionRepository.findById(questionId)
            .orElseThrow(() -> new EntityNotFoundException("问题不存在"));
        
        ExpertAnswer answer = answerRepository.findById(answerId)
            .orElseThrow(() -> new EntityNotFoundException("答案不存在"));
        
        if (!answer.getQuestionId().equals(questionId)) {
            throw new IllegalArgumentException("答案不属于该问题");
        }
        
        // 更新答案状态
        answer.setIsAdopted(true);
        answerRepository.save(answer);
        
        // 更新问题状态
        question.setStatus(ExpertQuestion.QuestionStatus.ADOPTED);
        question.setAdoptedAnswerId(answerId);
        questionRepository.save(question);
        
        // 如果采纳有额外奖励，创建收入记录
        BigDecimal adoptionReward = BigDecimal.valueOf(20); // 假设采纳奖励20元
        ExpertIncomeRecord incomeRecord = ExpertIncomeRecord.builder()
            .id(UUID.randomUUID().toString())
            .expertId(answer.getExpertId())
            .incomeType(ExpertIncomeRecord.IncomeType.ADOPTION)
            .sourceId(questionId)
            .amount(adoptionReward)
            .description("答案被采纳奖励")
            .status(ExpertIncomeRecord.IncomeStatus.SETTLED)
            .settledAt(LocalDateTime.now())
            .build();
        incomeRecordRepository.save(incomeRecord);
        
        // 更新专家收入
        updateExpertIncome(answer.getExpertId(), adoptionReward);
    }
    
    /**
     * 获取问题详情
     */
    public ExpertQuestion getQuestionDetail(String questionId) {
        return questionRepository.findById(questionId)
            .orElseThrow(() -> new EntityNotFoundException("问题不存在"));
    }
    
    /**
     * 获取我的回答列表
     */
    public Page<ExpertAnswer> getMyAnswers(String expertId, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size, 
            Sort.by(Sort.Direction.DESC, "createdAt"));
        return answerRepository.findByExpertId(expertId, pageable);
    }
    
    /**
     * 更新专家收入
     */
    private void updateExpertIncome(String expertId, BigDecimal amount) {
        ExpertProfile profile = profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
        
        profile.setTotalIncome(profile.getTotalIncome().add(amount));
        profile.setWithdrawableBalance(profile.getWithdrawableBalance().add(amount));
        profileRepository.save(profile);
    }
}

