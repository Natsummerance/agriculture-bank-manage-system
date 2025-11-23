package com.agriverse.auth.service;

import com.agriverse.auth.repository.VerificationCodeRepository;
import com.agriverse.entity.VerificationCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

/**
 * 验证码服务
 */
@Slf4j
@Service
@Transactional
public class VerificationCodeService {

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Autowired
    private EmailService emailService;

    @Value("${verification-code.expiration:600}")
    private int codeExpiration;

    /**
     * 生成并发送验证码（通过邮箱）
     */
    public String generateAndSendCode(String phone, String email, String type) {
        // 生成6位随机验证码
        String code = generateCode();

        // 创建验证码实体
        VerificationCode verificationCode = VerificationCode.builder()
                .phone(phone)
                .email(email)
                .code(code)
                .type(VerificationCode.CodeType.valueOf(type.toUpperCase()))
                .expiredAt(LocalDateTime.now().plusSeconds(codeExpiration))
                .attempts(0)
                .used(false)
                .createdAt(LocalDateTime.now())
                .build();

        // 保存验证码到数据库
        verificationCode = verificationCodeRepository.save(verificationCode);

        // 发送邮件
        try {
            emailService.sendVerificationCode(email, code, type);
            log.info("验证码已发送: email={}, type={}, code={}", email, type, code);
        } catch (Exception e) {
            log.error("验证码发送失败: email={}, type={}", email, type, e);
            // 这里可以根据需要决定是否抛出异常
            // 为了演示，我们仅记录日志，实际使用建议抛出异常
        }

        return code;
    }

    /**
     * 生成随机验证码
     */
    private String generateCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    /**
     * 删除过期的验证码
     */
    public void deleteExpiredCodes() {
        log.info("清理过期的验证码");
        verificationCodeRepository.deleteByExpiredAtBefore(LocalDateTime.now());
    }
}
