package com.hexagon.abuba.diary.service;

import com.hexagon.abuba.account.service.AccountService;
import com.hexagon.abuba.diary.Diary;
import com.hexagon.abuba.diary.dto.request.DiaryDetailReqDTO;
import com.hexagon.abuba.diary.dto.request.DiaryEditReqDTO;
import com.hexagon.abuba.diary.dto.request.DiaryRecentReqDTO;
import com.hexagon.abuba.diary.dto.response.DiaryDetailResDTO;
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
    private final AccountService accountService;

    public DiaryService(DiaryRepository diaryRepository, ParentRepository parentRepository, S3Service s3Service, AccountService accountService) {
        this.diaryRepository = diaryRepository;
        this.parentRepository = parentRepository;
        this.s3Service = s3Service;
        this.accountService = accountService;
    }

    public List<DiaryRecentResDTO> recentDiary(Long parentId) {
        List<DiaryRecentResDTO> diaryRecentResDTOList = new ArrayList<>();
        List<Diary> diaries = diaryRepository.findByParentId(parentId);

        for (Diary diary : diaries) {
            // TODO : 이미지 URL 이 Null 로 나올지 빈칸으로 나올지 모르기 때문에 수정할 가능성 있음
            if(diary.getImage_url().isEmpty()) continue; // 이미지 URL 이 null 일 경우

            DiaryRecentResDTO diaryRecentResDTO = new DiaryRecentResDTO(
                    diary.getId(),
                    s3Service.getFileUrl(diary.getImage_url())
            );

            diaryRecentResDTOList.add(diaryRecentResDTO);

            if(diaryRecentResDTOList.size() == 3) break; // 최대 3개까지만
        }
        return diaryRecentResDTOList;
    }

    public List<DiaryResDTO> getList(Long parentId){
        List<Diary> diaries = diaryRepository.findByParentId(parentId);
        List<DiaryResDTO> diaryResDTOList = new ArrayList<>();
        for (Diary diary : diaries) {
            DiaryResDTO diaryResDTO = EntityToResDTO(diary);
            diaryResDTOList.add(diaryResDTO);
        }

        return diaryResDTOList;
    }

    public DiaryDetailResDTO getDetail(Long diaryId){
        Diary diary = diaryRepository.findById(diaryId).orElseThrow();

        DiaryDetailResDTO diaryDetailResDTO = new DiaryDetailResDTO(
                diary.getId(),
                diary.getTitle(),
                diary.getContent(),
                diary.getCreatedAt(),
                diary.getAccount(),
                diary.getDeposit(),
                diary.getHeight(),
                diary.getWeight()
        );

        return diaryDetailResDTO;
    }

    public void addDiary(Long parentId, DiaryDetailReqDTO reqDTO, MultipartFile image, MultipartFile record){
        InputStream imageStream = null;
        InputStream recordStream = null;
        String imageName = null;
        String recordName = null;
        log.info(reqDTO.toString());
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

        Diary diary = DTOToEntity(parentId, reqDTO, imageStream, imageName, recordStream, recordName);
        diaryRepository.save(diary);

        accountService.minusParentMoney(parentId, reqDTO.deposit().longValue());
        accountService.addBabyMoney(parentId, reqDTO.deposit().longValue());
    }

    public void editDiary(DiaryEditReqDTO reqDTO, MultipartFile image, MultipartFile record){
        Diary diary = diaryRepository.findById(reqDTO.diaryId()).orElseThrow();

        diary.setTitle(reqDTO.title());
        diary.setContent(reqDTO.content());
        diary.setCreatedAt(reqDTO.createdAt());
        diary.setHeight(reqDTO.height());
        diary.setWeight(reqDTO.weight());

        s3Service.deleteFile(diary.getImage_url());
        s3Service.deleteFile(diary.getRecord_url());

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

        diary = uploadFile(imageStream, imageName, "img", diary);
        diary = uploadFile(recordStream, recordName, "record", diary);

        diaryRepository.save(diary);
    }




    private DiaryResDTO EntityToResDTO(Diary diary){
        return new DiaryResDTO(
                diary.getId(),
                diary.getTitle(),
                diary.getContent(),
                diary.getCreatedAt(),
                diary.getDeposit(),
                s3Service.getFileUrl(diary.getImage_url())
        );
    }

    private Diary DTOToEntity(Long parentId, DiaryDetailReqDTO reqDTO,
                              InputStream imageStream, String imageName,
                              InputStream recordStream, String recordName){
        Diary diary = new Diary();

        diary.setParent(parentRepository.findById(parentId).orElse(null));

        diary.setTitle(reqDTO.title());
        diary.setContent(reqDTO.content());
        diary.setCreatedAt(reqDTO.createdAt());
        diary.setAccount(reqDTO.account());
        diary.setDeposit(reqDTO.deposit());
        diary.setHeight(reqDTO.height());
        diary.setWeight(reqDTO.weight());


        diary = uploadFile(imageStream, imageName, "img", diary);
        diary = uploadFile(recordStream, recordName, "record", diary);

        return diary;
    }

    private Diary uploadFile(InputStream inputStream, String fileName, String fileType, Diary diary){
        if(inputStream != null && fileName != null){
            String uploadFileName = s3Service.uploadFile(inputStream, fileName, fileType);
            if(fileType.equals("img")){
                diary.setImage_url(uploadFileName);
            }else if(fileType.equals("record")){
                diary.setRecord_url(uploadFileName);
            }
        }
        return diary;
    }

}
