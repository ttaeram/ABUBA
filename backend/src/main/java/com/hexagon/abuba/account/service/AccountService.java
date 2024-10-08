package com.hexagon.abuba.account.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hexagon.abuba.account.dto.request.HistoryReqDTO;
import com.hexagon.abuba.account.dto.response.ApiResponseDTO;
import com.hexagon.abuba.account.dto.response.BalanceAmountResponseDTO;
import com.hexagon.abuba.account.dto.response.HistoryResDTO;
import com.hexagon.abuba.global.openfeign.FinAPIClient;
import com.hexagon.abuba.global.openfeign.dto.request.*;
import com.hexagon.abuba.global.openfeign.dto.response.BalanceResponseDTO;
import com.hexagon.abuba.global.openfeign.dto.response.HistoryData;
import com.hexagon.abuba.global.openfeign.dto.response.TransferResponseDTO;
import com.hexagon.abuba.user.Parent;
import com.hexagon.abuba.user.repository.ParentRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Transactional
@Slf4j
public class AccountService {

    private final ParentRepository parentRepository;
    private final FinAPIClient finAPIClient;

    @Value("${api.key}")
    private String apiKey;

    @Value("${user.key}")
    private String userKey;

    public AccountService(ParentRepository parentRepository, FinAPIClient finAPIClient) {
        this.parentRepository = parentRepository;
        this.finAPIClient = finAPIClient;
    }

    public List<HistoryData> getHistory(Long parentId, HistoryReqDTO historyReqDTO) {
        Parent parent = parentRepository.findById(parentId).orElseThrow();

        RequestHeader header = new RequestHeader();
        header.setHeader("inquireTransactionHistoryList", apiKey, userKey);

        String accountNo = parent.getBaby().getAccount();
        String startDate = historyReqDTO.getStartDate();
        String endDate = historyReqDTO.getEndDate();
        String transactionType = "A";
        String orderByType = "DESC";

        return finAPIClient.getHistory(new HistoryRequestDTO(header, accountNo, startDate, endDate, transactionType, orderByType)).REC().list();
    }

    public BalanceAmountResponseDTO getBalance(Long parentId, boolean isParent) {
        Parent parent = parentRepository.findById(parentId).orElseThrow();
        BalanceResponseDTO balanceResponseDTO = null;

        RequestHeader header = new RequestHeader();
        header.setHeader("inquireDemandDepositAccountBalance", apiKey, userKey);

        String bankName = null;
        String account = null;
        if(isParent) {
            balanceResponseDTO = finAPIClient.getBalance(new BalanceRequestDTO(header, parent.getAccount()));
            bankName = parent.getBankName();
            account = parent.getAccount();
        }
        else {
            balanceResponseDTO = finAPIClient.getBalance(new BalanceRequestDTO(header, parent.getBaby().getAccount()));
            bankName = parent.getBaby().getBankName();
            account = parent.getBaby().getAccount();
        }
        return new BalanceAmountResponseDTO(balanceResponseDTO.REC().getBankCode(), balanceResponseDTO.REC().getAccountBalance(), bankName, account);
    }

    public boolean transferMoney(Long parentId, Long amount, String memo){
        Parent parent = parentRepository.findById(parentId).orElseThrow();
        RequestHeader header = new RequestHeader();
        header.setHeader("updateDemandDepositAccountTransfer", apiKey, userKey);
        String depositAccountNo = parent.getBaby().getAccount();
        String depositTransactionSummary = memo;
        String transactionBalance = amount.toString();
        String withdrawalAccountNo = parent.getAccount();
        String withdrawalTransactionSummary = memo;

        TransferResponseDTO responseDTO = finAPIClient.transferDeposit(new TransferRequestDTO(
                header, depositAccountNo, depositTransactionSummary, transactionBalance, withdrawalAccountNo, withdrawalTransactionSummary
        ));
        log.info(responseDTO.toString());
        if(responseDTO.Header().getResponseCode().equals("H0000")) return true;
        return false;
    }

    public void addBabyMoney(Long parentId, Long amount) {
        Parent parent = parentRepository.findById(parentId).orElseThrow();
        RequestHeader header = new RequestHeader();
        header.setHeader("updateDemandDepositAccountDeposit", apiKey, userKey);
        DepositRequestDTO depositRequestDTO = new DepositRequestDTO(
                header, parent.getAccount(), amount.toString(), null
        );
        finAPIClient.addDeposit(depositRequestDTO);
    }

    public void minusParentMoney(Long parentId, Long amount) {
        Parent parent = parentRepository.findById(parentId).orElseThrow();
        RequestHeader header = new RequestHeader();
        header.setHeader("updateDemandDepositAccountWithdrawal", apiKey, userKey);
        DepositRequestDTO depositRequestDTO = new DepositRequestDTO(
                header, parent.getAccount(), amount.toString(), null
        );
        finAPIClient.withdrawDeposit(depositRequestDTO);
    }
}
