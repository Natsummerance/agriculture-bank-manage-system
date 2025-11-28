package com.agriverse.admin.controller;

import com.agriverse.admin.dto.OperationLogSearchRequest;
import com.agriverse.admin.entity.AdminOperationLog;
import com.agriverse.admin.service.AdminOperationLogService;
import com.agriverse.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/admin/logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "操作日志", description = "管理员操作日志查询和导出接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminOperationLogController {
    private final AdminOperationLogService logService;
    
    /**
     * 搜索操作日志
     */
    @Operation(summary = "搜索操作日志", description = "根据条件搜索操作日志")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "搜索成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<AdminOperationLog>>> searchLogs(
            @Valid @RequestBody OperationLogSearchRequest request) {
        try {
            Page<AdminOperationLog> logs = logService.searchLogs(request);
            return ResponseEntity.ok(ApiResponse.success("搜索成功", logs));
        } catch (Exception e) {
            log.error("搜索操作日志异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "搜索失败，请稍后重试"));
        }
    }
    
    /**
     * 导出操作日志
     */
    @Operation(summary = "导出操作日志", description = "导出操作日志为Excel文件")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "导出成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/export")
    public ResponseEntity<Resource> exportLogs(
            @RequestParam(required = false) String actionType,
            @RequestParam(required = false) LocalDateTime startTime,
            @RequestParam(required = false) LocalDateTime endTime) {
        try {
            // TODO: 实现Excel导出逻辑
            // 使用POI或EasyExcel库生成Excel文件
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=operation_logs.xlsx")
                .body(null); // 返回Excel文件资源
        } catch (Exception e) {
            log.error("导出操作日志异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}



