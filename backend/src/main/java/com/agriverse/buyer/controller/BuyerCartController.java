package com.agriverse.buyer.controller;

import com.agriverse.dto.ApiResponse;
import com.agriverse.entity.BuyerCartItem;
import com.agriverse.buyer.service.BuyerCartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 * 买家购物车控制器
 */
@Slf4j
@RestController
@RequestMapping("/buyer/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('BUYER')")
@Tag(name = "买家购物车", description = "购物车管理接口")
@SecurityRequirement(name = "Bearer Authentication")
public class BuyerCartController {
    private final BuyerCartService cartService;
    
    /**
     * 获取购物车
     */
    @Operation(summary = "获取购物车", description = "获取当前买家的购物车商品列表")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BuyerCartItem>>> getCart(Principal principal) {
        try {
            String buyerId = principal.getName();
            List<BuyerCartItem> items = cartService.getCartItems(buyerId);
            return ResponseEntity.ok(ApiResponse.success("获取成功", items));
        } catch (Exception e) {
            log.error("获取购物车异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "获取失败，请稍后重试"));
        }
    }
    
    /**
     * 添加商品到购物车
     */
    @Operation(summary = "添加商品到购物车", description = "添加商品到购物车，如果已存在则更新数量")
    @PostMapping("/items")
    public ResponseEntity<ApiResponse<BuyerCartItem>> addItem(
            @Parameter(description = "商品ID") @RequestParam String productId,
            @Parameter(description = "数量") @RequestParam @Min(1) Integer quantity,
            Principal principal) {
        try {
            String buyerId = principal.getName();
            BuyerCartItem item = cartService.addItem(buyerId, productId, quantity);
            return ResponseEntity.ok(ApiResponse.success("添加成功", item));
        } catch (RuntimeException e) {
            log.error("添加商品到购物车失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("添加商品到购物车异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "添加失败，请稍后重试"));
        }
    }
    
    /**
     * 更新购物车商品
     */
    @Operation(summary = "更新购物车商品", description = "更新购物车商品的数量或选中状态")
    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<BuyerCartItem>> updateItem(
            @Parameter(description = "购物车项ID") @PathVariable String itemId,
            @Parameter(description = "数量") @RequestParam(required = false) Integer quantity,
            @Parameter(description = "是否选中") @RequestParam(required = false) Boolean selected,
            Principal principal) {
        try {
            String buyerId = principal.getName();
            BuyerCartItem item = null;
            
            if (quantity != null) {
                // 从itemId获取productId（需要先查询）
                BuyerCartItem existing = cartService.getCartItems(buyerId).stream()
                    .filter(i -> i.getId().equals(itemId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("购物车商品不存在"));
                item = cartService.updateQuantity(buyerId, existing.getProductId(), quantity);
            }
            
            if (selected != null) {
                BuyerCartItem existing = cartService.getCartItems(buyerId).stream()
                    .filter(i -> i.getId().equals(itemId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("购物车商品不存在"));
                item = cartService.updateSelected(buyerId, existing.getProductId(), selected);
            }
            
            if (item == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, "请提供quantity或selected参数"));
            }
            
            return ResponseEntity.ok(ApiResponse.success("更新成功", item));
        } catch (RuntimeException e) {
            log.error("更新购物车商品失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("更新购物车商品异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "更新失败，请稍后重试"));
        }
    }
    
    /**
     * 删除购物车商品
     */
    @Operation(summary = "删除购物车商品", description = "从购物车中删除指定商品")
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<Object>> removeItem(
            @Parameter(description = "购物车项ID") @PathVariable String itemId,
            Principal principal) {
        try {
            String buyerId = principal.getName();
            // 从itemId获取productId（需要先查询）
            BuyerCartItem existing = cartService.getCartItems(buyerId).stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("购物车商品不存在"));
            
            cartService.removeItem(buyerId, existing.getProductId());
            return ResponseEntity.ok(ApiResponse.success("删除成功", null));
        } catch (RuntimeException e) {
            log.error("删除购物车商品失败: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, e.getMessage()));
        } catch (Exception e) {
            log.error("删除购物车商品异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "删除失败，请稍后重试"));
        }
    }
    
    /**
     * 清空购物车
     */
    @Operation(summary = "清空购物车", description = "清空当前买家的所有购物车商品")
    @DeleteMapping
    public ResponseEntity<ApiResponse<Object>> clearCart(Principal principal) {
        try {
            String buyerId = principal.getName();
            cartService.clearCart(buyerId);
            return ResponseEntity.ok(ApiResponse.success("清空成功", null));
        } catch (Exception e) {
            log.error("清空购物车异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(500, "清空失败，请稍后重试"));
        }
    }
}

