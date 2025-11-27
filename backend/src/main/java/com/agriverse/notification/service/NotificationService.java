package com.agriverse.notification.service;

import com.agriverse.auth.repository.UserRepository;
import com.agriverse.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 消息通知服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final UserRepository userRepository;
    
    /**
     * 发送审批结果通知
     */
    public void sendApprovalNotification(String farmerId, String financingId, String result, String comment) {
        User farmer = userRepository.findById(farmerId).orElse(null);
        if (farmer == null) {
            log.warn("农户不存在: farmerId={}", farmerId);
            return;
        }
        
        String message = String.format("您的融资申请 %s 已%s。%s", 
            financingId, result.equals("APPROVED") ? "通过审批" : "被拒绝", 
            comment != null ? "审批意见：" + comment : "");
        
        // TODO: 集成实际的消息推送服务（短信、邮件、站内信等）
        log.info("发送审批通知: farmerId={}, message={}", farmerId, message);
    }
    
    /**
     * 发送还款提醒
     */
    public void sendRepaymentReminder(String farmerId, String financingId, 
                                     java.math.BigDecimal amount, java.time.LocalDate dueDate) {
        User farmer = userRepository.findById(farmerId).orElse(null);
        if (farmer == null) {
            log.warn("农户不存在: farmerId={}", farmerId);
            return;
        }
        
        String message = String.format("您的融资 %s 有一笔还款即将到期，金额：¥%s，到期日期：%s", 
            financingId, amount, dueDate);
        
        // TODO: 集成实际的消息推送服务
        log.info("发送还款提醒: farmerId={}, message={}", farmerId, message);
    }
    
    /**
     * 发送逾期提醒
     */
    public void sendOverdueAlert(String farmerId, String financingId, 
                                 java.math.BigDecimal overdueAmount, long overdueDays) {
        User farmer = userRepository.findById(farmerId).orElse(null);
        if (farmer == null) {
            log.warn("农户不存在: farmerId={}", farmerId);
            return;
        }
        
        String message = String.format("您的融资 %s 已逾期 %d 天，逾期金额：¥%s，请尽快还款", 
            financingId, overdueDays, overdueAmount);
        
        // TODO: 集成实际的消息推送服务
        log.info("发送逾期提醒: farmerId={}, message={}", farmerId, message);
    }
    
    /**
     * 发送合同签署提醒
     */
    public void sendContractSignReminder(String farmerId, String contractId) {
        User farmer = userRepository.findById(farmerId).orElse(null);
        if (farmer == null) {
            log.warn("农户不存在: farmerId={}", farmerId);
            return;
        }
        
        String message = String.format("您的合同 %s 已生成，请及时签署", contractId);
        
        // TODO: 集成实际的消息推送服务
        log.info("发送合同签署提醒: farmerId={}, message={}", farmerId, message);
    }
}



