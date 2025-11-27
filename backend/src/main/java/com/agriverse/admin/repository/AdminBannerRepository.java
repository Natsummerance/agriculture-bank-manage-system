package com.agriverse.admin.repository;

import com.agriverse.admin.entity.AdminBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminBannerRepository extends JpaRepository<AdminBanner, String> {
    List<AdminBanner> findByEnabledOrderByDisplayOrderAsc(Boolean enabled);
    
    List<AdminBanner> findByEnabledAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
        Boolean enabled, LocalDateTime now1, LocalDateTime now2);
}



