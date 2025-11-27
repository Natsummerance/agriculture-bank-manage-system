package com.agriverse.bank.repository;

import com.agriverse.bank.entity.BankSystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 银行系统配置Repository
 */
@Repository
public interface BankSystemConfigRepository extends JpaRepository<BankSystemConfig, String> {
    Optional<BankSystemConfig> findByConfigKey(String configKey);
    
    List<BankSystemConfig> findByCategory(String category);
    
    List<BankSystemConfig> findByCategoryAndIsEditable(String category, Boolean isEditable);
}



