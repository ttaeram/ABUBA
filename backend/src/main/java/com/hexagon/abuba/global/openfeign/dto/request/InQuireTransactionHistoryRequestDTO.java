package com.hexagon.abuba.global.openfeign.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "1원 송금요청 DTO")
public record InQuireTransactionHistoryRequestDTO(
        @Schema(description = "공통해더") RequestHeader Header,
        @Schema(description = "계좌번호") String accountNo,
        @Schema(description = "고유거래번호") Long transactionUniqueNo
) {}
