package com.hexagon.abuba.user.service;


import com.hexagon.abuba.global.exception.BusinessException;
import com.hexagon.abuba.global.exception.ErrorCode;
import com.hexagon.abuba.global.openfeign.FinAPIClient;
import com.hexagon.abuba.global.openfeign.dto.request.CheckAuthCodeRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.request.InQuireTransactionHistoryRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.request.RequestHeader;
import com.hexagon.abuba.global.openfeign.dto.response.CheckAuthCodeResponseDTO;
import com.hexagon.abuba.global.openfeign.dto.response.InQuireTransactionHistoryResponseDTO;
import com.hexagon.abuba.global.openfeign.dto.response.OneTransferResponseDTO;
import com.hexagon.abuba.user.Baby;
import com.hexagon.abuba.user.Parent;
import com.hexagon.abuba.global.openfeign.dto.request.OneTransferRequestDTO;
import com.hexagon.abuba.user.dto.request.AccountRequestDTO;
import com.hexagon.abuba.user.dto.request.AuthCodeCheckDTO;
import com.hexagon.abuba.user.dto.request.RegistAccountRequestDTO;
import com.hexagon.abuba.user.dto.request.RegistBabyInfoDTO;
import com.hexagon.abuba.user.dto.response.AccountAuthResponseDTO;
import com.hexagon.abuba.user.repository.BabyRepository;
import com.hexagon.abuba.user.repository.ParentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
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


    public void registBaby(RegistBabyInfoDTO babyInfoDTO, Long parentId) {
        //은행정보가 있다면 저장하기


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

    /**
     * 사용자가 요청한 계좌로 1원을 송금하는 메서드
     *
     * @param request
     * @param user
     * @return
     */
    public AccountAuthResponseDTO transfer1won(AccountRequestDTO request, Parent user) {
        //1.사용자 계좌에 1원을 송금한다.
        RequestHeader requestHeader = new RequestHeader();
        requestHeader.setHeader("openAccountAuth", apiKey, userKey);
        OneTransferRequestDTO oneRequest = new OneTransferRequestDTO(requestHeader, request.accountNo(), "ABUBA");
        log.info("oneRequest: {}", oneRequest);

        try {
            OneTransferResponseDTO accountResponse = finAPIClient.accountAuth(oneRequest).orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NUMBER_INVALID));
            log.info("accountResponse {}", accountResponse);
            //2.사용자 거래 내역을 조회하여 내역을 반환한다.
            RequestHeader requestHeader2 = new RequestHeader();
            requestHeader2.setHeader("inquireTransactionHistory", apiKey, userKey);
            InQuireTransactionHistoryRequestDTO inQuireTransactionHistoryRequestDTO = new InQuireTransactionHistoryRequestDTO(
                    requestHeader2, request.accountNo()
                    , accountResponse.REC()
                    .getTransactionUniqueNo());
            InQuireTransactionHistoryResponseDTO inQuireTransactionHistoryResponseDTO = finAPIClient.inquireTransactionHistory(
                    inQuireTransactionHistoryRequestDTO);
            log.info("inQuireTransactionHistoryResponseDTO={}", inQuireTransactionHistoryResponseDTO);
            String[] result = inQuireTransactionHistoryResponseDTO.REC().transactionSummary().split(" ");
            String authText = result[0];
            String authCode = result[1];
            //반환해야할 정보
            //기업명, 인증번호 4자리, 입금한 금액, 잔액, 입금일시
            LocalDateTime dateTime = convertToLocalDateTime(inQuireTransactionHistoryResponseDTO.REC().transactionDate(),
                    inQuireTransactionHistoryResponseDTO.REC().transactionTime());
            AccountAuthResponseDTO response = new AccountAuthResponseDTO(authText, authCode,
                    inQuireTransactionHistoryResponseDTO.REC().transactionBalance().toString(),
                    inQuireTransactionHistoryResponseDTO.REC().transactionAfterBalance().toString(), dateTime);
            return response;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.ACCOUNT_NUMBER_INVALID);
        }

    }

    private LocalDateTime convertToLocalDateTime(String date, String time) {
        // 날짜와 시간 패턴을 지정
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        // transactionDate와 transactionTime을 결합한 문자열 생성
        String dateTimeString = date + time;

        // LocalDateTime으로 변환
        return LocalDateTime.parse(dateTimeString, formatter);
    }

    /**
     * 사용자가 보낸 값이 유효한지 확인하는 메서드
     *
     * @param authCodeCheckDTO
     * @param user
     * @return
     */
    public String checkAuthCode(AuthCodeCheckDTO authCodeCheckDTO, Parent user) {
        RequestHeader requestHeader = new RequestHeader();
        requestHeader.setHeader("checkAuthCode", apiKey, userKey);
        CheckAuthCodeRequestDTO request = new CheckAuthCodeRequestDTO(requestHeader, authCodeCheckDTO.accountNo(),
                authCodeCheckDTO.authText(), authCodeCheckDTO.authCode());
        CheckAuthCodeResponseDTO response = null;
        try {
            response = finAPIClient.checkAuthCode(request);
        } catch (Exception e) {
            return "FAIL";
        }
        return response.REC().status();
    }

    /**
     * 계좌정보를 등록하는 api
     * @param user
     * @param registAccountRequestDTO
     */
    public void registAccount(Parent user, RegistAccountRequestDTO registAccountRequestDTO) {
        if(registAccountRequestDTO.isParent()) {
            //부모인경우
            //이미 존재하는 계좌인 경우(주어진 은행과 계좌번호가 DB에서 매칭되는 경우, 이미 있는 계좌 정보)
//            if(checkAlreadyExists(registAccountRequestDTO)) {
//                throw new BusinessException(ErrorCode.ALREADY_EXISTS_ACCOUNT);
//            }
            user.setAccount(registAccountRequestDTO.accountNo());
            user.setBankName(registAccountRequestDTO.bankName());
            parentRepository.save(user);
        } else{
            //아이 계좌 등록 로직
            Baby baby = user.getBaby();
//            if(baby == null) {
//                baby = new Baby();
//            } else {
                //페치 조인을 사용하여 Baby와 Parents를 함께 로딩
//                baby = babyRepository.findByIdWithParents(baby.getId())
//                        .orElseThrow(() -> new EntityNotFoundException("Baby not found"));
//
//                //아이가 가지는 정보에 부모 정보와 일치하는지 확인
//                boolean isParentOfBaby = baby.getParents().stream()
//                        .anyMatch(parent -> parent.getId().equals(user.getId()));
//
//                if (!isParentOfBaby) {
//                    throw new BusinessException(ErrorCode.INVALID_PARENT_NUMBER);
//                }
//            }
            //이미 계좌가 등록된 아이인경우
            if(baby.getAccount() != null){
                throw new BusinessException(ErrorCode.ALREADY_EXISTS_ACCOUNT);

            }
            //사용자가 입력한 아이의 계좌번호를 조회한다.
            Optional<Baby> originBaby = babyRepository.findByAccount(registAccountRequestDTO.accountNo());
            if(originBaby.isPresent()){
                //-이미 존재하는 계좌인경우
                if(originBaby.get().getName().equals(baby.getName())){
                    //현재 계좌에 등록된 아이 이름과 새로등록하려는 아이의 이름이 일치한다면, 기존아이의 계좌를 연결해준다.
                    user.setBaby(originBaby.get());
                    parentRepository.save(user);
                    babyRepository.delete(baby);//이전 ui에서 아이정보를 db에 등록한 것을 삭제한다. 더 이상 사용하지 않음.
                    return;
                }
                //계좌번호와 아이 이름이 일치하지 않는 경우, 예외 처리
                throw new BusinessException(ErrorCode.BABY_INFO_DOES_NOT_MATCH);
            }

            //아이 계좌가 존재하지 않는 경우, 새로 만들어준다
            if(baby.getAccount() == null) {
                baby.setAccount(registAccountRequestDTO.accountNo());
                baby.setBankName(registAccountRequestDTO.bankName());
                babyRepository.save(baby);

            }
            //검증 이후 입력받은 계좌 정보와 은행 정보가 일치하는지 여부
            if(!checkSameAccount(baby, registAccountRequestDTO)) {
                throw new BusinessException(ErrorCode.INVALID_ACCOUNT_NUMBER);
            }
        }
    }

    private boolean checkSameAccount(Baby baby, RegistAccountRequestDTO request) {
        return baby.getAccount().equals(request.accountNo()) && baby.getBankName().equals(request.bankName());
    }

//    private boolean checkAlreadyExists(RegistAccountRequestDTO request) {
//        Baby baby = babyRepository.findByAccountAndBankName(request.accountNo(), request.bankName());
//        return baby != null;
//    }
}
