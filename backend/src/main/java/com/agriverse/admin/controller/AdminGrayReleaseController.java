package com.agriverse.admin.controller;

import com.agriverse.admin.dto.GrayReleaseRequest;
import com.agriverse.admin.entity.AdminGrayRelease;
import com.agriverse.admin.service.AdminGrayReleaseService;
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
@RequestMapping("/admin/gray-release")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "灰度发布", description = "灰度功能发布管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminGrayReleaseController {
    private final AdminGrayReleaseService grayReleaseService;
    
    /**
     * 创建灰度发布
     */
    @Operation(summary = "创建灰度发布", description = "创建新的灰度发布功能")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "创建成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<AdminGrayRelease>> createGrayRelease(
            @Valid @RequestBody GrayReleaseRequest request,
            Principal principal) {
        try {
            String createdBy = principal.getName();
            AdminGrayRelease grayRelease = grayReleaseService.createGrayRelease(request, createdBy);
            return ResponseEntity.ok(ApiResponse.success("创建成功", grayRelease));
        } catch (Exception e) {
            log.error("创建灰度发布异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "创建失败，请稍后重试"));
        }
    }
    
    /**
     * 更新灰度发布
     */
    @Operation(summary = "更新灰度发布", description = "更新灰度发布配置")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "更新成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @PutMapping("/{grayReleaseId}")
    public ResponseEntity<ApiResponse<AdminGrayRelease>> updateGrayRelease(
            @PathVariable String grayReleaseId,
            @Valid @RequestBody GrayReleaseRequest request,
            Principal principal) {
        try {
            String updatedBy = principal.getName();
            AdminGrayRelease grayRelease = grayReleaseService.updateGrayRelease(grayReleaseId, request, updatedBy);
            return ResponseEntity.ok(ApiResponse.success("更新成功", grayRelease));
        } catch (Exception e) {
            log.error("更新灰度发布异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 获取灰度发布列表
     */
    @Operation(summary = "获取灰度发布列表", description = "获取所有灰度发布功能")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "获取成功"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "服务器错误")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminGrayRelease>>> getGrayReleases(
            @RequestParam(required = false) Boolean enabled) {
        try {
            List<AdminGrayRelease> grayReleases = grayReleaseService.getGrayReleases(enabled);
            return ResponseEntity.ok(ApiResponse.success("获取成功", grayReleases));
        } catch (Exception e) {
            log.error("获取灰度发布列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}



