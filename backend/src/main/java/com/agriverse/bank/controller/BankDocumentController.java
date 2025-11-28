package com.agriverse.bank.controller;

import com.agriverse.bank.dto.DocumentUploadRequest;
import com.agriverse.bank.dto.DocumentVerifyRequest;
import com.agriverse.bank.entity.ApplicationDocument;
import com.agriverse.bank.service.ApplicationDocumentService;
import com.agriverse.dto.ApiResponse;
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

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * 申请资料管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/bank/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BANK')")
@Tag(name = "申请资料管理", description = "申请资料上传、审核、下载管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BankDocumentController {
    private final ApplicationDocumentService documentService;
    
    /**
     * 上传申请资料
     */
    @Operation(summary = "上传申请资料", description = "上传融资申请的相关资料文件")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "上传成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "参数错误"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "融资申请不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ApplicationDocument>> uploadDocument(
            @Parameter(description = "资料上传信息", required = true) @Valid @RequestBody DocumentUploadRequest request,
            Principal principal) {
        try {
            String uploadedBy = principal.getName();
            ApplicationDocument document = documentService.uploadDocument(request, uploadedBy);
            return ResponseEntity.ok(ApiResponse.success("上传成功", document));
        } catch (Exception e) {
            log.error("上传资料异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "上传失败，请稍后重试"));
        }
    }
    
    /**
     * 审核资料
     */
    @Operation(summary = "审核资料", description = "审核申请资料，批准或拒绝")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "审核成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "参数错误"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "资料不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<ApplicationDocument>> verifyDocument(
            @Parameter(description = "审核信息", required = true) @Valid @RequestBody DocumentVerifyRequest request,
            Principal principal) {
        try {
            String verifiedBy = principal.getName();
            ApplicationDocument document = documentService.verifyDocument(request, verifiedBy);
            return ResponseEntity.ok(ApiResponse.success("审核成功", document));
        } catch (Exception e) {
            log.error("审核资料异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "审核失败，请稍后重试"));
        }
    }
    
    /**
     * 获取申请的所有资料
     */
    @Operation(summary = "获取申请资料列表", description = "获取指定融资申请的所有资料")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/financing/{financingId}")
    public ResponseEntity<ApiResponse<List<ApplicationDocument>>> getDocuments(
            @Parameter(description = "融资申请ID", required = true) @PathVariable String financingId) {
        try {
            List<ApplicationDocument> documents = documentService.getDocumentsByFinancingId(financingId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", documents));
        } catch (Exception e) {
            log.error("获取资料列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 打包下载所有资料
     */
    @Operation(summary = "打包下载资料", description = "将申请的所有资料打包成ZIP文件下载")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "打包成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "融资申请不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/download-all/{financingId}")
    public ResponseEntity<ApiResponse<String>> downloadAllDocuments(
            @Parameter(description = "融资申请ID", required = true) @PathVariable String financingId) {
        try {
            String downloadUrl = documentService.downloadAllDocuments(financingId);
            return ResponseEntity.ok(ApiResponse.success("打包成功", downloadUrl));
        } catch (Exception e) {
            log.error("打包下载异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "打包失败，请稍后重试"));
        }
    }
    
    /**
     * 获取资料统计
     */
    @Operation(summary = "获取资料统计", description = "获取申请资料的统计信息")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/statistics/{financingId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDocumentStatistics(
            @Parameter(description = "融资申请ID", required = true) @PathVariable String financingId) {
        try {
            Map<String, Object> statistics = documentService.getDocumentStatistics(financingId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", statistics));
        } catch (Exception e) {
            log.error("获取资料统计异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}

