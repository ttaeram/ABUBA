package com.hexagon.abuba.alarm.entity;

import com.hexagon.abuba.diary.entity.Diary;
import com.hexagon.abuba.user.Parent;
import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
public class Alarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarm_id")
    private Long id;

    //사용자가 읽었는지
    private Boolean isRead;

    //사용자 id
    private String content;

    @ManyToOne
    @JoinColumn(name = "diary_id")
    private Diary diary;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Parent parent;

    // 엔티티 저장 전에 isRead의 기본값을 false로 설정
    @PrePersist
    protected void onCreate() {
        if (this.isRead == null) {
            this.isRead = false;
        }
    }

    public void setParent(Parent parent) {
        if(this.parent != null){
            parent.getAlarms().remove(this);
        }
        this.parent = parent;
        parent.getAlarms().add(this);
    }

    public void setDiary(Diary diary){
        if(this.diary != null){
            diary.getAlarms().remove(this);
        }
        this.diary = diary;
        diary.getAlarms().add(this);
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
}
