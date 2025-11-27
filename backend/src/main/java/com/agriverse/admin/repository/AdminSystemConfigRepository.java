package com.agriverse.admin.repository;

import com.agriverse.admin.entity.AdminSystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminSystemConfigRepository extends JpaRepository<AdminSystemConfig, String> {
    Optional<AdminSystemConfig> findByConfigKey(String configKey);
    
    List<AdminSystemConfig> findByCategory(String category);
    
    List<AdminSystemConfig> findByCategoryAndIsEditable(String category, Boolean isEditable);
}



