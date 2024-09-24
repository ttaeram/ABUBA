package com.hexagon.abuba.auth.controller;

import com.hexagon.abuba.auth.dto.JoinDTO;
import com.hexagon.abuba.auth.service.AuthService;
import com.hexagon.abuba.common.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> signup(JoinDTO joinDTO) {
        authService.joinProcess(joinDTO);
        return new ResponseEntity<>(MessageResponse.of(HttpStatus.OK,"회원가입이 완료 되었습니다."),HttpStatus.OK);
    }
}
