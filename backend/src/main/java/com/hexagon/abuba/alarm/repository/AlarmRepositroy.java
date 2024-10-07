package com.hexagon.abuba.alarm.repository;

import com.hexagon.abuba.alarm.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlarmRepositroy extends JpaRepository<Alarm, Long> {
}
