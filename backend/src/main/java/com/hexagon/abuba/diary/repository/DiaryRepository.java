package com.hexagon.abuba.diary.repository;

import com.hexagon.abuba.diary.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findByParentId(Long parentId);
}
