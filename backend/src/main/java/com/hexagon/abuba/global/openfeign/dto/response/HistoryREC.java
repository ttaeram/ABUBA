package com.hexagon.abuba.global.openfeign.dto.response;

import lombok.*;

import java.util.List;

public record HistoryREC(String totalCount, List<HistoryData> list) {
}
