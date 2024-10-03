package com.hexagon.abuba.global.openfeign.dto.response;


public record InQuireTransactionHistoryREC(
        Long transactionUniqueNo,
        String transactionDate,
        String transactionTime,
        String transactionType,
        String transactionTypeName,
        String transactionAccountNo,
        Long transactionBalance,
        Long transactionAfterBalance,
        String transactionSummary,
        String transactionMemo
) {}