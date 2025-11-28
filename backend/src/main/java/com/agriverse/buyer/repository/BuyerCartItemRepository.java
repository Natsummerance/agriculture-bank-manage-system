package com.agriverse.buyer.repository;

import com.agriverse.entity.BuyerCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 买家购物车Repository
 */
@Repository
public interface BuyerCartItemRepository extends JpaRepository<BuyerCartItem, String> {
    /**
     * 根据买家ID查询购物车商品列表
     */
    List<BuyerCartItem> findByBuyerId(String buyerId);
    
    /**
     * 根据买家ID和商品ID查询购物车商品
     */
    Optional<BuyerCartItem> findByBuyerIdAndProductId(String buyerId, String productId);
    
    /**
     * 根据买家ID删除所有购物车商品
     */
    void deleteByBuyerId(String buyerId);
    
    /**
     * 根据买家ID和商品ID删除购物车商品
     */
    void deleteByBuyerIdAndProductId(String buyerId, String productId);
}


