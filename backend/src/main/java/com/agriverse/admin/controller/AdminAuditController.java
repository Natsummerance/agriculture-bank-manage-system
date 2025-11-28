package com.agriverse.admin.controller;

import com.agriverse.admin.dto.ContentAuditRequest;
import com.agriverse.admin.dto.ExpertAuditRequest;
import com.agriverse.admin.dto.ProductAuditRequest;
import com.agriverse.admin.entity.AdminContentAudit;
import com.agriverse.admin.entity.AdminExpertAudit;
import com.agriverse.admin.entity.AdminProductAudit;
import com.agriverse.admin.service.AdminAuditService;
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
@RequestMapping("/admin/audit")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "审核管理", description = "商品、内容、专家审核接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminAuditController {
    private final AdminAuditService auditService;
    
    /**
     * 审核商品
     */
    @Operation(summary = "审核商品", description = "审核商品，批准或拒绝")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "审核成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/product")
    public ResponseEntity<ApiResponse<AdminProductAudit>> auditProduct(
            @Valid @RequestBody ProductAuditRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            AdminProductAudit audit = auditService.auditProduct(request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("审核成功", audit));
        } catch (Exception e) {
            log.error("审核商品异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "审核失败，请稍后重试"));
        }
    }
    
    /**
     * 审核内容
     */
    @Operation(summary = "审核内容", description = "审核内容，批准或拒绝")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "审核成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/content")
    public ResponseEntity<ApiResponse<AdminContentAudit>> auditContent(
            @Valid @RequestBody ContentAuditRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            AdminContentAudit audit = auditService.auditContent(request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("审核成功", audit));
        } catch (Exception e) {
            log.error("审核内容异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "审核失败，请稍后重试"));
        }
    }
    
    /**
     * 审核专家
     */
    @Operation(summary = "审核专家", description = "审核专家申请，批准或拒绝")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "审核成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/expert")
    public ResponseEntity<ApiResponse<AdminExpertAudit>> auditExpert(
            @Valid @RequestBody ExpertAuditRequest request,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            AdminExpertAudit audit = auditService.auditExpert(request, operatorId);
            return ResponseEntity.ok(ApiResponse.success("审核成功", audit));
        } catch (Exception e) {
            log.error("审核专家异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "审核失败，请稍后重试"));
        }
    }
    
    /**
     * 获取待审核商品列表
     */
    @Operation(summary = "获取待审核商品列表", description = "获取所有待审核的商品")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/products/pending")
    public ResponseEntity<ApiResponse<List<AdminProductAudit>>> getPendingProductAudits() {
        try {
            List<AdminProductAudit> audits = auditService.getPendingProductAudits();
            return ResponseEntity.ok(ApiResponse.success("获取成功", audits));
        } catch (Exception e) {
            log.error("获取待审核商品列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取待审核内容列表
     */
    @Operation(summary = "获取待审核内容列表", description = "获取所有待审核的内容")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/contents/pending")
    public ResponseEntity<ApiResponse<List<AdminContentAudit>>> getPendingContentAudits() {
        try {
            List<AdminContentAudit> audits = auditService.getPendingContentAudits();
            return ResponseEntity.ok(ApiResponse.success("获取成功", audits));
        } catch (Exception e) {
            log.error("获取待审核内容列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取待审核专家列表
     */
    @Operation(summary = "获取待审核专家列表", description = "获取所有待审核的专家申请")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/experts/pending")
    public ResponseEntity<ApiResponse<List<AdminExpertAudit>>> getPendingExpertAudits() {
        try {
            List<AdminExpertAudit> audits = auditService.getPendingExpertAudits();
            return ResponseEntity.ok(ApiResponse.success("获取成功", audits));
        } catch (Exception e) {
            log.error("获取待审核专家列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}



