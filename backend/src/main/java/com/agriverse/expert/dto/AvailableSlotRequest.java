package com.agriverse.expert.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableSlotRequest {
    @NotNull(message = "日期不能为空")
    private LocalDate slotDate;
    
    @NotBlank(message = "时间段不能为空")
    private String timeSlot; // 如：14:00-15:00
}



