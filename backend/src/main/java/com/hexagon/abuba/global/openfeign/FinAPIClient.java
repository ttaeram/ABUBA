package com.hexagon.abuba.global.openfeign;

import com.hexagon.abuba.common.DataResponse;
import com.hexagon.abuba.global.openfeign.dto.request.OneTransferRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.request.SignupRequestDTO;
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

    @PostMapping(value = "/edu/accountAuth/openAccountAuth", consumes = "application/json")
    OneTransferResponseDTO accountAuth(@RequestBody OneTransferRequestDTO oneTransferRequestDTO);

}
