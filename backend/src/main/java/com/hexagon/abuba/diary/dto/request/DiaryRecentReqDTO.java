package com.hexagon.abuba.diary.dto.request;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema
public record DiaryRecentReqDTO(Long parentId) {
}
