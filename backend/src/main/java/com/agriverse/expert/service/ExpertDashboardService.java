package com.agriverse.expert.service;

import com.agriverse.expert.dto.ExpertDashboardStatisticsResponse;
import com.agriverse.expert.entity.*;
import com.agriverse.expert.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpertDashboardService {
    private final ExpertQuestionRepository questionRepository;
    private final ExpertAnswerRepository answerRepository;
    private final ExpertIncomeRecordRepository incomeRecordRepository;
    private final ExpertProfileRepository profileRepository;
    private final ExpertAvailableSlotRepository slotRepository;
    private final ExpertAppointmentRepository appointmentRepository;
    
    /**
     * 获取仪表盘统计数据
     */
    public ExpertDashboardStatisticsResponse getDashboardStatistics(String expertId) {
        // 待回答问题数
        Integer pendingQuestionsCount = questionRepository.findPendingQuestions().size();
        
        // 已回答问题数
        List<ExpertAnswer> answers = answerRepository.findByExpertId(expertId);
        Integer answeredQuestionsCount = answers.size();
        
        // 收入统计
        ExpertProfile profile = profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
        BigDecimal totalIncome = profile.getTotalIncome();
        BigDecimal withdrawableBalance = profile.getWithdrawableBalance();
        
        // 时段统计
        List<ExpertAvailableSlot> availableSlots = slotRepository
            .findByExpertIdAndIsAvailableAndIsBooked(expertId, true, false);
        Integer availableSlotsCount = availableSlots.size();
        
        List<ExpertAvailableSlot> bookedSlots = slotRepository
            .findByExpertIdAndIsAvailableAndIsBooked(expertId, true, true);
        Integer bookedSlotsCount = bookedSlots.size();
        
        // 趋势数据（近6个月）
        List<ExpertDashboardStatisticsResponse.TrendData> incomeTrend = getIncomeTrend(expertId, 6);
        List<ExpertDashboardStatisticsResponse.TrendData> qaTrend = getQATrend(expertId, 6);
        List<ExpertDashboardStatisticsResponse.TrendData> appointmentTrend = getAppointmentTrend(expertId, 6);
        
        return ExpertDashboardStatisticsResponse.builder()
            .pendingQuestionsCount(pendingQuestionsCount)
            .answeredQuestionsCount(answeredQuestionsCount)
            .totalIncome(totalIncome)
            .withdrawableBalance(withdrawableBalance)
            .availableSlotsCount(availableSlotsCount)
            .bookedSlotsCount(bookedSlotsCount)
            .incomeTrend(incomeTrend)
            .qaTrend(qaTrend)
            .appointmentTrend(appointmentTrend)
            .build();
    }
    
    /**
     * 获取收入趋势
     */
    private List<ExpertDashboardStatisticsResponse.TrendData> getIncomeTrend(String expertId, int months) {
        List<ExpertDashboardStatisticsResponse.TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            List<ExpertIncomeRecord> records = incomeRecordRepository
                .findByExpertIdAndDateRange(
                    expertId,
                    monthStart.atStartOfDay(),
                    monthEnd.atTime(23, 59, 59));
            
            BigDecimal amount = records.stream()
                .filter(r -> r.getStatus() == ExpertIncomeRecord.IncomeStatus.SETTLED)
                .map(ExpertIncomeRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            trend.add(new ExpertDashboardStatisticsResponse.TrendData(
                monthStart.format(DateTimeFormatter.ofPattern("M月")),
                amount
            ));
        }
        
        return trend;
    }
    
    /**
     * 获取问答趋势
     */
    private List<ExpertDashboardStatisticsResponse.TrendData> getQATrend(String expertId, int months) {
        List<ExpertDashboardStatisticsResponse.TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            List<ExpertAnswer> answers = answerRepository.findByExpertId(expertId).stream()
                .filter(a -> a.getCreatedAt().isAfter(monthStart.atStartOfDay()) &&
                           a.getCreatedAt().isBefore(monthEnd.atTime(23, 59, 59)))
                .collect(Collectors.toList());
            
            trend.add(new ExpertDashboardStatisticsResponse.TrendData(
                monthStart.format(DateTimeFormatter.ofPattern("M月")),
                BigDecimal.valueOf(answers.size())
            ));
        }
        
        return trend;
    }
    
    /**
     * 获取预约趋势
     */
    private List<ExpertDashboardStatisticsResponse.TrendData> getAppointmentTrend(String expertId, int months) {
        List<ExpertDashboardStatisticsResponse.TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            List<ExpertAppointment> appointments = appointmentRepository
                .findByExpertIdAndDateRange(expertId, monthStart, monthEnd);
            
            trend.add(new ExpertDashboardStatisticsResponse.TrendData(
                monthStart.format(DateTimeFormatter.ofPattern("M月")),
                BigDecimal.valueOf(appointments.size())
            ));
        }
        
        return trend;
    }
}



