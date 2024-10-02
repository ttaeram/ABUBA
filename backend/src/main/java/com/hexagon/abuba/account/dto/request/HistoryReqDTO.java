package com.hexagon.abuba.account.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
@Schema
public class HistoryReqDTO {
    String startDate;
    String endDate;
}
