package com.agriverse.buyer.repository;

import com.agriverse.entity.BuyerAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 买家收货地址Repository
 */
@Repository
public interface BuyerAddressRepository extends JpaRepository<BuyerAddress, String> {
    /**
     * 根据买家ID查询地址列表
     */
    List<BuyerAddress> findByBuyerIdOrderByIsDefaultDescCreatedAtDesc(String buyerId);
    
    /**
     * 根据买家ID和是否默认查询地址
     */
    Optional<BuyerAddress> findByBuyerIdAndIsDefaultTrue(String buyerId);
    
    /**
     * 取消所有默认地址
     */
    @Modifying
    @Query("UPDATE BuyerAddress a SET a.isDefault = false WHERE a.buyerId = :buyerId")
    void clearDefaultAddress(@Param("buyerId") String buyerId);
}


