package com.hexagon.abuba.roadmap.controller;

import com.hexagon.abuba.roadmap.Roadmap;
import com.hexagon.abuba.roadmap.dto.response.RoadmapResponseDTO;
import com.hexagon.abuba.roadmap.service.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roadmap")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    @GetMapping
    public ResponseEntity<List<RoadmapResponseDTO>> getAllInformation(@RequestBody final String accessToken) {
        //발생 가능한 예외
        /*
        1. 만료된 토큰 여부 확인 -> Filter처리 되어있을 것으로 전제하면 사실상 없음
        2. 말고 뭐 더 있음?
        */
        List<RoadmapResponseDTO> allInformation = roadmapService.getAllInformation(accessToken);
        return ResponseEntity.status(HttpStatus.OK).body(allInformation);
    }

    @GetMapping("/healthInfo")
    public ResponseEntity<List<RoadmapResponseDTO>> getHealthInformation(@RequestBody final String accessToken) {
        List<RoadmapResponseDTO> healthInformation = roadmapService.getHealthInformation(accessToken);
        return ResponseEntity.status(HttpStatus.OK).body(healthInformation);
    }

    @GetMapping("/supportInfo")
    public ResponseEntity<List<RoadmapResponseDTO>> getSupportedInformation(@RequestBody final String accessToken) {
        List<RoadmapResponseDTO> supportedInformation = roadmapService.getSupportedInformation(accessToken);
        return ResponseEntity.status(HttpStatus.OK).body(supportedInformation);
    }

    @GetMapping("/averageInfo")
    public ResponseEntity<List<RoadmapResponseDTO>> getAverageBehaviorInformation(@RequestBody final String accessToken) {
        List<RoadmapResponseDTO> averageInformation = roadmapService.getAverageBehaviorInformation(accessToken);
        return ResponseEntity.status(HttpStatus.OK).body(averageInformation);
    }
}
