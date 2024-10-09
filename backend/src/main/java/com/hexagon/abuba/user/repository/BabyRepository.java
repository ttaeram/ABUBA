package com.hexagon.abuba.user.repository;

import com.hexagon.abuba.user.Baby;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BabyRepository extends JpaRepository<Baby, Long> {
    Baby findByAccountAndBankName(String accountNo, String bankName);
    @Query("SELECT b FROM Baby b LEFT JOIN FETCH b.parents WHERE b.id = :id")
    Optional<Baby> findByIdWithParents(@Param("id") Long id);
    List<Baby> findAllByAccount(String account);

    Optional<Baby> findByAccount(String accountNo);
}
