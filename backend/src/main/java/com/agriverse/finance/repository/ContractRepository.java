package com.agriverse.finance.repository;

import com.agriverse.finance.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 合同Repository
 */
@Repository
public interface ContractRepository extends JpaRepository<Contract, String> {
    /**
     * 根据融资申请ID查询合同
     */
    Optional<Contract> findByFinancingId(String financingId);
    
    /**
     * 根据合同编号查询合同
     */
    Optional<Contract> findByContractNo(String contractNo);
    
    /**
     * 根据状态查询合同列表
     */
    List<Contract> findByStatus(Contract.ContractStatus status);
}

