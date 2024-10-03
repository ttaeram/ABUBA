package com.hexagon.abuba.global.openfeign.dto.response;

import lombok.*;

public record OneTransferResponseDTO (
    ResponseHeader Header,
    REC REC
){}
