package com.agriverse.finance.service;

import com.agriverse.bank.dto.ContractGenerateRequest;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.entity.User;
import com.agriverse.exception.BusinessException;
import com.agriverse.finance.entity.Contract;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.repository.ContractRepository;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import com.agriverse.notification.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * 合同服务
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ContractService {
    private final ContractRepository contractRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;
    
    /**
     * 生成合同
     */
    public Contract generateContract(ContractGenerateRequest request) {
        FinancingApplication application = applicationRepository.findById(request.getFinancingId())
            .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
        
        if (application.getStatus() != FinancingApplication.FinancingStatus.APPROVED) {
            throw new BusinessException("只有已审批通过的申请才能生成合同");
        }
        
        User farmer = userRepository.findById(application.getFarmerId())
            .orElseThrow(() -> new EntityNotFoundException("农户不存在"));
        
        Contract contract = Contract.builder()
            .financingId(application.getId())
            .farmerId(application.getFarmerId())
            .farmerName(farmer.getName() != null ? farmer.getName() : farmer.getPhone())
            .farmerIdCard(null) // 需要从用户扩展信息中获取
            .bankName(request.getBankName() != null ? request.getBankName() : "中国农业银行")
            .amount(application.getAmount())
            .interestRate(application.getInterestRate() != null ? 
                application.getInterestRate() : BigDecimal.valueOf(5.5))
            .termMonths(application.getTermMonths())
            .purpose(application.getPurpose())
            .startDate(LocalDate.now())
            .endDate(LocalDate.now().plusMonths(application.getTermMonths()))
            .repaymentMethod("等额本息")
            .status(Contract.ContractStatus.DRAFT)
            .build();
        
        // 生成合同内容（JSON格式）
        try {
            Map<String, Object> contractContent = new HashMap<>();
            contractContent.put("parties", Map.of(
                "borrower", contract.getFarmerName(),
                "lender", contract.getBankName()
            ));
            contractContent.put("amount", application.getAmount());
            contractContent.put("interestRate", contract.getInterestRate());
            contractContent.put("termMonths", application.getTermMonths());
            contractContent.put("purpose", application.getPurpose());
            
            contract.setContractContent(objectMapper.writeValueAsString(contractContent));
        } catch (Exception e) {
            throw new BusinessException("生成合同内容失败");
        }
        
        Contract saved = contractRepository.save(contract);
        
        // 更新申请状态
        application.setContractId(saved.getId());
        applicationRepository.save(application);
        
        // 发送合同生成通知
        notificationService.sendContractSignReminder(application.getFarmerId(), saved.getId());
        
        return saved;
    }
    
    /**
     * 农户签署合同
     */
    public Contract signContractByFarmer(String contractId, String signatureUrl) {
        Contract contract = contractRepository.findById(contractId)
            .orElseThrow(() -> new EntityNotFoundException("合同不存在"));
        
        contract.setFarmerSignatureUrl(signatureUrl);
        contract.setFarmerSignedAt(java.time.LocalDateTime.now());
        
        // 如果双方都已签署，更新状态
        if (contract.getBankSignedAt() != null) {
            contract.setStatus(Contract.ContractStatus.SIGNED);
            
            // 更新融资申请状态
            FinancingApplication application = applicationRepository.findById(contract.getFinancingId())
                .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
            application.setStatus(FinancingApplication.FinancingStatus.SIGNED);
            application.setSignedAt(java.time.LocalDateTime.now());
            applicationRepository.save(application);
        }
        
        return contractRepository.save(contract);
    }
    
    /**
     * 银行签署合同
     */
    public Contract signContractByBank(String contractId, String signatureUrl) {
        Contract contract = contractRepository.findById(contractId)
            .orElseThrow(() -> new EntityNotFoundException("合同不存在"));
        
        contract.setBankSignatureUrl(signatureUrl);
        contract.setBankSignedAt(java.time.LocalDateTime.now());
        
        // 如果双方都已签署，更新状态
        if (contract.getFarmerSignedAt() != null) {
            contract.setStatus(Contract.ContractStatus.SIGNED);
            
            // 更新融资申请状态
            FinancingApplication application = applicationRepository.findById(contract.getFinancingId())
                .orElseThrow(() -> new EntityNotFoundException("融资申请不存在"));
            application.setStatus(FinancingApplication.FinancingStatus.SIGNED);
            application.setSignedAt(java.time.LocalDateTime.now());
            applicationRepository.save(application);
        }
        
        return contractRepository.save(contract);
    }
    
    /**
     * 获取合同详情
     */
    public Contract getContractById(String id) {
        return contractRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("合同不存在"));
    }
    
    /**
     * 根据融资申请ID获取合同
     */
    public Contract getContractByFinancingId(String financingId) {
        return contractRepository.findByFinancingId(financingId)
            .orElseThrow(() -> new EntityNotFoundException("合同不存在"));
    }
}

