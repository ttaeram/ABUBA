package com.hexagon.abuba.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "1원송금으로 전달된 코드가 유요한지 확인하는 DTO")
public record AuthCodeCheckDTO (
    @Schema(description = "인증코드") String authCode,
    @Schema(description = "authText") String authText,
    @Schema(description = "계좌번호") String accountNo
) {}