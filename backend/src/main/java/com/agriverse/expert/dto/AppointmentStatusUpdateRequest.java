package com.agriverse.expert.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentStatusUpdateRequest {
    @NotBlank(message = "预约ID不能为空")
    private String appointmentId;
    
    @NotBlank(message = "状态不能为空")
    private String status; // CONFIRMED, CANCELLED, COMPLETED
    
    private String comment; // 备注
}



