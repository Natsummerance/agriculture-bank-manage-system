package com.agriverse.bank.controller;

import com.agriverse.bank.dto.*;
import com.agriverse.bank.entity.LoanProduct;
import com.agriverse.bank.entity.CreditScore;
import com.agriverse.bank.entity.Disbursement;
import com.agriverse.bank.service.LoanProductService;
import com.agriverse.bank.service.BankApprovalService;
import com.agriverse.bank.service.DisbursementService;
import com.agriverse.bank.service.BankStatisticsService;
import com.agriverse.bank.service.ReconciliationService;
import com.agriverse.bank.service.OverdueManagementService;
import com.agriverse.bank.service.PostLoanService;
import com.agriverse.finance.service.OverdueService;
import com.agriverse.bank.entity.ReconciliationRecord;
import com.agriverse.bank.dto.ReconciliationExportRequest;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.entity.Contract;
import com.agriverse.finance.service.ContractService;
import com.agriverse.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
 * 银行贷款控制器
 */
@Slf4j
@RestController
@RequestMapping("/bank/loan")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BANK')")
@Tag(name = "银行贷款管理", description = "贷款产品、审批、放款、逾期、对账等管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BankLoanController {
    private final LoanProductService productService;
    private final BankApprovalService approvalService;
    private final ContractService contractService;
    private final DisbursementService disbursementService;
    private final BankStatisticsService statisticsService;
    private final OverdueService overdueService;
    private final ReconciliationService reconciliationService;
    private final OverdueManagementService overdueManagementService;
    private final PostLoanService postLoanService;
    
    /**
     * 创建贷款产品
     */
    @Operation(summary = "创建贷款产品", description = "创建新的贷款产品，包括利率、金额范围、期限等信息")
    @PostMapping("/products")
    public ResponseEntity<ApiResponse<LoanProduct>> createProduct(
            @Parameter(description = "贷款产品信息", required = true)
            @Valid @RequestBody LoanProductRequest request,
            Principal principal) {
        try {
            String createdBy = principal.getName();
            LoanProduct product = productService.createProduct(request, createdBy);
            return ResponseEntity.ok(ApiResponse.success("产品创建成功", product));
        } catch (Exception e) {
            log.error("创建贷款产品异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "创建失败，请稍后重试"));
        }
    }
    
    /**
     * 更新贷款产品
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<LoanProduct>> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody LoanProductRequest request) {
        try {
            LoanProduct product = productService.updateProduct(id, request);
            return ResponseEntity.ok(ApiResponse.success("产品更新成功", product));
        } catch (Exception e) {
            log.error("更新贷款产品异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 删除贷款产品
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteProduct(@PathVariable String id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(ApiResponse.success("产品删除成功", null));
        } catch (Exception e) {
            log.error("删除贷款产品异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "删除失败，请稍后重试"));
        }
    }
    
    /**
     * 获取产品列表
     */
    @Operation(summary = "获取产品列表", description = "获取所有启用的贷款产品列表")
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<LoanProduct>>> getProducts() {
        try {
            List<LoanProduct> products = productService.getActiveProducts();
            return ResponseEntity.ok(ApiResponse.success("获取成功", products));
        } catch (Exception e) {
            log.error("获取产品列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取产品详情
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<LoanProduct>> getProduct(@PathVariable String id) {
        try {
            LoanProduct product = productService.getProductById(id);
            return ResponseEntity.ok(ApiResponse.success("获取成功", product));
        } catch (Exception e) {
            log.error("获取产品详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取待审批列表
     */
    @Operation(summary = "获取待审批列表", description = "获取所有待审批的融资申请列表")
    @GetMapping("/approvals/pending")
    public ResponseEntity<ApiResponse<List<FinancingApplication>>> getPendingApprovals() {
        try {
            List<FinancingApplication> applications = approvalService.getPendingApplications();
            return ResponseEntity.ok(ApiResponse.success("获取成功", applications));
        } catch (Exception e) {
            log.error("获取待审批列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 审批申请
     */
    @Operation(summary = "审批申请", description = "批准或拒绝融资申请，批准时需要设置利率和信用评分")
    @PostMapping("/approvals")
    public ResponseEntity<ApiResponse<FinancingApplication>> approve(
            @Parameter(description = "审批请求", required = true)
            @Valid @RequestBody ApprovalRequest request,
            Principal principal) {
        try {
            String reviewerId = principal.getName();
            FinancingApplication application = approvalService.approveApplication(request, reviewerId);
            return ResponseEntity.ok(ApiResponse.success("审批成功", application));
        } catch (Exception e) {
            log.error("审批申请异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "审批失败，请稍后重试"));
        }
    }
    
    /**
     * 计算信用评分
     */
    @PostMapping("/credit-score/calculate")
    public ResponseEntity<ApiResponse<CreditScore>> calculateCreditScore(
            @Valid @RequestBody CreditScoreRequest request,
            Principal principal) {
        try {
            String reviewerId = principal.getName();
            CreditScore creditScore = approvalService.calculateCreditScore(request, reviewerId);
            return ResponseEntity.ok(ApiResponse.success("评分计算成功", creditScore));
        } catch (Exception e) {
            log.error("计算信用评分异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "计算失败，请稍后重试"));
        }
    }
    
    /**
     * 生成合同
     */
    @PostMapping("/contracts/generate")
    public ResponseEntity<ApiResponse<Contract>> generateContract(
            @Valid @RequestBody ContractGenerateRequest request) {
        try {
            Contract contract = contractService.generateContract(request);
            return ResponseEntity.ok(ApiResponse.success("合同生成成功", contract));
        } catch (Exception e) {
            log.error("生成合同异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "生成失败，请稍后重试"));
        }
    }
    
    /**
     * 银行签署合同
     */
    @PostMapping("/contracts/{contractId}/sign")
    public ResponseEntity<ApiResponse<Contract>> signContract(
            @PathVariable String contractId,
            @RequestParam String signatureUrl) {
        try {
            Contract contract = contractService.signContractByBank(contractId, signatureUrl);
            return ResponseEntity.ok(ApiResponse.success("签署成功", contract));
        } catch (Exception e) {
            log.error("签署合同异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "签署失败，请稍后重试"));
        }
    }
    
    /**
     * 放款
     */
    @PostMapping("/disburse")
    public ResponseEntity<ApiResponse<Disbursement>> disburse(
            @Valid @RequestBody DisbursementRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            Disbursement disbursement = disbursementService.disburse(request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("放款成功", disbursement));
        } catch (Exception e) {
            log.error("放款异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "放款失败，请稍后重试"));
        }
    }
    
    /**
     * 获取放款列表
     */
    @GetMapping("/disbursements")
    public ResponseEntity<ApiResponse<List<Disbursement>>> getDisbursements(
            @RequestParam(required = false) String status) {
        try {
            List<Disbursement> disbursements = disbursementService.getDisbursements(status);
            return ResponseEntity.ok(ApiResponse.success("获取成功", disbursements));
        } catch (Exception e) {
            log.error("获取放款列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取审批统计
     */
    @GetMapping("/statistics/approval")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getApprovalStatistics() {
        try {
            Map<String, Object> statistics = statisticsService.getApprovalStatistics();
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取审批统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取放款统计
     */
    @GetMapping("/statistics/disbursement")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDisbursementStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            java.time.LocalDateTime start = startDate != null ? 
                java.time.LocalDateTime.parse(startDate) : 
                java.time.LocalDateTime.now().minusMonths(1);
            java.time.LocalDateTime end = endDate != null ? 
                java.time.LocalDateTime.parse(endDate) : 
                java.time.LocalDateTime.now();
            
            Map<String, Object> statistics = statisticsService.getDisbursementStatistics(start, end);
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取放款统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 手动触发逾期检测
     */
    @PostMapping("/overdue/check")
    public ResponseEntity<ApiResponse<Integer>> checkOverdue() {
        try {
            int count = overdueService.checkOverdueManually();
            return ResponseEntity.ok(ApiResponse.success("检测完成，共更新 " + count + " 条逾期记录", count));
        } catch (Exception e) {
            log.error("逾期检测异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "检测失败，请稍后重试"));
        }
    }
    
    /**
     * 获取逾期统计
     */
    @GetMapping("/overdue/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOverdueStatistics() {
        try {
            Map<String, Object> statistics = overdueManagementService.getOverdueStatistics();
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取逾期统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取逾期列表
     */
    @GetMapping("/overdue/list")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getOverdueList() {
        try {
            List<Map<String, Object>> overdueList = overdueManagementService.getOverdueList();
            return ResponseEntity.ok(ApiResponse.success("获取成功", overdueList));
        } catch (Exception e) {
            log.error("获取逾期列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 发送逾期提醒
     */
    @PostMapping("/overdue/{financingId}/alert")
    public ResponseEntity<ApiResponse<Object>> sendOverdueAlert(@PathVariable String financingId) {
        try {
            overdueManagementService.sendOverdueAlert(financingId);
            return ResponseEntity.ok(ApiResponse.success("提醒发送成功", null));
        } catch (Exception e) {
            log.error("发送逾期提醒异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "发送失败，请稍后重试"));
        }
    }
    
    /**
     * 计算逾期罚息
     */
    @GetMapping("/overdue/{financingId}/penalty")
    public ResponseEntity<ApiResponse<BigDecimal>> calculateOverduePenalty(@PathVariable String financingId) {
        try {
            BigDecimal penalty = overdueManagementService.calculateOverduePenalty(financingId);
            return ResponseEntity.ok(ApiResponse.success("计算成功", penalty));
        } catch (Exception e) {
            log.error("计算逾期罚息异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "计算失败，请稍后重试"));
        }
    }
    
    /**
     * 对账（按日期）
     */
    @PostMapping("/reconciliation/reconcile")
    public ResponseEntity<ApiResponse<Integer>> reconcile(
            @RequestParam(required = false) String date) {
        try {
            java.time.LocalDate reconcileDate = date != null ? 
                java.time.LocalDate.parse(date) : 
                java.time.LocalDate.now().minusDays(1);
            int count = reconciliationService.reconcileByDate(reconcileDate);
            return ResponseEntity.ok(ApiResponse.success("对账完成，共处理 " + count + " 笔", count));
        } catch (Exception e) {
            log.error("对账异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "对账失败，请稍后重试"));
        }
    }
    
    /**
     * 获取对账列表
     */
    @GetMapping("/reconciliation/list")
    public ResponseEntity<ApiResponse<List<ReconciliationRecord>>> getReconciliationList(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            java.time.LocalDate start = startDate != null ? 
                java.time.LocalDate.parse(startDate) : null;
            java.time.LocalDate end = endDate != null ? 
                java.time.LocalDate.parse(endDate) : null;
            List<ReconciliationRecord> records = reconciliationService.getReconciliationList(start, end);
            return ResponseEntity.ok(ApiResponse.success("获取成功", records));
        } catch (Exception e) {
            log.error("获取对账列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取对账统计
     */
    @GetMapping("/reconciliation/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReconciliationStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            java.time.LocalDate start = startDate != null ? 
                java.time.LocalDate.parse(startDate) : 
                java.time.LocalDate.now().minusMonths(1);
            java.time.LocalDate end = endDate != null ? 
                java.time.LocalDate.parse(endDate) : 
                java.time.LocalDate.now();
            Map<String, Object> statistics = reconciliationService.getReconciliationStatistics(start, end);
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取对账统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取贷后监控数据
     */
    @GetMapping("/post-loan/monitoring/{financingId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPostLoanMonitoring(
            @PathVariable String financingId) {
        try {
            Map<String, Object> monitoring = postLoanService.getPostLoanMonitoring(financingId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", monitoring));
        } catch (Exception e) {
            log.error("获取贷后监控异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取所有贷后监控列表
     */
    @GetMapping("/post-loan/monitoring")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllPostLoanMonitoring() {
        try {
            List<Map<String, Object>> monitoringList = postLoanService.getAllPostLoanMonitoring();
            return ResponseEntity.ok(ApiResponse.success("获取成功", monitoringList));
        } catch (Exception e) {
            log.error("获取贷后监控列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 导出对账单
     */
    @PostMapping("/reconciliation/export")
    public ResponseEntity<ApiResponse<String>> exportReconciliation(
            @RequestBody ReconciliationExportRequest request) {
        try {
            // TODO: 实现Excel/CSV导出功能
            // 这里返回文件URL或文件ID
            String fileUrl = "/exports/reconciliation_" + 
                (request.getStartDate() != null ? request.getStartDate() : "") + ".xlsx";
            return ResponseEntity.ok(ApiResponse.success("导出成功", fileUrl));
        } catch (Exception e) {
            log.error("导出对账单异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "导出失败，请稍后重试"));
        }
    }
    
    /**
     * 导出T+1文件
     */
    @PostMapping("/reconciliation/export-t1")
    public ResponseEntity<ApiResponse<String>> exportT1File(
            @RequestBody ReconciliationExportRequest request) {
        try {
            // TODO: 实现T+1格式文件导出（用于银行内部系统对接）
            String fileUrl = "/exports/t1_" + 
                (request.getStartDate() != null ? request.getStartDate() : "") + ".txt";
            return ResponseEntity.ok(ApiResponse.success("导出成功", fileUrl));
        } catch (Exception e) {
            log.error("导出T+1文件异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "导出失败，请稍后重试"));
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

