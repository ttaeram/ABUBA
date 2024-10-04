package com.hexagon.abuba.global.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ErrorResponse {

    /**
     * error 메시지
     */
    private String message;

    /**
     * Http 상태 코드
     */
    private int status;

    /**
     * 직접 정의한 Custom Error Code
     */
    private String code;


    /**
     * 일반적인 상황에서 Error 를 반환하는 경우
     * 빈 배열을 반환한다.
     * @param code ErrorCode Enum 값을 넣는다
     */
    private ErrorResponse(final ErrorCode code) {
        this.message = code.getMessage();
        this.status = code.getStatus();
        this.code = code.getCode();
    }

    /**
     * 일반적인 Error 의 경우 사용된다.
     * @param code ErrorCode Enum 클래스를 넣는다
     * @return ErrorResponse 를 반환한다.
     */
    public static ErrorResponse of(final ErrorCode code) {
        return new ErrorResponse(code);
    }
}
