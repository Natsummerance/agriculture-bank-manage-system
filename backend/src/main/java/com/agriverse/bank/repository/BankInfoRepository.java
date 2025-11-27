package com.agriverse.bank.repository;

import com.agriverse.bank.entity.BankInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 银行信息Repository
 */
@Repository
public interface BankInfoRepository extends JpaRepository<BankInfo, String> {
    Optional<BankInfo> findByBankCode(String bankCode);
    
    List<BankInfo> findByStatus(BankInfo.BankStatus status);
}



