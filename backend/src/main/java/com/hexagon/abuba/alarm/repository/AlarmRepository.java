package com.hexagon.abuba.alarm.repository;

import com.hexagon.abuba.alarm.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {

    Optional<Alarm> findByDiaryIdAndParentId(Long diaryId, Long parentId);

    List<Alarm> findAllByParentId(Long id);
}
