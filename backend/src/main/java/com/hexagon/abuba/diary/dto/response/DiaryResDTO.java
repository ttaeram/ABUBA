package com.hexagon.abuba.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema
public record DiaryResDTO(Long id, String title, String content, LocalDateTime createdAt, BigDecimal deposit,
                          String imageUrl) {
}
