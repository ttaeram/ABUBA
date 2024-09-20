package com.hexagon.abuba.diary.dto.request;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Schema
@Getter
@Setter
public class DiaryRecentReqDTO {
    private Long parentId;
}
