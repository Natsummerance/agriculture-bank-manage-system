package com.agriverse.buyer.service;

import com.agriverse.entity.BuyerOrder;
import com.agriverse.buyer.repository.BuyerOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 买家退款服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuyerRefundService {
    private final BuyerOrderRepository orderRepository;
    
    /**
     * 获取退款列表
     */
    public Page<Object> getRefunds(String buyerId, String status, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        
        Page<BuyerOrder> orderPage;
        if (status != null && !status.isEmpty()) {
            BuyerOrder.RefundStatus refundStatus = convertToRefundStatus(status);
            orderPage = orderRepository.findByBuyerIdAndRefundStatusOrderByUpdatedAtDesc(
                buyerId, refundStatus, pageable);
        } else {
            // 查询所有有退款状态的订单
            orderPage = orderRepository.findByBuyerIdAndRefundStatusIsNotNullOrderByUpdatedAtDesc(
                buyerId, pageable);
        }
        
        return orderPage.map(order -> {
            java.util.Map<String, Object> refund = new java.util.HashMap<>();
            refund.put("orderId", order.getId());
            refund.put("refundStatus", order.getRefundStatus() != null ? 
                convertRefundStatusToString(order.getRefundStatus()) : null);
            refund.put("refundReason", order.getRefundReason());
            refund.put("totalAmount", order.getTotalAmount());
            refund.put("createdAt", order.getCreatedAt());
            refund.put("updatedAt", order.getUpdatedAt());
            return refund;
        });
    }
    
    private BuyerOrder.RefundStatus convertToRefundStatus(String status) {
        switch (status.toLowerCase()) {
            case "pending":
                return BuyerOrder.RefundStatus.PENDING;
            case "approved":
                return BuyerOrder.RefundStatus.APPROVED;
            case "rejected":
                return BuyerOrder.RefundStatus.REJECTED;
            case "escalated":
                return BuyerOrder.RefundStatus.ESCALATED;
            case "success":
                return BuyerOrder.RefundStatus.SUCCESS;
            case "failed":
                return BuyerOrder.RefundStatus.FAILED;
            default:
                throw new RuntimeException("无效的退款状态: " + status);
        }
    }
    
    private String convertRefundStatusToString(BuyerOrder.RefundStatus status) {
        switch (status) {
            case PENDING:
                return "pending";
            case APPROVED:
                return "approved";
            case REJECTED:
                return "rejected";
            case ESCALATED:
                return "escalated";
            case SUCCESS:
                return "success";
            case FAILED:
                return "failed";
            default:
                return status.name().toLowerCase();
        }
    }
}

