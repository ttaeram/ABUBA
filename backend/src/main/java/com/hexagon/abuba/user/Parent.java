package com.hexagon.abuba.user;

import com.hexagon.abuba.alarm.Alarm;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Parent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parent_id")
    Long id;

    //사용자 이름
    String name;

    //이메일
    String email;

    String password;

    //아이와의 관계
    String relationship;

    //ssafy api를 활용하기 위한 api키
    String userkey;

    String account;

    @OneToMany
    List<Alarm> alarms = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "baby_id")
    Baby baby;

}
