package com.agriverse.bank.repository;

import com.agriverse.bank.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 银行账户Repository
 */
@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, String> {
    List<BankAccount> findByBankId(String bankId);
    
    Optional<BankAccount> findByAccountNumber(String accountNumber);
    
    List<BankAccount> findByBankIdAndStatus(String bankId, BankAccount.AccountStatus status);
}



