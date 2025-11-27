package com.agriverse.bank.repository;

import com.agriverse.bank.entity.LoanProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * 贷款产品Repository
 */
@Repository
public interface LoanProductRepository extends JpaRepository<LoanProduct, String> {
    /**
     * 根据状态查询产品
     */
    List<LoanProduct> findByStatus(LoanProduct.ProductStatus status);
    
    /**
     * 根据金额和期限匹配产品
     */
    @Query("SELECT p FROM LoanProduct p WHERE p.status = 'ACTIVE' " +
           "AND :amount >= p.minAmount AND :amount <= p.maxAmount " +
           "AND :termMonths = p.termMonths")
    List<LoanProduct> findMatchingProducts(@Param("amount") BigDecimal amount, 
                                          @Param("termMonths") Integer termMonths);
}

