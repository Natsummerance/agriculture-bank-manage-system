package com.agriverse.admin.service;

import com.agriverse.admin.dto.OperationLogSearchRequest;
import com.agriverse.admin.entity.AdminOperationLog;
import com.agriverse.admin.repository.AdminOperationLogRepository;
import com.agriverse.entity.User;
import com.agriverse.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminOperationLogService {
    private final AdminOperationLogRepository logRepository;
    private final UserRepository userRepository;
    
    /**
     * 记录操作日志
     */
    public void logOperation(String operatorId, AdminOperationLog.ActionType actionType,
                             String actionDetail, AdminOperationLog.TargetType targetType,
                             String targetId, String targetName) {
        User operator = userRepository.findById(operatorId).orElse(null);
        
        AdminOperationLog log = AdminOperationLog.builder()
            .id(UUID.randomUUID().toString())
            .operatorId(operatorId)
            .operatorName(operator != null ? operator.getName() : null)
            .operatorRole(operator != null ? (operator.getRole() != null ? operator.getRole().name() : null) : null)
            .actionType(actionType)
            .actionDetail(actionDetail)
            .targetType(targetType)
            .targetId(targetId)
            .targetName(targetName)
            .result(AdminOperationLog.OperationResult.SUCCESS)
            .build();
        
        logRepository.save(log);
    }
    
    /**
     * 记录失败操作日志
     */
    public void logFailedOperation(String operatorId, AdminOperationLog.ActionType actionType,
                                  String actionDetail, String errorMessage) {
        User operator = userRepository.findById(operatorId).orElse(null);
        
        AdminOperationLog log = AdminOperationLog.builder()
            .id(UUID.randomUUID().toString())
            .operatorId(operatorId)
            .operatorName(operator != null ? operator.getName() : null)
            .operatorRole(operator != null ? (operator.getRole() != null ? operator.getRole().name() : null) : null)
            .actionType(actionType)
            .actionDetail(actionDetail)
            .result(AdminOperationLog.OperationResult.FAILED)
            .errorMessage(errorMessage)
            .build();
        
        logRepository.save(log);
    }
    
    /**
     * 搜索操作日志
     */
    public Page<AdminOperationLog> searchLogs(OperationLogSearchRequest request) {
        Specification<AdminOperationLog> spec = Specification.where(null);
        
        if (request.getActionType() != null && !request.getActionType().isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("actionType"), 
                    AdminOperationLog.ActionType.valueOf(request.getActionType())));
        }
        
        if (request.getTargetType() != null && !request.getTargetType().isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("targetType"), 
                    AdminOperationLog.TargetType.valueOf(request.getTargetType())));
        }
        
        if (request.getOperatorId() != null && !request.getOperatorId().isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("operatorId"), request.getOperatorId()));
        }
        
        if (request.getResult() != null && !request.getResult().isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("result"), 
                    AdminOperationLog.OperationResult.valueOf(request.getResult())));
        }
        
        if (request.getStartTime() != null && request.getEndTime() != null) {
            spec = spec.and((root, query, cb) -> 
                cb.between(root.get("createdAt"), request.getStartTime(), request.getEndTime()));
        }
        
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(),
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return logRepository.findAll(spec, pageable);
    }
}



