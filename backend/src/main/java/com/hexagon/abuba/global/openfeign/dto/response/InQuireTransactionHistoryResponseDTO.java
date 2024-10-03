package com.hexagon.abuba.global.openfeign.dto.response;

import com.hexagon.abuba.global.openfeign.dto.request.RequestHeader;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "1원 송금요청 DTO")
public record InQuireTransactionHistoryResponseDTO(
        @Schema(description = "공통해더") RequestHeader Header,
        @Schema(description = "응답 REC") InQuireTransactionHistoryREC REC
) {}
