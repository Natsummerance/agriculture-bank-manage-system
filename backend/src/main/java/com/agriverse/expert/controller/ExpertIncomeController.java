package com.agriverse.expert.controller;

import com.agriverse.dto.ApiResponse;
import com.agriverse.expert.dto.IncomeStatisticsResponse;
import com.agriverse.expert.dto.WithdrawalRequest;
import com.agriverse.expert.entity.ExpertIncomeRecord;
import com.agriverse.expert.entity.ExpertWithdrawal;
import com.agriverse.expert.service.ExpertIncomeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/expert/income")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('EXPERT')")
@Tag(name = "专家收入管理", description = "收入统计和提现管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ExpertIncomeController {
    private final ExpertIncomeService incomeService;
    
    /**
     * 获取收入统计
     */
    @Operation(summary = "获取收入统计", description = "获取问答、预约等收入统计")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<IncomeStatisticsResponse>> getIncomeStatistics(Principal principal) {
        try {
            String expertId = principal.getName();
            IncomeStatisticsResponse statistics = incomeService.getIncomeStatistics(expertId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取收入统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取收入明细
     */
    @Operation(summary = "获取收入明细", description = "获取收入记录列表")
    @GetMapping("/records")
    public ResponseEntity<ApiResponse<Page<ExpertIncomeRecord>>> getIncomeRecords(
            @RequestParam(required = false) String incomeType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        try {
            String expertId = principal.getName();
            Page<ExpertIncomeRecord> records = incomeService.getIncomeRecords(
                expertId, incomeType, startTime, endTime, page, size);
            return ResponseEntity.ok(ApiResponse.success("获取成功", records));
        } catch (Exception e) {
            log.error("获取收入明细异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 申请提现
     */
    @Operation(summary = "申请提现", description = "申请提现到银行账户")
    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<ExpertWithdrawal>> applyWithdrawal(
            @Valid @RequestBody WithdrawalRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertWithdrawal withdrawal = incomeService.applyWithdrawal(request, expertId);
            return ResponseEntity.ok(ApiResponse.success("申请成功", withdrawal));
        } catch (Exception e) {
            log.error("申请提现异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "申请失败，请稍后重试"));
        }
    }
    
    /**
     * 获取提现记录
     */
    @Operation(summary = "获取提现记录", description = "获取提现申请记录列表")
    @GetMapping("/withdrawals")
    public ResponseEntity<ApiResponse<Page<ExpertWithdrawal>>> getWithdrawals(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        try {
            String expertId = principal.getName();
            Page<ExpertWithdrawal> withdrawals = incomeService.getWithdrawals(
                expertId, status, page, size);
            return ResponseEntity.ok(ApiResponse.success("获取成功", withdrawals));
        } catch (Exception e) {
            log.error("获取提现记录异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取提现详情
     */
    @Operation(summary = "获取提现详情", description = "获取提现申请的详细信息")
    @GetMapping("/withdrawals/{withdrawalId}")
    public ResponseEntity<ApiResponse<ExpertWithdrawal>> getWithdrawalDetail(
            @PathVariable String withdrawalId,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertWithdrawal withdrawal = incomeService.getWithdrawalDetail(withdrawalId, expertId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", withdrawal));
        } catch (Exception e) {
            log.error("获取提现详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}

