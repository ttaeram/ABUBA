package com.hexagon.abuba.diary.service;

import com.hexagon.abuba.global.openfeign.FinAIAPIClient;
import com.hexagon.abuba.global.openfeign.dto.request.AnalyseRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.response.AnalyseResponseDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class AIService {
    private final FinAIAPIClient finAIAPIClient;

    public AIService(FinAIAPIClient finAIAPIClient) {
        this.finAIAPIClient = finAIAPIClient;
    }

    public String getSentiment(String text) {
        AnalyseRequestDTO requestDTO = new AnalyseRequestDTO(text);
        AnalyseResponseDTO responseDTO = finAIAPIClient.analyzeSentiment(requestDTO);

        return responseDTO.document().sentiment();
    }
}
