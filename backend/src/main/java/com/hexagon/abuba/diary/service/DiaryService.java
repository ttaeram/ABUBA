package com.hexagon.abuba.diary.service;

import com.hexagon.abuba.diary.Diary;
import com.hexagon.abuba.diary.dto.request.DiaryDetailReqDTO;
import com.hexagon.abuba.diary.dto.request.DiaryRecentReqDTO;
import com.hexagon.abuba.diary.dto.response.DiaryRecentResDTO;
import com.hexagon.abuba.diary.dto.response.DiaryResDTO;
import com.hexagon.abuba.diary.repository.DiaryRepository;
import com.hexagon.abuba.s3.service.S3Service;
import com.hexagon.abuba.user.repository.ParentRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@Slf4j
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final ParentRepository parentRepository;
    private final S3Service s3Service;

    public DiaryService(DiaryRepository diaryRepository, ParentRepository parentRepository, S3Service s3Service) {
        this.diaryRepository = diaryRepository;
        this.parentRepository = parentRepository;
        this.s3Service = s3Service;
    }

    public List<DiaryRecentResDTO> recentDiary(DiaryRecentReqDTO reqDTO) {
        List<DiaryRecentResDTO> diaryRecentResDTOList = new ArrayList<>();
        List<Diary> diaries = diaryRepository.findByParentId(reqDTO.parentId());

        for (Diary diary : diaries) {
            // TODO : 이미지 URL 이 Null 로 나올지 빈칸으로 나올지 모르기 때문에 수정할 가능성 있음
            if(diary.getImage_url().isEmpty()) continue; // 이미지 URL 이 null 일 경우

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

    public void addDiary(DiaryDetailReqDTO reqDTO, MultipartFile image, MultipartFile record){
        InputStream imageStream = null;
        InputStream recordStream = null;
        String imageName = null;
        String recordName = null;

        try {
            if (image != null) {
                imageStream = image.getInputStream();
                imageName = image.getOriginalFilename();
            }
            if (record != null) {
                recordStream = record.getInputStream();
                recordName = record.getOriginalFilename();
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        Diary diary = DTOToEntity(reqDTO, imageStream, imageName, recordStream, recordName);
        diaryRepository.save(diary);
    }





    private DiaryResDTO EntityToResDTO(Diary diary){
        return new DiaryResDTO(
                diary.getId(),
                diary.getTitle(),
                diary.getContent(),
                diary.getCreatedAt(),
                diary.getDeposit(),
                diary.getImage_url()
        );
    }

    private Diary DTOToEntity(DiaryDetailReqDTO reqDTO,
                              InputStream imageStream, String imageName,
                              InputStream recordStream, String recordName){
        Diary diary = new Diary();

        diary.setParent(parentRepository.findById(reqDTO.parentId()).orElse(null));

        diary.setTitle(reqDTO.title());
        diary.setContent(reqDTO.content());
        diary.setCreatedAt(reqDTO.createdAt());
        diary.setAccount(reqDTO.account());
        diary.setDeposit(reqDTO.deposit());
        diary.setHeight(reqDTO.height());
        diary.setWeight(reqDTO.weight());

        if(imageStream != null && imageName != null){
            String uploadedFileName = s3Service.uploadFile(imageStream, imageName, "img");
            String imageUrl = s3Service.getFileUrl(uploadedFileName, "img");
            diary.setImage_url(imageUrl);
        }

        if(recordStream != null && recordName != null){
            String uploadedFileName = s3Service.uploadFile(recordStream, recordName, "record");
            String recordUrl = s3Service.getFileUrl(uploadedFileName, "record");
            diary.setRecord_url(recordUrl);
        }

        return diary;
    }
}
