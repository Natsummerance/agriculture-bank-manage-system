package com.agriverse.bank.service;

import com.agriverse.bank.dto.BankAccountRequest;
import com.agriverse.bank.dto.BankInfoRequest;
import com.agriverse.bank.entity.BankAccount;
import com.agriverse.bank.entity.BankInfo;
import com.agriverse.bank.repository.BankAccountRepository;
import com.agriverse.bank.repository.BankInfoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * 银行信息服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BankInfoService {
    private final BankInfoRepository bankInfoRepository;
    private final BankAccountRepository accountRepository;
    
    /**
     * 创建或更新银行信息
     */
    public BankInfo saveBankInfo(BankInfoRequest request, String bankId) {
        BankInfo bankInfo = bankInfoRepository.findById(bankId)
            .orElse(BankInfo.builder()
                .id(bankId)
                .build());
        
        bankInfo.setBankCode(request.getBankCode());
        bankInfo.setBankName(request.getBankName());
        if (request.getBankType() != null && !request.getBankType().isEmpty()) {
            bankInfo.setBankType(BankInfo.BankType.valueOf(request.getBankType()));
        }
        bankInfo.setContactPerson(request.getContactPerson());
        bankInfo.setContactPhone(request.getContactPhone());
        bankInfo.setContactEmail(request.getContactEmail());
        bankInfo.setAddress(request.getAddress());
        bankInfo.setDescription(request.getDescription());
        bankInfo.setLogoUrl(request.getLogoUrl());
        
        return bankInfoRepository.save(bankInfo);
    }
    
    /**
     * 获取银行信息
     */
    public BankInfo getBankInfo(String bankId) {
        return bankInfoRepository.findById(bankId)
            .orElseThrow(() -> new EntityNotFoundException("银行信息不存在"));
    }
    
    /**
     * 创建银行账户
     */
    public BankAccount createAccount(BankAccountRequest request) {
        BankAccount account = BankAccount.builder()
            .id(UUID.randomUUID().toString())
            .bankId(request.getBankId())
            .accountNumber(request.getAccountNumber())
            .accountName(request.getAccountName())
            .accountType(BankAccount.AccountType.valueOf(request.getAccountType()))
            .currency(request.getCurrency() != null ? request.getCurrency() : "CNY")
            .remark(request.getRemark())
            .build();
        
        return accountRepository.save(account);
    }
    
    /**
     * 获取银行账户列表
     */
    public List<BankAccount> getBankAccounts(String bankId) {
        return accountRepository.findByBankId(bankId);
    }
    
    /**
     * 更新账户余额
     */
    public BankAccount updateAccountBalance(String accountId, BigDecimal balance) {
        BankAccount account = accountRepository.findById(accountId)
            .orElseThrow(() -> new EntityNotFoundException("账户不存在"));
        
        account.setBalance(balance);
        return accountRepository.save(account);
    }
}



