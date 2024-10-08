package com.hexagon.abuba.diary.entity;

import com.hexagon.abuba.user.Baby;
import com.hexagon.abuba.user.Parent;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.C;

@Getter
@Entity
public class DiaryAndRead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Parent parent;

    @ManyToOne
    @JoinColumn(name = "diary_id")
    private Diary diary;

    public void setParent(Parent parent) {
        if (this.parent != null) {
            this.parent.getDiaryAndReads().remove(this);
        }
        this.parent = parent;
        parent.getDiaryAndReads().add(this);
    }

    public void setDiary(Diary diary){
        if(this.diary != null){
            this.diary.getDiaryAndReads().remove(this);
        }
        this.diary = diary;
        diary.getDiaryAndReads().add(this);
    }
}
