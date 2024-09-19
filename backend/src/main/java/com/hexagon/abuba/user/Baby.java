package com.hexagon.abuba.user;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
public class Baby {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "baby_id")
    private Long id;

    private String name;

    private LocalDate birth_date;

    private String gender;

    private String image_url;

    private String account;

    private String bank_info;
    //키
    private Double height;

    //몸무게
    private Double weight;

    @OneToMany(mappedBy = "baby")
    private List<Parent> parents = new ArrayList<>();
}
