package com.agriverse.admin.controller;

import com.agriverse.admin.dto.SystemConfigRequest;
import com.agriverse.admin.entity.AdminSystemConfig;
import com.agriverse.admin.service.AdminSystemConfigService;
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

@Slf4j
@RestController
@RequestMapping("/admin/config")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "系统配置", description = "系统参数配置和管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminSystemConfigController {
    private final AdminSystemConfigService configService;
    
    /**
     * 获取系统配置
     */
    @Operation(summary = "获取系统配置", description = "根据分类获取系统配置")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminSystemConfig>>> getConfigs(
            @RequestParam(required = false) String category) {
        try {
            List<AdminSystemConfig> configs = category != null ?
                configService.getConfigsByCategory(category) :
                configService.getAllConfigs();
            return ResponseEntity.ok(ApiResponse.success("获取成功", configs));
        } catch (Exception e) {
            log.error("获取系统配置异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 设置系统配置
     */
    @Operation(summary = "设置系统配置", description = "设置或更新系统配置值")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "设置成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<AdminSystemConfig>> setConfig(
            @Valid @RequestBody SystemConfigRequest request,
            Principal principal) {
        try {
            String updatedBy = principal.getName();
            AdminSystemConfig config = configService.setConfigValue(request, updatedBy);
            return ResponseEntity.ok(ApiResponse.success("设置成功", config));
        } catch (Exception e) {
            log.error("设置系统配置异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "设置失败，请稍后重试"));
        }
    }
}



