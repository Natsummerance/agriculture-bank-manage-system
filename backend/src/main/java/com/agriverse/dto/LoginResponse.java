package com.agriverse.dto;

import com.agriverse.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 登录响应 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String token;
    private String refreshToken;
    private UserInfoResponse user;
    private Long expiresIn;

    public static LoginResponse build(String token, String refreshToken, User user, Long expiresIn) {
        return LoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .user(UserInfoResponse.fromEntity(user))
                .expiresIn(expiresIn)
                .build();
    }
}
