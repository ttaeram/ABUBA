package com.hexagon.abuba.diary.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CalendarResponse {
    private int year;
    private int month;
    private List<DayPosts> posts;
}
