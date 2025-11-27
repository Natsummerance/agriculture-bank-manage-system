package com.agriverse.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 电子合同实体
 */
@Entity
@Table(name = "contracts", indexes = {
    @Index(name = "idx_financing_id", columnList = "financing_id"),
    @Index(name = "idx_contract_no", columnList = "contract_no", unique = true),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "financing_id", nullable = false, length = 36)
    private String financingId;
    
    @Column(name = "contract_no", nullable = false, unique = true, length = 50)
    private String contractNo;
    
    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;
    
    @Column(name = "farmer_name", nullable = false, length = 100)
    private String farmerName;
    
    @Column(name = "farmer_id_card", length = 18)
    private String farmerIdCard;
    
    @Column(name = "bank_name", nullable = false, length = 200)
    private String bankName;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;
    
    @Column(name = "term_months", nullable = false)
    private Integer termMonths;
    
    @Column(length = 500)
    private String purpose;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(name = "repayment_method", length = 50)
    private String repaymentMethod;
    
    @Column(name = "contract_content", columnDefinition = "TEXT")
    private String contractContent;
    
    @Column(name = "contract_file_url", length = 500)
    private String contractFileUrl;
    
    @Column(name = "farmer_signature_url", length = 500)
    private String farmerSignatureUrl;
    
    @Column(name = "bank_signature_url", length = 500)
    private String bankSignatureUrl;
    
    @Column(name = "farmer_signed_at")
    private LocalDateTime farmerSignedAt;
    
    @Column(name = "bank_signed_at")
    private LocalDateTime bankSignedAt;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ContractStatus status = ContractStatus.DRAFT;
    
    @Column(name = "blockchain_hash", length = 64)
    private String blockchainHash;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        if (contractNo == null) {
            contractNo = generateContractNo();
        }
    }
    
    private String generateContractNo() {
        return "CT" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) 
               + String.format("%06d", (int)(Math.random() * 1000000));
    }
    
    /**
     * 合同状态枚举
     */
    public enum ContractStatus {
        DRAFT,     // 草稿
        SIGNED,    // 已签署
        CANCELLED  // 已取消
    }
}

