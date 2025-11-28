package com.agriverse.admin.service;

import com.agriverse.admin.dto.UserRoleUpdateRequest;
import com.agriverse.admin.dto.UserSearchRequest;
import com.agriverse.admin.dto.UserStatisticsResponse;
import com.agriverse.admin.dto.UserStatusUpdateRequest;
import com.agriverse.admin.entity.AdminOperationLog;
import com.agriverse.entity.User;
import com.agriverse.auth.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserService {
    private final UserRepository userRepository;
    private final AdminOperationLogService operationLogService;
    
    /**
     * 搜索用户
     */
    public Page<User> searchUsers(UserSearchRequest request) {
        Specification<User> spec = Specification.where(null);
        
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            String keyword = "%" + request.getKeyword() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                cb.like(root.get("name"), keyword),
                cb.like(root.get("phone"), keyword)
            ));
        }
        
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("role"), User.UserRole.valueOf(request.getRole())));
        }
        
        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            // User实体使用enabled字段，不是status
            boolean enabled = "ACTIVE".equalsIgnoreCase(request.getStatus());
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("enabled"), enabled));
        }
        
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(),
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return userRepository.findAll(spec, pageable);
    }
    
    /**
     * 获取用户详情
     */
    public User getUserDetail(String userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("用户不存在"));
    }
    
    /**
     * 更新用户状态
     */
    public User updateUserStatus(UserStatusUpdateRequest request, String operatorId) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new EntityNotFoundException("用户不存在"));
        
        // User实体使用enabled字段
        boolean enabled = "ACTIVE".equalsIgnoreCase(request.getStatus());
        user.setEnabled(enabled);
        User saved = userRepository.save(user);
        
        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.USER_MANAGE,
            "更新用户状态: " + request.getStatus(),
            AdminOperationLog.TargetType.USER,
            request.getUserId(),
            user.getName()
        );
        
        return saved;
    }
    
    /**
     * 更新用户角色
     */
    public User updateUserRole(UserRoleUpdateRequest request, String operatorId) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new EntityNotFoundException("用户不存在"));
        
        User.UserRole newRole = User.UserRole.valueOf(request.getRole());
        User.UserRole oldRole = user.getRole();
        user.setRole(newRole);
        User saved = userRepository.save(user);
        
        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.USER_MANAGE,
            "更新用户角色: " + oldRole + " -> " + newRole,
            AdminOperationLog.TargetType.USER,
            request.getUserId(),
            user.getName()
        );
        
        return saved;
    }
    
    /**
     * 获取用户统计数据
     */
    public UserStatisticsResponse getUserStatistics() {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(23, 59, 59);
        
        // 总用户数
        long totalUsers = userRepository.count();
        
        // 活跃用户数（enabled = true）
        Specification<User> activeSpec = (root, query, cb) -> cb.equal(root.get("enabled"), true);
        long activeUsers = userRepository.count(activeSpec);
        
        // 禁用用户数（enabled = false）
        Specification<User> disabledSpec = (root, query, cb) -> cb.equal(root.get("enabled"), false);
        long disabledUsers = userRepository.count(disabledSpec);
        
        // 按角色统计
        Map<String, Long> usersByRole = new HashMap<>();
        for (User.UserRole role : User.UserRole.values()) {
            Specification<User> roleSpec = (root, query, cb) -> cb.equal(root.get("role"), role);
            long count = userRepository.count(roleSpec);
            usersByRole.put(role.name(), count);
        }
        
        // 今日新增用户数
        Specification<User> todaySpec = (root, query, cb) -> 
            cb.between(root.get("createdAt"), todayStart, todayEnd);
        long todayNewUsers = userRepository.count(todaySpec);
        
        // 已验证邮箱用户数
        Specification<User> verifiedSpec = (root, query, cb) -> 
            cb.equal(root.get("emailVerified"), true);
        long verifiedUsers = userRepository.count(verifiedSpec);
        
        return UserStatisticsResponse.builder()
            .totalUsers(totalUsers)
            .activeUsers(activeUsers)
            .disabledUsers(disabledUsers)
            .usersByRole(usersByRole)
            .todayNewUsers(todayNewUsers)
            .verifiedUsers(verifiedUsers)
            .build();
    }
}

