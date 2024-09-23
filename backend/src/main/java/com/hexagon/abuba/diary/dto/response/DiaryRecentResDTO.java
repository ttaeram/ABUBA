package com.hexagon.abuba.diary.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema
public record DiaryRecentResDTO(Long diaryId, String imageUrl) {
}
