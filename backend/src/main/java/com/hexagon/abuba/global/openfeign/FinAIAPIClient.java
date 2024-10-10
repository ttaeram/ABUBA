package com.hexagon.abuba.global.openfeign;

import com.hexagon.abuba.global.openfeign.dto.request.AnalyseRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.response.AnalyseResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name="FinAIAPI", url="https://naveropenapi.apigw.ntruss.com")
public interface FinAIAPIClient {

    @PostMapping(value="sentiment-analysis/v1/analyze")
    AnalyseResponseDTO analyzeSentiment(@RequestHeader("X-NCP-APIGW-API-KEY-ID") String clientId,
                                        @RequestHeader("X-NCP-APIGW-API-KEY") String clientSecret,
                                        @RequestBody AnalyseRequestDTO analyseRequestDTO);

}
