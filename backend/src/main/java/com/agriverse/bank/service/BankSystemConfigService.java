package com.agriverse.bank.service;

import com.agriverse.bank.entity.BankSystemConfig;
import com.agriverse.bank.repository.BankSystemConfigRepository;
import com.agriverse.exception.BusinessException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * 银行系统配置服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BankSystemConfigService {
    private final BankSystemConfigRepository configRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * 获取配置值
     */
    public String getConfigValue(String configKey) {
        return configRepository.findByConfigKey(configKey)
            .map(BankSystemConfig::getConfigValue)
            .orElse(null);
    }
    
    /**
     * 获取配置值（带类型转换）
     */
    public <T> T getConfigValue(String configKey, Class<T> type) {
        BankSystemConfig config = configRepository.findByConfigKey(configKey)
            .orElse(null);
        
        if (config == null) {
            return null;
        }
        
        try {
            switch (config.getConfigType()) {
                case NUMBER:
                    return type.cast(Double.parseDouble(config.getConfigValue()));
                case BOOLEAN:
                    return type.cast(Boolean.parseBoolean(config.getConfigValue()));
                case JSON:
                    return objectMapper.readValue(config.getConfigValue(), type);
                default:
                    return type.cast(config.getConfigValue());
            }
        } catch (Exception e) {
            throw new BusinessException("配置值类型转换失败: " + configKey);
        }
    }
    
    /**
     * 设置配置值
     */
    public BankSystemConfig setConfigValue(String configKey, String configValue, 
                                          String description, String category, String updatedBy) {
        BankSystemConfig config = configRepository.findByConfigKey(configKey)
            .orElse(BankSystemConfig.builder()
                .id(UUID.randomUUID().toString())
                .configKey(configKey)
                .build());
        
        config.setConfigValue(configValue);
        if (description != null) {
            config.setDescription(description);
        }
        if (category != null) {
            config.setCategory(category);
        }
        config.setUpdatedBy(updatedBy);
        
        return configRepository.save(config);
    }
    
    /**
     * 获取分类下的所有配置
     */
    public List<BankSystemConfig> getConfigsByCategory(String category) {
        return configRepository.findByCategory(category);
    }
    
    /**
     * 获取所有配置
     */
    public List<BankSystemConfig> getAllConfigs() {
        return configRepository.findAll();
    }
}

