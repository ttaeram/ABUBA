package com.hexagon.abuba.global.exception;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Exception 을 핸들링하는 클래스.
 * Controller 까지 올라온 Exception 을 처리한다.
 */
@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 개발자가 정의한 사용자 Error 를 처리한다.
     * 사용자가 정의한 Exception 이 만약 BusinessException 을 상속하고 있다면,
     * 해당 Handler 가 처리하게 된다.
     * 개발자가 정의한 HttpStatus 에 맞게 처리한다.
     * 개발자가 정의한 Exception 은 Warn 로그를 가진다.
     */
    @ExceptionHandler(BusinessException.class)
    protected ResponseEntity<ErrorResponse> handleBusinessException(final BusinessException e) {
        log.warn("BusinessException", e);
        final ErrorCode errorCode = e.getErrorCode();
        final ErrorResponse response = ErrorResponse.of(errorCode);
        return new ResponseEntity<>(response, HttpStatus.valueOf(errorCode.getStatus()));
    }
}
