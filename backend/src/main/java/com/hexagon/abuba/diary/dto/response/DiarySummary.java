package com.hexagon.abuba.diary.dto.response;

import java.time.LocalDateTime;

public record DiarySummary(
        Long diaryId,
        String title,
        LocalDateTime createdAt,
        String sentiment
) {
}
