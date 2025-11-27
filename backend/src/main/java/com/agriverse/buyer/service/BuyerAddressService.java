package com.agriverse.buyer.service;

import com.agriverse.entity.BuyerAddress;
import com.agriverse.buyer.repository.BuyerAddressRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 买家收货地址服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BuyerAddressService {
    private final BuyerAddressRepository addressRepository;
    
    /**
     * 获取地址列表
     */
    public List<BuyerAddress> getAddresses(String buyerId) {
        return addressRepository.findByBuyerIdOrderByIsDefaultDescCreatedAtDesc(buyerId);
    }
    
    /**
     * 添加地址
     */
    public BuyerAddress addAddress(String buyerId, BuyerAddress address) {
        address.setBuyerId(buyerId);
        
        // 如果设置为默认地址，取消其他默认地址
        if (address.getIsDefault()) {
            addressRepository.clearDefaultAddress(buyerId);
        }
        
        return addressRepository.save(address);
    }
    
    /**
     * 更新地址
     */
    public BuyerAddress updateAddress(String buyerId, String addressId, BuyerAddress updates) {
        BuyerAddress address = addressRepository.findById(addressId)
            .orElseThrow(() -> new EntityNotFoundException("地址不存在"));
        
        // 验证地址属于当前买家
        if (!address.getBuyerId().equals(buyerId)) {
            throw new RuntimeException("无权操作该地址");
        }
        
        // 更新字段
        if (updates.getName() != null) {
            address.setName(updates.getName());
        }
        if (updates.getPhone() != null) {
            address.setPhone(updates.getPhone());
        }
        if (updates.getProvince() != null) {
            address.setProvince(updates.getProvince());
        }
        if (updates.getCity() != null) {
            address.setCity(updates.getCity());
        }
        if (updates.getDistrict() != null) {
            address.setDistrict(updates.getDistrict());
        }
        if (updates.getDetail() != null) {
            address.setDetail(updates.getDetail());
        }
        if (updates.getPostalCode() != null) {
            address.setPostalCode(updates.getPostalCode());
        }
        if (updates.getIsDefault() != null) {
            // 如果设置为默认地址，取消其他默认地址
            if (updates.getIsDefault()) {
                addressRepository.clearDefaultAddress(buyerId);
            }
            address.setIsDefault(updates.getIsDefault());
        }
        
        return addressRepository.save(address);
    }
    
    /**
     * 删除地址
     */
    public void deleteAddress(String buyerId, String addressId) {
        BuyerAddress address = addressRepository.findById(addressId)
            .orElseThrow(() -> new EntityNotFoundException("地址不存在"));
        
        // 验证地址属于当前买家
        if (!address.getBuyerId().equals(buyerId)) {
            throw new RuntimeException("无权操作该地址");
        }
        
        addressRepository.delete(address);
    }
    
    /**
     * 设置默认地址
     */
    public BuyerAddress setDefaultAddress(String buyerId, String addressId) {
        BuyerAddress address = addressRepository.findById(addressId)
            .orElseThrow(() -> new EntityNotFoundException("地址不存在"));
        
        // 验证地址属于当前买家
        if (!address.getBuyerId().equals(buyerId)) {
            throw new RuntimeException("无权操作该地址");
        }
        
        // 取消其他默认地址
        addressRepository.clearDefaultAddress(buyerId);
        
        // 设置当前地址为默认
        address.setIsDefault(true);
        return addressRepository.save(address);
    }
}


