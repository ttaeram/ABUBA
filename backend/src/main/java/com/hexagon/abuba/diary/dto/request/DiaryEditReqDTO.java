package com.hexagon.abuba.diary.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema
public record DiaryEditReqDTO(Long diaryId, String title, String content, LocalDateTime createdAt,
                              Double height, Double weight) {
}
