package com.agriverse.auth.repository;

import com.agriverse.entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * 验证码数据访问层
 */
@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, String> {
        /**
         * 根据手机号和类型查询最新的验证码
         */
        Optional<VerificationCode> findFirstByPhoneAndTypeOrderByCreatedAtDesc(
                        String phone,
                        VerificationCode.CodeType type);

        /**
         * 根据邮箱和类型查询最新的验证码
         */
        Optional<VerificationCode> findFirstByEmailAndTypeOrderByCreatedAtDesc(
                        String email,
                        VerificationCode.CodeType type);

        /**
         * 删除过期的验证码
         */
        void deleteByExpiredAtBefore(LocalDateTime expiredAt);

        /**
         * 查询未使用且未过期的验证码（基于手机号）
         */
        Optional<VerificationCode> findByPhoneAndCodeAndTypeAndUsedFalseAndExpiredAtAfter(
                        String phone,
                        String code,
                        VerificationCode.CodeType type,
                        LocalDateTime now);

        /**
         * 查询未使用且未过期的验证码（基于邮箱）
         */
        Optional<VerificationCode> findByEmailAndCodeAndTypeAndUsedFalseAndExpiredAtAfter(
                        String email,
                        String code,
                        VerificationCode.CodeType type,
                        LocalDateTime now);
}
