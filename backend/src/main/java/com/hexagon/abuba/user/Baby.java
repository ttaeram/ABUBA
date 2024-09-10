package com.hexagon.abuba.user;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Baby {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "baby_id")
    Long id;

    String name;

    LocalDate birth_date;

    String gender;

    String image_url;

    String account;

    String bank_info;

    //키
    Double height;

    //몸무게
    Double weight;

    @OneToMany
    List<Parent> parents = new ArrayList<>();
}
