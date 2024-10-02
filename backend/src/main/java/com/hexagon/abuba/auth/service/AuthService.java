package com.hexagon.abuba.auth.service;


import com.hexagon.abuba.auth.dto.request.JoinDTO;
import com.hexagon.abuba.global.openfeign.FinAPIClient;
import com.hexagon.abuba.global.openfeign.dto.request.SignupRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.response.SignupResponseDTO;
import com.hexagon.abuba.user.Baby;
import com.hexagon.abuba.user.Parent;
import com.hexagon.abuba.user.dto.response.BabyInfoResponseDTO;
import com.hexagon.abuba.user.repository.BabyRepository;
import com.hexagon.abuba.user.repository.ParentRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Transactional
@Service
@Slf4j
public class AuthService {

    private final ParentRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final FinAPIClient finAPIClient;
    private final BabyRepository babyRepository;

    @Value("${api.key}")
    private String apikey;
    public AuthService(ParentRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, FinAPIClient finAPIClient, BabyRepository babyRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.finAPIClient = finAPIClient;
        this.babyRepository = babyRepository;
    }

    public void joinProcess(JoinDTO joinDTO) {

        String username = joinDTO.getEmail();
        String password = joinDTO.getPassword();
        String name = joinDTO.getName();
        log.info("joinDTO={}",joinDTO.toString());
        Boolean isExist = userRepository.existsByUsername(username);

        if (isExist) {
            //이미 존재하는 경우 exception발생 시켜야함.
            return;
        }

        //금융api로 user키를 발급 받는다.
        SignupResponseDTO response = finAPIClient.signup(new SignupRequestDTO(apikey, joinDTO.getEmail()));

        Parent data = new Parent();

        data.setUsername(username);
        data.setPassword(bCryptPasswordEncoder.encode(password));
        data.setName(name);
        data.setRole("ROLE_USER");
        data.setUserkey(response.getUserKey());

        userRepository.save(data);
    }


    public boolean checkOnboarding(Long parentId) {
        Parent user = userRepository.findById(parentId).orElseThrow();
        if(user.getBaby() == null){
            return true;
        }
        return false;
    }

}
