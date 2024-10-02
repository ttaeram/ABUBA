package com.hexagon.abuba.global.openfeign.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "1원 송금요청 DTO")
@ToString
public class OneTransferRequestDTO {
    @Schema(description = "공통해더")
    private RequestHeader Header;
    @Schema(description = "계좌번호")
    private String accountNo;
    @Schema(description = "회사명")
    private String authText;
}
