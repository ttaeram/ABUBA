package com.hexagon.abuba.roadmap.service;

import com.hexagon.abuba.roadmap.Roadmap;
import com.hexagon.abuba.roadmap.dto.response.RoadmapResponseDTO;
import com.hexagon.abuba.roadmap.repository.RoadmapRepository;
import com.hexagon.abuba.user.Baby;
import com.hexagon.abuba.user.Parent;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Tag(name = "로드맵 관련 API")
@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    //아이 정보를 받아올 repository가 있어야 한다.
//    private final

    /*
        중복된 로직이 너무 많다. 어떻게 처리할지 구현 완료 후 생각해보자
    */

    @Transactional
    public List<RoadmapResponseDTO> getAllInformation(final Parent parent) {
        Baby baby = parent.getBaby();
        long birthDay = baby.getBirthDate().toEpochDay();
        long today = LocalDate.now().toEpochDay();

        //실제 findall은 아니고, 적절한 갯수의 정보만 식별해서 가져와야 된다.
        List<Roadmap> roadmaps = roadmapRepository.findSomeInformation((int)(today - birthDay));
        return getRoadmapInformation(roadmaps);
    }

    @Transactional
    public List<RoadmapResponseDTO> getHealthInformation(final Parent parent) {
        Baby baby = parent.getBaby();
        long birthDay = baby.getBirthDate().toEpochDay();
        long today = LocalDate.now().toEpochDay();

        //육아 의료 정보에 대한 최적 항목 몇 개만 반환한다.
        List<Roadmap> roadmaps = roadmapRepository.findHealthInformationByBirth((int)(today - birthDay));
        return getRoadmapInformation(roadmaps);
    }

    @Transactional
    public List<RoadmapResponseDTO> getAverageBehaviorInformation(final Parent parent) {
        Baby baby = parent.getBaby();
        long birthDay = baby.getBirthDate().toEpochDay();
        long today = LocalDate.now().toEpochDay();

        //평균 행동 정보에 대한 최적 항목 몇 개만 반환한다.
        List<Roadmap> roadmaps = roadmapRepository.findAverageBehaviorInformationByBirth((int)(today - birthDay));
        return getRoadmapInformation(roadmaps);
    }

    @Transactional
    public List<RoadmapResponseDTO> getSupportedInformation(final Parent parent) {
        Baby baby = parent.getBaby();
        long birthDay = baby.getBirthDate().toEpochDay();
        long today = LocalDate.now().toEpochDay();

        //국가 지원 정보에 대한 최적 항목 몇 개만 반환한다.
        List<Roadmap> roadmaps = roadmapRepository.findSupportInformationByBirth((int)(today - birthDay));
        //로드맵 정보 반환
        return getRoadmapInformation(roadmaps);
    }

    @Transactional
    public List<RoadmapResponseDTO> getRoadmapInformation(final List<Roadmap> Information) {
        List<RoadmapResponseDTO> roadmaps = new ArrayList<>();
        for(Roadmap roadmap : Information) {
            roadmaps.add(roadmap.toDTO());
        }
        return roadmaps;
    }
}
