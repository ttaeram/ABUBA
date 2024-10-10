package com.hexagon.abuba.alarm.repository;

import com.hexagon.abuba.alarm.entity.Alarm;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {

    Optional<Alarm> findByDiaryIdAndParentId(Long diaryId, Long parentId);

    @Query("SELECT a FROM Alarm a WHERE a.parent.id = :parentId ORDER BY a.diary.createdAt DESC")
    List<Alarm> findAllByParentId(Long parentId, Pageable pageable);
}
