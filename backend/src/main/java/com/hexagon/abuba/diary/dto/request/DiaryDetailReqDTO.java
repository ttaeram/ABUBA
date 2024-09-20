package com.hexagon.abuba.diary.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema
@Getter
@Setter
public class DiaryDetailReqDTO {
    private Long parentId;

    //제목
    private String title;

    //내용
    private String content;

    //작성시간
    private LocalDateTime createdAt;

    //계좌번호
    private String account;

    //입금액
    private BigDecimal deposit;

    private String record_url;

    private String image_url;
    //키
    private Double height;
    //몸무게
    private Double weight;
}
