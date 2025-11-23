package com.agriverse.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 短信服务
 * 这是一个模拟实现，实际使用时应集成真实的短信服务商（如阿里云、腾讯云等）
 */
@Slf4j
@Service
public class SmsService {

    /**
     * 发送短信
     * 
     * @param phone   手机号
     * @param message 短信内容
     */
    public void sendSms(String phone, String message) {
        log.info("发送短信: phone={}, message={}", phone, message);

        // 实际实现中应该调用真实的短信服务商API
        // 例如：
        // - 阿里云短信服务
        // - 腾讯云短信服务
        // - 网易云短信服务
        // 等等

        // 这里仅做日志记录演示
        // TODO: 集成真实的短信服务商
    }

    /**
     * 发送验证码短信
     * 
     * @param phone 手机号
     * @param code  验证码
     */
    public void sendVerificationCode(String phone, String code) {
        String message = String.format("验证码: %s, 10分钟内有效", code);
        sendSms(phone, message);
    }
}
