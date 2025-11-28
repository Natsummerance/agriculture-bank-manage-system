package com.agriverse.admin.controller;

import com.agriverse.admin.dto.FinanceMonitorResponse;
import com.agriverse.admin.service.AdminFinanceMonitorService;
import com.agriverse.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/admin/finance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "融资监控", description = "融资申请监控和管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminFinanceMonitorController {
    private final AdminFinanceMonitorService financeMonitorService;
    
    /**
     * 获取融资监控数据
     */
    @Operation(summary = "获取融资监控数据", description = "获取融资申请统计和列表")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/monitor")
    public ResponseEntity<ApiResponse<FinanceMonitorResponse>> getFinanceMonitor() {
        try {
            FinanceMonitorResponse monitor = financeMonitorService.getFinanceMonitor();
            return ResponseEntity.ok(ApiResponse.success("获取成功", monitor));
        } catch (Exception e) {
            log.error("获取融资监控数据异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}



