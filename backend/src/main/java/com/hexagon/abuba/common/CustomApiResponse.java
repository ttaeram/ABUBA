package com.hexagon.abuba.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 공통된 https응답형태를 만들기 위한 추상클래스
 */
@Getter
public class CustomApiResponse {
    protected int status;
    protected String message;

    protected CustomApiResponse(HttpStatus status, String message){
        this.status = status.value();
        this.message = message;
    }
}
