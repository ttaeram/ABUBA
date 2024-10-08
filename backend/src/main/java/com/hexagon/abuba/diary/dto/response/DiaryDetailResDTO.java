package com.hexagon.abuba.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema
public record DiaryDetailResDTO(Long id, String title, String content, LocalDateTime createdAt, String account,
                                BigDecimal deposit, Double height, Double weight, String imageUrl, String recordUrl, String memo) {
}