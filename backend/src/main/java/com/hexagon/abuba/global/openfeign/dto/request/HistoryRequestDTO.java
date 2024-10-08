package com.hexagon.abuba.global.openfeign.dto.request;

public record HistoryRequestDTO(RequestHeader Header, String accountNo,
                                String startDate, String endDate, String transactionType, String orderByType) {
}
