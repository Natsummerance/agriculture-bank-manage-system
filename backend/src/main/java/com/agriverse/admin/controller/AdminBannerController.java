package com.agriverse.admin.controller;

import com.agriverse.admin.dto.BannerRequest;
import com.agriverse.admin.entity.AdminBanner;
import com.agriverse.admin.service.AdminBannerService;
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
@RequestMapping("/admin/banners")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "轮播图管理", description = "轮播图创建、编辑、删除管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminBannerController {
    private final AdminBannerService bannerService;
    
    /**
     * 创建轮播图
     */
    @Operation(summary = "创建轮播图", description = "创建新的轮播图")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "创建成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<AdminBanner>> createBanner(
            @Valid @RequestBody BannerRequest request,
            Principal principal) {
        try {
            String createdBy = principal.getName();
            AdminBanner banner = bannerService.createBanner(request, createdBy);
            return ResponseEntity.ok(ApiResponse.success("创建成功", banner));
        } catch (Exception e) {
            log.error("创建轮播图异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "创建失败，请稍后重试"));
        }
    }
    
    /**
     * 更新轮播图
     */
    @Operation(summary = "更新轮播图", description = "更新轮播图信息")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "更新成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PutMapping("/{bannerId}")
    public ResponseEntity<ApiResponse<AdminBanner>> updateBanner(
            @PathVariable String bannerId,
            @Valid @RequestBody BannerRequest request,
            Principal principal) {
        try {
            String updatedBy = principal.getName();
            AdminBanner banner = bannerService.updateBanner(bannerId, request, updatedBy);
            return ResponseEntity.ok(ApiResponse.success("更新成功", banner));
        } catch (Exception e) {
            log.error("更新轮播图异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 删除轮播图
     */
    @Operation(summary = "删除轮播图", description = "删除指定的轮播图")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "删除成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @DeleteMapping("/{bannerId}")
    public ResponseEntity<ApiResponse<Object>> deleteBanner(
            @PathVariable String bannerId,
            Principal principal) {
        try {
            String operatorId = principal.getName();
            bannerService.deleteBanner(bannerId, operatorId);
            return ResponseEntity.ok(ApiResponse.success("删除成功", null));
        } catch (Exception e) {
            log.error("删除轮播图异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "删除失败，请稍后重试"));
        }
    }
    
    /**
     * 获取轮播图列表
     */
    @Operation(summary = "获取轮播图列表", description = "获取所有轮播图")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminBanner>>> getBanners(
            @RequestParam(required = false) Boolean enabled) {
        try {
            List<AdminBanner> banners = bannerService.getBanners(enabled);
            return ResponseEntity.ok(ApiResponse.success("获取成功", banners));
        } catch (Exception e) {
            log.error("获取轮播图列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}



