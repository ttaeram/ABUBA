package com.hexagon.abuba.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(description = "아이정보를 반환하는 DTO")
public record BabyInfoResponseDTO(
        String name,
        String relation,
        Double height,
        Double weight,
        LocalDate birthday,
        String gender
        ) {
}
