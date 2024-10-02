package com.hexagon.abuba.user;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
public class Baby {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "baby_id")
    private Long id;

    private String name;

    private LocalDate birthDate;

    private String gender;

    private String imageUrl;

    private String account;

    private String bankInfo;
    //키
    private Double height;

    //몸무게
    private Double weight;

    @OneToMany(mappedBy = "baby")
    private List<Parent> parents = new ArrayList<>();

    @Builder
    public Baby(Long id, String name, LocalDate birthDate, String gender, String imageUrl, String account, String bankInfo, Double height, Double weight) {
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
        this.imageUrl = imageUrl;
        this.account = account;
        this.bankInfo = bankInfo;
        this.height = height;
        this.weight = weight;
    }
}
