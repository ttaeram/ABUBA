package com.hexagon.abuba.user.controller;

import com.hexagon.abuba.auth.service.AuthService;
import com.hexagon.abuba.common.DataResponse;
import com.hexagon.abuba.common.MessageResponse;
import com.hexagon.abuba.user.Baby;
import com.hexagon.abuba.user.Parent;
import com.hexagon.abuba.global.openfeign.dto.request.OneTransferRequestDTO;
import com.hexagon.abuba.user.dto.request.AccountRequestDTO;
import com.hexagon.abuba.user.dto.request.RegistBabyInfoDTO;
import com.hexagon.abuba.user.dto.response.BabyInfoResponseDTO;
import com.hexagon.abuba.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin("*")
@SecurityRequirement(name = "access")
@Slf4j
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
    }

    @Operation(summary = "아이정보등록", description = "아이정보를 등록합니다.")
    @PostMapping("/babyInfo")
    public ResponseEntity<MessageResponse> registBabyInfo(@AuthenticationPrincipal(expression = "user") Parent user,@RequestBody RegistBabyInfoDTO babyInfoDTO){
        userService.registBaby(babyInfoDTO, user.getId());
        return new ResponseEntity<>(MessageResponse.of(HttpStatus.OK, "아이정보등록이 완료됬습니다."), HttpStatus.OK);
    }

    @Operation(summary = "1원송금", description = "계좌번호로 1원을 송금합니다.")
    @PostMapping("/1won")
    public ResponseEntity<DataResponse<?>> send1won(@AuthenticationPrincipal(expression = "user") Parent user, @RequestBody AccountRequestDTO request){
        OneTransferRequestDTO response = userService.transfer1won(request, user);
        return new ResponseEntity<>(DataResponse.of(HttpStatus.OK,"1원송금이 완료되었습니다." ,response),HttpStatus.OK);
    }

    @Operation(summary = "아이정보 조회", description = "아이정보를 조회합니다.")
    @GetMapping("/baby")
    public ResponseEntity<DataResponse<BabyInfoResponseDTO>> getBaby(@AuthenticationPrincipal(expression = "user") Parent user){
        log.info("user={}",user.getId());
        Baby baby = user.getBaby();
        BabyInfoResponseDTO response = new BabyInfoResponseDTO(baby.getName(), user.getRelationship(), baby.getHeight(), baby.getWeight(), baby.getBirthDate(), baby.getGender());
        //TODO 예외처리
        return new ResponseEntity<>(DataResponse.of(HttpStatus.OK,"아이정보 조회가 완료됬습니다.",response),HttpStatus.OK);
    }


}
