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
        List<Diary> diaries = diaryRepository.findByParentId(reqDTO.parentId());

        for (Diary diary : diaries) {
            // TODO : 이미지 URL 이 Null 로 나올지 빈칸으로 나올지 모르기 때문에 수정할 가능성 있음
            if(diary.getImage_url().isEmpty()) continue; // 이미지 URL 이 null 일 경우

            // TODO : 이미지 url 을 실제 이미지(S3에서 다운로드)로 변경
            DiaryRecentResDTO diaryRecentResDTO = new DiaryRecentResDTO(
                    diary.getId(),
                    diary.getImage_url()
            );

            diaryRecentResDTOList.add(diaryRecentResDTO);

            if(diaryRecentResDTOList.size() == 3) break; // 최대 3개까지만
        }
        return diaryRecentResDTOList;
    }

    public List<DiaryResDTO> getList(DiaryRecentReqDTO reqDTO){
        List<Diary> diaries = diaryRepository.findByParentId(reqDTO.parentId());
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
        // TODO : 이미지 url 을 실제 이미지(S3에서 다운로드)로 변경
        return new DiaryResDTO(
                diary.getId(),
                diary.getTitle(),
                diary.getContent(),
                diary.getCreatedAt(),
                diary.getDeposit(),
                diary.getImage_url()
        );
    }

    private Diary DTOToEntity(DiaryDetailReqDTO reqDTO){
        Diary diary = new Diary();
        // TODO : reqDTO 의 이미지 url 을 실제 이미지로 수정 후 S3에 업로드하는 코드로 변경

        diary.setParent(parentRepository.findById(reqDTO.parentId()).orElse(null));

        diary.setTitle(reqDTO.title());
        diary.setContent(reqDTO.content());
        diary.setCreatedAt(reqDTO.createdAt());
        diary.setAccount(reqDTO.account());
        diary.setDeposit(reqDTO.deposit());
        diary.setRecord_url(reqDTO.record_url());
        diary.setImage_url(reqDTO.image_url());
        diary.setHeight(reqDTO.height());
        diary.setWeight(reqDTO.weight());

        return diary;
    }
}
