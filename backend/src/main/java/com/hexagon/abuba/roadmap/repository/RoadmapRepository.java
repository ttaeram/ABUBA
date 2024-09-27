package com.hexagon.abuba.roadmap.repository;

import com.hexagon.abuba.roadmap.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
}
