package com.agriverse.expert.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

/**
 * 农户评价实体
 */
@Entity
@Table(name = "farmer_reviews", indexes = {
    @Index(name = "idx_expert_id", columnList = "expertId"),
    @Index(name = "idx_farmer_id", columnList = "farmerId"),
    @Index(name = "idx_rating", columnList = "rating"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerReview {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "expert_id", nullable = false, length = 36)
    private String expertId;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(name = "farmer_name", length = 100)
    private String farmerName;
    
    @Column(name = "appointment_id", length = 36)
    private String appointmentId;
    
    @Column(nullable = false)
    private Integer rating; // 1-5
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}



