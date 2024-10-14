package com.hexagon.abuba.diary.repository;

import com.hexagon.abuba.diary.entity.Diary;
import com.hexagon.abuba.user.Baby;
import com.hexagon.abuba.user.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findByParentId(Long parentId);

    @Query("SELECT d FROM Diary d WHERE d.parent IN :parents order by d.createdAt desc")
    List<Diary> findByParents(List<Parent> parents);

    @Query("SELECT d FROM Diary d " +
            "WHERE FUNCTION('YEAR', d.createdAt) = :year " +
            "AND FUNCTION('MONTH', d.createdAt) = :month " +
            "AND d.parent.baby.id = :babyId")
    List<Diary> findByYearAndMonthAndId(int year, int month, Long babyId);

    @Query("SELECT d FROM Diary d where d.parent.baby = :baby order by d.createdAt asc")
    List<Diary> findByBaby(Baby baby);
}
