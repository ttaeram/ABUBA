package com.hexagon.abuba.account.service;

import com.fasterxml.jackson.databind.ObjectMapper;
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

    public AccountService(ParentRepository parentRepository, RestTemplate restTemplate) {
        this.parentRepository = parentRepository;
        this.restTemplate = restTemplate;
    }

    public List<HistoryResDTO> getHistory(Long parentId, HistoryReqDTO historyReqDTO) {
        Parent parent = parentRepository.findById(parentId).orElseThrow();
        String babyAccount = parent.getBaby().getAccount();

        // 요청 바디 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", createHeader("inquireTransactionHistoryList", parent.getUserkey()));
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
        ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        // 응답 본문 로깅
        String responseBody = response.getBody();
        log.info("API Response: {}", responseBody);
        // JSON 파싱
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            ApiResponseDTO apiResponse = objectMapper.readValue(responseBody, ApiResponseDTO.class);

            // 응답에서 REC의 list를 가져와 HistoryResDTO로 변환
            if (apiResponse.getRec() == null || apiResponse.getRec().getList() == null || apiResponse.getRec().getList().isEmpty()) {
                log.info("No transactions found. Total count: {}", apiResponse.getRec() != null ? apiResponse.getRec().getTotalCount() : "null");
                return List.of(); // 빈 리스트 반환
            }

            List<ApiResponseDTO.TransactionDTO> transactions = apiResponse.getRec().getList();
            return transactions.stream()
                    .map(this::convertToHistoryResDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Failed to parse API response", e);
            return List.of(); // 파싱 실패 시 빈 리스트 반환
        }
    }

    // Header 생성 메서드
    private Map<String, String> createHeader(String apiName, String userKey) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HHmmss");

        // 랜덤한 6자리 숫자 생성
        Random random = new Random();
        String randomNumber = String.format("%06d", random.nextInt(1000000));

        Map<String, String> header = new HashMap<>();
        header.put("apiName", apiName);
        header.put("transmissionDate", now.format(dateFormatter));
        header.put("transmissionTime", now.format(timeFormatter));
        header.put("institutionCode", "00100");
        header.put("fintechAppNo", "001");
        header.put("apiServiceCode", apiName);
        header.put("institutionTransactionUniqueNo", now.format(dateFormatter) + now.format(timeFormatter) + randomNumber);
        header.put("apiKey", apiKey);  // 환경변수 사용
        header.put("userKey", userKey);

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
