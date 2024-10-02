package com.hexagon.abuba.account.controller;


import com.hexagon.abuba.account.dto.request.BalanceRequestDTO;
import com.hexagon.abuba.account.dto.request.HistoryReqDTO;
import com.hexagon.abuba.account.dto.response.HistoryResDTO;
import com.hexagon.abuba.account.service.AccountService;
import com.hexagon.abuba.global.openfeign.dto.response.BalanceResponseDTO;
import com.hexagon.abuba.user.Parent;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/members")
@CrossOrigin("*")
@Slf4j
@SecurityRequirement(name = "access")
public class AccountController {
    /*
    TODO
    / : GET - 아이 계좌 거래내역 조회
    /balance : GET - 부모/아이 계좌 잔액 조회
     */

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }


    @GetMapping
    @Operation(summary = "아이 계좌 거래내역 조회")
    public ResponseEntity<List<HistoryResDTO>> getHistory(@RequestBody HistoryReqDTO historyReqDTO,
                                             @AuthenticationPrincipal(expression = "user") Parent user) {
        List<HistoryResDTO> historyResDTOList = accountService.getHistory(user.getId(), historyReqDTO);

        return ResponseEntity.ok(historyResDTOList);
    }

    @GetMapping("/balance")
    @Operation(summary = "잔액 조회")
    public ResponseEntity<BalanceResponseDTO> getBalance(@RequestBody BalanceRequestDTO balanceRequestDTO, @AuthenticationPrincipal(expression = "user") Parent user) {
        BalanceResponseDTO balanceResponseDTO = accountService.getBalance(user.getId(), balanceRequestDTO.isParent());
        return ResponseEntity.ok(balanceResponseDTO);
    }
}
