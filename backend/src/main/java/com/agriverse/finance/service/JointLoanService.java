package com.agriverse.finance.service;

import com.agriverse.exception.BusinessException;
import com.agriverse.finance.entity.FinancingApplication;
import com.agriverse.finance.entity.JointLoanGroup;
import com.agriverse.finance.entity.JointLoanMember;
import com.agriverse.finance.repository.FinancingApplicationRepository;
import com.agriverse.finance.repository.JointLoanGroupRepository;
import com.agriverse.finance.repository.JointLoanMemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 智能拼单服务
 */
@Service
@RequiredArgsConstructor
@Transactional
public class JointLoanService {
    private final JointLoanGroupRepository groupRepository;
    private final JointLoanMemberRepository memberRepository;
    private final FinancingApplicationRepository applicationRepository;
    
    /**
     * 创建拼单组
     */
    public JointLoanGroup createGroup(BigDecimal amount, String farmerId) {
        JointLoanGroup group = JointLoanGroup.builder()
            .groupName("智能拼单组-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")))
            .totalAmount(amount)
            .minAmount(BigDecimal.valueOf(200000)) // 最低拼单金额
            .status(JointLoanGroup.GroupStatus.MATCHING)
            .matchedCount(1)
            .targetCount(calculateTargetCount(amount))
            .createdBy(farmerId)
            .build();
        
        return groupRepository.save(group);
    }
    
    /**
     * 加入拼单组
     */
    public JointLoanMember joinGroup(String groupId, String farmerId, BigDecimal amount, String purpose) {
        JointLoanGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new EntityNotFoundException("拼单组不存在"));
        
        if (group.getStatus() != JointLoanGroup.GroupStatus.MATCHING) {
            throw new BusinessException("该拼单组已不可加入");
        }
        
        // 检查是否已经加入
        List<JointLoanMember> existingMembers = memberRepository.findByGroupId(groupId);
        boolean alreadyJoined = existingMembers.stream()
            .anyMatch(m -> m.getFarmerId().equals(farmerId));
        if (alreadyJoined) {
            throw new BusinessException("您已经加入该拼单组");
        }
        
        JointLoanMember member = JointLoanMember.builder()
            .groupId(groupId)
            .farmerId(farmerId)
            .amount(amount)
            .purpose(purpose)
            .status(JointLoanMember.MemberStatus.PENDING)
            .build();
        
        JointLoanMember saved = memberRepository.save(member);
        
        // 更新拼单组状态
        BigDecimal totalAmount = memberRepository.getTotalConfirmedAmount(groupId)
            .add(amount);
        
        if (totalAmount.compareTo(group.getMinAmount()) >= 0) {
            group.setStatus(JointLoanGroup.GroupStatus.MATCHED);
        }
        
        group.setMatchedCount(group.getMatchedCount() + 1);
        groupRepository.save(group);
        
        return saved;
    }
    
    /**
     * 确认拼单并提交申请
     */
    public List<FinancingApplication> confirmAndApply(String groupId) {
        JointLoanGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new EntityNotFoundException("拼单组不存在"));
        
        List<JointLoanMember> members = memberRepository.findByGroupId(groupId);
        members = members.stream()
            .filter(m -> m.getStatus() == JointLoanMember.MemberStatus.PENDING)
            .collect(Collectors.toList());
        
        if (members.isEmpty()) {
            throw new BusinessException("没有待确认的成员");
        }
        
        List<FinancingApplication> applications = new ArrayList<>();
        
        for (JointLoanMember member : members) {
            member.setStatus(JointLoanMember.MemberStatus.CONFIRMED);
            memberRepository.save(member);
            
            // 为每个成员创建融资申请
            FinancingApplication application = FinancingApplication.builder()
                .farmerId(member.getFarmerId())
                .amount(member.getAmount())
                .termMonths(12) // 默认12个月
                .purpose(member.getPurpose())
                .status(FinancingApplication.FinancingStatus.APPLIED)
                .build();
            
            FinancingApplication saved = applicationRepository.save(application);
            member.setFinancingId(saved.getId());
            memberRepository.save(member);
            
            applications.add(saved);
        }
        
        group.setStatus(JointLoanGroup.GroupStatus.APPLIED);
        groupRepository.save(group);
        
        return applications;
    }
    
    /**
     * 获取拼单组详情
     */
    public JointLoanGroup getGroupById(String id) {
        return groupRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("拼单组不存在"));
    }
    
    /**
     * 获取拼单组成员列表
     */
    public List<JointLoanMember> getGroupMembers(String groupId) {
        return memberRepository.findByGroupId(groupId);
    }
    
    /**
     * 获取匹配候选（可加入的拼单组列表）
     */
    public List<JointLoanGroup> getMatchCandidates(BigDecimal amount, String farmerId) {
        // 查询状态为MATCHING的拼单组
        List<JointLoanGroup> matchingGroups = groupRepository.findByStatus(JointLoanGroup.GroupStatus.MATCHING);
        
        // 过滤掉已加入的拼单组
        List<String> joinedGroupIds = memberRepository.findByFarmerId(farmerId).stream()
            .map(JointLoanMember::getGroupId)
            .collect(Collectors.toList());
        
        return matchingGroups.stream()
            .filter(group -> !joinedGroupIds.contains(group.getId()))
            .filter(group -> {
                // 如果指定了金额，筛选金额相近的拼单组
                if (amount != null) {
                    BigDecimal currentTotal = memberRepository.getTotalConfirmedAmount(group.getId());
                    BigDecimal remaining = group.getMinAmount().subtract(currentTotal);
                    // 剩余金额应该大于等于申请金额的50%，且不超过申请金额的200%
                    return remaining.compareTo(amount.multiply(BigDecimal.valueOf(0.5))) >= 0 &&
                           remaining.compareTo(amount.multiply(BigDecimal.valueOf(2))) <= 0;
                }
                return true;
            })
            .collect(Collectors.toList());
    }
    
    /**
     * 退出拼单组
     */
    public void quitGroup(String groupId, String farmerId) {
        JointLoanGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new EntityNotFoundException("拼单组不存在"));
        
        if (group.getStatus() != JointLoanGroup.GroupStatus.MATCHING) {
            throw new BusinessException("只有匹配中的拼单组可以退出");
        }
        
        List<JointLoanMember> members = memberRepository.findByGroupId(groupId);
        JointLoanMember member = members.stream()
            .filter(m -> m.getFarmerId().equals(farmerId))
            .findFirst()
            .orElseThrow(() -> new EntityNotFoundException("您未加入该拼单组"));
        
        if (member.getStatus() == JointLoanMember.MemberStatus.CONFIRMED) {
            throw new BusinessException("已确认的成员不能退出");
        }
        
        // 删除成员
        memberRepository.delete(member);
        
        // 更新拼单组状态
        group.setMatchedCount(Math.max(0, group.getMatchedCount() - 1));
        
        // 如果拼单组只剩创建者，可以取消拼单组
        List<JointLoanMember> remainingMembers = memberRepository.findByGroupId(groupId);
        if (remainingMembers.isEmpty() || 
            (remainingMembers.size() == 1 && remainingMembers.get(0).getFarmerId().equals(group.getCreatedBy()))) {
            group.setStatus(JointLoanGroup.GroupStatus.CANCELLED);
        }
        
        groupRepository.save(group);
    }
    
    /**
     * 计算目标农户数
     */
    private Integer calculateTargetCount(BigDecimal amount) {
        BigDecimal minAmount = BigDecimal.valueOf(200000);
        return amount.divide(minAmount, 0, RoundingMode.UP).intValue();
    }
}


