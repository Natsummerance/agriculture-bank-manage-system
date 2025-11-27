package com.agriverse.admin.repository;

import com.agriverse.admin.entity.AdminCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminCouponRepository extends JpaRepository<AdminCoupon, String> {
    List<AdminCoupon> findByEnabled(Boolean enabled);
    
    List<AdminCoupon> findByTargetRoleAndEnabled(AdminCoupon.TargetRole targetRole, Boolean enabled);
    
    @Query("SELECT c FROM AdminCoupon c WHERE c.validFrom <= :now AND c.validTo >= :now AND c.enabled = true")
    List<AdminCoupon> findValidCoupons(@Param("now") LocalDateTime now);
}



