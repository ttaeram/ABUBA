package com.hexagon.abuba.global.openfeign.dto.request;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@RequiredArgsConstructor
public class SignupRequestDTO {
    private final String apiKey;
    private final String userId;
}
