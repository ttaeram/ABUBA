package com.hexagon.abuba.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(description = "아이정보를 등록하는 DTO")
public record RegistBabyInfoDTO(
        @Schema(description = "이이이름")
        String name,
        @Schema(description = "아이와 부모의 관계")
        String relation,
        @Schema(description = "키")
        Double height,
        @Schema(description = "몸무게")
        Double weight,
        @Schema(description = "생일")
        LocalDate birthday,
        @Schema(description = "성별")
        String gender) {
}
