package com.hexagon.abuba.user;

import com.hexagon.abuba.alarm.entity.Alarm;
import com.hexagon.abuba.diary.Diary;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
public class Parent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parent_id")
    private Long id;

    //사용자 이름
    private String name;

    //username = 사용자 이메일 = 로그인시 사용하는 id
    private String username;

    private String password;

    //아이와의 관계
    private String relationship;

    //ssafy api를 활용하기 위한 api키
    private String userkey;

    private String account;

    private String role;

    @OneToMany(mappedBy = "parent")
    private List<Alarm> alarms = new ArrayList<>();

    @OneToMany(mappedBy = "parent")
    private List<Diary> diaries = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "baby_id")
    private Baby baby;

    public void setBaby(Baby baby) {
        if (this.baby != null) {
            this.baby.getParents().remove(this);
        }
        this.baby = baby;
        baby.getParents().add(this);
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public void setUserkey(String userkey) {
        this.userkey = userkey;
    }


}
