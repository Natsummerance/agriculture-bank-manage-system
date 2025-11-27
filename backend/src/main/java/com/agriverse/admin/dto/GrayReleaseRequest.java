package com.agriverse.admin.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrayReleaseRequest {
    @NotBlank(message = "功能名称不能为空")
    private String featureName;
    
    private String description;
    
    @NotNull(message = "发布比例不能为空")
    @Min(0)
    @Max(100)
    private Integer releasePercent;
    
    private String targetUsers; // ALL, NEW, VIP
    private Boolean enabled;
}



