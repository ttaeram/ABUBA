package com.hexagon.abuba.roadmap;

import com.hexagon.abuba.roadmap.dto.response.RoadmapResponseDTO;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Entity
public class Roadmap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roadmap_id")
    private Long id;

    private String information;

    @Enumerated(EnumType.STRING)
    private RoadmapType type;

    private Integer startDate, endDate;

    public RoadmapResponseDTO toDTO() {
        return new RoadmapResponseDTO(this.information);
    }


}
