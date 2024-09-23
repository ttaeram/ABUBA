package com.hexagon.abuba.Auth.controller;

import com.hexagon.abuba.Auth.dto.JoinDTO;
import com.hexagon.abuba.Auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public String signup(JoinDTO joinDTO) {
        authService.joinProcess(joinDTO);
        return "ok";
    }
}
