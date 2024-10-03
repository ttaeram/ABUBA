package com.hexagon.abuba.global.openfeign.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


public record CheckAuthREC (
    String status,
    Long transactionUniqueNo,
    String accountNo
){}
