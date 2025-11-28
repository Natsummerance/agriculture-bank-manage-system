package com.agriverse.admin.controller;

import com.agriverse.admin.dto.AdminDashboardStatisticsResponse;
import com.agriverse.admin.service.AdminDashboardService;
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
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "管理员仪表盘", description = "管理员数据统计和监控接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminDashboardController {
    private final AdminDashboardService dashboardService;
    
    /**
     * 获取仪表盘统计数据
     */
    @Operation(summary = "获取仪表盘统计数据", description = "获取PV/UV、交易额、订单、审核等统计数据")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<AdminDashboardStatisticsResponse>> getStatistics() {
        try {
            AdminDashboardStatisticsResponse statistics = dashboardService.getDashboardStatistics();
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取仪表盘统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}



