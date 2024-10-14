package com.hexagon.abuba.diary.service;

import com.hexagon.abuba.account.service.AccountService;
import com.hexagon.abuba.alarm.entity.Alarm;
import com.hexagon.abuba.alarm.repository.AlarmRepository;
import com.hexagon.abuba.alarm.service.AlarmService;
import com.hexagon.abuba.diary.entity.Diary;
import com.hexagon.abuba.diary.dto.request.DiaryDetailReqDTO;
import com.hexagon.abuba.diary.dto.request.DiaryEditReqDTO;
import com.hexagon.abuba.diary.dto.response.*;
import com.hexagon.abuba.diary.repository.DiaryRepository;
import com.hexagon.abuba.global.exception.BusinessException;
import com.hexagon.abuba.global.exception.ErrorCode;
import com.hexagon.abuba.s3.service.S3Service;
import com.hexagon.abuba.user.Baby;
import com.hexagon.abuba.user.Parent;
import com.hexagon.abuba.user.repository.BabyRepository;
import com.hexagon.abuba.user.repository.ParentRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@Slf4j
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final ParentRepository parentRepository;
    private final S3Service s3Service;
    private final AccountService accountService;
    private final Tika tika;
    private final BabyRepository babyRepository;
    private final AlarmRepository alarmRepository;
    private final AlarmService alarmService;
    private final AIService aiService;

    public DiaryService(DiaryRepository diaryRepository, ParentRepository parentRepository, S3Service s3Service, AccountService accountService, BabyRepository babyRepository, AIService aiService,  AlarmRepository alarmRepository, AlarmService alarmService) {
        this.diaryRepository = diaryRepository;
        this.parentRepository = parentRepository;
        this.s3Service = s3Service;
        this.accountService = accountService;
        this.tika = new Tika();
        this.babyRepository = babyRepository;
        this.aiService = aiService;
        this.alarmRepository = alarmRepository;
        this.alarmService = alarmService;
    }

    @Transactional
    public List<DiaryRecentResDTO> recentDiary(Long parentId) {
        List<DiaryRecentResDTO> diaryRecentResDTOList = new ArrayList<>();
        Parent parent = parentRepository.findById(parentId).orElseThrow();
        Baby baby = parent.getBaby();
        List<Parent> parentList = baby.getParents();
        List<Diary> diaries = diaryRepository.findByParents(parentList);

        for (Diary diary : diaries) {
            DiaryRecentResDTO diaryRecentResDTO = new DiaryRecentResDTO(diary.getId(), null);
            if(diary.getImage_url() != null) {
                diaryRecentResDTO = new DiaryRecentResDTO(
                        diary.getId(),
                        s3Service.getFileUrl(diary.getImage_url())
                );
            }
            diaryRecentResDTOList.add(diaryRecentResDTO);

            if(diaryRecentResDTOList.size() == 3) break; // 최대 3개까지만
        }
        return diaryRecentResDTOList;
    }

    @Transactional
    public List<DiaryResDTO> getList(Long parentId){
        Parent parent = parentRepository.findById(parentId).orElseThrow();
        Baby baby = parent.getBaby();
        List<Baby> babyList = babyRepository.findAllByAccount(baby.getAccount());

        List<Parent> parentList = new ArrayList<>();

        for(Baby b: babyList){
            parentList.addAll(b.getParents());
        }

        List<Diary> diaries = diaryRepository.findByParents(parentList);
//        Collections.reverse(diaries);
        List<DiaryResDTO> diaryResDTOList = new ArrayList<>();
        for (Diary diary : diaries) {
            DiaryResDTO diaryResDTO = EntityToResDTO(diary);
            diaryResDTOList.add(diaryResDTO);
        }

        return diaryResDTOList;
    }

    @Transactional
    public DiaryDetailResDTO getDetail(Long diaryId, Parent user){
        Diary diary = diaryRepository.findById(diaryId).orElseThrow();
        Optional<Alarm> alarm = alarmRepository.findByDiaryIdAndParentId(diaryId, user.getId());
        if(alarm.isPresent()){
            alarm.get().setIsRead(true);
        }

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
        Diary diary = null;

        String sentiment = aiService.getSentiment(reqDTO.content());

        if(reqDTO.deposit() != null && reqDTO.deposit().intValue() != 0){
            if(accountService.transferMoney(parentId, reqDTO.deposit().longValue(), reqDTO.memo())) {
                diary = DTOToEntity(parentId, reqDTO, imageStream, imageName, recordStream, recordName, imgMimeType, recordMimeType);
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
            diary = DTOToEntity(parentId, reqDTO, imageStream, imageName, recordStream, recordName, imgMimeType, recordMimeType);
            diary.setSentiment(sentiment);
            diaryRepository.save(diary);
        }

        //알림 전송을 위한 로직 추가.
        //1.작성자가 해당 게시글을 읽었음으로 표기한다.
        Parent writer = parentRepository.findById(parentId).orElseThrow(()->new BusinessException(ErrorCode.USER_NOT_FOUND));
        log.info("writer={}",writer.getId());
        //2.동일한 아이를 가지고 있는 사람이 있으면 알람을 전송한다.
        for(Parent parent: writer.getBaby().getParents()){
            log.info("parentId={}",parent.getId());
            if(parent == writer) continue;
            //2-1.알람 Entity 내역추가.
            Alarm alarm = new Alarm();
            alarm.setDiary(diary);
            alarm.setParent(parent);
            alarmRepository.save(alarm);
            log.info("Saved Alarm ID: {}", alarm.getId());
            //2-2.알람 전송
            alarmService.sendNotification(parent);
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
        diaryRepository.save(diary);

        uploadFile(imageStream, imageName, "img", diary, imgMimeType);
        uploadFile(recordStream, recordName, "record", diary, recordMimeType);

    }


    public List<HeightResponse> getHeight(Parent user){
        List<Diary> diaries = diaryRepository.findByParentId(user.getId());

        LocalDate recent = LocalDate.now().plusDays(1);
        List<HeightResponse> responses = new ArrayList<>();
        for(Diary diary: diaries){
            if(recent.isEqual(diary.getCreatedAt().toLocalDate())){
                continue;
            }else{
                recent = diary.getCreatedAt().toLocalDate();
                responses.add(new HeightResponse(
                        recent,
                        diary.getHeight(),
                        diary.getWeight(),
                        diary.getFace_url()
                ));

            }
        }
        return responses;
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
        diary.setCreatedAt(LocalDateTime.now());
        diary.setAccount(reqDTO.account());
        diary.setDeposit(reqDTO.deposit());
        diary.setHeight(reqDTO.height());
        diary.setWeight(reqDTO.weight());
        diary.setMemo(reqDTO.memo());


        uploadFile(imageStream, imageName, "img", diary, imgMimeType);
        uploadFile(recordStream, recordName, "record", diary, recordMimeType);

        return diary;
    }
    @Async
    private void uploadFile(InputStream inputStream, String fileName, String fileType, Diary diary, String mimeType){
        if(inputStream != null && fileName != null){
            String uploadFileName = s3Service.uploadFile(inputStream, fileName, fileType, mimeType);
            if(fileType.equals("img")){
                diary.setImage_url(uploadFileName);
//                usingGoogleAI(diary.getImage_url(), diary);
            }else if(fileType.equals("record")){
                diary.setRecord_url(uploadFileName);
            }
        }
    }

    @Async
    private void usingGoogleAI(String imageUrl, Diary diary) {
        if(imageUrl == null) return;
        try{
            String faceImageUrl = String.valueOf(aiService.detectFacesGcs(s3Service.getFileUrl(imageUrl)).get());
            if(faceImageUrl != null){
                diary.setFace_url(faceImageUrl);
            }
        }catch (Exception e){
            log.info("GoogleAI 사용하다가 Exception이 발생했습니다.");
            e.printStackTrace();
        }

    }

    /**
     * 캘린더형태로 조회할 수 있는 데이터를 반환한다.
     * @param year
     * @param month
     * @param user
     */
    @Transactional
    public CalendarResponse getCalendar(int year, int month, Parent user) {
        YearMonth yearMonth = YearMonth.of(year, month);
        List<DayPosts> dayPostsList = initializeMonthDays(yearMonth);

        Long babyId = user.getBaby().getId();
        List<Diary> posts = diaryRepository.findByYearAndMonthAndId(year, month, babyId);
        mapPostsToDays(dayPostsList, posts);

        return new CalendarResponse(year, month, dayPostsList);
    }

    private List<DayPosts> initializeMonthDays(YearMonth yearMonth) {
        return IntStream.rangeClosed(1, yearMonth.lengthOfMonth())
                .mapToObj(day -> new DayPosts(yearMonth.atDay(day).toString(), new ArrayList<>()))
                .collect(Collectors.toList());
    }

    private void mapPostsToDays(List<DayPosts> dayPostsList, List<Diary> posts) {
        Map<String, List<DiarySummary>> postsByDate = posts.stream()
                .collect(Collectors.groupingBy(
                        post -> post.getCreatedAt().toLocalDate().toString(),
                        Collectors.mapping(this::toPostSummary, Collectors.toList())
                ));

        dayPostsList.forEach(dayPosts ->
                dayPosts.setPosts(postsByDate.getOrDefault(dayPosts.getDate(), new ArrayList<>()))
        );
    }

    private DiarySummary toPostSummary(Diary diary) {
        return new DiarySummary(diary.getId(), diary.getTitle(), diary.getCreatedAt(), diary.getSentiment());
    }
}
