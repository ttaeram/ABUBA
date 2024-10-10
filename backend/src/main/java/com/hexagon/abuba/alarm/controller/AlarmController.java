package com.hexagon.abuba.alarm.controller;

import com.hexagon.abuba.alarm.AlarmResponseDTO;
import com.hexagon.abuba.alarm.service.AlarmService;
import com.hexagon.abuba.common.DataResponse;
import com.hexagon.abuba.user.Parent;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@Slf4j
@RequestMapping("/api/v1/alarm")
public class AlarmController {

    private final AlarmService alarmService;
    // 사용자별 SSE 연결을 관리하기 위한 맵

    public AlarmController(AlarmService alarmService) {
        this.alarmService = alarmService;
    }

    //1. 연결 설정
    //2. 알림 전송 - 새로운 게시글이 등록됐음을 알리는 api 새로운글이 몇개 등록 되었는지 확인한다.
    //3. 알림 조회 - 알림 목록을 전달한다. 전달할 데이터는 게시글의 제목, 작성일, id, 게시글별 조회 여부
    // SSE 연결 설정
    @SecurityRequirement(name = "access")  // 이 API는 토큰이 필요함
    @Operation(summary = "알람 구독")
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@AuthenticationPrincipal(expression = "user") Parent user) {
        log.info(" subscribe요청이 들어왔습니다. user={}",user.getId());
        return alarmService.subscribe(user.getUsername());
    }


    @SecurityRequirement(name="access")
    @Operation(summary = "알림 조회")
    @GetMapping
    public ResponseEntity<DataResponse<?>> getAlarms(@AuthenticationPrincipal(expression = "user") Parent  user) {
        List<AlarmResponseDTO> response =  alarmService.getAlarms(user.getId());
        return new ResponseEntity<>(DataResponse.of(HttpStatus.OK,"알람 조회 성공", response),HttpStatus.OK);
    }
}

