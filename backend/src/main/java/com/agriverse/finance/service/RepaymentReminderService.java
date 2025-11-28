package com.agriverse.finance.service;

import com.agriverse.finance.entity.RepaymentSchedule;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import com.agriverse.finance.repository.RepaymentScheduleRepository;
import com.agriverse.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 还款提醒服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RepaymentReminderService {
    private final RepaymentScheduleRepository scheduleRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final NotificationService notificationService;
    
    /**
     * 发送还款提醒（每天上午9点执行，提醒未来3天内到期的还款）
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendRepaymentReminders() {
        log.info("开始发送还款提醒");
        
        LocalDate today = LocalDate.now();
        LocalDate reminderEndDate = today.plusDays(3);
        
        // 查询未来3天内到期的待还款计划
        List<RepaymentSchedule> upcomingSchedules = scheduleRepository
            .findUpcomingSchedules(today, reminderEndDate);
        
        int count = 0;
        for (RepaymentSchedule schedule : upcomingSchedules) {
            try {
                var application = applicationRepository.findById(schedule.getFinancingId())
                    .orElse(null);
                
                if (application != null) {
                    notificationService.sendRepaymentReminder(
                        application.getFarmerId(),
                        schedule.getFinancingId(),
                        schedule.getTotalAmount(),
                        schedule.getDueDate()
                    );
                    count++;
                }
            } catch (Exception e) {
                log.error("发送还款提醒失败: scheduleId={}, error={}", schedule.getId(), e.getMessage());
            }
        }
        
        log.info("还款提醒发送完成，共发送 {} 条", count);
    }
}

