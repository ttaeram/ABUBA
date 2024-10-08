package com.hexagon.abuba.alarm.repository;

import com.hexagon.abuba.alarm.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {

    Alarm findByDiaryIdAndParentId(Long diaryId, Long parentId);

    List<Alarm> findAllByParentId(Long id);
}
