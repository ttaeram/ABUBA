package com.hexagon.abuba.diary.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * @param title     제목
 * @param content   내용
 * @param createdAt 작성시간
 * @param account   계좌번호
 * @param deposit   입금액
 * @param height    키
 * @param weight    몸무게
 */
@Schema
public record DiaryDetailReqDTO(String title, String content, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime createdAt, String account,
                                BigDecimal deposit, Double height, Double weight
                                ) {
}