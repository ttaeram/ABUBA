package com.hexagon.abuba.account.service;

import com.hexagon.abuba.account.dto.request.HistoryReqDTO;
import com.hexagon.abuba.account.dto.response.ApiResponseDTO;
import com.hexagon.abuba.account.dto.response.HistoryResDTO;
import com.hexagon.abuba.user.Parent;
import com.hexagon.abuba.user.repository.ParentRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class AccountService {

    private final ParentRepository parentRepository;
    private final RestTemplate restTemplate;

    @Value("${api.key}")
    private String apiKey;

    @Value("${user.key}")
    private String userKey;

    public AccountService(ParentRepository parentRepository, RestTemplate restTemplate) {
        this.parentRepository = parentRepository;
        this.restTemplate = restTemplate;
    }

    public List<HistoryResDTO> getHistory(Long parentId, HistoryReqDTO historyReqDTO) {
        Parent parent = parentRepository.findById(parentId).orElseThrow();
        String babyAccount = parent.getBaby().getAccount();

        // 요청 바디 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", createHeader("inquireTransactionHistoryList"));
        requestBody.put("accountNo", babyAccount);
        requestBody.put("startDate", historyReqDTO.getStartDate());
        requestBody.put("endDate", historyReqDTO.getEndDate());
        requestBody.put("transactionType", "A");
        requestBody.put("orderByType", "DESC");

        // HTTP 헤더 설정
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        // 요청 엔터티 생성
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, httpHeaders);

        // 외부 API 호출
        String apiUrl = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireTransactionHistoryList"; // 실제 API 엔드포인트로 변경 필요
        ResponseEntity<ApiResponseDTO> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                ApiResponseDTO.class
        );

        // 응답에서 REC의 list를 가져와 HistoryResDTO로 변환
        try {
            List<ApiResponseDTO.TransactionDTO> transactions = response.getBody().getREC().getList();
            return transactions.stream()
                    .map(this::convertToHistoryResDTO)  // 변환 함수 사용
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // Header 생성 메서드
    private Map<String, String> createHeader(String apiName) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HHmmss");

        // 랜덤한 8자리 숫자 생성
        Random random = new Random();
        String randomNumber = String.format("%08d", random.nextInt(100000000));

        Map<String, String> header = new HashMap<>();
        header.put("apiName", apiName);
        header.put("transmissionDate", now.format(dateFormatter));
        header.put("transmissionTime", now.format(timeFormatter));
        header.put("institutionCode", "00100");
        header.put("fintechAppNo", "001");
        header.put("apiServiceCode", apiName);
        header.put("institutionTransactionUniqueNo", now.format(dateFormatter) + now.format(timeFormatter) + randomNumber);
        header.put("apiKey", apiKey);  // 환경변수 사용
        header.put("userKey", userKey);  // 환경변수 사용

        return header;
    }

    // TransactionDTO를 HistoryResDTO로 변환하는 메서드
    private HistoryResDTO convertToHistoryResDTO(ApiResponseDTO.TransactionDTO transactionDTO) {
        return new HistoryResDTO(
                transactionDTO.getTransactionDate(),
                transactionDTO.getTransactionTime(),
                transactionDTO.getTransactionType(),
                transactionDTO.getTransactionTypeName(),
                transactionDTO.getTransactionAccountName(),
                transactionDTO.getTransactionBalance(),
                transactionDTO.getTransactionAfterBalance(),
                transactionDTO.getTransactionSummary(),
                transactionDTO.getTransactionMemo()
        );
    }
}
