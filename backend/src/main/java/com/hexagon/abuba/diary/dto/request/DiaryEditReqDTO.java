package com.hexagon.abuba.diary.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema
public record DiaryEditReqDTO(Long diaryId, String title, String content, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime createdAt,
                              Double height, Double weight) {
}
