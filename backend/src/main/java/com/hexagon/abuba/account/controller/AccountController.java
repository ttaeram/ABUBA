package com.hexagon.abuba.account.controller;


import com.hexagon.abuba.account.service.AccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/members")
@CrossOrigin("*")
@Slf4j
@SecurityRequirement(name = "access")
public class AccountController {
    /*
    TODO
    / : POST - 아이 계좌 거래내역 조회
    /balance : POST - 부모/아이 계좌 잔액 조회
     */

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

}
