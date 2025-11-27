package com.agriverse.admin.service;

import com.agriverse.admin.dto.OrderSearchRequest;
import com.agriverse.admin.dto.OrderStatisticsResponse;
import com.agriverse.entity.Order;
import com.agriverse.order.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminOrderService {
    private final OrderRepository orderRepository;

    /**
     * 获取订单统计
     */
    public OrderStatisticsResponse getOrderStatistics() {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(23, 59, 59);

        // 订单总数和总额
        List<Order> allOrders = orderRepository.findAll();
        Long totalOrders = (long) allOrders.size();
        BigDecimal totalAmount = allOrders.stream()
            .map(Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 今日订单
        List<Order> todayOrders = orderRepository.findByCreatedAtBetween(todayStart, todayEnd);
        Integer todayOrdersCount = todayOrders.size();
        BigDecimal todayAmount = todayOrders.stream()
            .map(Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 订单状态分布
        Map<String, Long> statusDistribution = new HashMap<>();
        for (Order.OrderStatus status : Order.OrderStatus.values()) {
            Long count = orderRepository.countByStatus(status);
            if (count > 0) {
                statusDistribution.put(status.name(), count);
            }
        }

        // 退款状态分布
        Map<String, Long> refundStatusDistribution = new HashMap<>();
        List<Order> refundOrders = orderRepository.findAll().stream()
            .filter(o -> o.getRefundStatus() != null)
            .collect(java.util.stream.Collectors.toList());
        refundStatusDistribution = refundOrders.stream()
            .filter(o -> o.getRefundStatus() != null)
            .collect(Collectors.groupingBy(
                o -> o.getRefundStatus().name(),
                Collectors.counting()
            ));

        return OrderStatisticsResponse.builder()
            .totalOrders(totalOrders)
            .totalAmount(totalAmount)
            .todayOrders(todayOrdersCount)
            .todayAmount(todayAmount)
            .statusDistribution(statusDistribution)
            .refundStatusDistribution(refundStatusDistribution)
            .build();
    }

    /**
     * 搜索订单
     */
    public Page<Order> searchOrders(OrderSearchRequest request) {
        Specification<Order> spec = Specification.where(null);

        if (request.getBuyerId() != null && !request.getBuyerId().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("buyerId"), request.getBuyerId()));
        }

        if (request.getFarmerId() != null && !request.getFarmerId().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("farmerId"), request.getFarmerId()));
        }

        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), Order.OrderStatus.valueOf(request.getStatus())));
        }

        if (request.getRefundStatus() != null && !request.getRefundStatus().isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("refundStatus"), Order.RefundStatus.valueOf(request.getRefundStatus())));
        }

        if (request.getStartTime() != null && request.getEndTime() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.between(root.get("createdAt"), request.getStartTime(), request.getEndTime()));
        }

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(),
            Sort.by(Sort.Direction.DESC, "createdAt"));

        return orderRepository.findAll(spec, pageable);
    }

    /**
     * 获取订单详情
     */
    public Order getOrderDetail(String orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("订单不存在"));
    }
}

