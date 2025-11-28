package com.agriverse.expert.controller;

import com.agriverse.dto.ApiResponse;
import com.agriverse.expert.dto.ServicePriceUpdateRequest;
import com.agriverse.expert.entity.ExpertProfile;
import com.agriverse.expert.entity.FarmerReview;
import com.agriverse.expert.service.ExpertProfileService;
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
@RequestMapping("/api/expert/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('EXPERT')")
@Tag(name = "专家资料管理", description = "专家信息和服务价格管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ExpertProfileController {
    private final ExpertProfileService profileService;
    
    /**
     * 获取专家资料
     */
    @Operation(summary = "获取专家资料", description = "获取专家详细信息")
    @GetMapping
    public ResponseEntity<ApiResponse<ExpertProfile>> getExpertProfile(Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertProfile profile = profileService.getExpertProfile(expertId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", profile));
        } catch (Exception e) {
            log.error("获取专家资料异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 更新服务价格
     */
    @Operation(summary = "更新服务价格", description = "更新预约咨询和问答价格")
    @PutMapping("/service-price")
    public ResponseEntity<ApiResponse<ExpertProfile>> updateServicePrice(
            @Valid @RequestBody ServicePriceUpdateRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertProfile profile = profileService.updateServicePrice(request, expertId);
            return ResponseEntity.ok(ApiResponse.success("更新成功", profile));
        } catch (Exception e) {
            log.error("更新服务价格异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 获取农户评价
     */
    @Operation(summary = "获取农户评价", description = "获取农户对专家的评价列表")
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<Page<FarmerReview>>> getFarmerReviews(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        try {
            String expertId = principal.getName();
            Page<FarmerReview> reviews = profileService.getFarmerReviews(expertId, page, size);
            return ResponseEntity.ok(ApiResponse.success("获取成功", reviews));
        } catch (Exception e) {
            log.error("获取农户评价异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
}



