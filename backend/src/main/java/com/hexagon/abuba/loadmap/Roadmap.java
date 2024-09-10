package com.hexagon.abuba.loadmap;

import jakarta.persistence.*;

@Entity
public class Roadmap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roadmap_id")
    Long id;

    String title;

    String content;

    @Enumerated(EnumType.STRING)
    RoadmapType type;


}
