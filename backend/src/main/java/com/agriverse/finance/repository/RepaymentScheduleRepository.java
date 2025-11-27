package com.agriverse.finance.repository;

import com.agriverse.finance.entity.RepaymentSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * 还款计划Repository
 */
@Repository
public interface RepaymentScheduleRepository extends JpaRepository<RepaymentSchedule, String> {
    /**
     * 根据融资申请ID查询还款计划，按期数升序
     */
    List<RepaymentSchedule> findByFinancingIdOrderByInstallmentNumberAsc(String financingId);
    
    /**
     * 根据融资申请ID和状态查询还款计划
     */
    List<RepaymentSchedule> findByFinancingIdAndStatus(String financingId, 
                                                        RepaymentSchedule.ScheduleStatus status);
    
    /**
     * 查询逾期的还款计划
     */
    @Query("SELECT r FROM RepaymentSchedule r WHERE r.dueDate < :date " +
           "AND r.status = 'PENDING'")
    List<RepaymentSchedule> findOverdueSchedules(@Param("date") LocalDate date);
    
    /**
     * 查询指定日期范围内到期的还款计划
     */
    @Query("SELECT r FROM RepaymentSchedule r WHERE r.dueDate >= :startDate " +
           "AND r.dueDate <= :endDate AND r.status = 'PENDING'")
    List<RepaymentSchedule> findUpcomingSchedules(@Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate);
}

