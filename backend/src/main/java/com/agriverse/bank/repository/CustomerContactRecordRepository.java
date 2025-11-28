package com.agriverse.bank.repository;

import com.agriverse.bank.entity.CustomerContactRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 客户联系记录Repository
 */
@Repository
public interface CustomerContactRecordRepository extends JpaRepository<CustomerContactRecord, String> {
    List<CustomerContactRecord> findByCustomerRelationIdOrderByContactDateDesc(String customerRelationId);
    
    @Query("SELECT r FROM CustomerContactRecord r WHERE r.customerRelationId = :relationId " +
           "AND r.contactDate >= :startDate AND r.contactDate <= :endDate")
    List<CustomerContactRecord> findByDateRange(@Param("relationId") String relationId,
                                                 @Param("startDate") LocalDateTime startDate,
                                                 @Param("endDate") LocalDateTime endDate);
}



