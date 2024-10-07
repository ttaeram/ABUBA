package com.hexagon.abuba.alarm.entity;

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
    @JoinColumn(name = "parent_id")
    private Parent parent;

    public void setParent(Parent parent) {
        if(this.parent != null){
            parent.getAlarms().remove(this);
        }
        this.parent = parent;
        parent.getAlarms().add(this);
    }
}
