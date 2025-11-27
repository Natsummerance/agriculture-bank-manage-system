package com.agriverse.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BannerRequest {
    @NotBlank(message = "标题不能为空")
    private String title;
    
    @NotBlank(message = "图片URL不能为空")
    private String imageUrl;
    
    private String linkUrl;
    private Integer displayOrder;
    private Boolean enabled;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}



