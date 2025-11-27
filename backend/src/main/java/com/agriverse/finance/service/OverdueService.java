package com.agriverse.finance.service;

import com.agriverse.finance.entity.RepaymentSchedule;
import com.agriverse.finance.repository.RepaymentScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 逾期管理服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OverdueService {
    private final RepaymentScheduleRepository scheduleRepository;
    
    /**
     * 检测并更新逾期状态
     * 每天凌晨2点执行
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void checkAndUpdateOverdue() {
        log.info("开始检测逾期还款计划");
        
        LocalDate today = LocalDate.now();
        List<RepaymentSchedule> overdueSchedules = scheduleRepository.findOverdueSchedules(today);
        
        int count = 0;
        for (RepaymentSchedule schedule : overdueSchedules) {
            if (schedule.getStatus() == RepaymentSchedule.ScheduleStatus.PENDING) {
                schedule.setStatus(RepaymentSchedule.ScheduleStatus.OVERDUE);
                scheduleRepository.save(schedule);
                count++;
            }
        }
        
        log.info("逾期检测完成，共更新 {} 条逾期记录", count);
    }
    
    /**
     * 手动触发逾期检测
     */
    @Transactional
    public int checkOverdueManually() {
        LocalDate today = LocalDate.now();
        List<RepaymentSchedule> overdueSchedules = scheduleRepository.findOverdueSchedules(today);
        
        int count = 0;
        for (RepaymentSchedule schedule : overdueSchedules) {
            if (schedule.getStatus() == RepaymentSchedule.ScheduleStatus.PENDING) {
                schedule.setStatus(RepaymentSchedule.ScheduleStatus.OVERDUE);
                scheduleRepository.save(schedule);
                count++;
            }
        }
        
        return count;
    }
}



