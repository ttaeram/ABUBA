package com.hexagon.abuba.global.openfeign.dto.response;

public record HistoryData(String transactionUniqueNo, String transactionDate, String transactionTime,
                          String transactionType, String transactionTypeName, String transactionAccountNo,
                          String transactionBalance, String transactionAfterBalance, String transactionSummary,
                          String transactionMemo) {
}
