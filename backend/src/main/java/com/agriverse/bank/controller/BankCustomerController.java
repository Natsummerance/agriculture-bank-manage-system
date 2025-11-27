package com.agriverse.bank.controller;

import com.agriverse.bank.dto.CustomerContactRequest;
import com.agriverse.bank.dto.CustomerDetailResponse;
import com.agriverse.bank.dto.CustomerSearchRequest;
import com.agriverse.bank.entity.BankCustomerRelation;
import com.agriverse.bank.entity.CustomerContactRecord;
import com.agriverse.bank.service.BankCustomerService;
import com.agriverse.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

/**
 * 银行客户管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/bank/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BANK')")
@Tag(name = "银行客户管理", description = "客户信息、联系记录、贷款历史管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BankCustomerController {
    private final BankCustomerService customerService;
    
    /**
     * 搜索客户
     */
    @Operation(summary = "搜索客户", description = "根据关键词、状态、地区等条件搜索客户")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "搜索成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<BankCustomerRelation>>> searchCustomers(
            @Parameter(description = "搜索条件", required = true) @Valid @RequestBody CustomerSearchRequest request,
            Principal principal) {
        try {
            String bankId = principal.getName();
            Page<BankCustomerRelation> customers = customerService.searchCustomers(request, bankId);
            return ResponseEntity.ok(ApiResponse.success("搜索成功", customers));
        } catch (Exception e) {
            log.error("搜索客户异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "搜索失败，请稍后重试"));
        }
    }
    
    /**
     * 获取客户详情
     */
    @Operation(summary = "获取客户详情", description = "获取客户详细信息，包括贷款历史、信用评分、联系记录")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "客户不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/{relationId}")
    public ResponseEntity<ApiResponse<CustomerDetailResponse>> getCustomerDetail(
            @Parameter(description = "客户关系ID", required = true) @PathVariable String relationId) {
        try {
            CustomerDetailResponse detail = customerService.getCustomerDetail(relationId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", detail));
        } catch (Exception e) {
            log.error("获取客户详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 添加客户联系记录
     */
    @Operation(summary = "添加客户联系记录", description = "记录与客户的联系信息，包括电话、邮件、拜访等")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "添加成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "参数错误"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/contacts")
    public ResponseEntity<ApiResponse<CustomerContactRecord>> addContactRecord(
            @Parameter(description = "联系记录信息", required = true) @Valid @RequestBody CustomerContactRequest request,
            Principal principal) {
        try {
            String createdBy = principal.getName();
            CustomerContactRecord record = customerService.addContactRecord(request, createdBy);
            return ResponseEntity.ok(ApiResponse.success("添加成功", record));
        } catch (Exception e) {
            log.error("添加联系记录异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "添加失败，请稍后重试"));
        }
    }
    
    /**
     * 更新客户信息
     */
    @Operation(summary = "更新客户信息", description = "更新客户标签和备注信息")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "更新成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "客户不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PutMapping("/{relationId}")
    public ResponseEntity<ApiResponse<BankCustomerRelation>> updateCustomer(
            @Parameter(description = "客户关系ID", required = true) @PathVariable String relationId,
            @Parameter(description = "客户标签（JSON格式）") @RequestParam(required = false) String tags,
            @Parameter(description = "备注信息") @RequestParam(required = false) String notes) {
        try {
            BankCustomerRelation relation = customerService.updateCustomer(relationId, tags, notes);
            return ResponseEntity.ok(ApiResponse.success("更新成功", relation));
        } catch (Exception e) {
            log.error("更新客户信息异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 同步客户数据
     */
    @Operation(summary = "同步客户数据", description = "从融资申请中同步客户的最新数据")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "同步成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "客户不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/sync/{customerId}")
    public ResponseEntity<ApiResponse<Object>> syncCustomerData(
            @Parameter(description = "客户ID", required = true) @PathVariable String customerId,
            Principal principal) {
        try {
            String bankId = principal.getName();
            customerService.syncCustomerData(bankId, customerId);
            return ResponseEntity.ok(ApiResponse.success("同步成功", null));
        } catch (Exception e) {
            log.error("同步客户数据异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "同步失败，请稍后重试"));
        }
    }
}

