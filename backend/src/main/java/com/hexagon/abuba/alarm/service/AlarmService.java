package com.hexagon.abuba.alarm.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hexagon.abuba.alarm.AlarmResponseDTO;
import com.hexagon.abuba.alarm.entity.Alarm;
import com.hexagon.abuba.alarm.repository.AlarmRepository;
import com.hexagon.abuba.diary.entity.Diary;
import com.hexagon.abuba.user.Parent;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional
@Slf4j
public class AlarmService {
    private final AlarmRepository alarmRepository;
    private final Map<String, SseEmitter> sseEmitters = new ConcurrentHashMap<>();

    @Autowired
    public AlarmService(AlarmRepository alarmRepository) {
        this.alarmRepository = alarmRepository;
    }


    public SseEmitter subscribe(String username) {
        SseEmitter emitter = new SseEmitter(60 * 1000L); // 1분 타임아웃
        sseEmitters.put(username, emitter);
        emitter.onCompletion(() -> sseEmitters.remove(username));
        emitter.onTimeout(() -> sseEmitters.remove(username));
        return emitter;
    }

    public void sendNotification(Parent parent) {
        SseEmitter emitter = sseEmitters.get(parent.getUsername());
        if (emitter != null) {
            try {
                //데이터를 가져온다.(게시글ID,작성자,읽었는지 여부,작성일)
                List<AlarmResponseDTO> response = new ArrayList<>();
                for(Alarm alarm : alarmRepository.findAllById(parent.getId())) {
                    Diary diary = alarm.getDiary();
                    AlarmResponseDTO row = new AlarmResponseDTO(diary.getCreatedAt(),
                            alarm.getIsRead(),
                            alarm.getDiary().getId(),
                            diary.getParent().getName());
                    response.add(row);
                }

                ObjectMapper objectMapper = new ObjectMapper();
                // 데이터를 JSON 형태로 변환
                String jsonData = objectMapper.writeValueAsString(response);
                // JSON 데이터를 클라이언트로 전송
                emitter.send(SseEmitter.event().name("notification").data(jsonData));
            } catch (IOException e) {
                // 전송 실패 시 emitter 삭제
                sseEmitters.remove(parent.getUsername());
                log.info("Failed to send notification to user: " + parent.getUsername());
            }
        }
    }
}
