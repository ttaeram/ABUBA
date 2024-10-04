package com.hexagon.abuba.auth.repository;

import com.hexagon.abuba.auth.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    VerificationToken findByToken(String token);
    VerificationToken findByEmail(String email);
}
