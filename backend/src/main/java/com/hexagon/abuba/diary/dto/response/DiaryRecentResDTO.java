package com.hexagon.abuba.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Schema
@Getter
@Setter
public class DiaryRecentResDTO {
    private Long diaryId;
    private String imageUrl;
}
