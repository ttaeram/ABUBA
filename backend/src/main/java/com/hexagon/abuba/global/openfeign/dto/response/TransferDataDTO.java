package com.hexagon.abuba.global.openfeign.dto.response;

public record TransferDataDTO(
        String transactionUniqueNo,
        String accountNo,
        String transactionDate,
        String transactionType,
        String transactionTypeName,
        String transactionAccountNo
) {
}
