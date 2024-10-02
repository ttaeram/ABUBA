package com.hexagon.abuba.roadmap.repository;

import com.hexagon.abuba.roadmap.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {

    @Query(value = "SELECT r FROM Roadmap r WHERE r.endDate >= :birthDay order by r.startDate limit 15")
    List<Roadmap> findSomeInformation(int birthDay);

    @Query(value = "SELECT r FROM Roadmap r WHERE r.endDate >= :birthDay and r.type = 'HEALTH' order by r.startDate limit 5")
    List<Roadmap> findHealthInformationByBirth(int birthDay);

    @Query(value = "SELECT r FROM Roadmap r WHERE r.endDate >= :birthDay and r.type = 'GROWTH' order by r.startDate limit 5")
    List<Roadmap> findAverageBehaviorInformationByBirth(int birthDay);

    @Query(value = "SELECT r FROM Roadmap r WHERE r.endDate >= :birthDay and r.type = 'SUPPORT' order by r.startDate limit 5")
    List<Roadmap> findSupportInformationByBirth(int birthDay);

}
