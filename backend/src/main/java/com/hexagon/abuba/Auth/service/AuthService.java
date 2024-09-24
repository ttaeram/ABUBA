package com.hexagon.abuba.Auth.service;


import com.hexagon.abuba.Auth.dto.JoinDTO;
import com.hexagon.abuba.user.Parent;
import com.hexagon.abuba.user.repository.ParentRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final ParentRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public AuthService(ParentRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void joinProcess(JoinDTO joinDTO) {

        String username = joinDTO.getUsername();
        String password = joinDTO.getPassword();
        String name = joinDTO.getName();

        Boolean isExist = userRepository.existsByUsername(username);

        if (isExist) {
            //이미 존재하는 경우 exception발생 시켜야함.
            return;
        }

        Parent data = new Parent();

        data.setUsername(username);
        data.setPassword(bCryptPasswordEncoder.encode(password));
        data.setName(name);
        data.setRole("ROLE_USER");

        userRepository.save(data);
    }
}
