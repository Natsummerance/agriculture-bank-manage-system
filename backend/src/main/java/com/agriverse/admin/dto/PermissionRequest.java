package com.agriverse.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PermissionRequest {
    @NotBlank(message = "角色不能为空")
    private String role;
    
    @NotBlank(message = "资源不能为空")
    private String resource;
    
    @NotBlank(message = "操作不能为空")
    private String action; // READ, WRITE, DELETE, EXECUTE
    
    private String description;
    private Boolean enabled;
}



