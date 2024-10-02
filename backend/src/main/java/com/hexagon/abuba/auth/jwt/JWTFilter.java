package com.hexagon.abuba.auth.jwt;

import com.hexagon.abuba.auth.dto.CustomUserDetails;
import com.hexagon.abuba.auth.service.CustomUserDetailsService;
import com.hexagon.abuba.user.Parent;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    private final CustomUserDetailsService customUserDetailsService;
    public JWTFilter(JWTUtil jwtUtil, CustomUserDetailsService customUserDetailsService) {

        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 헤더에서 Authorization 키에 담긴 토큰을 꺼냄
        String authorizationHeader = request.getHeader("Authorization");

        // "Bearer "로 시작하는지 확인
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Bearer 다음에 오는 토큰만 가져옴
            String accessToken = authorizationHeader.substring(7);
            log.info("Access token: {}", accessToken);

            // 나머지 인증 로직...
            try {
                jwtUtil.isExpired(accessToken);
                String category = jwtUtil.getCategory(accessToken);
                if (!category.equals("access")) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid access token");
                    return;
                }

                // username, role 값을 획득
                String username = jwtUtil.getUsername(accessToken);
                String role = jwtUtil.getRole(accessToken);

                Parent userEntity = customUserDetailsService.getUserByUsername(username);
//                userEntity.setUsername(username);
//                userEntity.setRole(role);
                CustomUserDetails customerUserDetails = new CustomUserDetails(userEntity);

                Authentication authToken = new UsernamePasswordAuthenticationToken(customerUserDetails, null, customerUserDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } catch (ExpiredJwtException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Access token expired");
                return;
            } catch (Exception e) {
                log.error("Token validation error: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid token");
                return;
            }
        } else {
            log.info("No Authorization header found");
        }

        filterChain.doFilter(request, response);
    }
}
