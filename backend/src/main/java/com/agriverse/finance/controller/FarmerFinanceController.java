package com.agriverse.finance.controller;

import com.agriverse.dto.ApiResponse;
import com.agriverse.exception.BusinessException;
import com.agriverse.finance.dto.EarlyRepaymentCalculateRequest;
import com.agriverse.finance.dto.FinancingApplicationRequest;
import com.agriverse.finance.dto.RepaymentRequest;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.entity.RepaymentRecord;
import com.agriverse.finance.entity.RepaymentSchedule;
import com.agriverse.finance.entity.Contract;
import com.agriverse.finance.entity.JointLoanGroup;
import com.agriverse.finance.entity.JointLoanMember;
import com.agriverse.finance.service.FinancingApplicationService;
import com.agriverse.finance.service.RepaymentService;
import com.agriverse.finance.service.ContractService;
import com.agriverse.finance.service.JointLoanService;
import com.agriverse.finance.service.FinancingStatisticsService;
import com.agriverse.finance.dto.RepaymentSummaryResponse;
import com.agriverse.finance.dto.FinancingApplicationDetailResponse;
import com.agriverse.finance.repository.FinancingTimelineRepository;
import com.agriverse.finance.repository.RepaymentScheduleRepository;
import com.agriverse.auth.repository.UserRepository;
import com.agriverse.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * 农户融资控制器
 */
@Slf4j
@RestController
@RequestMapping("/farmer/finance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('FARMER')")
@Tag(name = "农户融资管理", description = "农户融资申请、还款、合同等管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class FarmerFinanceController {
    private final FinancingApplicationService applicationService;
    private final RepaymentService repaymentService;
    private final ContractService contractService;
    private final JointLoanService jointLoanService;
    private final FinancingStatisticsService statisticsService;
    private final FinancingTimelineRepository timelineRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    
    /**
     * 提交融资申请
     */
    @Operation(summary = "提交融资申请", description = "农户提交融资申请，系统会自动检查金额是否低于最低额度，如果低于则引导进入智能拼单流程")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "申请提交成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "2001", description = "金额低于最低额度，建议使用智能拼单"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "参数错误"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<FinancingApplication>> apply(
            @Parameter(description = "融资申请请求", required = true)
            @Valid @RequestBody FinancingApplicationRequest request,
            @Parameter(description = "当前用户", hidden = true)
            Principal principal) {
        try {
            String farmerId = principal.getName();
            log.info("提交融资申请: farmerId={}, amount={}", farmerId, request.getAmount());
            
            FinancingApplication application = applicationService.createApplication(request, farmerId);
            return ResponseEntity.ok(ApiResponse.success("申请提交成功", application));
        } catch (BusinessException e) {
            if ("APPLY_JOINT_LOAN".equals(e.getCode())) {
                return ResponseEntity.status(HttpStatus.OK)
                    .body(ApiResponse.error(2001, e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("提交融资申请异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "申请提交失败，请稍后重试"));
        }
    }
    
    /**
     * 获取我的融资申请列表
     */
    @Operation(summary = "获取我的融资申请列表", description = "获取当前农户的所有融资申请，可按状态筛选")
    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<FinancingApplication>>> getMyApplications(
            @Parameter(description = "申请状态筛选（可选）：APPLIED, REVIEWING, APPROVED, REJECTED, SIGNED, DISBURSED, REPAYING, SETTLED")
            @RequestParam(required = false) String status,
            Principal principal) {
        try {
            String farmerId = principal.getName();
            List<FinancingApplication> applications = applicationService.getFarmerApplications(farmerId, status);
            return ResponseEntity.ok(ApiResponse.success("获取成功", applications));
        } catch (Exception e) {
            log.error("获取融资申请列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取列表失败，请稍后重试"));
        }
    }
    
    /**
     * 获取融资申请详情
     */
    @GetMapping("/applications/{id}")
    public ResponseEntity<ApiResponse<FinancingApplicationDetailResponse>> getApplication(@PathVariable String id) {
        try {
            FinancingApplication application = applicationService.getApplicationById(id);
            
            // 构建详情响应
            FinancingApplicationDetailResponse response = FinancingApplicationDetailResponse.builder()
                .id(application.getId())
                .farmerId(application.getFarmerId())
                .productId(application.getProductId())
                .amount(application.getAmount())
                .termMonths(application.getTermMonths())
                .purpose(application.getPurpose())
                .status(application.getStatus() != null ? application.getStatus().name() : null)
                .interestRate(application.getInterestRate())
                .creditScore(application.getCreditScore())
                .reviewerId(application.getReviewerId())
                .reviewedAt(application.getReviewedAt())
                .reviewComment(application.getReviewComment())
                .contractId(application.getContractId())
                .signedAt(application.getSignedAt())
                .disbursedAt(application.getDisbursedAt())
                .disbursedAmount(application.getDisbursedAmount())
                .createdAt(application.getCreatedAt())
                .updatedAt(application.getUpdatedAt())
                .timeline(timelineRepository.findByFinancingIdOrderByCreatedAtAsc(application.getId()))
                .repaymentSchedules(scheduleRepository.findByFinancingIdOrderByInstallmentNumberAsc(application.getId()))
                .repaymentSummary(statisticsService.getRepaymentSummary(application.getId()))
                .build();
            
            // 获取农户信息
            User farmer = userRepository.findById(application.getFarmerId()).orElse(null);
            if (farmer != null) {
                response.setFarmerName(farmer.getName() != null ? farmer.getName() : farmer.getPhone());
            }
            
            return ResponseEntity.ok(ApiResponse.success("获取成功", response));
        } catch (Exception e) {
            log.error("获取融资申请详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取详情失败，请稍后重试"));
        }
    }
    
    /**
     * 还款
     */
    @PostMapping("/repay")
    public ResponseEntity<ApiResponse<RepaymentRecord>> repay(
            @Valid @RequestBody RepaymentRequest request) {
        try {
            RepaymentRecord record = repaymentService.repay(request);
            return ResponseEntity.ok(ApiResponse.success("还款成功", record));
        } catch (Exception e) {
            log.error("还款异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "还款失败，请稍后重试"));
        }
    }
    
    /**
     * 提前还款试算
     */
    @PostMapping("/early-repay/calculate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> calculateEarlyRepayment(
            @Valid @RequestBody EarlyRepaymentCalculateRequest request) {
        try {
            Map<String, Object> result = repaymentService.calculateEarlyRepayment(request);
            return ResponseEntity.ok(ApiResponse.success("计算成功", result));
        } catch (Exception e) {
            log.error("提前还款试算异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "计算失败，请稍后重试"));
        }
    }
    
    /**
     * 获取还款计划列表
     */
    @GetMapping("/applications/{id}/schedules")
    public ResponseEntity<ApiResponse<List<RepaymentSchedule>>> getRepaymentSchedules(
            @PathVariable String id) {
        try {
            List<RepaymentSchedule> schedules = repaymentService.getRepaymentSchedules(id);
            return ResponseEntity.ok(ApiResponse.success("获取成功", schedules));
        } catch (Exception e) {
            log.error("获取还款计划异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取还款记录列表
     */
    @GetMapping("/applications/{id}/records")
    public ResponseEntity<ApiResponse<List<RepaymentRecord>>> getRepaymentRecords(
            @PathVariable String id) {
        try {
            List<RepaymentRecord> records = repaymentService.getRepaymentRecords(id);
            return ResponseEntity.ok(ApiResponse.success("获取成功", records));
        } catch (Exception e) {
            log.error("获取还款记录异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 签署合同
     */
    @PostMapping("/contracts/{contractId}/sign")
    public ResponseEntity<ApiResponse<Contract>> signContract(
            @PathVariable String contractId,
            @RequestParam String signatureUrl,
            Principal principal) {
        try {
            Contract contract = contractService.signContractByFarmer(contractId, signatureUrl);
            return ResponseEntity.ok(ApiResponse.success("签署成功", contract));
        } catch (Exception e) {
            log.error("签署合同异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "签署失败，请稍后重试"));
        }
    }
    
    /**
     * 创建拼单组
     */
    @PostMapping("/joint-loan/create")
    public ResponseEntity<ApiResponse<JointLoanGroup>> createJointLoanGroup(
            @RequestParam BigDecimal amount,
            Principal principal) {
        try {
            String farmerId = principal.getName();
            JointLoanGroup group = jointLoanService.createGroup(amount, farmerId);
            return ResponseEntity.ok(ApiResponse.success("拼单组创建成功", group));
        } catch (Exception e) {
            log.error("创建拼单组异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "创建失败，请稍后重试"));
        }
    }
    
    /**
     * 加入拼单组
     */
    @PostMapping("/joint-loan/{groupId}/join")
    public ResponseEntity<ApiResponse<JointLoanMember>> joinGroup(
            @PathVariable String groupId,
            @RequestParam BigDecimal amount,
            @RequestParam String purpose,
            Principal principal) {
        try {
            String farmerId = principal.getName();
            JointLoanMember member = jointLoanService.joinGroup(groupId, farmerId, amount, purpose);
            return ResponseEntity.ok(ApiResponse.success("加入成功", member));
        } catch (Exception e) {
            log.error("加入拼单组异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "加入失败，请稍后重试"));
        }
    }
    
    /**
     * 确认拼单并提交申请
     */
    @PostMapping("/joint-loan/{groupId}/confirm")
    public ResponseEntity<ApiResponse<List<FinancingApplication>>> confirmJointLoan(
            @PathVariable String groupId) {
        try {
            List<FinancingApplication> applications = jointLoanService.confirmAndApply(groupId);
            return ResponseEntity.ok(ApiResponse.success("拼单确认成功", applications));
        } catch (Exception e) {
            log.error("确认拼单异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "确认失败，请稍后重试"));
        }
    }
    
    /**
     * 获取拼单组详情
     */
    @GetMapping("/joint-loan/{groupId}")
    public ResponseEntity<ApiResponse<JointLoanGroup>> getJointLoanGroup(@PathVariable String groupId) {
        try {
            JointLoanGroup group = jointLoanService.getGroupById(groupId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", group));
        } catch (Exception e) {
            log.error("获取拼单组详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取匹配候选（可加入的拼单组列表）
     */
    @Operation(summary = "获取匹配候选", description = "根据金额获取可加入的拼单组列表")
    @GetMapping("/joint-loan/candidates")
    public ResponseEntity<ApiResponse<List<JointLoanGroup>>> getMatchCandidates(
            @Parameter(description = "申请金额") @RequestParam(required = false) BigDecimal amount,
            Principal principal) {
        try {
            String farmerId = principal.getName();
            List<JointLoanGroup> candidates = jointLoanService.getMatchCandidates(amount, farmerId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", candidates));
        } catch (Exception e) {
            log.error("获取匹配候选异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 退出拼单组
     */
    @Operation(summary = "退出拼单组", description = "农户退出已加入的拼单组")
    @PostMapping("/joint-loan/{groupId}/quit")
    public ResponseEntity<ApiResponse<Object>> quitGroup(
            @Parameter(description = "拼单组ID") @PathVariable String groupId,
            Principal principal) {
        try {
            String farmerId = principal.getName();
            jointLoanService.quitGroup(groupId, farmerId);
            return ResponseEntity.ok(ApiResponse.success("退出成功", null));
        } catch (Exception e) {
            log.error("退出拼单组异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "退出失败，请稍后重试"));
        }
    }
    
    /**
     * 获取融资统计
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatistics(Principal principal) {
        try {
            String farmerId = principal.getName();
            Map<String, Object> statistics = statisticsService.getFarmerStatistics(farmerId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取融资统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取还款汇总
     */
    @GetMapping("/applications/{id}/repayment-summary")
    public ResponseEntity<ApiResponse<RepaymentSummaryResponse>> getRepaymentSummary(
            @PathVariable String id) {
        try {
            RepaymentSummaryResponse summary = statisticsService.getRepaymentSummary(id);
            return ResponseEntity.ok(ApiResponse.success("获取成功", summary));
        } catch (Exception e) {
            log.error("获取还款汇总异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 健康检查
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Object>> health() {
        return ResponseEntity.ok(ApiResponse.success("OK", null));
    }
}

