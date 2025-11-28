package com.agriverse.auth.controller;

import com.agriverse.auth.service.AuthService;
import com.agriverse.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.Principal;

/**
 * 认证控制器
 * 处理登录、注册、验证码等认证相关的请求
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * 用户登录
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            log.info("处理登录请求: phone={}", request.getPhone());
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("登录成功", response));
        } catch (RuntimeException e) {
            log.error("登录失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, e.getMessage()));
        } catch (Exception e) {
            log.error("登录异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "登录失败，请稍后重试"));
        }
    }

    /**
     * 用户注册
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            log.info("处理注册请求: phone={}, role={}", request.getPhone(), request.getRole());
            LoginResponse response = authService.register(request);
            return ResponseEntity.ok(ApiResponse.success("注册成功", response));
        } catch (RuntimeException e) {
            log.error("注册失败: {}", e.getMessage());
            if (e.getMessage().contains("已被注册")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ApiResponse.error(409, e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("注册异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "注册失败，请稍后重试"));
        }
    }

    /**
     * 发送验证码
     * POST /api/auth/send-code
     */
    @PostMapping("/send-code")
    public ResponseEntity<ApiResponse<Object>> sendVerificationCode(@Valid @RequestBody SendCodeRequest request) {
        try {
            log.info("处理发送验证码请求: phone={}, type={}", request.getPhone(), request.getType());
            Object response = authService.sendVerificationCode(request);
            return ResponseEntity.ok(ApiResponse.success("验证码已发送", response));
        } catch (RuntimeException e) {
            log.error("发送验证码失败: {}", e.getMessage());
            if (e.getMessage().contains("频繁")) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(ApiResponse.error(429, e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("发送验证码异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "发送验证码失败，请稍后重试"));
        }
    }

    /**
     * 验证验证码
     * POST /api/auth/verify-code
     */
    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponse<Object>> verifyCode(@Valid @RequestBody VerifyCodeRequest request) {
        try {
            log.info("处理验证验证码请求: email={}, type={}", request.getEmail(), request.getType());
            Object response = authService.verifyVerificationCode(request);
            return ResponseEntity.ok(ApiResponse.success("验证成功", response));
        } catch (RuntimeException e) {
            log.error("验证验证码失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("验证验证码异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "验证失败，请稍后重试"));
        }
    }

    /**
     * 刷新令牌
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Object>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            log.info("处理刷新令牌请求");
            Object response = authService.refreshToken(request);
            return ResponseEntity.ok(ApiResponse.success("令牌刷新成功", response));
        } catch (RuntimeException e) {
            log.error("刷新令牌失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, e.getMessage()));
        } catch (Exception e) {
            log.error("刷新令牌异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "令牌刷新失败，请稍后重试"));
        }
    }

    /**
     * 重置密码
     * POST /api/auth/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Object>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            log.info("处理重置密码请求: phone={}", request.getPhone());
            Object response = authService.resetPassword(request);
            return ResponseEntity.ok(ApiResponse.success("密码重置成功", response));
        } catch (RuntimeException e) {
            log.error("重置密码失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("重置密码异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "密码重置失败，请稍后重试"));
        }
    }

    /**
     * 获取当前用户信息
     * GET /api/auth/me
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getCurrentUser(Principal principal) {
        try {
            log.info("获取当前用户信息: userId={}", principal.getName());
            UserInfoResponse response = authService.getCurrentUser(principal.getName());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            log.error("获取用户信息失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(404, e.getMessage()));
        } catch (Exception e) {
            log.error("获取用户信息异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "获取用户信息失败"));
        }
    }

    /**
     * 检查手机号是否存在
     * GET /api/auth/check-phone
     */
    @GetMapping("/check-phone")
    public ResponseEntity<ApiResponse<Object>> checkPhoneExists(
            @RequestParam String phone,
            @RequestParam(required = false) String role) {
        try {
            log.info("检查手机号: phone={}, role={}", phone, role);
            Object response = authService.checkPhoneExists(phone, role);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            log.error("检查手机号异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "检查失败"));
        }
    }

    /**
     * 登出
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Object>> logout(Principal principal) {
        try {
            log.info("处理登出请求: userId={}", principal.getName());
            authService.logout(principal.getName());
            return ResponseEntity.ok(ApiResponse.success("登出成功", null));
        } catch (Exception e) {
            log.error("登出异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "登出失败"));
        }
    }

    /**
     * 健康检查
     * GET /api/auth/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Object>> health() {
        return ResponseEntity.ok(ApiResponse.success("OK", null));
    }
}
