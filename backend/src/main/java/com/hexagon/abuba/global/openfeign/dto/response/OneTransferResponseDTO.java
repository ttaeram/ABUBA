package com.hexagon.abuba.global.openfeign.dto.response;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OneTransferResponseDTO {
    ResponseHeader Header;
    REC REC;
}
