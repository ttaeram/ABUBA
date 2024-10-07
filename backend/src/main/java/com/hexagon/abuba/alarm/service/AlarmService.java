package com.hexagon.abuba.alarm.service;

import com.hexagon.abuba.alarm.repository.AlarmRepositroy;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class AlarmService {
    private final AlarmRepositroy alarmRepositroy;

    @Autowired
    public AlarmService(AlarmRepositroy alarmRepositroy) {
        this.alarmRepositroy = alarmRepositroy;
    }


}
