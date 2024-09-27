package com.hexagon.abuba.auth.controller;

import com.hexagon.abuba.auth.dto.request.JoinDTO;
import com.hexagon.abuba.auth.dto.request.LoginDTO;
import com.hexagon.abuba.auth.dto.response.LoginResDTO;
import com.hexagon.abuba.auth.service.AuthService;
import com.hexagon.abuba.common.DataResponse;
import com.hexagon.abuba.common.MessageResponse;
import com.hexagon.abuba.user.Parent;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.bridge.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "회원가입", description = "신규 유저가 회원가입합니다.")
    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> signup(@RequestBody JoinDTO joinDTO) {
        authService.joinProcess(joinDTO);
        return new ResponseEntity<>(MessageResponse.of(HttpStatus.OK,"회원가입이 완료되었습니다."),HttpStatus.OK);
    }

    @Operation(summary = "로그인", description = "신규 유저가 회원가입합니다.")
    @PostMapping("/login")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Request body for Swagger",
            required = true
    )
    public ResponseEntity<DataResponse<LoginResDTO>> login(LoginDTO loginDTO,  @Parameter(hidden = true)  HttpServletRequest request) {
        Parent user = (Parent)request.getAttribute("user");
        LoginResDTO  response = new LoginResDTO(user.getUsername(),user.getName());
        return new ResponseEntity<>(DataResponse.of(HttpStatus.OK,"로그인이 완료되었습니다.",response),HttpStatus.OK);
    }

    @SecurityRequirement(name = "bearerAuth")  // 이 API는 토큰이 필요함
    @Operation(summary = "로그아웃", description = "로그아웃")
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(){
        return new ResponseEntity<>(MessageResponse.of(HttpStatus.OK,"로그아웃 되었습니다."),HttpStatus.OK);
    }
}
