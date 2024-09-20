package com.hexagon.abuba.diary.service;

import com.hexagon.abuba.diary.Diary;
import com.hexagon.abuba.diary.dto.request.DiaryDetailReqDTO;
import com.hexagon.abuba.diary.dto.request.DiaryRecentReqDTO;
import com.hexagon.abuba.diary.dto.response.DiaryRecentResDTO;
import com.hexagon.abuba.diary.dto.response.DiaryResDTO;
import com.hexagon.abuba.diary.repository.DiaryRepository;
import com.hexagon.abuba.user.repository.ParentRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@Slf4j
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final ParentRepository parentRepository;

    public DiaryService(DiaryRepository diaryRepository, ParentRepository parentRepository) {
        this.diaryRepository = diaryRepository;
        this.parentRepository = parentRepository;
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
            DiaryResDTO diaryResDTO = EntityToResDTO(diary);
            diaryResDTOList.add(diaryResDTO);
        }

        return diaryResDTOList;
    }

    public void addDiary(DiaryDetailReqDTO reqDTO){
        Diary diary = DTOToEntity(reqDTO);
        diaryRepository.save(diary);
    }





    private DiaryResDTO EntityToResDTO(Diary diary){
        DiaryResDTO diaryResDTO = new DiaryResDTO();

        diaryResDTO.setId(diary.getId());
        diaryResDTO.setTitle(diary.getTitle());
        diaryResDTO.setContent(diary.getContent());
        diaryResDTO.setDeposit(diary.getDeposit());
        diaryResDTO.setCreatedAt(diary.getCreatedAt());
        diaryResDTO.setImageUrl(diary.getImage_url());

        return diaryResDTO;
    }

    private Diary DTOToEntity(DiaryDetailReqDTO reqDTO){
        Diary diary = new Diary();

        diary.setParent(parentRepository.findById(reqDTO.getParentId()).orElse(null));

        diary.setTitle(reqDTO.getTitle());
        diary.setContent(reqDTO.getContent());
        diary.setCreatedAt(reqDTO.getCreatedAt());
        diary.setAccount(reqDTO.getAccount());
        diary.setDeposit(reqDTO.getDeposit());
        diary.setRecord_url(reqDTO.getRecord_url());
        diary.setImage_url(reqDTO.getImage_url());
        diary.setHeight(reqDTO.getHeight());
        diary.setWeight(reqDTO.getWeight());

        return diary;
    }
}
