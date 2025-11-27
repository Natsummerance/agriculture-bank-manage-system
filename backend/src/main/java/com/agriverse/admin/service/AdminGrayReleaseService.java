package com.agriverse.admin.service;

import com.agriverse.admin.dto.GrayReleaseRequest;
import com.agriverse.admin.entity.AdminGrayRelease;
import com.agriverse.admin.entity.AdminOperationLog;
import com.agriverse.admin.repository.AdminGrayReleaseRepository;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.entity.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminGrayReleaseService {
    private final AdminGrayReleaseRepository grayReleaseRepository;
    private final AdminOperationLogService operationLogService;
    private final UserRepository userRepository;
    
    /**
     * 创建灰度发布
     */
    public AdminGrayRelease createGrayRelease(GrayReleaseRequest request, String createdBy) {
        AdminGrayRelease grayRelease = AdminGrayRelease.builder()
            .id(UUID.randomUUID().toString())
            .featureName(request.getFeatureName())
            .description(request.getDescription())
            .releasePercent(request.getReleasePercent())
            .targetUsers(request.getTargetUsers() != null && !request.getTargetUsers().isEmpty() ? 
                AdminGrayRelease.TargetUsers.valueOf(request.getTargetUsers()) : 
                AdminGrayRelease.TargetUsers.ALL)
            .enabled(request.getEnabled() != null ? request.getEnabled() : false)
            .createdBy(createdBy)
            .build();
        
        AdminGrayRelease saved = grayReleaseRepository.save(grayRelease);
        
        // 记录操作日志
        operationLogService.logOperation(
            createdBy,
            AdminOperationLog.ActionType.GRAY_RELEASE,
            "创建灰度发布: " + request.getFeatureName(),
            AdminOperationLog.TargetType.FEATURE,
            saved.getId(),
            request.getFeatureName()
        );
        
        return saved;
    }
    
    /**
     * 更新灰度发布
     */
    public AdminGrayRelease updateGrayRelease(String grayReleaseId, GrayReleaseRequest request, String updatedBy) {
        AdminGrayRelease grayRelease = grayReleaseRepository.findById(grayReleaseId)
            .orElseThrow(() -> new EntityNotFoundException("灰度发布不存在"));
        
        grayRelease.setFeatureName(request.getFeatureName());
        if (request.getDescription() != null) {
            grayRelease.setDescription(request.getDescription());
        }
        if (request.getReleasePercent() != null) {
            grayRelease.setReleasePercent(request.getReleasePercent());
        }
        if (request.getTargetUsers() != null && !request.getTargetUsers().isEmpty()) {
            grayRelease.setTargetUsers(AdminGrayRelease.TargetUsers.valueOf(request.getTargetUsers()));
        }
        if (request.getEnabled() != null) {
            grayRelease.setEnabled(request.getEnabled());
        }
        
        AdminGrayRelease saved = grayReleaseRepository.save(grayRelease);
        
        // 记录操作日志
        operationLogService.logOperation(
            updatedBy,
            AdminOperationLog.ActionType.GRAY_RELEASE,
            "更新灰度发布: " + request.getFeatureName(),
            AdminOperationLog.TargetType.FEATURE,
            grayReleaseId,
            request.getFeatureName()
        );
        
        return saved;
    }
    
    /**
     * 获取灰度发布列表
     */
    public List<AdminGrayRelease> getGrayReleases(Boolean enabled) {
        if (enabled != null) {
            return grayReleaseRepository.findByEnabled(enabled);
        }
        return grayReleaseRepository.findAll();
    }
    
    /**
     * 检查功能是否对用户启用
     */
    public boolean isFeatureEnabledForUser(String featureName, String userId) {
        Optional<AdminGrayRelease> grayReleaseOpt = grayReleaseRepository.findByFeatureName(featureName);
        
        if (grayReleaseOpt.isEmpty()) {
            return false;
        }
        
        AdminGrayRelease grayRelease = grayReleaseOpt.get();
        if (!grayRelease.getEnabled()) {
            return false;
        }
        
        // 根据发布比例和目标用户判断
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        
        // 检查目标用户类型
        if (grayRelease.getTargetUsers() == AdminGrayRelease.TargetUsers.NEW) {
            // 新用户：注册时间在30天内
            if (user.getCreatedAt() == null || 
                user.getCreatedAt().isBefore(LocalDateTime.now().minusDays(30))) {
                return false;
            }
        } else if (grayRelease.getTargetUsers() == AdminGrayRelease.TargetUsers.VIP) {
            // VIP用户：这里可以根据业务逻辑判断，暂时使用邮箱已验证作为VIP标识
            if (!Boolean.TRUE.equals(user.getEmailVerified())) {
                return false;
            }
        }
        // ALL类型不需要额外检查
        
        // 根据发布比例判断（使用用户ID的哈希值）
        int userHash = Math.abs(userId.hashCode());
        int percent = userHash % 100;
        
        return percent < grayRelease.getReleasePercent();
    }
}

