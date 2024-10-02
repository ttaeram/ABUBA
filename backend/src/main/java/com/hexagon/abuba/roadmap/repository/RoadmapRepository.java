package com.hexagon.abuba.roadmap.repository;

import com.hexagon.abuba.roadmap.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {

    @Query(value = "SELECT r FROM Roadmap r WHERE r.startDate >= :birthDay")
    List<Roadmap> findSomeInformation(int birthDay);

    @Query(value = "SELECT r FROM Roadmap r WHERE r.startDate >= :birthDay and r.type = 'HEALTH'")
    List<Roadmap> findHealthInformationByBirth(int birthDay);

    @Query(value = "SELECT r FROM Roadmap r WHERE r.startDate >= :birthDay and r.type = 'GROWTH'")
    List<Roadmap> findAverageBehaviorInformationByBirth(int birthDay);

    @Query(value = "SELECT r FROM Roadmap r WHERE r.startDate >= :birthDay and r.type = 'SUPPORT'")
    List<Roadmap> findSupportInformationByBirth(int birthDay);

}
