package com.hexagon.abuba.auth.dto.request;


import io.swagger.v3.oas.annotations.media.Schema;

public record VerifyEmailDTO(@Schema(description = "인증번호") String token) {
}
