package com.hexagon.abuba.alarm.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@Slf4j
@RequestMapping("/alarm")
public class Alarm {
    // 사용자별 SSE 연결을 관리하기 위한 맵
    private final Map<String, SseEmitter> sseEmitters = new ConcurrentHashMap<>();

    // SSE 연결 설정
    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable String userId) {
        SseEmitter emitter = new SseEmitter(60 * 1000L); // 1분 타임아웃
        sseEmitters.put(userId, emitter);

        emitter.onCompletion(() -> sseEmitters.remove(userId));
        emitter.onTimeout(() -> sseEmitters.remove(userId));

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
}

