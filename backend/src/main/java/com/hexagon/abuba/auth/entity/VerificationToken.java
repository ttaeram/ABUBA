package com.hexagon.abuba.auth.entity;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@NoArgsConstructor
@Entity
public class VerificationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private String email;

    private boolean verified; // 이메일 인증 여부

    private LocalDateTime expiryDate;

    public VerificationToken(String token, String email) {
        this.token = token;
        this.email = email;
        this.verified = false;
        this.expiryDate = LocalDateTime.now().plusHours(24); // 24시간 유효
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }

    public boolean isVerified() {
        return this.verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }
}
