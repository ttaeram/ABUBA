package com.hexagon.abuba.global.openfeign.dto.response;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DepositREC {
    private String transactionUniqueNo;
    private String transactionDate;
}
