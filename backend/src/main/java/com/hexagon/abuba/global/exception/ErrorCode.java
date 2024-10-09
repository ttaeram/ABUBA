package com.hexagon.abuba.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    //accountH1008 API_KEY가 유효하지않습니다.
    //H1009 USER_KEY가 유효하지 않습니다.
    //H1003 계좌번호가 유효하지 않습니다.
    ACCOUNT_NUMBER_INVALID(HttpStatus.UNAUTHORIZED, "A001", "계좌번호가 유효하지 않습니다."),
    INVALID_ACCOUNT_NUMBER(HttpStatus.BAD_REQUEST, "A002","잘못된 계좌번호입니다."),
    ALREADY_EXISTS_ACCOUNT(HttpStatus.NOT_ACCEPTABLE, "A003", "이미 등록된 계좌번호입니다."),

    //User,
    INVALID_USER_KEY(HttpStatus.FORBIDDEN,"U001","유효하지 않은 유저키 입니다."),
    DUPLICATED_EMAIL(HttpStatus.CONFLICT,"U002","이미 사용중인 이메일입니다."),
    INVALID_PARENT_NUMBER(HttpStatus.NO_CONTENT, "U003", "아이 정보가 일치하지 않습니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND,"U003","해당 유저를 찾을 수 없습니다."),
    BABY_INFO_DOES_NOT_MATCH(HttpStatus.UNPROCESSABLE_ENTITY, "U004", "이미 등록된 아이의 계좌입니다. 아이의 이름을 제대로 입력했는지 확인해주세요");
    private final HttpStatus status;
    private final String code;
    private final String message;

    public int getStatus(){
        return this.status.value();
    }

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}
