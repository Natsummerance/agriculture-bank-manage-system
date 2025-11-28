package com.agriverse.expert.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentPublishRequest {
    @NotBlank(message = "内容类型不能为空")
    private String contentType; // ARTICLE, VIDEO, IMAGE
    
    @NotBlank(message = "标题不能为空")
    private String title;
    
    private String summary;
    private String content;
    private String coverUrl;
    private String videoUrl;
    private List<String> images;
}



