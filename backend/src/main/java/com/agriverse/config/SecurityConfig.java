package com.agriverse.config;

import com.agriverse.util.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

/**
 * Spring Security 配置类
 */
@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * 密码编码器
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS 配置
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * JWT 认证过滤器
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider);
    }

    /**
     * HTTP 安全配置
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 禁用 CSRF
                .csrf(csrf -> csrf.disable())
                // 启用 CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 设置会话管理为无状态
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 配置请求授权 - 注意：permitAll()必须在authenticated()之前配置
                .authorizeHttpRequests(authz -> authz
                        // 允许公开访问的端点
                        // 在Spring Boot 3.x中，当设置了context-path时，Spring Security的路径匹配
                        // 使用的是servlet path（不包含context-path），所以配置路径应该是/auth/login
                        .requestMatchers("/auth/**", "/farmer/products/health", "/swagger-ui/**", "/v3/api-docs/**",
                                "/error")
                        .permitAll()
                        // 其他所有请求需要认证
                        .anyRequest().authenticated())
                // 异常处理
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            String servletPath = request.getServletPath();
                            String requestURI = request.getRequestURI();
                            log.error("认证失败 - servletPath: {}, requestURI: {}, 错误: {}",
                                    servletPath, requestURI, authException.getMessage());
                            response.setStatus(401);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"code\":401,\"message\":\"未授权\",\"success\":false}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            log.error("访问被拒绝: {}", accessDeniedException.getMessage());
                            response.setStatus(403);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"code\":403,\"message\":\"禁止访问\",\"success\":false}");
                        }));

        // 添加 JWT 认证过滤器 - 放在UsernamePasswordAuthenticationFilter之前
        // Spring Security的permitAll()会确保公开端点不需要认证，JWT过滤器会处理所有请求但不会阻止公开端点
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
