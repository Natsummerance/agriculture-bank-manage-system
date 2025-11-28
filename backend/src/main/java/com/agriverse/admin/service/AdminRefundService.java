package com.agriverse.admin.service;

import com.agriverse.admin.dto.RefundArbitrationRequest;
import com.agriverse.admin.dto.RefundDisputeResponse;
import com.agriverse.admin.entity.AdminOperationLog;
import com.agriverse.entity.Order;
import com.agriverse.entity.RefundHistory;
import com.agriverse.order.repository.OrderRepository;
import com.agriverse.order.repository.RefundHistoryRepository;
import com.agriverse.auth.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminRefundService {
    private final OrderRepository orderRepository;
    private final RefundHistoryRepository refundHistoryRepository;
    private final UserRepository userRepository;
    private final AdminOperationLogService operationLogService;

    /**
     * 获取退款纠纷列表
     */
    public List<RefundDisputeResponse> getRefundDisputes() {
        // 获取需要仲裁的退款订单（状态为REJECTED或ESCALATED）
        List<Order> disputeOrders = orderRepository.findAll().stream()
            .filter(o -> o.getRefundStatus() != null && 
                (o.getRefundStatus() == Order.RefundStatus.REJECTED ||
                 o.getRefundStatus() == Order.RefundStatus.ESCALATED ||
                 o.getRefundStatus() == Order.RefundStatus.PENDING))
            .collect(Collectors.toList());

        return disputeOrders.stream()
            .map(this::convertToRefundDisputeResponse)
            .collect(Collectors.toList());
    }

    /**
     * 获取退款详情
     */
    public RefundDisputeResponse getRefundDetail(String orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("订单不存在"));

        if (order.getRefundStatus() == null) {
            throw new EntityNotFoundException("该订单没有退款记录");
        }

        return convertToRefundDisputeResponse(order);
    }

    /**
     * 处理退款仲裁
     */
    public Order processRefundArbitration(RefundArbitrationRequest request, String operatorId) {
        Order order = orderRepository.findById(request.getOrderId())
            .orElseThrow(() -> new EntityNotFoundException("订单不存在"));

        if (order.getRefundStatus() == null) {
            throw new IllegalStateException("该订单没有退款申请");
        }

        // 更新退款状态
        if ("SUCCESS".equals(request.getResult())) {
            order.setRefundStatus(Order.RefundStatus.SUCCESS);
            order.setStatus(Order.OrderStatus.REFUNDED);
        } else if ("FAILED".equals(request.getResult())) {
            order.setRefundStatus(Order.RefundStatus.FAILED);
        }

        Order saved = orderRepository.save(order);

        // 记录退款历史
        RefundHistory history = RefundHistory.builder()
            .id(UUID.randomUUID().toString())
            .orderId(order.getId())
            .action("SUCCESS".equals(request.getResult()) ? "平台仲裁：退款成功" : "平台仲裁：退款失败")
            .actor(RefundHistory.ActorType.ADMIN)
            .note(request.getNote())
            .build();
        refundHistoryRepository.save(history);

        // 记录操作日志
        operationLogService.logOperation(
            operatorId,
            AdminOperationLog.ActionType.USER_MANAGE, // 可以添加REFUND_ARBITRATION类型
            "处理退款仲裁: " + request.getResult(),
            AdminOperationLog.TargetType.USER,
            order.getId(),
            "订单退款仲裁"
        );

        return saved;
    }

    /**
     * 转换为退款纠纷响应
     */
    private RefundDisputeResponse convertToRefundDisputeResponse(Order order) {
        // 获取退款历史
        List<RefundHistory> histories = refundHistoryRepository.findByOrderIdOrderByCreatedAtDesc(order.getId());
        List<RefundDisputeResponse.RefundHistoryItem> historyItems = histories.stream()
            .map(h -> RefundDisputeResponse.RefundHistoryItem.builder()
                .action(h.getAction())
                .actor(h.getActor().name())
                .note(h.getNote())
                .createdAt(h.getCreatedAt())
                .build())
            .collect(Collectors.toList());

        // 获取买家和农户信息
        String buyerName = userRepository.findById(order.getBuyerId())
            .map(u -> u.getName() != null ? u.getName() : u.getPhone())
            .orElse("未知");
        String farmerName = userRepository.findById(order.getFarmerId())
            .map(u -> u.getName() != null ? u.getName() : u.getPhone())
            .orElse("未知");

        return RefundDisputeResponse.builder()
            .orderId(order.getId())
            .buyerId(order.getBuyerId())
            .buyerName(buyerName)
            .farmerId(order.getFarmerId())
            .farmerName(farmerName)
            .totalAmount(order.getTotalAmount())
            .refundStatus(order.getRefundStatus() != null ? order.getRefundStatus().name() : null)
            .refundReason(order.getRefundReason())
            .createdAt(order.getCreatedAt())
            .refundHistory(historyItems)
            .build();
    }
}



