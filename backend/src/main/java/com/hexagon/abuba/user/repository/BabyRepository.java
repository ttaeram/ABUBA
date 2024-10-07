package com.hexagon.abuba.user.repository;

import com.hexagon.abuba.user.Baby;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BabyRepository extends JpaRepository<Baby, Long> {
    List<Baby> findAllByAccount(String account);
}
