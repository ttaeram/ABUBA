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
import com.hexagon.abuba.user.Baby;
import com.hexagon.abuba.user.Parent;
import com.hexagon.abuba.user.repository.BabyRepository;
import com.hexagon.abuba.user.repository.ParentRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
@Slf4j
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final ParentRepository parentRepository;
    private final S3Service s3Service;
    private final AccountService accountService;
    private final Tika tika;
    private final BabyRepository babyRepository;
    private final AIService aiService;

    public DiaryService(DiaryRepository diaryRepository, ParentRepository parentRepository, S3Service s3Service, AccountService accountService, BabyRepository babyRepository, AIService aiService) {
        this.diaryRepository = diaryRepository;
        this.parentRepository = parentRepository;
        this.s3Service = s3Service;
        this.accountService = accountService;
        this.tika = new Tika();
        this.babyRepository = babyRepository;
        this.aiService = aiService;
    }

    public List<DiaryRecentResDTO> recentDiary(Long parentId) {
        List<DiaryRecentResDTO> diaryRecentResDTOList = new ArrayList<>();
        Parent parent = parentRepository.findById(parentId).orElseThrow();
        Baby baby = parent.getBaby();
        List<Parent> parentList = baby.getParents();
        List<Diary> diaries = diaryRepository.findByParents(parentList);
        Collections.reverse(diaries);

        for (Diary diary : diaries) {
            if(diary.getImage_url()==null) continue; // 이미지 URL 이 null 일 경우

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
        Parent parent = parentRepository.findById(parentId).orElseThrow();
        Baby baby = parent.getBaby();
        List<Baby> babyList = babyRepository.findAllByAccount(baby.getAccount());

        List<Parent> parentList = new ArrayList<>();

        for(Baby b: babyList){
            parentList.addAll(b.getParents());
        }

        List<Diary> diaries = diaryRepository.findByParents(parentList);
        Collections.reverse(diaries);
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
                diary.getWeight(),
                s3Service.getFileUrl(diary.getImage_url()),
                s3Service.getFileUrl(diary.getRecord_url()),
                diary.getMemo(),
                diary.getSentiment()
        );

        return diaryDetailResDTO;
    }

    public void addDiary(Long parentId, DiaryDetailReqDTO reqDTO, MultipartFile image, MultipartFile record){
        InputStream imageStream = null;
        InputStream recordStream = null;
        String imageName = null;
        String recordName = null;
        String imgMimeType = null;
        String recordMimeType = null;
        log.info(reqDTO.toString());
        try {
            if (image != null) {
                imageStream = image.getInputStream();
                imageName = image.getOriginalFilename();
                InputStream tmp = image.getInputStream();
                imgMimeType = tika.detect(tmp);
            }
            if (record != null) {
                recordStream = record.getInputStream();
                recordName = record.getOriginalFilename();
                InputStream tmp = record.getInputStream();
                recordMimeType = tika.detect(tmp);
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        String sentiment = aiService.getSentiment(reqDTO.content());

        if(reqDTO.deposit() != null && reqDTO.deposit().intValue() != 0){
            if(accountService.transferMoney(parentId, reqDTO.deposit().longValue(), reqDTO.memo())) {
                Diary diary = DTOToEntity(parentId, reqDTO, imageStream, imageName, recordStream, recordName, imgMimeType, recordMimeType);
                diary.setSentiment(sentiment);
                diaryRepository.save(diary);
            }else{
                try {
                    throw new Exception("계좌이체중 문제가 발생했습니다.");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }else {
            Diary diary = DTOToEntity(parentId, reqDTO, imageStream, imageName, recordStream, recordName, imgMimeType, recordMimeType);
            diary.setSentiment(sentiment);
            diaryRepository.save(diary);
        }

    }

    public void editDiary(DiaryEditReqDTO reqDTO, MultipartFile image, MultipartFile record){
        log.info(reqDTO.toString());
        Diary diary = diaryRepository.findById(reqDTO.diaryId()).orElseThrow();

        diary.setTitle(reqDTO.title());
        diary.setContent(reqDTO.content());
        diary.setHeight(reqDTO.height());
        diary.setWeight(reqDTO.weight());

        if(diary.getImage_url() != null)
            s3Service.deleteFile(diary.getImage_url());
        if(diary.getRecord_url() != null)
            s3Service.deleteFile(diary.getRecord_url());

        InputStream imageStream = null;
        InputStream recordStream = null;
        String imageName = null;
        String recordName = null;
        String imgMimeType = null;
        String recordMimeType = null;
        try {
            if (image != null) {
                imageStream = image.getInputStream();
                imageName = image.getOriginalFilename();
                InputStream tmp = image.getInputStream();
                imgMimeType = tika.detect(tmp);
            }
            if (record != null) {
                recordStream = record.getInputStream();
                recordName = record.getOriginalFilename();
                InputStream tmp = record.getInputStream();
                recordMimeType = tika.detect(tmp);
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        String sentiment = aiService.getSentiment(reqDTO.content());
        diary.setSentiment(sentiment);
        diary = uploadFile(imageStream, imageName, "img", diary, imgMimeType);
        diary = uploadFile(recordStream, recordName, "record", diary, recordMimeType);

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
                              InputStream recordStream, String recordName,
                              String imgMimeType, String recordMimeType){
        Diary diary = new Diary();

        diary.setParent(parentRepository.findById(parentId).orElse(null));

        diary.setTitle(reqDTO.title());
        diary.setContent(reqDTO.content());
        diary.setCreatedAt(LocalDateTime.now().plusHours(9));
        diary.setAccount(reqDTO.account());
        diary.setDeposit(reqDTO.deposit());
        diary.setHeight(reqDTO.height());
        diary.setWeight(reqDTO.weight());
        diary.setMemo(reqDTO.memo());


        diary = uploadFile(imageStream, imageName, "img", diary, imgMimeType);
        diary = uploadFile(recordStream, recordName, "record", diary, recordMimeType);

        return diary;
    }

    private Diary uploadFile(InputStream inputStream, String fileName, String fileType, Diary diary, String mimeType){
        if(inputStream != null && fileName != null){
            String uploadFileName = s3Service.uploadFile(inputStream, fileName, fileType, mimeType);
            if(fileType.equals("img")){
                diary.setImage_url(uploadFileName);
            }else if(fileType.equals("record")){
                diary.setRecord_url(uploadFileName);
            }
        }else{
            if(fileType.equals("img")){
                diary.setImage_url(null);
            }else{
                diary.setRecord_url(null);
            }
        }
        return diary;
    }

}
