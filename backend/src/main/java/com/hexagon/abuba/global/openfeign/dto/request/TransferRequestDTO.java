package com.hexagon.abuba.global.openfeign.dto.request;

public record TransferRequestDTO(RequestHeader Header,
                                 String depositAccountNo,
                                 String depositTransactionSummary,
                                 String transactionBalance,
                                 String withdrawalAccountNo,
                                 String withdrawalTransactionSummary) {
}
