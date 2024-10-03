package com.hexagon.abuba.global.openfeign;

import com.hexagon.abuba.common.DataResponse;
import com.hexagon.abuba.global.openfeign.dto.request.BalanceRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.request.CheckAuthCodeRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.request.DepositRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.request.InQuireTransactionHistoryRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.request.OneTransferRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.request.SignupRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.response.BalanceResponseDTO;
import com.hexagon.abuba.global.openfeign.dto.response.CheckAuthCodeResponseDTO;
import com.hexagon.abuba.global.openfeign.dto.response.DepositResponseDTO;
import com.hexagon.abuba.global.openfeign.dto.response.InQuireTransactionHistoryResponseDTO;
import com.hexagon.abuba.global.openfeign.dto.response.OneTransferResponseDTO;
import com.hexagon.abuba.global.openfeign.dto.response.SignupResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "FinAPI", url = "https://finopenapi.ssafy.io/ssafy/api/v1")
public interface FinAPIClient {

    @PostMapping("/member")
    SignupResponseDTO signup(@RequestBody SignupRequestDTO signupRequestDTO);

    @PostMapping("/edu/demandDeposit/inquireDemandDepositAccountBalance")
    BalanceResponseDTO getBalance(@RequestBody BalanceRequestDTO balanceRequestDTO);

    @PostMapping(value = "/edu/accountAuth/openAccountAuth")
    OneTransferResponseDTO accountAuth(@RequestBody OneTransferRequestDTO oneTransferRequestDTO);

    @PostMapping(value = "edu/demandDeposit/updateDemandDepositAccountWithdrawal")
    DepositResponseDTO withdrawDeposit(@RequestBody DepositRequestDTO depositRequestDTO);

    @PostMapping(value = "edu/demandDeposit/updateDemandDepositAccountDeposit")
    DepositResponseDTO addDeposit(@RequestBody DepositRequestDTO depositRequestDTO);

    @PostMapping(value = "edu/demandDeposit/inquireTransactionHistory")
    InQuireTransactionHistoryResponseDTO inquireTransactionHistory(@RequestBody InQuireTransactionHistoryRequestDTO inQuireTransactionHistoryRequestDTO);

    @PostMapping(value="edu/accountAuth/checkAuthCode")
    CheckAuthCodeResponseDTO checkAuthCode(@RequestBody CheckAuthCodeRequestDTO checkAuthCodeRequestDTO);
}
