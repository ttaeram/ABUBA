package com.hexagon.abuba.diary.service;

import com.hexagon.abuba.diary.Diary;
import com.hexagon.abuba.diary.dto.request.DiaryRecentReqDTO;
import com.hexagon.abuba.diary.dto.response.DiaryRecentResDTO;
import com.hexagon.abuba.diary.dto.response.DiaryResDTO;
import com.hexagon.abuba.diary.repository.DiaryRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@Slf4j
public class DiaryService {
    private DiaryRepository diaryRepository;

    public DiaryService(DiaryRepository diaryRepository) {
        this.diaryRepository = diaryRepository;
    }

    public List<DiaryRecentResDTO> recentDiary(DiaryRecentReqDTO reqDTO) {
        List<DiaryRecentResDTO> diaryRecentResDTOList = new ArrayList<>();
        List<Diary> diaries = diaryRepository.findByParentId(reqDTO.getParentId());

        for (Diary diary : diaries) {
            // TODO : 이미지 URL 이 Null 로 나올지 빈칸으로 나올지 모르기 때문에 수정할 가능성 있음
            if(diary.getImage_url().isEmpty()) continue; // 이미지 URL 이 null 일 경우

            DiaryRecentResDTO diaryRecentResDTO = new DiaryRecentResDTO();
            diaryRecentResDTO.setDiaryId(diary.getId());
            diaryRecentResDTO.setImageUrl(diary.getImage_url());

            diaryRecentResDTOList.add(diaryRecentResDTO);

            if(diaryRecentResDTOList.size() == 3) break; // 최대 3개까지만
        }
        return diaryRecentResDTOList;
    }

    public List<DiaryResDTO> getList(DiaryRecentReqDTO reqDTO){
        List<Diary> diaries = diaryRepository.findByParentId(reqDTO.getParentId());
        List<DiaryResDTO> diaryResDTOList = new ArrayList<>();
        for (Diary diary : diaries) {
            DiaryResDTO diaryResDTO = new DiaryResDTO();

            diaryResDTO.setId(diary.getId());
            diaryResDTO.setTitle(diary.getTitle());
            diaryResDTO.setContent(diary.getContent());
            diaryResDTO.setDeposit(diary.getDeposit());
            diaryResDTO.setCreatedAt(diary.getCreatedAt());
            diaryResDTO.setImageUrl(diary.getImage_url());

            diaryResDTOList.add(diaryResDTO);
        }

        return diaryResDTOList;
    }
}
