package com.hexagon.abuba.diary.service;

import com.hexagon.abuba.global.openfeign.FinAIAPIClient;
import com.hexagon.abuba.global.openfeign.dto.request.AnalyseRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.response.AnalyseResponseDTO;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Transactional
@Slf4j
public class AIService {
    private final FinAIAPIClient finAIAPIClient;
    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    public AIService(FinAIAPIClient finAIAPIClient) {
        this.finAIAPIClient = finAIAPIClient;
    }

    public String getSentiment(String text) {
        log.info("getSentiment");
        log.info("clientId: {}", clientId);
        log.info("clientSecret: {}", clientSecret);
        AnalyseRequestDTO requestDTO = new AnalyseRequestDTO(text);
        AnalyseResponseDTO responseDTO = finAIAPIClient.analyzeSentiment(clientId, clientSecret, requestDTO);

        return responseDTO.document().sentiment();
    }
}
