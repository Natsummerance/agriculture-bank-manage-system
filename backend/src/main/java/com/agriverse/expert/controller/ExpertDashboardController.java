package com.agriverse.expert.controller;

import com.agriverse.dto.ApiResponse;
import com.agriverse.expert.dto.ExpertDashboardStatisticsResponse;
import com.agriverse.expert.service.ExpertDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/expert/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('EXPERT')")
@Tag(name = "专家仪表盘", description = "专家数据统计和监控接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ExpertDashboardController {
    private final ExpertDashboardService dashboardService;
    
    /**
     * 获取仪表盘统计数据
     */
    @Operation(summary = "获取仪表盘统计数据", description = "获取问答、预约、收入等统计数据")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<ExpertDashboardStatisticsResponse>> getStatistics(Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertDashboardStatisticsResponse statistics = dashboardService.getDashboardStatistics(expertId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取仪表盘统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}



