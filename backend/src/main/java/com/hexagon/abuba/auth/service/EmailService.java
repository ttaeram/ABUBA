package com.hexagon.abuba.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // 이메일 발송 기능
    public void sendVerificationEmail(String toEmail, String verificationLink) {
        log.info("to email={}", toEmail);
        log.info("from email={}",fromEmail);
        log.info("mailSender={}",mailSender);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("이메일 인증 요청");
        message.setText("회원가입을 완료하려면 다음 링크를 클릭하여 이메일 인증을 완료하세요: " + verificationLink);
        message.setFrom(fromEmail);
        mailSender.send(message);
    }
}
