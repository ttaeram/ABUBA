package com.hexagon.abuba.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema
@Getter
@Setter
public record DiaryResDTO(Long id, String title, String content, LocalDateTime createdAt, BigDecimal deposit,
                          String imageUrl) {
}
