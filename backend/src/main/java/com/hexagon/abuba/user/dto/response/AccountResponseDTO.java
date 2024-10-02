package com.hexagon.abuba.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description="1원 송금요청 결과를 반환하는 DTO")
public record AccountResponseDTO(
        @Schema(description = "요청 고유번호")
        String accountNum,
        @Schema(description = "인증 텍스트")
        String authText
) {
}
