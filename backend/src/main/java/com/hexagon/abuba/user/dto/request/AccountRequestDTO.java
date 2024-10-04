package com.hexagon.abuba.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "계좌번호에 1원송금을 요청하는 DTO")
public record AccountRequestDTO(
        @Schema(description = "계좌번호")
        String accountNo,
        @Schema(description = "은행명")
        String bankName
) {
}
