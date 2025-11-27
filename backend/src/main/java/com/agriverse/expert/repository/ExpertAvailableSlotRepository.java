package com.agriverse.expert.repository;

import com.agriverse.expert.entity.ExpertAvailableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpertAvailableSlotRepository extends JpaRepository<ExpertAvailableSlot, String> {
    List<ExpertAvailableSlot> findByExpertId(String expertId);
    
    List<ExpertAvailableSlot> findByExpertIdAndSlotDate(String expertId, LocalDate slotDate);
    
    List<ExpertAvailableSlot> findByExpertIdAndIsAvailableAndIsBooked(
        String expertId, Boolean isAvailable, Boolean isBooked);
    
    @Query("SELECT s FROM ExpertAvailableSlot s WHERE s.expertId = :expertId " +
           "AND s.slotDate >= :startDate AND s.slotDate <= :endDate " +
           "AND s.isAvailable = true AND s.isBooked = false")
    List<ExpertAvailableSlot> findAvailableSlotsInRange(
        @Param("expertId") String expertId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
}



