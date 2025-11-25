package com.agriverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * 买家订单列表响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerOrderListResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<BuyerOrderResponse> orders;
    private Long total;
    private Integer page;
    private Integer pageSize;
}
