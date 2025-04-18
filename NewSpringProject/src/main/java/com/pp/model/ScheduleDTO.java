package com.pp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleDTO {
	private int sche_idx; // DB에서 자동 증가x
    private String user_id;
    private String sche_title;
    private Timestamp st_dt;   // 또는 java.util.Date
    private Timestamp ed_dt;
    private String sche_color;
}
