package com.agriverse.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * 邮件服务
 * 支持QQ邮箱、163邮箱等SMTP服务
 */
@Slf4j
@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.from:your-qq-email@qq.com}")
    private String fromEmail;

    /**
     * 发送邮件
     * 
     * @param to      收件人邮箱
     * @param subject 邮件主题
     * @param content 邮件内容
     */
    public void sendEmail(String to, String subject, String content) {
        log.info("发送邮件: to={}, subject={}", to, subject);

        // 如果配置了邮件服务器，则发送真实邮件
        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(content);
                message.setFrom(fromEmail); // 从配置文件读取发件人地址
                mailSender.send(message);
                log.info("邮件发送成功: to={}, from={}", to, fromEmail);
            } catch (Exception e) {
                log.error("邮件发送失败: to={}", to, e);
                throw new RuntimeException("邮件发送失败: " + e.getMessage(), e);
            }
        } else {
            // 未配置邮件服务器时，仅记录日志（开发环境）
            log.warn("邮件服务未配置，模拟发送邮件: to={}, subject={}, content={}", to, subject, content);
            log.warn("请在 application.yml 中配置 spring.mail 相关参数以启用真实邮件发送");
        }
    }

    /**
     * 发送验证码邮件
     * 
     * @param email 邮箱地址
     * @param code  验证码
     * @param type  验证码类型
     */
    public void sendVerificationCode(String email, String code, String type) {
        String subject = switch (type.toLowerCase()) {
            case "register" -> "AgriVerse 注册验证码";
            case "login" -> "AgriVerse 登录验证码";
            case "reset" -> "AgriVerse 密码重置验证码";
            default -> "AgriVerse 验证码";
        };

        String content = switch (type.toLowerCase()) {
            case "register" -> String.format(
                    "尊敬的用户，\n\n" +
                            "您的注册验证码是：%s\n" +
                            "验证码有效期为10分钟，请勿泄露给他人。\n\n" +
                            "如果您没有进行注册操作，请忽略此邮件。\n\n" +
                            "AgriVerse 团队",
                    code);
            case "login" -> String.format(
                    "尊敬的用户，\n\n" +
                            "您的登录验证码是：%s\n" +
                            "验证码有效期为10分钟，请勿泄露给他人。\n\n" +
                            "如果您没有进行登录操作，请忽略此邮件。\n\n" +
                            "AgriVerse 团队",
                    code);
            case "reset" -> String.format(
                    "尊敬的用户，\n\n" +
                            "您的密码重置验证码是：%s\n" +
                            "验证码有效期为10分钟，请勿泄露给他人。\n\n" +
                            "如果您没有进行密码重置操作，请立即联系客服。\n\n" +
                            "AgriVerse 团队",
                    code);
            default -> String.format(
                    "您的验证码是：%s，有效期为10分钟。\n\n" +
                            "AgriVerse 团队",
                    code);
        };

        sendEmail(email, subject, content);
    }
}
