package com.pp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberDTO {
    private String user_id;
    private String user_pw;
    private String user_name;
    private String user_nick;
    private String user_email;
    private String user_birthdate;
    private String user_role;
    private String user_img;
    
    public void setUser_role(String user_role) {
        this.user_role = user_role;
    }

    
}

