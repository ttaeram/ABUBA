package com.hexagon.abuba.global.openfeign.dto.request;

import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class RequestHeader {
    private String apiName;//path명
    private String transmissionDate; //YYYYMMDD
    private String transmissionTime; //HHMMSS
    private String institutionCode="00100"; //
    private String fintechAppNo="001";
    private String apiServiceCode;//path명
    private String institutionTransactionUniqueNo; //YYYYMMDD HHMMSS+일련번호6개 총 20자리를 요청마다 만들어야함.
    private String apiKey;//app key
    private String userKey;//user key

    public RequestHeader() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HHmmss");

        this.transmissionDate = now.format(dateFormatter);
        this.transmissionTime = now.format(timeFormatter);

        //(YYYYMMDDHHMMSS + 6-digit serial number)
        String serialNumber = String.format("%06d", (int) (Math.random() * 1000000)); // 6자리 랜덤 숫자
        this.institutionTransactionUniqueNo = now.format(dateFormatter) + now.format(timeFormatter) + serialNumber;
    }


    public void setHeader(String path, String apiKey, String userKey){
        this.apiName = path;
        this.apiServiceCode = path;
        this.apiKey = apiKey;
        this.userKey = userKey;
    }
}



