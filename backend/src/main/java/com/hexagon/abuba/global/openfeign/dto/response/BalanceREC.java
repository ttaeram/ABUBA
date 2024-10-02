package com.hexagon.abuba.global.openfeign.dto.response;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class BalanceREC {
    private String bankCode;
    private String accountNo;
    private String accountBalance;
    private String accountCreatedDate;
    private String accountExpiryDate;
    private String lastTransactionDate;
    private String currency;
}
