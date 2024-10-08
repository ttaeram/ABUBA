package com.hexagon.abuba.diary.repository;

import com.hexagon.abuba.diary.entity.Diary;
import com.hexagon.abuba.user.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findByParentId(Long parentId);
    @Query("SELECT d FROM Diary d WHERE d.parent IN :parents")
    List<Diary> findByParents(List<Parent> parents);
}
