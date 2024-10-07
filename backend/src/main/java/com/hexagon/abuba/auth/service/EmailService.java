package com.hexagon.abuba.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Autowired
    private TemplateEngine templateEngine;

    // 이메일 발송 기능
    public void sendVerificationEmail(String toEmail, String authenticationCode) {
        log.info("to email={}", toEmail);
        log.info("from email={}",fromEmail);
        log.info("mailSender={}",mailSender);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("회원 가입 인증 번호입니다.");
            helper.setText(setContext(authenticationCode), true); // true는 HTML 사용을 의미합니다
            helper.setFrom(fromEmail);

            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("이메일 전송 실패", e);
        }
    }

    private String setContext(String authenticationCode) {
        Context context = new Context();
        context.setVariable("authenticationCode", authenticationCode);
        return templateEngine.process("email", context);
    }
}
