package com.agriverse.admin.controller;

import com.agriverse.admin.dto.PermissionRequest;
import com.agriverse.admin.entity.AdminPermission;
import com.agriverse.admin.service.AdminPermissionService;
import com.agriverse.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/admin/permissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "权限管理", description = "角色权限配置和管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class AdminPermissionController {
    private final AdminPermissionService permissionService;

    /**
     * 创建权限
     */
    @Operation(summary = "创建权限", description = "为角色创建新的权限")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "创建成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "请求参数错误"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<AdminPermission>> createPermission(
            @Valid @RequestBody PermissionRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            AdminPermission permission = permissionService.createPermission(request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("创建成功", permission));
        } catch (Exception e) {
            log.error("创建权限异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "创建失败，请稍后重试"));
        }
    }

    /**
     * 更新权限
     */
    @Operation(summary = "更新权限", description = "更新权限信息")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "更新成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "权限不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PutMapping("/{permissionId}")
    public ResponseEntity<ApiResponse<AdminPermission>> updatePermission(
            @PathVariable String permissionId,
            @Valid @RequestBody PermissionRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            AdminPermission permission = permissionService.updatePermission(permissionId, request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("更新成功", permission));
        } catch (Exception e) {
            log.error("更新权限异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }

    /**
     * 删除权限
     */
    @Operation(summary = "删除权限", description = "删除指定的权限")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "删除成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "权限不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @DeleteMapping("/{permissionId}")
    public ResponseEntity<ApiResponse<Object>> deletePermission(
            @PathVariable String permissionId,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            permissionService.deletePermission(permissionId, operatorId);
            return ResponseEntity.ok(ApiResponse.success("删除成功", null));
        } catch (Exception e) {
            log.error("删除权限异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "删除失败，请稍后重试"));
        }
    }

    /**
     * 获取角色权限列表
     */
    @Operation(summary = "获取角色权限列表", description = "根据角色获取所有权限")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<AdminPermission>>> getPermissionsByRole(@PathVariable String role) {
        try {
            List<AdminPermission> permissions = permissionService.getPermissionsByRole(role);
            return ResponseEntity.ok(ApiResponse.success("获取成功", permissions));
        } catch (Exception e) {
            log.error("获取角色权限列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }

    /**
     * 获取所有权限
     */
    @Operation(summary = "获取所有权限", description = "获取系统中所有权限配置")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminPermission>>> getAllPermissions() {
        try {
            List<AdminPermission> permissions = permissionService.getAllPermissions();
            return ResponseEntity.ok(ApiResponse.success("获取成功", permissions));
        } catch (Exception e) {
            log.error("获取所有权限异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}



