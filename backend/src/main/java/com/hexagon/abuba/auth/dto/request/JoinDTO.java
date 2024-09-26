package com.hexagon.abuba.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Schema(description = "회원가입용 DTO")
public class JoinDTO {
    @Schema(description = "사용자의 id == email" , required = true)
    private String email;

    @Schema(description = "비밀번호", required = true)
    private String password;

    @Schema(description = "이름", required = true)
    private String name;

    @Override
    public String toString() {
        return "JoinDTO{" +
                "username='" +  + '\'' +
                ", password='" + password + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
