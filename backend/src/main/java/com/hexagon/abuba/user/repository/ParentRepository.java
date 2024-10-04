package com.hexagon.abuba.user.repository;

import com.hexagon.abuba.user.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ParentRepository extends JpaRepository<Parent, Long> {
    Parent findByUsername(String username);

    Boolean existsByUsername(String username);

    @Query("SELECT p FROM Parent p WHERE p.username = :email")
    Optional<Parent> findByEmail(@Param("email") String email);

}
