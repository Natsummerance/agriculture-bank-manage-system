package com.agriverse.finance.repository;

import com.agriverse.finance.entity.FinancingTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 融资时间线Repository
 */
@Repository
public interface FinancingTimelineRepository extends JpaRepository<FinancingTimeline, String> {
    /**
     * 根据融资申请ID查询时间线，按创建时间升序
     */
    List<FinancingTimeline> findByFinancingIdOrderByCreatedAtAsc(String financingId);
}

