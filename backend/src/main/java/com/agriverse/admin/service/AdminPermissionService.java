package com.agriverse.admin.service;

import com.agriverse.admin.dto.PermissionRequest;
import com.agriverse.admin.entity.AdminOperationLog;
import com.agriverse.admin.entity.AdminPermission;
import com.agriverse.admin.repository.AdminPermissionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminPermissionService {
    private final AdminPermissionRepository permissionRepository;
    private final AdminOperationLogService operationLogService;

    /**
     * 创建权限
     */
    public AdminPermission createPermission(PermissionRequest request, String operatorId) {
        // 检查是否已存在
        AdminPermission existing = permissionRepository.findByRoleAndResourceAndAction(
            request.getRole(),
            request.getResource(),
            AdminPermission.PermissionAction.valueOf(request.getAction())
        );

        if (existing != null) {
            throw new IllegalStateException("权限已存在");
        }

        AdminPermission permission = AdminPermission.builder()
            .id(UUID.randomUUID().toString())
            .role(request.getRole())
            .resource(request.getResource())
            .action(AdminPermission.PermissionAction.valueOf(request.getAction()))
            .description(request.getDescription())
            .enabled(request.getEnabled() != null ? request.getEnabled() : true)
            .build();

        AdminPermission saved = permissionRepository.save(permission);

        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.PERMISSION_MANAGE,
            "创建权限: " + request.getRole() + " - " + request.getResource() + " - " + request.getAction(),
            AdminOperationLog.TargetType.USER,
            saved.getId(),
            "权限管理"
        );

        return saved;
    }

    /**
     * 更新权限
     */
    public AdminPermission updatePermission(String permissionId, PermissionRequest request, String operatorId) {
        AdminPermission permission = permissionRepository.findById(permissionId)
            .orElseThrow(() -> new EntityNotFoundException("权限不存在"));

        if (request.getDescription() != null) {
            permission.setDescription(request.getDescription());
        }
        if (request.getEnabled() != null) {
            permission.setEnabled(request.getEnabled());
        }

        AdminPermission saved = permissionRepository.save(permission);

        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.PERMISSION_MANAGE,
            "更新权限: " + permission.getRole() + " - " + permission.getResource(),
            AdminOperationLog.TargetType.USER,
            permissionId,
            "权限管理"
        );

        return saved;
    }

    /**
     * 删除权限
     */
    public void deletePermission(String permissionId, String operatorId) {
        AdminPermission permission = permissionRepository.findById(permissionId)
            .orElseThrow(() -> new EntityNotFoundException("权限不存在"));

        permissionRepository.delete(permission);

        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.PERMISSION_MANAGE,
            "删除权限: " + permission.getRole() + " - " + permission.getResource(),
            AdminOperationLog.TargetType.USER,
            permissionId,
            "权限管理"
        );
    }

    /**
     * 获取角色权限列表
     */
    public List<AdminPermission> getPermissionsByRole(String role) {
        return permissionRepository.findByRoleAndEnabled(role, true);
    }

    /**
     * 获取所有权限
     */
    public List<AdminPermission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    /**
     * 检查权限
     */
    public boolean hasPermission(String role, String resource, AdminPermission.PermissionAction action) {
        AdminPermission permission = permissionRepository.findByRoleAndResourceAndAction(role, resource, action);
        return permission != null && permission.getEnabled();
    }
}



