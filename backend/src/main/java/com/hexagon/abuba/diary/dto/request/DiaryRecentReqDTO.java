package com.hexagon.abuba.diary.dto.request;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Schema
@Getter
@Setter
public record DiaryRecentReqDTO(Long parentId) {
}
