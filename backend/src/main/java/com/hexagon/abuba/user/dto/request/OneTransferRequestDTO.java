package com.hexagon.abuba.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "1원 송금 하기 DTO")
public record OneTransferRequestDTO(
        @Schema(description = "계좌번호")
        String account,
        @Schema(description = "은행명")
        String authText
) {
}
