package com.agriverse.admin.service;

import com.agriverse.admin.dto.SystemConfigRequest;
import com.agriverse.admin.entity.AdminSystemConfig;
import com.agriverse.admin.repository.AdminSystemConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminSystemConfigService {
    private final AdminSystemConfigRepository configRepository;
    
    /**
     * 获取配置值
     */
    public String getConfigValue(String configKey) {
        return configRepository.findByConfigKey(configKey)
            .map(AdminSystemConfig::getConfigValue)
            .orElse(null);
    }
    
    /**
     * 设置配置值
     */
    public AdminSystemConfig setConfigValue(SystemConfigRequest request, String updatedBy) {
        AdminSystemConfig config = configRepository.findByConfigKey(request.getConfigKey())
            .orElse(AdminSystemConfig.builder()
                .id(UUID.randomUUID().toString())
                .configKey(request.getConfigKey())
                .build());
        
        config.setConfigValue(request.getConfigValue());
        if (request.getConfigType() != null && !request.getConfigType().isEmpty()) {
            config.setConfigType(AdminSystemConfig.ConfigType.valueOf(request.getConfigType()));
        }
        if (request.getDescription() != null) {
            config.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            config.setCategory(request.getCategory());
        }
        config.setUpdatedBy(updatedBy);
        
        return configRepository.save(config);
    }
    
    /**
     * 获取分类下的所有配置
     */
    public List<AdminSystemConfig> getConfigsByCategory(String category) {
        return configRepository.findByCategory(category);
    }
    
    /**
     * 获取所有配置
     */
    public List<AdminSystemConfig> getAllConfigs() {
        return configRepository.findAll();
    }
}



