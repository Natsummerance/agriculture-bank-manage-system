package com.agriverse.bank.service;

import com.agriverse.auth.repository.UserRepository;
import com.agriverse.bank.dto.CustomerContactRequest;
import com.agriverse.bank.dto.CustomerDetailResponse;
import com.agriverse.bank.dto.CustomerSearchRequest;
import com.agriverse.bank.entity.BankCustomerRelation;
import com.agriverse.bank.entity.CustomerContactRecord;
import com.agriverse.bank.entity.CreditScore;
import com.agriverse.bank.repository.BankCustomerRelationRepository;
import com.agriverse.bank.repository.CreditScoreRepository;
import com.agriverse.bank.repository.CustomerContactRecordRepository;
import com.agriverse.entity.User;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * 银行客户服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BankCustomerService {
    private final BankCustomerRelationRepository relationRepository;
    private final CustomerContactRecordRepository contactRepository;
    private final FinancingApplicationRepository applicationRepository;
    private final CreditScoreRepository creditScoreRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * 搜索客户
     */
    public Page<BankCustomerRelation> searchCustomers(CustomerSearchRequest request, String bankId) {
        Specification<BankCustomerRelation> spec = Specification.where(null);
        
        spec = spec.and((root, query, cb) -> cb.equal(root.get("bankId"), bankId));
        
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            String keyword = "%" + request.getKeyword() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                cb.like(root.get("customerName"), keyword),
                cb.like(root.get("customerPhone"), keyword)
            ));
        }
        
        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), 
                    BankCustomerRelation.RelationStatus.valueOf(request.getStatus())));
        }
        
        if (request.getLocation() != null && !request.getLocation().isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.like(root.get("customerLocation"), "%" + request.getLocation() + "%"));
        }
        
        if (request.getMinLoans() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.greaterThanOrEqualTo(root.get("totalLoans"), request.getMinLoans()));
        }
        
        if (request.getMaxLoans() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.lessThanOrEqualTo(root.get("totalLoans"), request.getMaxLoans()));
        }
        
        Pageable pageable = PageRequest.of(
            request.getPage() != null ? request.getPage() : 0,
            request.getSize() != null ? request.getSize() : 20,
            Sort.by(Sort.Direction.DESC, "updatedAt"));
        
        return relationRepository.findAll(spec, pageable);
    }
    
    /**
     * 获取客户详情
     */
    public CustomerDetailResponse getCustomerDetail(String relationId) {
        BankCustomerRelation relation = relationRepository.findById(relationId)
            .orElseThrow(() -> new EntityNotFoundException("客户关系不存在"));
        
        // 获取贷款历史
        List<FinancingApplication> loanHistory = applicationRepository
            .findByFarmerId(relation.getCustomerId());
        
        // 获取信用评分历史
        List<CreditScore> creditHistory = creditScoreRepository
            .findByFarmerIdOrderByCreatedAtDesc(relation.getCustomerId());
        
        // 获取联系记录
        List<CustomerContactRecord> contactRecords = contactRepository
            .findByCustomerRelationIdOrderByContactDateDesc(relationId);
        
        return CustomerDetailResponse.builder()
            .id(relation.getId())
            .customerId(relation.getCustomerId())
            .customerName(relation.getCustomerName())
            .customerPhone(relation.getCustomerPhone())
            .customerLocation(relation.getCustomerLocation())
            .customerType(relation.getCustomerType() != null ? relation.getCustomerType().name() : null)
            .status(relation.getStatus() != null ? relation.getStatus().name() : null)
            .totalLoans(relation.getTotalLoans())
            .totalAmount(relation.getTotalAmount())
            .currentLoans(relation.getCurrentLoans())
            .currentAmount(relation.getCurrentAmount())
            .tags(parseTags(relation.getTags()))
            .notes(relation.getNotes())
            .lastContactAt(relation.getLastContactAt())
            .loanHistory(loanHistory)
            .creditHistory(creditHistory)
            .contactRecords(contactRecords)
            .build();
    }
    
    /**
     * 添加客户联系记录
     */
    public CustomerContactRecord addContactRecord(CustomerContactRequest request, String createdBy) {
        BankCustomerRelation relation = relationRepository.findById(request.getCustomerRelationId())
            .orElseThrow(() -> new EntityNotFoundException("客户关系不存在"));
        
        CustomerContactRecord record = CustomerContactRecord.builder()
            .id(UUID.randomUUID().toString())
            .customerRelationId(request.getCustomerRelationId())
            .contactType(CustomerContactRecord.ContactType.valueOf(request.getContactType()))
            .contactDate(request.getContactDate())
            .contactPerson(request.getContactPerson())
            .contactContent(request.getContactContent())
            .nextFollowupDate(request.getNextFollowupDate())
            .createdBy(createdBy)
            .build();
        
        CustomerContactRecord saved = contactRepository.save(record);
        
        // 更新最后联系时间
        relation.setLastContactAt(request.getContactDate());
        relationRepository.save(relation);
        
        return saved;
    }
    
    /**
     * 更新客户信息
     */
    public BankCustomerRelation updateCustomer(String relationId, String tags, String notes) {
        BankCustomerRelation relation = relationRepository.findById(relationId)
            .orElseThrow(() -> new EntityNotFoundException("客户关系不存在"));
        
        if (tags != null) {
            relation.setTags(tags);
        }
        if (notes != null) {
            relation.setNotes(notes);
        }
        
        return relationRepository.save(relation);
    }
    
    /**
     * 同步客户数据（从融资申请中）
     */
    public void syncCustomerData(String bankId, String customerId) {
        Optional<BankCustomerRelation> relationOpt = relationRepository
            .findByBankIdAndCustomerId(bankId, customerId);
        
        User customer = userRepository.findById(customerId)
            .orElseThrow(() -> new EntityNotFoundException("客户不存在"));
        
        List<FinancingApplication> applications = applicationRepository
            .findByFarmerId(customerId);
        
        int totalLoans = applications.size();
        BigDecimal totalAmount = applications.stream()
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long currentLoans = applications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.DISBURSED ||
                        a.getStatus() == FinancingApplication.FinancingStatus.REPAYING)
            .count();
        
        BigDecimal currentAmount = applications.stream()
            .filter(a -> a.getStatus() == FinancingApplication.FinancingStatus.DISBURSED ||
                        a.getStatus() == FinancingApplication.FinancingStatus.REPAYING)
            .map(FinancingApplication::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BankCustomerRelation relation = relationOpt.orElse(BankCustomerRelation.builder()
            .id(UUID.randomUUID().toString())
            .bankId(bankId)
            .customerId(customerId)
            .customerName(customer.getName() != null ? customer.getName() : customer.getPhone())
            .customerPhone(customer.getPhone())
            .customerLocation(customer.getLocation())
            .build());
        
        relation.setTotalLoans(totalLoans);
        relation.setTotalAmount(totalAmount);
        relation.setCurrentLoans((int) currentLoans);
        relation.setCurrentAmount(currentAmount);
        
        relationRepository.save(relation);
    }
    
    private List<String> parseTags(String tagsJson) {
        if (tagsJson == null || tagsJson.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(tagsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("解析客户标签失败: {}", tagsJson, e);
            return new ArrayList<>();
        }
    }
}

