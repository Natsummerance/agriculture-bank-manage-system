package com.agriverse.expert.service;

import com.agriverse.expert.dto.IncomeStatisticsResponse;
import com.agriverse.expert.dto.WithdrawalRequest;
import com.agriverse.expert.entity.*;
import com.agriverse.expert.repository.*;
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
public class ExpertIncomeService {
    private final ExpertProfileRepository profileRepository;
    private final ExpertIncomeRecordRepository incomeRecordRepository;
    private final ExpertWithdrawalRepository withdrawalRepository;
    
    /**
     * 获取收入统计
     */
    public IncomeStatisticsResponse getIncomeStatistics(String expertId) {
        ExpertProfile profile = profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
        
        BigDecimal qaIncome = incomeRecordRepository
            .getTotalIncomeByType(expertId, ExpertIncomeRecord.IncomeType.QA);
        
        BigDecimal appointmentIncome = incomeRecordRepository
            .getTotalIncomeByType(expertId, ExpertIncomeRecord.IncomeType.APPOINTMENT);
        
        BigDecimal adoptionIncome = incomeRecordRepository
            .getTotalIncomeByType(expertId, ExpertIncomeRecord.IncomeType.ADOPTION);
        
        BigDecimal totalIncome = profile.getTotalIncome();
        BigDecimal withdrawTotal = withdrawalRepository.getTotalWithdrawnAmount(expertId);
        BigDecimal withdrawableBalance = profile.getWithdrawableBalance();
        
        return IncomeStatisticsResponse.builder()
            .qaIncome(qaIncome != null ? qaIncome : BigDecimal.ZERO)
            .appointmentIncome(appointmentIncome != null ? appointmentIncome : BigDecimal.ZERO)
            .adoptionIncome(adoptionIncome != null ? adoptionIncome : BigDecimal.ZERO)
            .totalIncome(totalIncome)
            .withdrawTotal(withdrawTotal != null ? withdrawTotal : BigDecimal.ZERO)
            .withdrawableBalance(withdrawableBalance)
            .build();
    }
    
    /**
     * 获取收入明细
     */
    public Page<ExpertIncomeRecord> getIncomeRecords(String expertId, String incomeType,
                                                    LocalDateTime startTime, LocalDateTime endTime,
                                                    Integer page, Integer size) {
        Specification<ExpertIncomeRecord> spec = Specification.where(
            (root, query, cb) -> cb.equal(root.get("expertId"), expertId));
        
        if (incomeType != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("incomeType"), 
                    ExpertIncomeRecord.IncomeType.valueOf(incomeType)));
        }
        
        if (startTime != null && endTime != null) {
            spec = spec.and((root, query, cb) -> 
                cb.between(root.get("createdAt"), startTime, endTime));
        }
        
        Pageable pageable = PageRequest.of(page, size, 
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return incomeRecordRepository.findAll(spec, pageable);
    }
    
    /**
     * 申请提现
     */
    public ExpertWithdrawal applyWithdrawal(WithdrawalRequest request, String expertId) {
        ExpertProfile profile = profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
        
        if (profile.getWithdrawableBalance().compareTo(request.getAmount()) < 0) {
            throw new IllegalArgumentException("可提现余额不足");
        }
        
        ExpertWithdrawal withdrawal = ExpertWithdrawal.builder()
            .id(UUID.randomUUID().toString())
            .expertId(expertId)
            .amount(request.getAmount())
            .bankAccount(request.getBankAccount())
            .accountName(request.getAccountName())
            .status(ExpertWithdrawal.WithdrawalStatus.PENDING)
            .build();
        
        ExpertWithdrawal saved = withdrawalRepository.save(withdrawal);
        
        // 更新可提现余额
        profile.setWithdrawableBalance(profile.getWithdrawableBalance().subtract(request.getAmount()));
        profileRepository.save(profile);
        
        return saved;
    }
    
    /**
     * 获取提现记录
     */
    public Page<ExpertWithdrawal> getWithdrawals(String expertId, String status,
                                                Integer page, Integer size) {
        Specification<ExpertWithdrawal> spec = Specification.where(
            (root, query, cb) -> cb.equal(root.get("expertId"), expertId));
        
        if (status != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), 
                    ExpertWithdrawal.WithdrawalStatus.valueOf(status)));
        }
        
        Pageable pageable = PageRequest.of(page, size, 
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return withdrawalRepository.findAll(spec, pageable);
    }
    
    /**
     * 获取提现详情
     */
    public ExpertWithdrawal getWithdrawalDetail(String withdrawalId, String expertId) {
        ExpertWithdrawal withdrawal = withdrawalRepository.findById(withdrawalId)
            .orElseThrow(() -> new EntityNotFoundException("提现记录不存在"));
        
        if (!withdrawal.getExpertId().equals(expertId)) {
            throw new IllegalArgumentException("无权查看此提现记录");
        }
        
        return withdrawal;
    }
}

