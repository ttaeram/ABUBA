package com.hexagon.abuba.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "로그인 요청에 사용할 DTO")
public record LoginDTO(
        @Schema(description = "로그인 id(email)")
        String username,
        @Schema(description = "password")
        String password) {
}
