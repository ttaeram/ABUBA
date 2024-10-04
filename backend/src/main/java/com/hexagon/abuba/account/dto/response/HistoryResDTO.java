package com.hexagon.abuba.account.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema
public record HistoryResDTO(String transactionDate, // 거래일자
                            String transactionTime, // 거래시각
                            String transactionType, // 입금출금구분
                            String transactionTypeName, // 입금출금구분명
                            String transactionAccountName, // 거래계좌번호
                            String transactionBalance, // 거래금액
                            String transactionAfterBalance, // 거래후잔액
                            String transactionSummary, // 거래 요약내용
                            String transactionMemo // 거래 메모
                            ) {
}
