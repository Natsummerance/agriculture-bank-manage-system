package com.agriverse.admin.repository;

import com.agriverse.admin.entity.AdminPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminPermissionRepository extends JpaRepository<AdminPermission, String> {
    List<AdminPermission> findByRole(String role);
    
    List<AdminPermission> findByRoleAndEnabled(String role, Boolean enabled);
    
    List<AdminPermission> findByResource(String resource);
    
    AdminPermission findByRoleAndResourceAndAction(String role, String resource, AdminPermission.PermissionAction action);
}



