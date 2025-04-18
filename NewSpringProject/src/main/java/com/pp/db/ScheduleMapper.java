package com.pp.db;

import java.util.List;

import com.pp.model.ScheduleDTO;

public interface ScheduleMapper {

	// 일정 추가
	public int insertSchedule(ScheduleDTO dto);

	// 스케줄 불러오기
	public List<ScheduleDTO> getScheduleList(String user_id);

	// 일정 수정
	public int updateSchedule(ScheduleDTO dto);

	// 일정 삭제
	public int deleteSchedule(int sche_idx);

}
