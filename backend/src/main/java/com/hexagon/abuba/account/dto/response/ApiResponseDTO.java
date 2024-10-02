package com.hexagon.abuba.account.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Schema
@Getter
@Setter
public class ApiResponseDTO {

    @JsonProperty("Header")
    private HeaderDTO header;

    @JsonProperty("REC")
    private RecDTO rec;

    @Getter
    @Setter
    public static class HeaderDTO {
        @JsonProperty("responseCode")
        private String responseCode;

        @JsonProperty("responseMessage")
        private String responseMessage;

        @JsonProperty("apiName")
        private String apiName;

        @JsonProperty("transmissionDate")
        private String transmissionDate;

        @JsonProperty("transmissionTime")
        private String transmissionTime;

        @JsonProperty("institutionCode")
        private String institutionCode;

        @JsonProperty("apiKey")
        private String apiKey;

        @JsonProperty("apiServiceCode")
        private String apiServiceCode;

        @JsonProperty("institutionTransactionUniqueNo")
        private String institutionTransactionUniqueNo;
    }

    @Getter
    @Setter
    public static class RecDTO {
        @JsonProperty("totalCount")
        private String totalCount;

        @JsonProperty("list")
        private List<TransactionDTO> list;
    }

    @Getter
    @Setter
    public static class TransactionDTO {
        @JsonProperty("transactionDate")
        private String transactionDate;

        @JsonProperty("transactionTime")
        private String transactionTime;

        @JsonProperty("transactionType")
        private String transactionType;

        @JsonProperty("transactionTypeName")
        private String transactionTypeName;

        @JsonProperty("transactionAccountName")
        private String transactionAccountName;

        @JsonProperty("transactionBalance")
        private String transactionBalance;

        @JsonProperty("transactionAfterBalance")
        private String transactionAfterBalance;

        @JsonProperty("transactionSummary")
        private String transactionSummary;

        @JsonProperty("transactionMemo")
        private String transactionMemo;
    }
}
