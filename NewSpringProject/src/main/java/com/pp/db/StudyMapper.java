package com.pp.db;

import org.apache.ibatis.annotations.Param;

import com.pp.model.StudyTimeDTO;

public interface StudyMapper {
    public int saveStudyTime(StudyTimeDTO dto);
    
    int deleteUserStudyTime(@Param("user_id") String user_id);
}
