package com.hexagon.abuba.global.openfeign.dto.request;

public record DepositRequestDTO(RequestHeader Header, String accountNo, String transactionBalance, String transactionSummary) {
}
