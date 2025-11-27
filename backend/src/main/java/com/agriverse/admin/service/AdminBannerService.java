package com.agriverse.admin.service;

import com.agriverse.admin.dto.BannerRequest;
import com.agriverse.admin.entity.AdminBanner;
import com.agriverse.admin.entity.AdminOperationLog;
import com.agriverse.admin.repository.AdminBannerRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminBannerService {
    private final AdminBannerRepository bannerRepository;
    private final AdminOperationLogService operationLogService;
    
    /**
     * 创建轮播图
     */
    public AdminBanner createBanner(BannerRequest request, String createdBy) {
        AdminBanner banner = AdminBanner.builder()
            .id(UUID.randomUUID().toString())
            .title(request.getTitle())
            .imageUrl(request.getImageUrl())
            .linkUrl(request.getLinkUrl())
            .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
            .enabled(request.getEnabled() != null ? request.getEnabled() : true)
            .startTime(request.getStartTime())
            .endTime(request.getEndTime())
            .createdBy(createdBy)
            .build();
        
        AdminBanner saved = bannerRepository.save(banner);
        
        // 记录操作日志
        operationLogService.logOperation(
            createdBy,
            AdminOperationLog.ActionType.BANNER_MANAGE,
            "创建轮播图: " + request.getTitle(),
            AdminOperationLog.TargetType.BANNER,
            saved.getId(),
            request.getTitle()
        );
        
        return saved;
    }
    
    /**
     * 更新轮播图
     */
    public AdminBanner updateBanner(String bannerId, BannerRequest request, String updatedBy) {
        AdminBanner banner = bannerRepository.findById(bannerId)
            .orElseThrow(() -> new EntityNotFoundException("轮播图不存在"));
        
        banner.setTitle(request.getTitle());
        banner.setImageUrl(request.getImageUrl());
        banner.setLinkUrl(request.getLinkUrl());
        if (request.getDisplayOrder() != null) {
            banner.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getEnabled() != null) {
            banner.setEnabled(request.getEnabled());
        }
        banner.setStartTime(request.getStartTime());
        banner.setEndTime(request.getEndTime());
        
        AdminBanner saved = bannerRepository.save(banner);
        
        // 记录操作日志
        operationLogService.logOperation(
            updatedBy,
            AdminOperationLog.ActionType.BANNER_MANAGE,
            "更新轮播图: " + request.getTitle(),
            AdminOperationLog.TargetType.BANNER,
            bannerId,
            request.getTitle()
        );
        
        return saved;
    }
    
    /**
     * 删除轮播图
     */
    public void deleteBanner(String bannerId, String operatorId) {
        AdminBanner banner = bannerRepository.findById(bannerId)
            .orElseThrow(() -> new EntityNotFoundException("轮播图不存在"));
        
        String title = banner.getTitle();
        bannerRepository.delete(banner);
        
        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.BANNER_MANAGE,
            "删除轮播图: " + title,
            AdminOperationLog.TargetType.BANNER,
            bannerId,
            title
        );
    }
    
    /**
     * 获取轮播图列表
     */
    public List<AdminBanner> getBanners(Boolean enabled) {
        if (enabled != null) {
            return bannerRepository.findByEnabledOrderByDisplayOrderAsc(enabled);
        }
        return bannerRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder"));
    }
    
    /**
     * 更新轮播图顺序
     */
    public void updateBannerOrder(String bannerId, Integer newOrder, String operatorId) {
        AdminBanner banner = bannerRepository.findById(bannerId)
            .orElseThrow(() -> new EntityNotFoundException("轮播图不存在"));
        
        banner.setDisplayOrder(newOrder);
        bannerRepository.save(banner);
    }
    
    /**
     * 增加点击次数
     */
    public void incrementClickCount(String bannerId) {
        AdminBanner banner = bannerRepository.findById(bannerId)
            .orElse(null);
        if (banner != null) {
            banner.setClickCount(banner.getClickCount() + 1);
            bannerRepository.save(banner);
        }
    }
}



