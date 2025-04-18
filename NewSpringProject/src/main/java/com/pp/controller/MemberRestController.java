package com.pp.controller;

import java.io.File;
import java.sql.Timestamp;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pp.db.MemberMapper;
import com.pp.db.StudyMapper;
import com.pp.model.MemberDTO;
import com.pp.model.StudyTimeDTO;


@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST,
		RequestMethod.PUT, RequestMethod.DELETE }, allowCredentials = "true")
@RestController
@RequestMapping("/member")
public class MemberRestController {

	@Autowired
	private MemberMapper mapper;
	
	@Autowired
	private StudyMapper studyMapper;

	// 테스트용
	@GetMapping("/test")
	public String test() {
		System.out.println("✅ [Spring] /member/test 진입됨");
		return "ok";
	}

	// 회원가입
	@PostMapping("/join")
	public int join(@RequestBody MemberDTO dto) {
		dto.setUser_role("USER"); // 기본 역할
		int result = mapper.insertMember(dto);

		if (result == 1) {
			System.out.println("회원가입 성공!!!!!");
		}
		return result; // 1이면 성공
	}
	
	

	// 로그인

	@PostMapping("/login")
	public MemberDTO login(@RequestBody MemberDTO dto, HttpSession session) {
		System.out.println("✅ [Spring] /member/login 요청 도착");
		MemberDTO user = mapper.login(dto);
		if (user != null) {
			session.setAttribute("loginUser", user);
		}
		System.out.println(user);
		return user; // 일치하면 정보 반환, 아니면 null 반환
	}

	// 아이디 중복 체크
	@GetMapping("/checkId")
	@ResponseBody
	public int checkId(@RequestParam("user_id") String user_id) {
		System.out.println("아이디중복체크중: " + user_id);
		try {
			MemberDTO result = mapper.checkId(user_id);
			return result == null ? 0 : 1;
		} catch (Exception e) {
			e.printStackTrace();
			return -1; // 프론트에서 -1이면 에러 처리 가능
		}
	}

	// 프론트에서 로그인 유지상태 확인
	@GetMapping("/session-check")
	public MemberDTO checkSession(HttpSession session) {
		MemberDTO loginUser = (MemberDTO) session.getAttribute("loginUser");
		return loginUser;
	}

	// 회원 정보 수정? (패스워드, 닉네임)
	@PutMapping("/updateUserInfo")
	public ResponseEntity<String> updateUserInfo(@RequestBody MemberDTO dto) {
		int result = mapper.updateUserInfo(dto);
		return result > 0 ? ResponseEntity.ok("수정 완료")
				: ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 실패");
	}

	// 프로필 이미지
	@PostMapping("/uploadProfile")
	public int uploadProfile(@RequestParam("profile") MultipartFile file, @RequestParam("user_id") String user_id,
			HttpServletRequest request) {
		try {
			// 저장 경로 설정 (예: /resources/profile)
			String savePath = request.getServletContext().getRealPath("/resources/profile");
			File folder = new File(savePath);
			if (!folder.exists())
				folder.mkdirs();

			// 저장 파일명 설정 (중복 방지)
			String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
			File saveFile = new File(savePath, fileName);
			file.transferTo(saveFile);

			// DB에 저장할 경로
			String profilePath = "/resources/profile/" + fileName;
			int result = mapper.updateProfileImage(user_id, profilePath);

			// 잘 연결되나 확인
			System.out.println(file + user_id);
			System.out.println(user_id);
			System.out.println("파일 이름: " + file.getOriginalFilename());

			System.out.println("savePath = " + savePath);
			System.out.println("fileName = " + fileName);

			return result;
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}

	// 로그아웃 요청
	@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
	@GetMapping("/logout")
	public ResponseEntity<String> logout(HttpSession session) {
		session.invalidate(); // 세션 전체 삭제
		return ResponseEntity.ok("로그아웃 성공");
	}

	// 아이디 찾기
	@GetMapping("/findId")
	public ResponseEntity<String> findId(@RequestParam("user_name") String name,
			@RequestParam("user_email") String email) {
		try {
			// 이름과 이메일을 기준으로 user_id 조회
			String userId = mapper.findUserId(name, email);
			if (userId != null) {
				return ResponseEntity.ok(userId); // 아이디 반환
			} else {
				return ResponseEntity.ok(""); // 일치하는 정보 없으면 빈 문자열
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 비밀번호 찾기
	@GetMapping("/findPassword")
	public ResponseEntity<String> findPassword(@RequestParam("user_id") String userId,
			@RequestParam("user_name") String userName, @RequestParam("user_email") String userEmail) {
		// 아이디, 이름, 이메일 모두 일치하는 사용자 조회
		MemberDTO dto = mapper.findPassword(userId, userName, userEmail);
		if (dto != null) {
			return ResponseEntity.ok(dto.getUser_pw()); // 비밀번호 반환
		} else {
			return ResponseEntity.ok(""); // 일치하는 정보 없으면 빈 문자열
		}
	}

	// 닉네임 변경 기능
	@PutMapping("/updateNick")
	public ResponseEntity<String> updateNick(@RequestBody Map<String, String> map) {
		String user_id = map.get("user_id");
		String user_nick = map.get("user_nick");

		System.out.println("닉네임 변경 요청 - user_id: " + user_id + ", user_nick: " + user_nick);

		int result = mapper.updateUserNick(user_id, user_nick); // 닉네임 업데이트
		if (result > 0) {
			return ResponseEntity.ok("닉네임 변경 완료");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("닉네임 변경 실패");
		}
	}

	// 회원 탈퇴 기능
	// 일정달력에 일정이 있는 사용자는 회원탈퇴 불가능 해서 일정이 있든 없든 강제 삭제
    @PostMapping("/delete")
    public ResponseEntity<String> deleteUser(HttpSession session) {
       // 세션에서 로그인된 사용자 정보 가져오기
       MemberDTO loginUser = (MemberDTO) session.getAttribute("loginUser");

       if (loginUser == null) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보 없음");
       }

       String user_id = loginUser.getUser_id();

       studyMapper.deleteUserStudyTime(user_id);
       // 1. 사용자 일정 삭제
       mapper.deleteUserSchedules(user_id);
       
       
       mapper.deleteUserOcr(user_id);

       // 2. 사용자 정보 삭제
       int result = mapper.deleteUser(user_id);

       if (result > 0) {
          session.invalidate(); // 세션 제거
          return ResponseEntity.ok("탈퇴 성공");
       } else {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("탈퇴 실패");
       }
    }
	
	// 공부 시간 저장
	   @PostMapping("/study/saveTime")
	   public ResponseEntity<String> saveStudyTime(@RequestBody Map<String, Object> data) {
	       try {
	           String user_id = (String) data.get("user_id");

	           // 프론트에서 넘어온 시간 문자열을 Date → Timestamp로 변환
	           String st_tm_raw = (String) data.get("st_tm");
	           String ed_tm_raw = (String) data.get("ed_tm");

	           // T 제거 및 초단위 맞추기
	           String st_tm_fixed = st_tm_raw.replace("T", " ").substring(0, 19);
	           String ed_tm_fixed = ed_tm_raw.replace("T", " ").substring(0, 19);

	           Timestamp st_tm = Timestamp.valueOf(st_tm_fixed);
	           Timestamp ed_tm = Timestamp.valueOf(ed_tm_fixed);

	           int st_duration = (int) data.get("st_duration");

	           StudyTimeDTO study = new StudyTimeDTO();
	           study.setUser_id(user_id);
	           study.setSt_tm(st_tm);
	           study.setEd_tm(ed_tm);
	           study.setSt_duration(st_duration);

	           int result = studyMapper.saveStudyTime(study);

	           if (result > 0) {
	               return ResponseEntity.ok("공부 시간 저장 완료");
	           } else {
	               return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("저장 실패");
	           }
	       } catch (Exception e) {
	           e.printStackTrace();
	           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("예외 발생");
	       }
	   }
	   
	   

}
