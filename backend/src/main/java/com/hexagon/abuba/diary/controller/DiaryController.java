package com.hexagon.abuba.diary.controller;

import com.hexagon.abuba.diary.Diary;
import com.hexagon.abuba.diary.dto.request.DiaryRecentReqDTO;
import com.hexagon.abuba.diary.dto.response.DiaryRecentResDTO;
import com.hexagon.abuba.diary.service.DiaryService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.net.ssl.SSLSession;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/diary")
@CrossOrigin("*")
@Slf4j
public class DiaryController {
    /*
    TODO
    /recents : GET - 아이 사진 정보 최대 3개
    /notification : GET - 알림
    / : GET - 목록 조회
    / : POST - 일기 작성
    / : PUT - 일기 수정
    /{diary_id} : GET - 상세 조회
     */

    private final DiaryService diaryService;

    public DiaryController(DiaryService diaryService) {
        this.diaryService = diaryService;
    }

    /***
     * 가장 최근에 다이어리에 작성한 사진이 있는 게시물 3개 불러오기
     * @param diaryRecentReqDTO
     * @return
     */
    @GetMapping("/recents")
    @Operation(summary = "가장 최근에 다이어리에 작성한 사진이 있는 게시물 3개 불러오기")
    public ResponseEntity<List<DiaryRecentResDTO>> getRecent(@RequestBody(required = true) final DiaryRecentReqDTO diaryRecentReqDTO) {
        log.info("getRecent");
        List<DiaryRecentResDTO> diaryRecentResDTOList = diaryService.recentDiary(diaryRecentReqDTO);

        return ResponseEntity.ok(diaryRecentResDTOList);
    }

}
