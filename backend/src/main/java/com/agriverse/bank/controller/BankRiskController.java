package com.agriverse.bank.controller;

import com.agriverse.bank.dto.RiskAlert;
import com.agriverse.bank.dto.RiskDashboardResponse;
import com.agriverse.bank.entity.RiskIndicator;
import com.agriverse.bank.service.RiskManagementService;
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

import java.util.List;

/**
 * 银行风控控制器
 */
@Slf4j
@RestController
@RequestMapping("/bank/risk")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BANK')")
@Tag(name = "银行风控管理", description = "风险指标监控、风险预警、风险分析接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BankRiskController {
    private final RiskManagementService riskService;
    
    /**
     * 获取风控仪表盘数据
     */
    @Operation(summary = "获取风控仪表盘数据", description = "获取逾期率、不良率、授信余额等风险指标")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<RiskDashboardResponse>> getRiskDashboard() {
        try {
            RiskDashboardResponse dashboard = riskService.getRiskDashboard();
            return ResponseEntity.ok(ApiResponse.success("获取成功", dashboard));
        } catch (Exception e) {
            log.error("获取风控仪表盘异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取风险预警列表
     */
    @Operation(summary = "获取风险预警列表", description = "获取所有风险预警信息")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<RiskAlert>>> getRiskAlerts() {
        try {
            List<RiskAlert> alerts = riskService.getRiskAlerts();
            return ResponseEntity.ok(ApiResponse.success("获取成功", alerts));
        } catch (Exception e) {
            log.error("获取风险预警异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 手动计算风险指标
     */
    @Operation(summary = "手动计算风险指标", description = "手动触发风险指标计算")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "计算成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/indicators/calculate")
    public ResponseEntity<ApiResponse<RiskIndicator>> calculateRiskIndicator() {
        try {
            RiskIndicator indicator = riskService.calculateCurrentRiskIndicator();
            return ResponseEntity.ok(ApiResponse.success("计算成功", indicator));
        } catch (Exception e) {
            log.error("计算风险指标异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "计算失败，请稍后重试"));
        }
    }
}

