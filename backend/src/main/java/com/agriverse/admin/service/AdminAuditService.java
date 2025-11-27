package com.agriverse.admin.service;

import com.agriverse.admin.dto.ContentAuditRequest;
import com.agriverse.admin.dto.ExpertAuditRequest;
import com.agriverse.admin.dto.ProductAuditRequest;
import com.agriverse.admin.entity.AdminContentAudit;
import com.agriverse.admin.entity.AdminExpertAudit;
import com.agriverse.admin.entity.AdminOperationLog;
import com.agriverse.admin.entity.AdminProductAudit;
import com.agriverse.admin.repository.AdminContentAuditRepository;
import com.agriverse.admin.repository.AdminExpertAuditRepository;
import com.agriverse.admin.repository.AdminProductAuditRepository;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.entity.FarmerProduct;
import com.agriverse.entity.User;
import com.agriverse.farmer.repository.FarmerProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminAuditService {
    private final AdminProductAuditRepository productAuditRepository;
    private final AdminContentAuditRepository contentAuditRepository;
    private final AdminExpertAuditRepository expertAuditRepository;
    private final FarmerProductRepository farmerProductRepository;
    private final UserRepository userRepository;
    private final AdminOperationLogService operationLogService;
    
    /**
     * 审核商品
     */
    public AdminProductAudit auditProduct(ProductAuditRequest request, String operatorId) {
        AdminProductAudit audit = productAuditRepository.findByProductId(request.getProductId())
            .orElseThrow(() -> new EntityNotFoundException("审核记录不存在"));
        
        audit.setAuditStatus(AdminProductAudit.AuditStatus.valueOf(request.getAuditStatus()));
        audit.setAuditComment(request.getAuditComment());
        audit.setAuditedBy(operatorId);
        audit.setAuditedAt(LocalDateTime.now());
        
        AdminProductAudit saved = productAuditRepository.save(audit);
        
        // 更新商品状态
        FarmerProduct product = farmerProductRepository.findById(request.getProductId())
            .orElseThrow(() -> new EntityNotFoundException("商品不存在"));
        
        if ("APPROVED".equals(request.getAuditStatus())) {
            product.setStatus(FarmerProduct.ProductStatus.ON); // 上架
        } else if ("REJECTED".equals(request.getAuditStatus())) {
            product.setStatus(FarmerProduct.ProductStatus.OFF); // 下架
        }
        farmerProductRepository.save(product);
        
        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.PRODUCT_AUDIT,
            "审核商品: " + product.getName(),
            AdminOperationLog.TargetType.PRODUCT,
            request.getProductId(),
            product.getName()
        );
        
        return saved;
    }
    
    /**
     * 审核内容
     */
    public AdminContentAudit auditContent(ContentAuditRequest request, String operatorId) {
        AdminContentAudit audit = contentAuditRepository.findByContentId(request.getContentId())
            .orElseThrow(() -> new EntityNotFoundException("审核记录不存在"));
        
        audit.setAuditStatus(AdminContentAudit.AuditStatus.valueOf(request.getAuditStatus()));
        audit.setAuditComment(request.getAuditComment());
        audit.setAuditedBy(operatorId);
        audit.setAuditedAt(LocalDateTime.now());
        
        AdminContentAudit saved = contentAuditRepository.save(audit);
        
        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.CONTENT_AUDIT,
            "审核内容: " + audit.getContentTitle(),
            AdminOperationLog.TargetType.CONTENT,
            request.getContentId(),
            audit.getContentTitle()
        );
        
        return saved;
    }
    
    /**
     * 审核专家
     */
    public AdminExpertAudit auditExpert(ExpertAuditRequest request, String operatorId) {
        AdminExpertAudit audit = expertAuditRepository.findByExpertId(request.getExpertId())
            .orElseThrow(() -> new EntityNotFoundException("审核记录不存在"));
        
        audit.setAuditStatus(AdminExpertAudit.AuditStatus.valueOf(request.getAuditStatus()));
        audit.setAuditComment(request.getAuditComment());
        audit.setAuditedBy(operatorId);
        audit.setAuditedAt(LocalDateTime.now());
        
        AdminExpertAudit saved = expertAuditRepository.save(audit);
        
        // 更新用户角色状态（如果通过审核）
        if ("APPROVED".equals(request.getAuditStatus())) {
            User expert = userRepository.findById(request.getExpertId())
                .orElseThrow(() -> new EntityNotFoundException("用户不存在"));
            // 更新用户角色为专家
            expert.setRole(User.UserRole.EXPERT);
            userRepository.save(expert);
        } else if ("REJECTED".equals(request.getAuditStatus())) {
            // 如果拒绝，可以保持原角色或设置为其他角色
            // 这里保持原角色不变
        }
        
        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.EXPERT_AUDIT,
            "审核专家: " + audit.getExpertName(),
            AdminOperationLog.TargetType.EXPERT,
            request.getExpertId(),
            audit.getExpertName()
        );
        
        return saved;
    }
    
    /**
     * 获取待审核商品列表
     */
    public List<AdminProductAudit> getPendingProductAudits() {
        return productAuditRepository.findPendingAudits();
    }
    
    /**
     * 获取待审核内容列表
     */
    public List<AdminContentAudit> getPendingContentAudits() {
        return contentAuditRepository.findPendingAudits();
    }
    
    /**
     * 获取待审核专家列表
     */
    public List<AdminExpertAudit> getPendingExpertAudits() {
        return expertAuditRepository.findPendingAudits();
    }
}

