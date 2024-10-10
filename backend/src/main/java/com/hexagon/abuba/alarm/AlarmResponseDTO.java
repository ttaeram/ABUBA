package com.hexagon.abuba.alarm;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "알림응답형태")
public record AlarmResponseDTO(
        @Schema(description = "작성시간")
        LocalDateTime createdAt,
        @Schema(description = "읽었는지 여부")
        Boolean isRead,
        @Schema(description = "diary고유Id")
        Long diaryId,
        @Schema(description = "작성자")
        String writer,
        @Schema(description = "제목")
        String title) {
}
