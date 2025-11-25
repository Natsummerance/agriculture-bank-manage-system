package com.agriverse.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 农户创建商品请求
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {

    @NotBlank(message = "商品名称不能为空")
    @Size(max = 200, message = "商品名称长度不能超过200字符")
    private String name;

    @NotBlank(message = "商品类别不能为空")
    @Size(max = 100, message = "商品类别长度不能超过100字符")
    private String category;

    @NotNull(message = "商品价格不能为空")
    @DecimalMin(value = "0.01", inclusive = true, message = "商品价格必须大于0")
    private Double price;

    @NotNull(message = "库存不能为空")
    @Min(value = 0, message = "库存不能为负数")
    private Integer stock;

    @NotBlank(message = "产地不能为空")
    @Size(max = 200, message = "产地长度不能超过200字符")
    private String origin;

    @Size(max = 4000, message = "商品描述长度不能超过4000字符")
    private String description;
}
