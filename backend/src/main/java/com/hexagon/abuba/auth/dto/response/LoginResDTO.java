package com.hexagon.abuba.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "로그인 이후 클라이언트에게 반환할 정보를 담은 DTO")
public record LoginResDTO(
        @Schema(description = "사용자 id(email)") String email,
        @Schema(description = "사용자의 이름") String name) {
}
