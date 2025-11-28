package com.agriverse.expert.service;

import com.agriverse.expert.dto.AppointmentStatusUpdateRequest;
import com.agriverse.expert.dto.AvailableSlotRequest;
import com.agriverse.expert.entity.*;
import com.agriverse.expert.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpertAppointmentService {
    private final ExpertAvailableSlotRepository slotRepository;
    private final ExpertAppointmentRepository appointmentRepository;
    private final ExpertProfileRepository profileRepository;
    private final ExpertIncomeRecordRepository incomeRecordRepository;
    
    /**
     * 添加可用时段
     */
    public ExpertAvailableSlot addAvailableSlot(AvailableSlotRequest request, String expertId) {
        ExpertAvailableSlot slot = ExpertAvailableSlot.builder()
            .id(UUID.randomUUID().toString())
            .expertId(expertId)
            .slotDate(request.getSlotDate())
            .timeSlot(request.getTimeSlot())
            .isAvailable(true)
            .isBooked(false)
            .build();
        
        return slotRepository.save(slot);
    }
    
    /**
     * 获取可用时段列表
     */
    public List<ExpertAvailableSlot> getAvailableSlots(String expertId, LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return slotRepository.findByExpertId(expertId);
        }
        return slotRepository.findAvailableSlotsInRange(expertId, startDate, endDate);
    }
    
    /**
     * 删除时段
     */
    public void deleteSlot(String slotId, String expertId) {
        ExpertAvailableSlot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new EntityNotFoundException("时段不存在"));
        
        if (!slot.getExpertId().equals(expertId)) {
            throw new IllegalArgumentException("无权删除此时段");
        }
        
        if (slot.getIsBooked()) {
            throw new IllegalStateException("该时段已被预约，无法删除");
        }
        
        slotRepository.delete(slot);
    }
    
    /**
     * 更新预约状态
     */
    public ExpertAppointment updateAppointmentStatus(AppointmentStatusUpdateRequest request, String expertId) {
        ExpertAppointment appointment = appointmentRepository.findById(request.getAppointmentId())
            .orElseThrow(() -> new EntityNotFoundException("预约不存在"));
        
        if (!appointment.getExpertId().equals(expertId)) {
            throw new IllegalArgumentException("无权操作此预约");
        }
        
        ExpertAppointment.AppointmentStatus newStatus = 
            ExpertAppointment.AppointmentStatus.valueOf(request.getStatus());
        
        appointment.setStatus(newStatus);
        if (request.getComment() != null) {
            appointment.setExpertComment(request.getComment());
        }
        
        ExpertAppointment saved = appointmentRepository.save(appointment);
        
        // 如果确认预约，更新时段状态
        if (newStatus == ExpertAppointment.AppointmentStatus.CONFIRMED && appointment.getSlotId() != null) {
            ExpertAvailableSlot slot = slotRepository.findById(appointment.getSlotId())
                .orElse(null);
            if (slot != null) {
                slot.setIsBooked(true);
                slotRepository.save(slot);
            }
        }
        
        // 如果完成预约，创建收入记录
        if (newStatus == ExpertAppointment.AppointmentStatus.COMPLETED) {
            ExpertIncomeRecord incomeRecord = ExpertIncomeRecord.builder()
                .id(UUID.randomUUID().toString())
                .expertId(expertId)
                .incomeType(ExpertIncomeRecord.IncomeType.APPOINTMENT)
                .sourceId(appointment.getId())
                .amount(appointment.getAmount())
                .description("预约咨询收入")
                .status(ExpertIncomeRecord.IncomeStatus.SETTLED)
                .settledAt(LocalDateTime.now())
                .build();
            incomeRecordRepository.save(incomeRecord);
            
            // 更新专家收入
            updateExpertIncome(expertId, appointment.getAmount());
        }
        
        return saved;
    }
    
    /**
     * 获取预约列表
     */
    public Page<ExpertAppointment> getAppointments(String expertId, String status, 
                                                   LocalDate startDate, LocalDate endDate,
                                                   Integer page, Integer size) {
        Specification<ExpertAppointment> spec = Specification.where(
            (root, query, cb) -> cb.equal(root.get("expertId"), expertId));
        
        if (status != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), 
                    ExpertAppointment.AppointmentStatus.valueOf(status)));
        }
        
        if (startDate != null && endDate != null) {
            spec = spec.and((root, query, cb) -> 
                cb.between(root.get("appointmentDate"), startDate, endDate));
        }
        
        Pageable pageable = PageRequest.of(page, size, 
            Sort.by(Sort.Direction.DESC, "appointmentDate", "createdAt"));
        
        return appointmentRepository.findAll(spec, pageable);
    }
    
    /**
     * 获取预约详情
     */
    public ExpertAppointment getAppointmentDetail(String appointmentId, String expertId) {
        ExpertAppointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new EntityNotFoundException("预约不存在"));
        
        if (!appointment.getExpertId().equals(expertId)) {
            throw new IllegalArgumentException("无权查看此预约");
        }
        
        return appointment;
    }
    
    private void updateExpertIncome(String expertId, BigDecimal amount) {
        ExpertProfile profile = profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
        
        profile.setTotalIncome(profile.getTotalIncome().add(amount));
        profile.setWithdrawableBalance(profile.getWithdrawableBalance().add(amount));
        profileRepository.save(profile);
    }
}

