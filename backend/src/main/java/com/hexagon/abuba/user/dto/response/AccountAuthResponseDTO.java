package com.hexagon.abuba.user.dto.response;

import java.time.LocalDateTime;

public record AccountAuthResponseDTO(
        String authText,
        String authCode,
        String transactionBalance,
        String transactionAfterBalance,
        LocalDateTime dateTime
) {
}
