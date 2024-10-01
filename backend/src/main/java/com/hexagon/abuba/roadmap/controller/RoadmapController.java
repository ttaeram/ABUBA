package com.hexagon.abuba.roadmap.controller;

import com.hexagon.abuba.roadmap.dto.response.RoadmapResponseDTO;
import com.hexagon.abuba.roadmap.service.RoadmapService;
import com.hexagon.abuba.user.Parent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roadmap")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    @GetMapping
    public ResponseEntity<List<RoadmapResponseDTO>> getAllInformation(@AuthenticationPrincipal(expression = "user") Parent parent) {
        //발생 가능한 예외
        /*
        1. 만료된 토큰 여부 확인 -> Filter처리 되어있을 것으로 전제하면 사실상 없음
        2. 말고 뭐 더 있음?
        */
        List<RoadmapResponseDTO> allInformation = roadmapService.getAllInformation(parent);
        return ResponseEntity.status(HttpStatus.OK).body(allInformation);
    }

    @GetMapping("/healthInfo")
    public ResponseEntity<List<RoadmapResponseDTO>> getHealthInformation(@AuthenticationPrincipal(expression = "user") Parent parent) {
        List<RoadmapResponseDTO> healthInformation = roadmapService.getHealthInformation(parent);
        return ResponseEntity.status(HttpStatus.OK).body(healthInformation);
    }

    @GetMapping("/supportInfo")
    public ResponseEntity<List<RoadmapResponseDTO>> getSupportedInformation(@AuthenticationPrincipal(expression = "user") Parent parent) {
        List<RoadmapResponseDTO> supportedInformation = roadmapService.getSupportedInformation(parent);
        return ResponseEntity.status(HttpStatus.OK).body(supportedInformation);
    }

    @GetMapping("/averageInfo")
    public ResponseEntity<List<RoadmapResponseDTO>> getAverageBehaviorInformation(@AuthenticationPrincipal(expression = "user") Parent parent) {
        List<RoadmapResponseDTO> averageInformation = roadmapService.getAverageBehaviorInformation(parent);
        return ResponseEntity.status(HttpStatus.OK).body(averageInformation);
    }
}
