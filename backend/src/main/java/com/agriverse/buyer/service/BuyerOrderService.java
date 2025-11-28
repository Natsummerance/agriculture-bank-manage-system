package com.agriverse.buyer.service;

import com.agriverse.dto.*;
import com.agriverse.entity.BuyerOrder;
import com.agriverse.entity.BuyerOrderItem;
import com.agriverse.entity.FarmerProduct;
import com.agriverse.buyer.repository.BuyerOrderRepository;
import com.agriverse.farmer.repository.FarmerProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 买家订单服务
 */
@Slf4j
@Service
@Transactional
public class BuyerOrderService {

    @Autowired
    private BuyerOrderRepository buyerOrderRepository;

    @Autowired
    private FarmerProductRepository farmerProductRepository;
    
    @Autowired
    private com.agriverse.order.repository.RefundHistoryRepository refundHistoryRepository;

    /**
     * 创建订单
     */
    public BuyerOrderResponse createOrder(String buyerId, CreateOrderRequest request) {
        log.info("创建订单: buyerId={}, items={}", buyerId, request.getItems().size());

        // 创建订单实体
        BuyerOrder order = BuyerOrder.builder()
                .buyerId(buyerId)
                .status(BuyerOrder.OrderStatus.PENDING)
                .shippingName(request.getShippingName())
                .shippingPhone(request.getShippingPhone())
                .shippingAddress(request.getShippingAddress())
                .paymentMethod(request.getPaymentMethod())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // 处理订单项并计算总金额
        double totalAmount = 0.0;
        List<BuyerOrderItem> items = request.getItems().stream()
                .map(itemRequest -> {
                    // 查询商品信息
                    String productId = itemRequest.getProductId();
                    FarmerProduct product = farmerProductRepository.findById(productId)
                            .orElseThrow(() -> new RuntimeException("商品不存在: " + productId));

                    // 检查商品是否已上架
                    if (product.getStatus() != FarmerProduct.ProductStatus.ON) {
                        throw new RuntimeException("商品未上架: " + product.getName());
                    }

                    // 检查库存
                    if (product.getStock() < itemRequest.getQuantity()) {
                        throw new RuntimeException("商品库存不足: " + product.getName() + "，当前库存: " + product.getStock());
                    }

                    // 创建订单项
                    BuyerOrderItem orderItem = BuyerOrderItem.builder()
                            .order(order)
                            .productId(product.getId())
                            .productName(product.getName())
                            .price(product.getPrice())
                            .quantity(itemRequest.getQuantity())
                            .build();

                    return orderItem;
                })
                .collect(Collectors.toList());

        // 计算总金额
        totalAmount = items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        order.setTotalAmount(totalAmount);
        order.setItems(items);

        // 保存订单
        BuyerOrder savedOrder = buyerOrderRepository.save(order);

        // 扣减库存
        for (BuyerOrderItem item : items) {
            String productId = item.getProductId();
            FarmerProduct product = farmerProductRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("商品不存在: " + productId));
            product.setStock(product.getStock() - item.getQuantity());
            farmerProductRepository.save(product);
        }

        log.info("订单创建成功: orderId={}, totalAmount={}", savedOrder.getId(), totalAmount);

        return convertToOrderResponse(savedOrder);
    }

    /**
     * 获取订单列表
     */
    @Transactional(readOnly = true)
    public BuyerOrderListResponse getOrderList(String buyerId, String status, Integer page, Integer pageSize) {
        log.info("获取订单列表: buyerId={}, status={}, page={}, pageSize={}",
                buyerId, status, page, pageSize);

        Pageable pageable = PageRequest.of(
                page - 1,
                pageSize,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<BuyerOrder> orderPage;
        if (status != null && !status.isEmpty() && !"all".equals(status)) {
            // 有状态筛选
            BuyerOrder.OrderStatus orderStatus = convertToOrderStatus(status);
            orderPage = buyerOrderRepository.findByBuyerIdAndStatusOrderByCreatedAtDesc(
                    buyerId, orderStatus, pageable);
        } else {
            // 无状态筛选
            orderPage = buyerOrderRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId, pageable);
        }

        List<BuyerOrderResponse> orderResponses = orderPage.getContent().stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());

        return BuyerOrderListResponse.builder()
                .orders(orderResponses)
                .total(orderPage.getTotalElements())
                .page(page)
                .pageSize(pageSize)
                .build();
    }

    /**
     * 获取订单详情
     */
    @Transactional(readOnly = true)
    public BuyerOrderResponse getOrderDetail(String buyerId, String orderId) {
        log.info("获取订单详情: buyerId={}, orderId={}", buyerId, orderId);

        BuyerOrder order = buyerOrderRepository.findByIdAndBuyerId(orderId, buyerId)
                .orElseThrow(() -> new RuntimeException("订单不存在或无权访问"));

        return convertToOrderResponse(order);
    }

    /**
     * 更新订单状态
     */
    public void updateOrderStatus(String buyerId, String orderId, UpdateOrderStatusRequest request) {
        log.info("更新订单状态: buyerId={}, orderId={}, status={}", buyerId, orderId, request.getStatus());

        BuyerOrder order = buyerOrderRepository.findByIdAndBuyerId(orderId, buyerId)
                .orElseThrow(() -> new RuntimeException("订单不存在或无权访问"));

        BuyerOrder.OrderStatus newStatus = convertToOrderStatus(request.getStatus());
        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());

        buyerOrderRepository.save(order);
        log.info("订单状态已更新: orderId={}, newStatus={}", orderId, newStatus);
    }

    /**
     * 取消订单
     */
    public void cancelOrder(String buyerId, String orderId) {
        log.info("取消订单: buyerId={}, orderId={}", buyerId, orderId);

        BuyerOrder order = buyerOrderRepository.findByIdAndBuyerId(orderId, buyerId)
                .orElseThrow(() -> new RuntimeException("订单不存在或无权访问"));

        // 检查订单状态是否可以取消
        if (order.getStatus() != BuyerOrder.OrderStatus.PENDING &&
                order.getStatus() != BuyerOrder.OrderStatus.PAID) {
            throw new RuntimeException("订单状态不允许取消");
        }

        // 恢复库存
        for (BuyerOrderItem item : order.getItems()) {
            String productId = item.getProductId();
            FarmerProduct product = farmerProductRepository.findById(productId)
                    .orElse(null);
            if (product != null) {
                product.setStock(product.getStock() + item.getQuantity());
                farmerProductRepository.save(product);
            }
        }

        order.setStatus(BuyerOrder.OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        buyerOrderRepository.save(order);

        log.info("订单已取消: orderId={}", orderId);
    }

    /**
     * 将实体转换为DTO
     */
    private BuyerOrderResponse convertToOrderResponse(BuyerOrder order) {
        List<BuyerOrderResponse.OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> BuyerOrderResponse.OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .productImage(item.getProductImage())
                        .build())
                .collect(Collectors.toList());

        return BuyerOrderResponse.builder()
                .id(order.getId())
                .buyerId(order.getBuyerId())
                .status(convertStatusToString(order.getStatus()))
                .totalAmount(order.getTotalAmount())
                .shippingName(order.getShippingName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .refundStatus(
                        order.getRefundStatus() != null ? convertRefundStatusToString(order.getRefundStatus()) : null)
                .refundReason(order.getRefundReason())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    /**
     * 将字符串转换为订单状态枚举
     */
    private BuyerOrder.OrderStatus convertToOrderStatus(String status) {
        switch (status.toLowerCase()) {
            case "pending":
                return BuyerOrder.OrderStatus.PENDING;
            case "paid":
                return BuyerOrder.OrderStatus.PAID;
            case "to-ship":
            case "to_ship":
                return BuyerOrder.OrderStatus.TO_SHIP;
            case "shipped":
                return BuyerOrder.OrderStatus.SHIPPED;
            case "completed":
                return BuyerOrder.OrderStatus.COMPLETED;
            case "refunding":
                return BuyerOrder.OrderStatus.REFUNDING;
            case "refunded":
                return BuyerOrder.OrderStatus.REFUNDED;
            case "cancelled":
                return BuyerOrder.OrderStatus.CANCELLED;
            default:
                throw new RuntimeException("无效的订单状态: " + status);
        }
    }

    /**
     * 将订单状态枚举转换为字符串
     */
    private String convertStatusToString(BuyerOrder.OrderStatus status) {
        switch (status) {
            case PENDING:
                return "pending";
            case PAID:
                return "paid";
            case TO_SHIP:
                return "to-ship";
            case SHIPPED:
                return "shipped";
            case COMPLETED:
                return "completed";
            case REFUNDING:
                return "refunding";
            case REFUNDED:
                return "refunded";
            case CANCELLED:
                return "cancelled";
            default:
                return status.name().toLowerCase();
        }
    }

    /**
     * 将退款状态枚举转换为字符串
     */
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
    
    /**
     * 申请退款
     */
    public void applyRefund(String buyerId, String orderId, String reason) {
        log.info("申请退款: buyerId={}, orderId={}, reason={}", buyerId, orderId, reason);
        
        BuyerOrder order = buyerOrderRepository.findByIdAndBuyerId(orderId, buyerId)
            .orElseThrow(() -> new RuntimeException("订单不存在或无权访问"));
        
        // 检查订单状态是否可以申请退款
        if (order.getStatus() != BuyerOrder.OrderStatus.PAID &&
            order.getStatus() != BuyerOrder.OrderStatus.SHIPPED &&
            order.getStatus() != BuyerOrder.OrderStatus.COMPLETED) {
            throw new RuntimeException("订单状态不允许申请退款");
        }
        
        // 检查是否已有退款申请
        if (order.getRefundStatus() != null && 
            order.getRefundStatus() != BuyerOrder.RefundStatus.REJECTED &&
            order.getRefundStatus() != BuyerOrder.RefundStatus.FAILED) {
            throw new RuntimeException("该订单已有退款申请");
        }
        
        // 更新订单退款状态
        order.setRefundStatus(BuyerOrder.RefundStatus.PENDING);
        order.setRefundReason(reason);
        order.setStatus(BuyerOrder.OrderStatus.REFUNDING);
        order.setUpdatedAt(LocalDateTime.now());
        buyerOrderRepository.save(order);
        
        // 创建退款历史记录
        com.agriverse.entity.RefundHistory refundHistory = com.agriverse.entity.RefundHistory.builder()
            .orderId(orderId)
            .action("申请退款")
            .actor(com.agriverse.entity.RefundHistory.ActorType.BUYER)
            .note(reason)
            .build();
        refundHistoryRepository.save(refundHistory);
        
        log.info("退款申请已提交: orderId={}", orderId);
    }
    
    /**
     * 获取退款详情
     */
    @Transactional(readOnly = true)
    public Object getRefundDetail(String buyerId, String orderId) {
        log.info("获取退款详情: buyerId={}, orderId={}", buyerId, orderId);
        
        BuyerOrder order = buyerOrderRepository.findByIdAndBuyerId(orderId, buyerId)
            .orElseThrow(() -> new RuntimeException("订单不存在或无权访问"));
        
        // 获取退款历史记录
        List<com.agriverse.entity.RefundHistory> history = refundHistoryRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
        
        // 构建退款详情响应
        java.util.Map<String, Object> refundDetail = new java.util.HashMap<>();
        refundDetail.put("orderId", orderId);
        refundDetail.put("refundStatus", order.getRefundStatus() != null ? convertRefundStatusToString(order.getRefundStatus()) : null);
        refundDetail.put("refundReason", order.getRefundReason());
        refundDetail.put("totalAmount", order.getTotalAmount());
        refundDetail.put("history", history.stream().map(h -> {
            java.util.Map<String, Object> item = new java.util.HashMap<>();
            item.put("action", h.getAction());
            item.put("actor", h.getActor().name().toLowerCase());
            item.put("note", h.getNote());
            item.put("createdAt", h.getCreatedAt());
            return item;
        }).collect(Collectors.toList()));
        
        return refundDetail;
    }
}
