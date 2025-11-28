package com.agriverse.bank.service;

import com.agriverse.bank.dto.LoanProductRequest;
import com.agriverse.bank.entity.LoanProduct;
import com.agriverse.bank.repository.LoanProductRepository;
import com.agriverse.exception.BusinessException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * 贷款产品服务
 */
@Service
@RequiredArgsConstructor
public class LoanProductService {
    private final LoanProductRepository productRepository;
    
    /**
     * 创建贷款产品
     */
    @Transactional
    public LoanProduct createProduct(LoanProductRequest request, String createdBy) {
        // 验证金额范围
        if (request.getMinAmount().compareTo(request.getMaxAmount()) > 0) {
            throw new BusinessException("最小金额不能大于最大金额");
        }
        
        LoanProduct product = LoanProduct.builder()
            .name(request.getName())
            .rate(request.getRate())
            .minAmount(request.getMinAmount())
            .maxAmount(request.getMaxAmount())
            .termMonths(request.getTermMonths())
            .description(request.getDescription())
            .status(LoanProduct.ProductStatus.ACTIVE)
            .createdBy(createdBy)
            .build();
        
        return productRepository.save(product);
    }
    
    /**
     * 更新贷款产品
     */
    @Transactional
    public LoanProduct updateProduct(String id, LoanProductRequest request) {
        LoanProduct product = productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("产品不存在"));
        
        // 验证金额范围
        if (request.getMinAmount().compareTo(request.getMaxAmount()) > 0) {
            throw new BusinessException("最小金额不能大于最大金额");
        }
        
        product.setName(request.getName());
        product.setRate(request.getRate());
        product.setMinAmount(request.getMinAmount());
        product.setMaxAmount(request.getMaxAmount());
        product.setTermMonths(request.getTermMonths());
        product.setDescription(request.getDescription());
        
        return productRepository.save(product);
    }
    
    /**
     * 删除贷款产品（软删除，设置为停用）
     */
    @Transactional
    public void deleteProduct(String id) {
        LoanProduct product = productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("产品不存在"));
        product.setStatus(LoanProduct.ProductStatus.INACTIVE);
        productRepository.save(product);
    }
    
    /**
     * 获取所有启用的产品
     */
    public List<LoanProduct> getActiveProducts() {
        return productRepository.findByStatus(LoanProduct.ProductStatus.ACTIVE);
    }
    
    /**
     * 根据金额和期限匹配产品
     */
    public List<LoanProduct> findMatchingProducts(BigDecimal amount, Integer termMonths) {
        return productRepository.findMatchingProducts(amount, termMonths);
    }
    
    /**
     * 获取产品详情
     */
    public LoanProduct getProductById(String id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("产品不存在"));
    }
}

