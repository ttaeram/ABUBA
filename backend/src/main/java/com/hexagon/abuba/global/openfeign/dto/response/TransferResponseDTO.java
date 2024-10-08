package com.hexagon.abuba.global.openfeign.dto.response;

import java.util.List;

public record TransferResponseDTO(ResponseHeader Header, List<TransferDataDTO> REC) {
}
