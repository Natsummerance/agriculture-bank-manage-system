package com.agriverse.buyer.controller;

import com.agriverse.dto.ApiResponse;
import com.agriverse.entity.BuyerAddress;
import com.agriverse.buyer.service.BuyerAddressService;
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

import java.security.Principal;
import java.util.List;

/**
 * 买家收货地址控制器
 */
@Slf4j
@RestController
@RequestMapping("/buyer/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BUYER')")
@Tag(name = "买家收货地址", description = "收货地址管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BuyerAddressController {
    private final BuyerAddressService addressService;
    
    /**
     * 获取收货地址列表
     */
    @Operation(summary = "获取收货地址列表", description = "获取当前买家的所有收货地址")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BuyerAddress>>> getAddresses(Principal principal) {
        try {
            String buyerId = principal.getName();
            List<BuyerAddress> addresses = addressService.getAddresses(buyerId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", addresses));
        } catch (Exception e) {
            log.error("获取收货地址列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 添加收货地址
     */
    @Operation(summary = "添加收货地址", description = "添加新的收货地址")
    @PostMapping
    public ResponseEntity<ApiResponse<BuyerAddress>> addAddress(
            @Valid @RequestBody BuyerAddress address,
            Principal principal) {
        try {
            String buyerId = principal.getName();
            BuyerAddress saved = addressService.addAddress(buyerId, address);
            return ResponseEntity.ok(ApiResponse.success("添加成功", saved));
        } catch (Exception e) {
            log.error("添加收货地址异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "添加失败，请稍后重试"));
        }
    }
    
    /**
     * 更新收货地址
     */
    @Operation(summary = "更新收货地址", description = "更新指定收货地址的信息")
    @PutMapping("/{addressId}")
    public ResponseEntity<ApiResponse<BuyerAddress>> updateAddress(
            @Parameter(description = "地址ID") @PathVariable String addressId,
            @Valid @RequestBody BuyerAddress address,
            Principal principal) {
        try {
            String buyerId = principal.getName();
            BuyerAddress updated = addressService.updateAddress(buyerId, addressId, address);
            return ResponseEntity.ok(ApiResponse.success("更新成功", updated));
        } catch (RuntimeException e) {
            log.error("更新收货地址失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("更新收货地址异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 删除收货地址
     */
    @Operation(summary = "删除收货地址", description = "删除指定收货地址")
    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse<Object>> deleteAddress(
            @Parameter(description = "地址ID") @PathVariable String addressId,
            Principal principal) {
        try {
            String buyerId = principal.getName();
            addressService.deleteAddress(buyerId, addressId);
            return ResponseEntity.ok(ApiResponse.success("删除成功", null));
        } catch (RuntimeException e) {
            log.error("删除收货地址失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("删除收货地址异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "删除失败，请稍后重试"));
        }
    }
    
    /**
     * 设置默认地址
     */
    @Operation(summary = "设置默认地址", description = "设置指定地址为默认收货地址")
    @PutMapping("/{addressId}/default")
    public ResponseEntity<ApiResponse<BuyerAddress>> setDefaultAddress(
            @Parameter(description = "地址ID") @PathVariable String addressId,
            Principal principal) {
        try {
            String buyerId = principal.getName();
            BuyerAddress address = addressService.setDefaultAddress(buyerId, addressId);
            return ResponseEntity.ok(ApiResponse.success("设置成功", address));
        } catch (RuntimeException e) {
            log.error("设置默认地址失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("设置默认地址异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "设置失败，请稍后重试"));
        }
    }
}

