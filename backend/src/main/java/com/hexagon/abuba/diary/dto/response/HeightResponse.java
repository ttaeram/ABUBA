package com.hexagon.abuba.diary.dto.response;

import java.time.LocalDate;

public record HeightResponse(LocalDate date, Double height, Double weight, String faceUrl) {
}
