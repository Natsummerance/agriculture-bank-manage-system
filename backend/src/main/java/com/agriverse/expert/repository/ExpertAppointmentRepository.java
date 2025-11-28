package com.agriverse.expert.repository;

import com.agriverse.expert.entity.ExpertAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpertAppointmentRepository extends JpaRepository<ExpertAppointment, String>, JpaSpecificationExecutor<ExpertAppointment> {
    List<ExpertAppointment> findByExpertId(String expertId);
    
    List<ExpertAppointment> findByFarmerId(String farmerId);
    
    List<ExpertAppointment> findByExpertIdAndStatus(String expertId, ExpertAppointment.AppointmentStatus status);
    
    List<ExpertAppointment> findByExpertIdAndAppointmentDate(
        String expertId, LocalDate appointmentDate);
    
    @Query("SELECT a FROM ExpertAppointment a WHERE a.expertId = :expertId " +
           "AND a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate")
    List<ExpertAppointment> findByExpertIdAndDateRange(
        @Param("expertId") String expertId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
}

