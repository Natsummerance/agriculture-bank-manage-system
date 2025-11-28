package com.agriverse.bank.service;

import com.agriverse.bank.dto.DocumentUploadRequest;
import com.agriverse.bank.dto.DocumentVerifyRequest;
import com.agriverse.bank.entity.ApplicationDocument;
import com.agriverse.bank.repository.ApplicationDocumentRepository;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 申请资料服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationDocumentService {
    private final ApplicationDocumentRepository documentRepository;
    private final FinancingApplicationRepository applicationRepository;
    
    /**
     * 上传申请资料
     */
    public ApplicationDocument uploadDocument(DocumentUploadRequest request, String uploadedBy) {
        // 验证融资申请是否存在
        if (!applicationRepository.existsById(request.getFinancingId())) {
            throw new EntityNotFoundException("融资申请不存在");
        }
        
        ApplicationDocument document = ApplicationDocument.builder()
            .id(UUID.randomUUID().toString())
            .financingId(request.getFinancingId())
            .documentType(ApplicationDocument.DocumentType.valueOf(request.getDocumentType()))
            .documentName(request.getDocumentName())
            .fileUrl(request.getFileUrl())
            .fileSize(request.getFileSize())
            .fileType(request.getFileType())
            .uploadStatus(ApplicationDocument.UploadStatus.UPLOADED)
            .verifyStatus(ApplicationDocument.VerifyStatus.PENDING)
            .uploadedBy(uploadedBy)
            .uploadedAt(LocalDateTime.now())
            .build();
        
        return documentRepository.save(document);
    }
    
    /**
     * 审核资料
     */
    public ApplicationDocument verifyDocument(DocumentVerifyRequest request, String verifiedBy) {
        ApplicationDocument document = documentRepository.findById(request.getDocumentId())
            .orElseThrow(() -> new EntityNotFoundException("资料不存在"));
        
        document.setVerifyStatus(ApplicationDocument.VerifyStatus.valueOf(request.getVerifyStatus()));
        document.setVerifyComment(request.getVerifyComment());
        document.setVerifiedBy(verifiedBy);
        document.setVerifiedAt(LocalDateTime.now());
        
        if (ApplicationDocument.VerifyStatus.APPROVED.name().equals(request.getVerifyStatus())) {
            document.setUploadStatus(ApplicationDocument.UploadStatus.VERIFIED);
        } else if (ApplicationDocument.VerifyStatus.REJECTED.name().equals(request.getVerifyStatus())) {
            document.setUploadStatus(ApplicationDocument.UploadStatus.REJECTED);
        }
        
        return documentRepository.save(document);
    }
    
    /**
     * 获取申请的所有资料
     */
    public List<ApplicationDocument> getDocumentsByFinancingId(String financingId) {
        return documentRepository.findByFinancingId(financingId);
    }
    
    /**
     * 打包下载资料（生成ZIP文件）
     */
    public String downloadAllDocuments(String financingId) {
        // 验证融资申请是否存在
        if (!applicationRepository.existsById(financingId)) {
            throw new EntityNotFoundException("融资申请不存在");
        }
        
        // TODO: 实现ZIP文件打包逻辑
        // 1. 从文件URL下载所有文件
        // 2. 打包成ZIP
        // 3. 上传到文件服务器
        // 4. 返回下载URL
        
        return "/downloads/" + financingId + ".zip";
    }
    
    /**
     * 获取资料统计
     */
    public Map<String, Object> getDocumentStatistics(String financingId) {
        List<ApplicationDocument> documents = documentRepository.findByFinancingId(financingId);
        
        Long totalSize = documentRepository.getTotalFileSize(financingId);
        int totalCount = documents != null ? documents.size() : 0;
        int verifiedCount = documents != null ? (int) documents.stream()
            .filter(d -> d.getVerifyStatus() == ApplicationDocument.VerifyStatus.APPROVED)
            .count() : 0;
        int pendingCount = documents != null ? (int) documents.stream()
            .filter(d -> d.getVerifyStatus() == ApplicationDocument.VerifyStatus.PENDING)
            .count() : 0;
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCount", totalCount);
        stats.put("totalSize", totalSize != null ? totalSize : 0L);
        stats.put("verifiedCount", verifiedCount);
        stats.put("pendingCount", pendingCount);
        
        return stats;
    }
}

