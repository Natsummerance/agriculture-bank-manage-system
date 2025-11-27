package com.agriverse.admin.service;

import com.agriverse.admin.dto.AdminDashboardStatisticsResponse;
import com.agriverse.admin.entity.AdminContentAudit;
import com.agriverse.admin.entity.AdminProductAudit;
import com.agriverse.admin.repository.AdminContentAuditRepository;
import com.agriverse.admin.repository.AdminProductAuditRepository;
import com.agriverse.bank.dto.TrendData;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    private final AdminProductAuditRepository productAuditRepository;
    private final AdminContentAuditRepository contentAuditRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final com.agriverse.order.repository.OrderRepository orderRepository;
    
    /**
     * 获取仪表盘统计数据
     */
    public AdminDashboardStatisticsResponse getDashboardStatistics() {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(23, 59, 59);
        
        // 今日PV/UV（需要访问日志统计，这里使用模拟数据）
        Long todayPV = getTodayPV();
        Long totalPV = getTotalPV();
        Long todayUV = getTodayUV();
        Long totalUV = getTotalUV();
        
        // 今日交易额和订单
        List<com.agriverse.entity.Order> todayOrders = orderRepository.findByCreatedAtBetween(todayStart, todayEnd);
        BigDecimal todayRevenue = todayOrders.stream()
            .map(com.agriverse.entity.Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        Integer todayOrdersCount = todayOrders.size();
        
        // 累计数据
        List<com.agriverse.entity.Order> allOrders = orderRepository.findAll();
        BigDecimal totalRevenue = allOrders.stream()
            .map(com.agriverse.entity.Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        Integer totalOrdersCount = allOrders.size();
        
        // 待审核商品
        Integer pendingProducts = productAuditRepository
            .findByAuditStatus(AdminProductAudit.AuditStatus.PENDING).size();
        
        // 待审核内容
        Integer pendingContent = contentAuditRepository
            .findByAuditStatus(AdminContentAudit.AuditStatus.PENDING).size();
        
        // 在途融资
        List<FinancingApplication> activeFinancing = applicationRepository
            .findByStatusIn(List.of(
                FinancingApplication.FinancingStatus.APPLIED,
                FinancingApplication.FinancingStatus.REVIEWING,
                FinancingApplication.FinancingStatus.APPROVED,
                FinancingApplication.FinancingStatus.SIGNED,
                FinancingApplication.FinancingStatus.DISBURSED,
                FinancingApplication.FinancingStatus.REPAYING));
        
        Integer activeFinancingCount = activeFinancing.size();
        BigDecimal totalFinancingAmount = activeFinancing.stream()
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 趋势数据
        List<TrendData> orderTrend = getOrderTrend(6);
        List<TrendData> revenueTrend = getRevenueTrend(6);
        
        return AdminDashboardStatisticsResponse.builder()
            .todayPV(todayPV)
            .totalPV(totalPV)
            .todayUV(todayUV)
            .totalUV(totalUV)
            .todayRevenue(todayRevenue)
            .totalRevenue(totalRevenue)
            .todayOrders(todayOrdersCount)
            .totalOrders(totalOrdersCount)
            .pendingProducts(pendingProducts)
            .pendingContent(pendingContent)
            .activeFinancing(activeFinancingCount)
            .totalFinancingAmount(totalFinancingAmount)
            .orderTrend(orderTrend)
            .revenueTrend(revenueTrend)
            .build();
    }
    
    /**
     * 获取订单趋势
     */
    private List<TrendData> getOrderTrend(int months) {
        List<TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            List<com.agriverse.entity.Order> orders = orderRepository.findByCreatedAtBetween(
                monthStart.atStartOfDay(),
                monthEnd.atTime(23, 59, 59));
            
            trend.add(new TrendData(
                monthStart.format(DateTimeFormatter.ofPattern("M月")),
                BigDecimal.valueOf(orders.size())
            ));
        }
        
        return trend;
    }
    
    /**
     * 获取交易额趋势
     */
    private List<TrendData> getRevenueTrend(int months) {
        List<TrendData> trend = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = endDate.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            
            List<com.agriverse.entity.Order> orders = orderRepository.findByCreatedAtBetween(
                monthStart.atStartOfDay(),
                monthEnd.atTime(23, 59, 59));
            
            BigDecimal amount = orders.stream()
                .map(com.agriverse.entity.Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            trend.add(new TrendData(
                monthStart.format(DateTimeFormatter.ofPattern("M月")),
                amount
            ));
        }
        
        return trend;
    }
    
    // TODO: 实现PV/UV统计（需要访问日志表）
    private Long getTodayPV() {
        return 0L; // 需要从访问日志表统计
    }
    
    private Long getTotalPV() {
        return 0L; // 需要从访问日志表统计
    }
    
    private Long getTodayUV() {
        return 0L; // 需要从访问日志表统计
    }
    
    private Long getTotalUV() {
        return 0L; // 需要从访问日志表统计
    }
}

