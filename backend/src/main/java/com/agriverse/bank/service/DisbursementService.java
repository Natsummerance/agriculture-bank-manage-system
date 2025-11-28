package com.agriverse.bank.service;

import com.agriverse.bank.dto.DisbursementRequest;
import com.agriverse.bank.entity.Disbursement;
import com.agriverse.bank.repository.DisbursementRepository;
import com.agriverse.exception.BusinessException;
import com.agriverse.finance.entity.Contract;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.repository.ContractRepository;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 放款服务
 */
@Service
@RequiredArgsConstructor
@Transactional
public class DisbursementService {
    private final DisbursementRepository disbursementRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final ContractRepository contractRepository;
    
    /**
     * 放款
     */
    public Disbursement disburse(DisbursementRequest request, String operatorId) {
        FinancingApplication application = applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        if (application.getStatus() != FinancingApplication.FinancingStatus.SIGNED) {
            throw new BusinessException("只有已签约的申请才能放款");
        }
        
        Contract contract = contractRepository.findById(request.getContractId())
            .orElseThrow(() -> new EntityNotFoundException("合同不存在"));
        
        if (contract.getStatus() != Contract.ContractStatus.SIGNED) {
            throw new BusinessException("合同未签署");
        }
        
        Disbursement disbursement = Disbursement.builder()
            .financingId(request.getFinancingId())
            .contractId(request.getContractId())
            .amount(request.getAmount())
            .bankAccount(request.getBankAccount())
            .farmerAccount(request.getFarmerAccount())
            .status(Disbursement.DisbursementStatus.PENDING)
            .disbursedBy(operatorId)
            .remark(request.getRemark())
            .build();
        
        // TODO: 调用支付接口进行实际放款
        // 这里模拟放款成功
        disbursement.setStatus(Disbursement.DisbursementStatus.SUCCESS);
        disbursement.setDisbursedAt(java.time.LocalDateTime.now());
        disbursement.setTransactionId("TXN" + System.currentTimeMillis());
        
        Disbursement saved = disbursementRepository.save(disbursement);
        
        // 更新融资申请状态
        application.setStatus(FinancingApplication.FinancingStatus.DISBURSED);
        application.setDisbursedAt(java.time.LocalDateTime.now());
        application.setDisbursedAmount(request.getAmount());
        applicationRepository.save(application);
        
        return saved;
    }
    
    /**
     * 获取放款列表
     */
    public List<Disbursement> getDisbursements(String status) {
        if (status != null && !status.isEmpty()) {
            try {
                Disbursement.DisbursementStatus statusEnum = 
                    Disbursement.DisbursementStatus.valueOf(status);
                return disbursementRepository.findByStatus(statusEnum);
            } catch (IllegalArgumentException e) {
                return disbursementRepository.findAll();
            }
        }
        return disbursementRepository.findAll();
    }
    
    /**
     * 获取放款详情
     */
    public Disbursement getDisbursementById(String id) {
        return disbursementRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("放款记录不存在"));
    }
}



