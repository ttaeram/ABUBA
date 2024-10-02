package com.hexagon.abuba.user.service;


import com.hexagon.abuba.global.openfeign.FinAPIClient;
import com.hexagon.abuba.global.openfeign.dto.request.RequestHeader;
import com.hexagon.abuba.global.openfeign.dto.response.OneTransferResponseDTO;
import com.hexagon.abuba.user.Baby;
import com.hexagon.abuba.user.Parent;
import com.hexagon.abuba.global.openfeign.dto.request.OneTransferRequestDTO;
import com.hexagon.abuba.user.dto.request.AccountRequestDTO;
import com.hexagon.abuba.user.dto.request.RegistBabyInfoDTO;
import com.hexagon.abuba.user.repository.BabyRepository;
import com.hexagon.abuba.user.repository.ParentRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Transactional
public class UserService {
    private final ParentRepository parentRepository;
    private final BabyRepository babyRepository;
    private final FinAPIClient finAPIClient;

    @Value("${api.key}")
    private String apiKey;
    @Value("${user.key}")
    private String userKey;
    @Autowired
    public UserService(ParentRepository parentRepository, BabyRepository babyRepository, FinAPIClient finAPIClient) {
        this.parentRepository = parentRepository;
        this.babyRepository = babyRepository;
        this.finAPIClient = finAPIClient;
    }


    public void registBaby(RegistBabyInfoDTO babyInfoDTO ,Long parentId) {
        //아이정보 등록하기
        Parent parent = parentRepository.findById(parentId).orElseThrow();
        Baby baby = convertToEntity(babyInfoDTO, parent);
        //아이와 연관관계 매핑 (부모쪽에서 연결한다.)
        parent.setRelationship(babyInfoDTO.relation());
        parent.setBaby(baby);
        babyRepository.save(baby);
    }

    private Baby convertToEntity(RegistBabyInfoDTO babyInfoDTO, Parent parent) {
        return Baby.builder()
                .name(babyInfoDTO.name())
                .birthDate(babyInfoDTO.birthday())
                .gender(babyInfoDTO.gender())
                .height(babyInfoDTO.height())
                .weight(babyInfoDTO.weight())
                .build();
    }

    public OneTransferRequestDTO transfer1won(AccountRequestDTO request, Parent user) {
        //1.사용자 계좌에 1원을 송금한다.
        RequestHeader requestHeader = new RequestHeader();
        requestHeader.setHeader("openAccountAuth", apiKey, userKey);

        OneTransferRequestDTO oneRequest = new OneTransferRequestDTO();
        oneRequest.setHeader(requestHeader);
        oneRequest.setAccountNo(request.accountNo());
        oneRequest.setAuthText("SSAFY");

        log.info("oneRequest: {}", oneRequest);
        OneTransferResponseDTO accountResponse = finAPIClient.accountAuth(oneRequest);
        log.info("accountResponse {}", accountResponse);
        //2.사용자 거래 내역을 조회하여 내역을 반환한다.

        //3.입금 일시, 입급내역 등
        return null;
    }
}
