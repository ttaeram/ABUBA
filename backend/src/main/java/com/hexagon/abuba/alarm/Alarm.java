package com.hexagon.abuba.alarm;

import com.hexagon.abuba.user.Parent;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Alarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarm_id")
    Long id;

    //사용자가 이메일을 읽었는지
    Boolean isRead;

    String content;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    Parent parent;
}
