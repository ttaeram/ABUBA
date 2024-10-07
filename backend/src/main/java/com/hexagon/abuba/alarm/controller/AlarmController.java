package com.hexagon.abuba.alarm.controller;

import com.hexagon.abuba.user.Parent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@Slf4j
@RequestMapping("/alarm")
public class AlarmController {
    // 사용자별 SSE 연결을 관리하기 위한 맵
    private final Map<String, SseEmitter> sseEmitters = new ConcurrentHashMap<>();

    //1. 연결 설정
    //2. 알림 전송 - 새로운 게시글이 등록됐음을 알리는 api 새로운글이 몇개 등록 되었는지 확인한다.
    //3. 알림 조회 - 알림 목록을 전달한다. 전달할 데이터는 게시글의 제목, 작성일, id, 게시글별 조회 여부
    // SSE 연결 설정
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@AuthenticationPrincipal Parent user) {
        SseEmitter emitter = new SseEmitter(60 * 1000L); // 1분 타임아웃
        sseEmitters.put(user.getUsername(), emitter);
        emitter.onCompletion(() -> sseEmitters.remove(user.getUsername()));
        emitter.onTimeout(() -> sseEmitters.remove(user.getUsername()));
        return emitter;
    }

    // 특정 사용자들에게 알림을 보내는 메서드
    @PostMapping("/send/{userId}")
    public String sendNotificationToUser(@PathVariable String userId, @RequestParam String message) {
        SseEmitter emitter = sseEmitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("notification").data(message));
            } catch (IOException e) {
                sseEmitters.remove(userId);
                return "Failed to send notification";
            }
        }
        return "Notification sent to user " + userId;
    }

//    // SSE 연결 설정
//    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//    public SseEmitter subscribe(@PathVariable String userId) {
//        SseEmitter emitter = new SseEmitter(60 * 1000L); // 1분 타임아웃
//        sseEmitters.put(userId, emitter);
//        emitter.onCompletion(() -> sseEmitters.remove(userId));
//        emitter.onTimeout(() -> sseEmitters.remove(userId));
//        return emitter;
//    }
//
//    // 특정 사용자들에게 알림을 보내는 메서드
//    @PostMapping("/send/{userId}")
//    public String sendNotificationToUser(@PathVariable String userId, @RequestParam String message) {
//        SseEmitter emitter = sseEmitters.get(userId);
//        if (emitter != null) {
//            try {
//                emitter.send(SseEmitter.event().name("notification").data(message));
//            } catch (IOException e) {
//                sseEmitters.remove(userId);
//                return "Failed to send notification";
//            }
//        }
//        return "Notification sent to user " + userId;
//    }
}

