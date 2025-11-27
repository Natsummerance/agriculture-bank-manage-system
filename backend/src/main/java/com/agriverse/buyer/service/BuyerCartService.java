package com.agriverse.buyer.service;

import com.agriverse.entity.BuyerCartItem;
import com.agriverse.entity.FarmerProduct;
import com.agriverse.buyer.repository.BuyerCartItemRepository;
import com.agriverse.farmer.repository.FarmerProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 买家购物车服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BuyerCartService {
    private final BuyerCartItemRepository cartItemRepository;
    private final FarmerProductRepository productRepository;
    
    /**
     * 获取购物车列表
     */
    public List<BuyerCartItem> getCartItems(String buyerId) {
        return cartItemRepository.findByBuyerId(buyerId);
    }
    
    /**
     * 添加商品到购物车
     */
    public BuyerCartItem addItem(String buyerId, String productId, Integer quantity) {
        // 检查商品是否存在
        FarmerProduct product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("商品不存在"));
        
        // 检查库存
        if (product.getStock() < quantity) {
            throw new RuntimeException("库存不足");
        }
        
        // 检查是否已在购物车中
        Optional<BuyerCartItem> existing = cartItemRepository.findByBuyerIdAndProductId(buyerId, productId);
        
        if (existing.isPresent()) {
            // 更新数量
            BuyerCartItem item = existing.get();
            int newQuantity = item.getQuantity() + quantity;
            if (newQuantity > product.getStock()) {
                throw new RuntimeException("库存不足，当前库存：" + product.getStock());
            }
            item.setQuantity(newQuantity);
            return cartItemRepository.save(item);
        } else {
            // 创建新项
            BuyerCartItem item = BuyerCartItem.builder()
                .buyerId(buyerId)
                .productId(productId)
                .quantity(quantity)
                .selected(true)
                .build();
            return cartItemRepository.save(item);
        }
    }
    
    /**
     * 更新购物车商品数量
     */
    public BuyerCartItem updateQuantity(String buyerId, String productId, Integer quantity) {
        BuyerCartItem item = cartItemRepository.findByBuyerIdAndProductId(buyerId, productId)
            .orElseThrow(() -> new EntityNotFoundException("购物车商品不存在"));
        
        // 检查库存
        FarmerProduct product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("商品不存在"));
        
        if (quantity > product.getStock()) {
            throw new RuntimeException("库存不足，当前库存：" + product.getStock());
        }
        
        if (quantity <= 0) {
            throw new RuntimeException("数量必须大于0");
        }
        
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }
    
    /**
     * 删除购物车商品
     */
    public void removeItem(String buyerId, String productId) {
        cartItemRepository.deleteByBuyerIdAndProductId(buyerId, productId);
    }
    
    /**
     * 清空购物车
     */
    public void clearCart(String buyerId) {
        cartItemRepository.deleteByBuyerId(buyerId);
    }
    
    /**
     * 更新选中状态
     */
    public BuyerCartItem updateSelected(String buyerId, String productId, Boolean selected) {
        BuyerCartItem item = cartItemRepository.findByBuyerIdAndProductId(buyerId, productId)
            .orElseThrow(() -> new EntityNotFoundException("购物车商品不存在"));
        
        item.setSelected(selected);
        return cartItemRepository.save(item);
    }
}


