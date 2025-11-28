package com.agriverse.admin.repository;

import com.agriverse.admin.entity.AdminGrayRelease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminGrayReleaseRepository extends JpaRepository<AdminGrayRelease, String> {
    List<AdminGrayRelease> findByEnabled(Boolean enabled);
    
    Optional<AdminGrayRelease> findByFeatureName(String featureName);
}



