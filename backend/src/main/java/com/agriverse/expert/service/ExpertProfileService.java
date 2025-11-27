package com.agriverse.expert.service;

import com.agriverse.expert.dto.ServicePriceUpdateRequest;
import com.agriverse.expert.entity.ExpertProfile;
import com.agriverse.expert.entity.FarmerReview;
import com.agriverse.expert.repository.ExpertProfileRepository;
import com.agriverse.expert.repository.FarmerReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpertProfileService {
    private final ExpertProfileRepository profileRepository;
    private final FarmerReviewRepository reviewRepository;
    
    /**
     * 获取专家资料
     */
    public ExpertProfile getExpertProfile(String expertId) {
        return profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
    }
    
    /**
     * 更新服务价格
     */
    public ExpertProfile updateServicePrice(ServicePriceUpdateRequest request, String expertId) {
        ExpertProfile profile = profileRepository.findByExpertId(expertId)
            .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
        
        if (request.getServicePrice() != null) {
            profile.setServicePrice(request.getServicePrice());
        }
        if (request.getQaPrice() != null) {
            profile.setQaPrice(request.getQaPrice());
        }
        
        return profileRepository.save(profile);
    }
    
    /**
     * 获取农户评价
     */
    public Page<FarmerReview> getFarmerReviews(String expertId, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size, 
            Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return reviewRepository.findByExpertId(expertId, pageable);
    }
    
    /**
     * 更新专家评分
     */
    public void updateExpertRating(String expertId) {
        BigDecimal averageRating = reviewRepository.getAverageRating(expertId);
        if (averageRating != null) {
            ExpertProfile profile = profileRepository.findByExpertId(expertId)
                .orElseThrow(() -> new EntityNotFoundException("专家信息不存在"));
            profile.setRating(averageRating);
            profileRepository.save(profile);
        }
    }
}



