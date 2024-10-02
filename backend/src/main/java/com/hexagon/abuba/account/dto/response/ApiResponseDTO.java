package com.hexagon.abuba.account.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ApiResponseDTO {
    private HeaderDTO Header;
    private RecDTO REC;

    @Getter
    @Setter
    public static class HeaderDTO {
        private String responseCode;
        private String responseMessage;
        private String apiName;
        private String transmissionDate;
        private String transmissionTime;
        private String institutionCode;
        private String apiKey;
        private String apiServiceCode;
        private String institutionTransactionUniqueNo;
    }

    @Getter
    @Setter
    public static class RecDTO {
        private int totalCount; // 거래 건수
        private List<TransactionDTO> list; // 거래 내역 리스트
    }

    @Getter
    @Setter
    public static class TransactionDTO {
        private String transactionUniqueNo;
        private String transactionDate; // 거래일자
        private String transactionTime; // 거래시각
        private String transactionType; // 입금출금구분
        private String transactionTypeName; // 입금출금구분명
        private String transactionAccountName; // 거래계좌번호
        private String transactionBalance; // 거래금액
        private String transactionAfterBalance; // 거래후잔액
        private String transactionSummary; // 거래 요약내용
        private String transactionMemo; // 거래 메모
    }
}
