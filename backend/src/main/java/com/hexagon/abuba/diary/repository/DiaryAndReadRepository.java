package com.hexagon.abuba.diary.repository;

import com.hexagon.abuba.diary.entity.Diary;
import com.hexagon.abuba.diary.entity.DiaryAndRead;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiaryAndReadRepository extends JpaRepository<DiaryAndRead, Long> {

}
