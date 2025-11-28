package com.agriverse.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfigRequest {
    @NotBlank(message = "配置键不能为空")
    private String configKey;
    
    private String configValue;
    private String configType;
    private String description;
    private String category;
}



