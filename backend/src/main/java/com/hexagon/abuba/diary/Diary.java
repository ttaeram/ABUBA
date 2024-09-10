package com.hexagon.abuba.diary;

import com.hexagon.abuba.user.Parent;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_id")
    Long id;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    Parent parent;

    //제목
    String title;

    //내용
    String content;

    //작성시간
    LocalDateTime createdAt;

    //계좌번호
    String account;

    //입금액
    BigDecimal deposit;

    String record_url;

    String image_url;
    //키
    Double height;
    //몸무게
    Double weight;
}
