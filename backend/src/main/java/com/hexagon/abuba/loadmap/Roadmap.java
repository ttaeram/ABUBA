package com.hexagon.abuba.loadmap;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
public class Roadmap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roadmap_id")
    private Long id;

    private String title;

    private String content;

    @Enumerated(EnumType.STRING)
    private RoadmapType type;


}
