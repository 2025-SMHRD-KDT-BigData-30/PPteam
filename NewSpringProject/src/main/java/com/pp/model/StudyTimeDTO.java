package com.pp.model;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class StudyTimeDTO {
    private int stime_idx;
    private String user_id;
    private Timestamp st_tm;
    private Timestamp ed_tm;
    private int st_duration;
}
