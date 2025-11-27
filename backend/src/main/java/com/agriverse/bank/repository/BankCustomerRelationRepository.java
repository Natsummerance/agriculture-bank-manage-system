package com.agriverse.bank.repository;

import com.agriverse.bank.entity.BankCustomerRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 银行客户关系Repository
 */
@Repository
public interface BankCustomerRelationRepository extends JpaRepository<BankCustomerRelation, String>, 
        JpaSpecificationExecutor<BankCustomerRelation> {
    List<BankCustomerRelation> findByBankId(String bankId);
    
    Optional<BankCustomerRelation> findByBankIdAndCustomerId(String bankId, String customerId);
    
    @Query("SELECT r FROM BankCustomerRelation r WHERE r.bankId = :bankId " +
           "AND (r.customerName LIKE %:keyword% OR r.customerPhone LIKE %:keyword%)")
    List<BankCustomerRelation> searchByKeyword(@Param("bankId") String bankId, 
                                                @Param("keyword") String keyword);
    
    List<BankCustomerRelation> findByBankIdAndStatus(String bankId, 
                                                     BankCustomerRelation.RelationStatus status);
    
    @Query("SELECT COUNT(r) FROM BankCustomerRelation r WHERE r.bankId = :bankId " +
           "AND r.status = 'ACTIVE'")
    Long countActiveCustomers(@Param("bankId") String bankId);
}

