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

    private String bankName;
    //키
    private Double height;

    //몸무게
    private Double weight;

    @OneToMany(mappedBy = "baby", fetch = FetchType.EAGER)
    private List<Parent> parents = new ArrayList<>();

    @Builder
    public Baby(Long id, String name, LocalDate birthDate, String gender, String imageUrl, String account, String bankName, Double height, Double weight) {
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
        this.imageUrl = imageUrl;
        this.account = account;
        this.bankName = bankName;
        this.height = height;
        this.weight = weight;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }
}
