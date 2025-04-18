package com.pp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pp.db.ScheduleMapper;
import com.pp.model.ScheduleDTO;


@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/schedule")
public class ScheduleRestController {
	
	@Autowired
    private ScheduleMapper mapper;
	
	//스케줄등록
	@PostMapping("/addSchedule")
	public int addSchedule(@RequestBody ScheduleDTO dto) {
	    int result = mapper.insertSchedule(dto);
	    return dto.getSche_idx();
	}
	
	//스케줄불러오기	
	@GetMapping("/getSchedules")
	public List<ScheduleDTO> getSchedules(@RequestParam("user_id") String user_id) {
		System.out.println("스케줄 조회 요청 - user_id: " + user_id);
		List<ScheduleDTO> list = mapper.getScheduleList(user_id);
		System.out.println("조회 결과: " + list);
	    return list;
	}
		
	// 일정 수정
	@PutMapping("/updateSchedule")
	public int updateSchedule(@RequestBody ScheduleDTO dto) {
	    return mapper.updateSchedule(dto);
	}

	// 일정 삭제
	@DeleteMapping("/deleteSchedule")
	public int deleteSchedule(@RequestParam("sche_idx") int sche_idx) {
	    return mapper.deleteSchedule(sche_idx);
	}




}
