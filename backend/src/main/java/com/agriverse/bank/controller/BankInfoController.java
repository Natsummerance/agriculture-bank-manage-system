package com.agriverse.bank.controller;

import com.agriverse.bank.dto.BankAccountRequest;
import com.agriverse.bank.dto.BankInfoRequest;
import com.agriverse.bank.entity.BankAccount;
import com.agriverse.bank.entity.BankInfo;
import com.agriverse.bank.entity.BankSystemConfig;
import com.agriverse.bank.service.BankInfoService;
import com.agriverse.bank.service.BankSystemConfigService;
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

/**
 * 银行信息管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/bank/info")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BANK')")
@Tag(name = "银行信息管理", description = "银行基本信息、账户管理、系统配置接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BankInfoController {
    private final BankInfoService bankInfoService;
    private final BankSystemConfigService configService;
    
    /**
     * 获取银行信息
     */
    @Operation(summary = "获取银行信息", description = "获取当前银行的基本信息")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "银行信息不存在"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<BankInfo>> getBankInfo(Principal principal) {
        try {
            String bankId = principal.getName();
            BankInfo bankInfo = bankInfoService.getBankInfo(bankId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", bankInfo));
        } catch (Exception e) {
            log.error("获取银行信息异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 更新银行信息
     */
    @Operation(summary = "更新银行信息", description = "更新银行的基本信息")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "更新成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "参数错误"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PutMapping
    public ResponseEntity<ApiResponse<BankInfo>> updateBankInfo(
            @Parameter(description = "银行信息", required = true) @Valid @RequestBody BankInfoRequest request,
            Principal principal) {
        try {
            String bankId = principal.getName();
            BankInfo bankInfo = bankInfoService.saveBankInfo(request, bankId);
            return ResponseEntity.ok(ApiResponse.success("更新成功", bankInfo));
        } catch (Exception e) {
            log.error("更新银行信息异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 获取银行账户列表
     */
    @Operation(summary = "获取银行账户列表", description = "获取银行的所有账户")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/accounts")
    public ResponseEntity<ApiResponse<List<BankAccount>>> getBankAccounts(Principal principal) {
        try {
            String bankId = principal.getName();
            List<BankAccount> accounts = bankInfoService.getBankAccounts(bankId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", accounts));
        } catch (Exception e) {
            log.error("获取账户列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 创建银行账户
     */
    @Operation(summary = "创建银行账户", description = "创建新的银行账户")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "创建成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "参数错误"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/accounts")
    public ResponseEntity<ApiResponse<BankAccount>> createAccount(
            @Parameter(description = "账户信息", required = true) @Valid @RequestBody BankAccountRequest request) {
        try {
            BankAccount account = bankInfoService.createAccount(request);
            return ResponseEntity.ok(ApiResponse.success("创建成功", account));
        } catch (Exception e) {
            log.error("创建账户异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "创建失败，请稍后重试"));
        }
    }
    
    /**
     * 获取系统配置
     */
    @Operation(summary = "获取系统配置", description = "根据分类获取系统配置")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping("/configs")
    public ResponseEntity<ApiResponse<List<BankSystemConfig>>> getConfigs(
            @Parameter(description = "配置分类（可选）") @RequestParam(required = false) String category) {
        try {
            List<BankSystemConfig> configs = category != null ?
                configService.getConfigsByCategory(category) :
                configService.getAllConfigs();
            return ResponseEntity.ok(ApiResponse.success("获取成功", configs));
        } catch (Exception e) {
            log.error("获取配置异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 设置系统配置
     */
    @Operation(summary = "设置系统配置", description = "设置或更新系统配置值")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "设置成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "参数错误"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping("/configs")
    public ResponseEntity<ApiResponse<BankSystemConfig>> setConfig(
            @Parameter(description = "配置键", required = true) @RequestParam String configKey,
            @Parameter(description = "配置值", required = true) @RequestParam String configValue,
            @Parameter(description = "配置描述") @RequestParam(required = false) String description,
            @Parameter(description = "配置分类") @RequestParam(required = false) String category,
            Principal principal) {
        try {
            String updatedBy = principal.getName();
            BankSystemConfig config = configService.setConfigValue(
                configKey, configValue, description, category, updatedBy);
            return ResponseEntity.ok(ApiResponse.success("设置成功", config));
        } catch (Exception e) {
            log.error("设置配置异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "设置失败，请稍后重试"));
        }
    }
}

