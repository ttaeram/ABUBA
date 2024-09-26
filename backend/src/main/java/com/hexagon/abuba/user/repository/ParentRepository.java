package com.hexagon.abuba.user.repository;

import com.hexagon.abuba.user.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParentRepository extends JpaRepository<Parent, Long> {
    Parent findByUsername(String username);

    Boolean existsByUsername(String username);
}
