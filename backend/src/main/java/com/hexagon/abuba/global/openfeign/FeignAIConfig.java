package com.hexagon.abuba.global.openfeign;
import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignAIConfig {

    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            requestTemplate.header("X-NCP-APIGW-API-KEY-ID", clientId);
            requestTemplate.header("X-NCP-APIGW-API-KEY", clientSecret);
            requestTemplate.header("Content-Type", "application/json");
        };
    }
}
