package com.agriverse.expert.controller;

import com.agriverse.dto.ApiResponse;
import com.agriverse.expert.dto.AppointmentStatusUpdateRequest;
import com.agriverse.expert.dto.AvailableSlotRequest;
import com.agriverse.expert.entity.ExpertAppointment;
import com.agriverse.expert.entity.ExpertAvailableSlot;
import com.agriverse.expert.service.ExpertAppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expert/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('EXPERT')")
@Tag(name = "专家预约管理", description = "预约时段和预约记录管理接口")
@SecurityRequirement(name = "Bearer Authentication")
@Slf4j
public class ExpertAppointmentController {
    private final ExpertAppointmentService appointmentService;
    
    /**
     * 添加可用时段
     */
    @Operation(summary = "添加可用时段", description = "设置可预约的时间段")
    @PostMapping("/slots")
    public ResponseEntity<ApiResponse<ExpertAvailableSlot>> addAvailableSlot(
            @Valid @RequestBody AvailableSlotRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertAvailableSlot slot = appointmentService.addAvailableSlot(request, expertId);
            return ResponseEntity.ok(ApiResponse.success("添加成功", slot));
        } catch (Exception e) {
            log.error("添加可用时段异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "添加失败，请稍后重试"));
        }
    }
    
    /**
     * 获取可用时段列表
     */
    @Operation(summary = "获取可用时段列表", description = "获取专家的可用时段列表")
    @GetMapping("/slots")
    public ResponseEntity<ApiResponse<List<ExpertAvailableSlot>>> getAvailableSlots(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Principal principal) {
        try {
            String expertId = principal.getName();
            List<ExpertAvailableSlot> slots = appointmentService.getAvailableSlots(expertId, startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success("获取成功", slots));
        } catch (Exception e) {
            log.error("获取可用时段列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 删除时段
     */
    @Operation(summary = "删除时段", description = "删除指定的可用时段")
    @DeleteMapping("/slots/{slotId}")
    public ResponseEntity<ApiResponse<Object>> deleteSlot(
            @PathVariable String slotId,
            Principal principal) {
        try {
            String expertId = principal.getName();
            appointmentService.deleteSlot(slotId, expertId);
            return ResponseEntity.ok(ApiResponse.success("删除成功", null));
        } catch (Exception e) {
            log.error("删除时段异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "删除失败，请稍后重试"));
        }
    }
    
    /**
     * 获取预约列表
     */
    @Operation(summary = "获取预约列表", description = "获取专家的预约记录列表")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ExpertAppointment>>> getAppointments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        try {
            String expertId = principal.getName();
            Page<ExpertAppointment> appointments = appointmentService.getAppointments(
                expertId, status, startDate, endDate, page, size);
            return ResponseEntity.ok(ApiResponse.success("获取成功", appointments));
        } catch (Exception e) {
            log.error("获取预约列表异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 获取预约详情
     */
    @Operation(summary = "获取预约详情", description = "获取预约的详细信息")
    @GetMapping("/{appointmentId}")
    public ResponseEntity<ApiResponse<ExpertAppointment>> getAppointmentDetail(
            @PathVariable String appointmentId,
            Principal principal) {
        try {
            String expertId = principal.getName();
            ExpertAppointment appointment = appointmentService.getAppointmentDetail(appointmentId, expertId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", appointment));
        } catch (Exception e) {
            log.error("获取预约详情异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 更新预约状态
     */
    @Operation(summary = "更新预约状态", description = "确认、取消或完成预约")
    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<ApiResponse<ExpertAppointment>> updateAppointmentStatus(
            @PathVariable String appointmentId,
            @Valid @RequestBody AppointmentStatusUpdateRequest request,
            Principal principal) {
        try {
            String expertId = principal.getName();
            request.setAppointmentId(appointmentId);
            ExpertAppointment appointment = appointmentService.updateAppointmentStatus(request, expertId);
            return ResponseEntity.ok(ApiResponse.success("更新成功", appointment));
        } catch (Exception e) {
            log.error("更新预约状态异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
}

