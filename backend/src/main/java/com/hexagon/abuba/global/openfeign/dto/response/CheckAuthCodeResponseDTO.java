package com.hexagon.abuba.global.openfeign.dto.response;

public record CheckAuthCodeResponseDTO(
    ResponseHeader Header,
    CheckAuthREC REC
    ){}
