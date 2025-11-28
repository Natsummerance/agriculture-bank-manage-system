package com.agriverse.expert.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequest {
    @NotBlank(message = "问题ID不能为空")
    private String questionId;
    
    @NotBlank(message = "答案内容不能为空")
    private String content;
}



