package com.hexagon.abuba.diary.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

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
@Getter
@Setter
public record DiaryDetailReqDTO(Long parentId, String title, String content, LocalDateTime createdAt, String account,
                                BigDecimal deposit, String record_url, String image_url, Double height, Double weight) {
}
