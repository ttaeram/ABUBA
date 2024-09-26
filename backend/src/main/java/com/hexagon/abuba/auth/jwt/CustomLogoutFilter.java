package com.hexagon.abuba.auth.jwt;

import com.hexagon.abuba.auth.repository.RefreshRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

@Slf4j
public class CustomLogoutFilter extends GenericFilterBean {

    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;

    public CustomLogoutFilter(JWTUtil jwtUtil, RefreshRepository refreshRepository) {

        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {

        String requestUri = request.getRequestURI();
        log.info("Request URI: {}", requestUri); // 요청 URI 로그
        String requestMethod = request.getMethod();
        log.info("Request Method: {}", requestMethod); // 요청 메서드 로그

        if (!requestUri.matches("^\\/api/v1/auth/logout$")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (!requestMethod.equals("POST")) {
            filterChain.doFilter(request, response);
            return;
        }

        // get refresh token
        String refresh = null;
        Cookie[] cookies = request.getCookies();

        // 쿠키가 null인지 체크
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    refresh = cookie.getValue();
                    log.info("Refresh token found in cookies: {}", refresh); // 쿠키에서 Refresh 토큰 로그
                    break;
                }
            }
        } else {
            log.warn("No cookies found in the request."); // 쿠키가 없을 경우 로그
        }

        // refresh null check
        if (refresh == null) {
            log.warn("Refresh token is null."); // Refresh 토큰이 null일 경우 로그
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: {}", e.getMessage()); // 만료된 토큰 로그
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);
        if (!category.equals("refresh")) {
            log.warn("Token category is not refresh."); // 토큰 카테고리가 refresh가 아닐 경우 로그
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // DB에 저장되어 있는지 확인
        Boolean isExist = refreshRepository.existsByRefresh(refresh);
        if (!isExist) {
            log.warn("Refresh token does not exist in DB."); // DB에 존재하지 않을 경우 로그
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 로그아웃 진행
        refreshRepository.deleteByRefresh(refresh);
        log.info("Successfully logged out and deleted refresh token."); // 로그아웃 성공 로그

        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);

        filterChain.doFilter(request, response);
    }
}