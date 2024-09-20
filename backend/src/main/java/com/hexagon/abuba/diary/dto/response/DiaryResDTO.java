package com.hexagon.abuba.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema
@Getter
@Setter
public class DiaryResDTO {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private BigDecimal deposit;
    private String imageUrl;
}
