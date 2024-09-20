package com.hexagon.abuba.diary;

import com.hexagon.abuba.user.Parent;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Parent parent;

    //제목
    private String title;

    //내용
    private String content;

    //작성시간
    private LocalDateTime createdAt;

    //계좌번호
    private String account;

    //입금액
    private BigDecimal deposit;

    private String record_url;

    private String image_url;
    //키
    private Double height;
    //몸무게
    private Double weight;

    public void setParent(Parent parent) {
        if(this.parent != null){
            this.parent.getDiaries().remove(this);
        }
        this.parent = parent;
        this.parent.getDiaries().add(this);
    }
}
