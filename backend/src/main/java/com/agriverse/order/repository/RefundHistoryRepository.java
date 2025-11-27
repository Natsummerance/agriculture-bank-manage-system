package com.agriverse.order.repository;

import com.agriverse.entity.RefundHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefundHistoryRepository extends JpaRepository<RefundHistory, String> {
    List<RefundHistory> findByOrderIdOrderByCreatedAtDesc(String orderId);
}



