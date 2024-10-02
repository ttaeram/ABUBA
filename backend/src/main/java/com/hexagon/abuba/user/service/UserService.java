package com.hexagon.abuba.user.service;


import com.hexagon.abuba.user.Baby;
import com.hexagon.abuba.user.Parent;
import com.hexagon.abuba.user.dto.request.RegistBabyInfoDTO;
import com.hexagon.abuba.user.repository.BabyRepository;
import com.hexagon.abuba.user.repository.ParentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserService {
    private final ParentRepository parentRepository;
    private final BabyRepository userRepository;
    private final BabyRepository babyRepository;

    @Autowired
    public UserService(ParentRepository parentRepository, BabyRepository userRepository, BabyRepository babyRepository) {
        this.parentRepository = parentRepository;
        this.userRepository = userRepository;
        this.babyRepository = babyRepository;
    }


    public void registBaby(RegistBabyInfoDTO babyInfoDTO ,Long parentId) {
        //아이정보 등록하기
        Parent parent = parentRepository.findById(parentId).orElseThrow();
        Baby baby = convertToEntity(babyInfoDTO, parent);
        //아이와 연관관계 매핑 (부모쪽에서 연결한다.)
        parent.setRelationship(babyInfoDTO.relation());
        parent.setBaby(baby);
        babyRepository.save(baby);
    }

    private Baby convertToEntity(RegistBabyInfoDTO babyInfoDTO, Parent parent) {
        return Baby.builder()
                .name(babyInfoDTO.name())
                .birthDate(babyInfoDTO.birthday())
                .gender(babyInfoDTO.gender())
                .height(babyInfoDTO.height())
                .weight(babyInfoDTO.weight())
                .build();
    }
}
