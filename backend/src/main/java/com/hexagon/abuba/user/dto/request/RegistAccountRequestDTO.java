package com.hexagon.abuba.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "계좌번호를 등록하는 DTO")
public record RegistAccountRequestDTO(
        @Schema(description = "부모인지, 자녀인지 여부") Boolean isParent,
        @Schema(description = "계좌번호") String accountNo,
        @Schema(description = "은행명") String bankName
) {
}
