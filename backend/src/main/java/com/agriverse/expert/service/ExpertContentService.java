package com.agriverse.expert.service;

import com.agriverse.expert.dto.ContentPublishRequest;
import com.agriverse.expert.entity.ExpertContent;
import com.agriverse.expert.repository.ExpertContentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpertContentService {
    private final ExpertContentRepository contentRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * 发布内容
     */
    public ExpertContent publishContent(ContentPublishRequest request, String expertId) {
        String imagesJson = null;
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            try {
                imagesJson = objectMapper.writeValueAsString(request.getImages());
            } catch (JsonProcessingException e) {
                throw new RuntimeException("图片列表序列化失败", e);
            }
        }
        
        ExpertContent content = ExpertContent.builder()
            .id(UUID.randomUUID().toString())
            .expertId(expertId)
            .contentType(ExpertContent.ContentType.valueOf(request.getContentType()))
            .title(request.getTitle())
            .summary(request.getSummary())
            .content(request.getContent())
            .coverUrl(request.getCoverUrl())
            .videoUrl(request.getVideoUrl())
            .images(imagesJson)
            .status(ExpertContent.ContentStatus.PUBLISHED)
            .auditStatus(ExpertContent.AuditStatus.PENDING)
            .publishedAt(LocalDateTime.now())
            .build();
        
        return contentRepository.save(content);
    }
    
    /**
     * 更新内容
     */
    public ExpertContent updateContent(String contentId, ContentPublishRequest request, String expertId) {
        ExpertContent content = contentRepository.findById(contentId)
            .orElseThrow(() -> new EntityNotFoundException("内容不存在"));
        
        if (!content.getExpertId().equals(expertId)) {
            throw new IllegalArgumentException("无权修改此内容");
        }
        
        if (request.getContentType() != null) {
            content.setContentType(ExpertContent.ContentType.valueOf(request.getContentType()));
        }
        if (request.getTitle() != null) {
            content.setTitle(request.getTitle());
        }
        if (request.getSummary() != null) {
            content.setSummary(request.getSummary());
        }
        if (request.getContent() != null) {
            content.setContent(request.getContent());
        }
        if (request.getCoverUrl() != null) {
            content.setCoverUrl(request.getCoverUrl());
        }
        if (request.getVideoUrl() != null) {
            content.setVideoUrl(request.getVideoUrl());
        }
        if (request.getImages() != null) {
            try {
                content.setImages(objectMapper.writeValueAsString(request.getImages()));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("图片列表序列化失败", e);
            }
        }
        
        return contentRepository.save(content);
    }
    
    /**
     * 获取内容列表
     */
    public Page<ExpertContent> getContents(String expertId, String contentType, 
                                          String status, Integer page, Integer size) {
        Specification<ExpertContent> spec = Specification.where(
            (root, query, cb) -> cb.equal(root.get("expertId"), expertId));
        
        if (contentType != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("contentType"), 
                    ExpertContent.ContentType.valueOf(contentType)));
        }
        
        if (status != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), 
                    ExpertContent.ContentStatus.valueOf(status)));
        }
        
        Pageable pageable = PageRequest.of(page, size, 
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return contentRepository.findAll(spec, pageable);
    }
    
    /**
     * 获取内容详情
     */
    public ExpertContent getContentDetail(String contentId) {
        return contentRepository.findById(contentId)
            .orElseThrow(() -> new EntityNotFoundException("内容不存在"));
    }
    
    /**
     * 删除内容
     */
    public void deleteContent(String contentId, String expertId) {
        ExpertContent content = contentRepository.findById(contentId)
            .orElseThrow(() -> new EntityNotFoundException("内容不存在"));
        
        if (!content.getExpertId().equals(expertId)) {
            throw new IllegalArgumentException("无权删除此内容");
        }
        
        contentRepository.delete(content);
    }
    
    /**
     * 更新内容状态
     */
    public ExpertContent updateContentStatus(String contentId, String status, String expertId) {
        ExpertContent content = contentRepository.findById(contentId)
            .orElseThrow(() -> new EntityNotFoundException("内容不存在"));
        
        if (!content.getExpertId().equals(expertId)) {
            throw new IllegalArgumentException("无权修改此内容");
        }
        
        content.setStatus(ExpertContent.ContentStatus.valueOf(status));
        return contentRepository.save(content);
    }
}

