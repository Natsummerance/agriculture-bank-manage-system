package com.agriverse.auth.service;

import com.agriverse.auth.repository.UserRepository;
import com.agriverse.auth.repository.VerificationCodeRepository;
import com.agriverse.dto.*;
import com.agriverse.entity.User;
import com.agriverse.entity.VerificationCode;
import com.agriverse.util.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

/**
 * 认证服务
 */
@Slf4j
@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private VerificationCodeService verificationCodeService;

    /**
     * 用户登录
     */
    public LoginResponse login(LoginRequest request) {
        log.info("用户登录请求: phone={}", request.getPhone());

        // 查询用户
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        // 检查账户是否被禁用
        if (!user.getEnabled()) {
            throw new RuntimeException("账户已被禁用");
        }

        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            // 增加登录失败次数
            user.setLoginAttempts(user.getLoginAttempts() + 1);
            if (user.getLoginAttempts() >= 5) {
                user.setEnabled(false);
                log.warn("用户账户已被锁定: phone={}", request.getPhone());
            }
            userRepository.save(user);
            throw new RuntimeException("密码错误");
        }

        // 登录成功，重置失败次数和更新最后登录时间
        user.setLoginAttempts(0);
        user.setLastLoginTime(LocalDateTime.now());
        userRepository.save(user);

        // 生成 token
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(),
                user.getPhone(),
                user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        log.info("用户登录成功: phone={}, userId={}", request.getPhone(), user.getId());

        return LoginResponse.build(accessToken, refreshToken, user, jwtTokenProvider.getExpirationTime());
    }

    /**
     * 用户注册
     */
    public LoginResponse register(RegisterRequest request) {
        log.info("用户注册请求: phone={}, email={}, role={}", request.getPhone(), request.getEmail(), request.getRole());

        // 检查手机号是否已注册
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("该手机号已被注册");
        }

        // 检查邮箱是否已注册
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("该邮箱已被注册");
        }

        // 验证验证码（使用邮箱）
        verifyVerificationCodeByEmail(request.getEmail(), request.getCode(), "register");

        // 创建用户
        User user = User.builder()
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName() != null ? request.getName() : request.getPhone())
                .email(request.getEmail())
                .role(User.UserRole.valueOf(request.getRole().toUpperCase()))
                .company(request.getCompany())
                .location(request.getLocation())
                .enabled(true)
                .emailVerified(false)
                .loginAttempts(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);

        // 标记验证码为已使用（使用邮箱）
        markVerificationCodeAsUsedByEmail(request.getEmail(), request.getCode(), "register");

        // 生成 token
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(),
                user.getPhone(),
                user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        log.info("用户注册成功: phone={}, userId={}", request.getPhone(), user.getId());

        return LoginResponse.build(accessToken, refreshToken, user, jwtTokenProvider.getExpirationTime());
    }

    /**
     * 发送验证码
     */
    public Map<String, Object> sendVerificationCode(SendCodeRequest request) {
        log.info("发送验证码请求: phone={}, email={}, type={}", request.getPhone(), request.getEmail(), request.getType());

        // 如果是注册验证码，检查手机号和邮箱是否已被注册
        if ("register".equalsIgnoreCase(request.getType())) {
            if (userRepository.existsByPhone(request.getPhone())) {
                throw new RuntimeException("该手机号已被注册");
            }
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("该邮箱已被注册");
            }
        }

        // 检查是否频繁发送
        VerificationCode lastCode = verificationCodeRepository
                .findFirstByEmailAndTypeOrderByCreatedAtDesc(
                        request.getEmail(),
                        VerificationCode.CodeType.valueOf(request.getType().toUpperCase()))
                .orElse(null);

        if (lastCode != null && !lastCode.isExpired()) {
            LocalDateTime now = LocalDateTime.now();
            long secondsSinceCreation = java.time.temporal.ChronoUnit.SECONDS
                    .between(lastCode.getCreatedAt(), now);

            if (secondsSinceCreation < 60) {
                log.warn("验证码发送过于频繁: email={}", request.getEmail());
                throw new RuntimeException("验证码发送过于频繁，请稍后再试");
            }
        }

        // 生成验证码并发送（通过邮箱）
        String code = verificationCodeService.generateAndSendCode(
                request.getPhone(),
                request.getEmail(),
                request.getType());

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "验证码已发送到邮箱");
        result.put("expiresIn", 600); // 10 minutes

        log.info("验证码已发送: email={}", request.getEmail());

        return result;
    }

    /**
     * 验证验证码
     */
    public Map<String, Object> verifyVerificationCode(VerifyCodeRequest request) {
        log.info("验证验证码请求: email={}, type={}", request.getEmail(), request.getType());

        try {
            verifyVerificationCodeByEmail(request.getEmail(), request.getCode(), request.getType());
            Map<String, Object> result = new HashMap<>();
            result.put("valid", true);
            result.put("message", "验证码有效");
            return result;
        } catch (RuntimeException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("valid", false);
            result.put("message", e.getMessage());
            return result;
        }
    }

    /**
     * 刷新 Token
     */
    public Map<String, Object> refreshToken(RefreshTokenRequest request) {
        log.info("刷新令牌请求");

        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            throw new RuntimeException("无效的刷新令牌");
        }

        String userId = jwtTokenProvider.getUserIdFromToken(request.getRefreshToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        // 生成新的 token
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(),
                user.getPhone(),
                user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        Map<String, Object> result = new HashMap<>();
        result.put("token", accessToken);
        result.put("refreshToken", refreshToken);
        result.put("expiresIn", jwtTokenProvider.getExpirationTime());

        return result;
    }

    /**
     * 重置密码
     */
    public Map<String, Object> resetPassword(ResetPasswordRequest request) {
        log.info("重置密码请求: phone={}", request.getPhone());

        // 查询用户
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        // 验证验证码（使用用户的邮箱）
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new RuntimeException("用户未绑定邮箱，无法重置密码");
        }
        verifyVerificationCodeByEmail(user.getEmail(), request.getCode(), "reset");

        // 更新密码
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setLoginAttempts(0);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // 标记验证码为已使用（使用邮箱）
        markVerificationCodeAsUsedByEmail(user.getEmail(), request.getCode(), "reset");

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "密码重置成功");

        log.info("密码重置成功: phone={}", request.getPhone());

        return result;
    }

    /**
     * 获取当前用户信息
     */
    public UserInfoResponse getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        return UserInfoResponse.fromEntity(user);
    }

    /**
     * 检查手机号是否存在
     */
    public Map<String, Object> checkPhoneExists(String phone, String role) {
        boolean exists = role != null && !role.isEmpty()
                ? userRepository.existsByPhone(phone)
                : userRepository.existsByPhone(phone);

        Map<String, Object> result = new HashMap<>();
        result.put("exists", exists);
        return result;
    }

    /**
     * 内部方法：验证验证码（基于邮箱）
     */
    private void verifyVerificationCodeByEmail(String email, String code, String type) {
        VerificationCode verCode = verificationCodeRepository
                .findByEmailAndCodeAndTypeAndUsedFalseAndExpiredAtAfter(
                        email,
                        code,
                        VerificationCode.CodeType.valueOf(type.toUpperCase()),
                        LocalDateTime.now())
                .orElseThrow(() -> new RuntimeException("验证码错误或已过期"));

        // 增加尝试次数
        verCode.setAttempts(verCode.getAttempts() + 1);
        if (verCode.getAttempts() > 3) {
            throw new RuntimeException("验证码尝试次数过多");
        }
        verificationCodeRepository.save(verCode);
    }

    /**
     * 内部方法：标记验证码为已使用（基于邮箱）
     */
    private void markVerificationCodeAsUsedByEmail(String email, String code, String type) {
        VerificationCode verCode = verificationCodeRepository
                .findByEmailAndCodeAndTypeAndUsedFalseAndExpiredAtAfter(
                        email,
                        code,
                        VerificationCode.CodeType.valueOf(type.toUpperCase()),
                        LocalDateTime.now())
                .orElse(null);

        if (verCode != null) {
            verCode.setUsed(true);
            verificationCodeRepository.save(verCode);
        }
    }

    /**
     * 登出
     */
    public void logout(String userId) {
        log.info("用户登出: userId={}", userId);
        // 可以在这里做一些清理工作，比如记录登出日志、清除缓存等
    }
}
