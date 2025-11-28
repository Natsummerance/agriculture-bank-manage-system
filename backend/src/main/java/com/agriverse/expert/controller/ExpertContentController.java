package com.agriverse.expert.controller;

import com.agriverse.dto.ApiResponse;
import com.agriverse.expert.dto.ContentPublishRequest;
import com.agriverse.expert.entity.ExpertContent;
import com.agriverse.expert.service.ExpertContentService;
import io.swagger.v3.oas.annotations.Operation;
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

@RestController
@RequestMapping("/api/expert/contents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('EXPERT')")
@Tag(name = "专家内容管理", description = "内容发布和管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ExpertContentController {
    private final ExpertContentService contentService;
    
    /**
     * 发布内容
     */
    @Operation(summary = "发布内容", description = "发布文章、视频等内容")
    @PostMapping
    public ResponseEntity<ApiResponse<ExpertContent>> publishContent(
            @Valid @RequestBody ContentPublishRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertContent content = contentService.publishContent(request, expertId);
            return ResponseEntity.ok(ApiResponse.success("发布成功", content));
        } catch (Exception e) {
            log.error("发布内容异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "发布失败，请稍后重试"));
        }
    }
    
    /**
     * 更新内容
     */
    @Operation(summary = "更新内容", description = "更新已发布的内容")
    @PutMapping("/{contentId}")
    public ResponseEntity<ApiResponse<ExpertContent>> updateContent(
            @PathVariable String contentId,
            @Valid @RequestBody ContentPublishRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertContent content = contentService.updateContent(contentId, request, expertId);
            return ResponseEntity.ok(ApiResponse.success("更新成功", content));
        } catch (Exception e) {
            log.error("更新内容异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 获取内容列表
     */
    @Operation(summary = "获取内容列表", description = "获取专家发布的内容列表")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ExpertContent>>> getContents(
            @RequestParam(required = false) String contentType,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        try {
            String expertId = principal.getName();
            Page<ExpertContent> contents = contentService.getContents(
                expertId, contentType, status, page, size);
            return ResponseEntity.ok(ApiResponse.success("获取成功", contents));
        } catch (Exception e) {
            log.error("获取内容列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取内容详情
     */
    @Operation(summary = "获取内容详情", description = "获取内容的详细信息")
    @GetMapping("/{contentId}")
    public ResponseEntity<ApiResponse<ExpertContent>> getContentDetail(
            @PathVariable String contentId) {
        try {
            ExpertContent content = contentService.getContentDetail(contentId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", content));
        } catch (Exception e) {
            log.error("获取内容详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 删除内容
     */
    @Operation(summary = "删除内容", description = "删除指定的内容")
    @DeleteMapping("/{contentId}")
    public ResponseEntity<ApiResponse<Object>> deleteContent(
            @PathVariable String contentId,
            Principal principal) {
        try {
            String expertId = principal.getName();
            contentService.deleteContent(contentId, expertId);
            return ResponseEntity.ok(ApiResponse.success("删除成功", null));
        } catch (Exception e) {
            log.error("删除内容异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "删除失败，请稍后重试"));
        }
    }
    
    /**
     * 更新内容状态
     */
    @Operation(summary = "更新内容状态", description = "更新内容的发布状态")
    @PutMapping("/{contentId}/status")
    public ResponseEntity<ApiResponse<ExpertContent>> updateContentStatus(
            @PathVariable String contentId,
            @RequestParam String status,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertContent content = contentService.updateContentStatus(contentId, status, expertId);
            return ResponseEntity.ok(ApiResponse.success("更新成功", content));
        } catch (Exception e) {
            log.error("更新内容状态异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
}



