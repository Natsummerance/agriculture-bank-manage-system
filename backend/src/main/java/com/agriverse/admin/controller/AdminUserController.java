package com.agriverse.admin.controller;

import com.agriverse.admin.dto.UserRoleUpdateRequest;
import com.agriverse.admin.dto.UserSearchRequest;
import com.agriverse.admin.dto.UserStatisticsResponse;
import com.agriverse.admin.dto.UserStatusUpdateRequest;
import com.agriverse.dto.ApiResponse;
import com.agriverse.entity.User;
import com.agriverse.admin.service.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import java.security.Principal;

@Slf4j
@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "用户管理", description = "用户信息管理和状态控制接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminUserController {
    private final AdminUserService userService;
    
    /**
     * 搜索用户
     */
    @Operation(summary = "搜索用户", description = "根据关键词、角色、状态等条件搜索用户")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "搜索成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<User>>> searchUsers(
            @Valid @RequestBody UserSearchRequest request) {
        try {
            Page<User> users = userService.searchUsers(request);
            return ResponseEntity.ok(ApiResponse.success("搜索成功", users));
        } catch (Exception e) {
            log.error("搜索用户异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "搜索失败，请稍后重试"));
        }
    }
    
    /**
     * 获取用户详情
     */
    @Operation(summary = "获取用户详情", description = "根据用户ID获取用户详细信息")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "用户不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<User>> getUserDetail(
            @Parameter(description = "用户ID") @PathVariable String userId) {
        try {
            User user = userService.getUserDetail(userId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", user));
        } catch (EntityNotFoundException e) {
            log.error("用户不存在: userId={}", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(404, "用户不存在"));
        } catch (Exception e) {
            log.error("获取用户详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 更新用户状态
     */
    @Operation(summary = "更新用户状态", description = "启用或禁用用户")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "更新成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PutMapping("/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
            @Valid @RequestBody UserStatusUpdateRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            User user = userService.updateUserStatus(request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("更新成功", user));
        } catch (Exception e) {
            log.error("更新用户状态异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 更新用户角色
     */
    @Operation(summary = "更新用户角色", description = "修改用户的角色")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "更新成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PutMapping("/role")
    public ResponseEntity<ApiResponse<User>> updateUserRole(
            @Valid @RequestBody UserRoleUpdateRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            User user = userService.updateUserRole(request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("更新成功", user));
        } catch (Exception e) {
            log.error("更新用户角色异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 获取用户统计数据
     */
    @Operation(summary = "获取用户统计数据", description = "获取用户总数、按角色统计、今日新增等统计数据")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<UserStatisticsResponse>> getUserStatistics() {
        try {
            UserStatisticsResponse statistics = userService.getUserStatistics();
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取用户统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}

