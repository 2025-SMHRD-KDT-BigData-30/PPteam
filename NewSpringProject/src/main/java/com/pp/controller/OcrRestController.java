package com.pp.controller;

import java.io.File;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;


import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pp.db.OcrMapper;
import com.pp.model.MemberDTO;
import com.pp.model.OcrDTO;




@RestController
@RequestMapping("/ocr")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OcrRestController {

	@Autowired
	private OcrMapper mapper;
	
	@GetMapping("/userkeywords")
	public ResponseEntity<?> getUserKeywordsBySubject(@RequestParam("subjectNo") int subjectNo) {
	    try {
	    	System.out.println("🟢 요청받은 subjectNo: " + subjectNo); // ✅ 콘솔 확인용 출력
	        List<String> keywords = mapper.selectKeywordsBySubject(subjectNo);
	        return ResponseEntity.ok(keywords);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("키워드 조회 중 오류 발생: " + e.getMessage());
	    }
	}


	@PostMapping("/processImage")
	public ResponseEntity<?> processImage(@RequestParam("image") MultipartFile file, HttpSession session) {
		try {
			// ✅ 1. 업로드된 파일 정보 출력
			System.out.println("🖼️ [Spring] 업로드된 파일 정보 ↓↓↓");
			System.out.println("파일 이름: " + file.getOriginalFilename());
			System.out.println("파일 크기: " + file.getSize() + " bytes");
			System.out.println("파일 타입: " + file.getContentType());

			// ✅ 2. 로그인 사용자 확인
			MemberDTO loginUser = (MemberDTO) session.getAttribute("loginUser");
			if (loginUser == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
			}

			String userId = loginUser.getUser_id();
			System.out.println("👤 로그인된 사용자 ID: " + userId);

			// ✅ 3. Flask 서버로 이미지 전송
			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.MULTIPART_FORM_DATA);

			MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
			body.add("image", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));

			HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

			// Flask 서버 주소 (예: 로컬 실행 중인 Flask 서버)
			String flaskUrl = "http://localhost:5000/ocr";

			ResponseEntity<String> flaskResponse = restTemplate.postForEntity(flaskUrl, requestEntity, String.class);

			// ✅ 4. Flask 응답 파싱 (JSON 문자열 → Map)
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String, Object> resultFromFlask = objectMapper.readValue(flaskResponse.getBody(), Map.class);

			// ✅ 5. 결과 확인 및 로그 출력
			String ocrText = (String) resultFromFlask.get("ocr_text");
			Object ocrKeyword = resultFromFlask.get("ocr_keyword");

			System.out.println("📄 OCR 텍스트 결과: " + ocrText);
			System.out.println("🔑 OCR 키워드: " + ocrKeyword);

			// ✅ 6. React에 전달할 결과 구성
			Map<String, Object> result = new HashMap<>();
			result.put("filename", file.getOriginalFilename());
			result.put("size", file.getSize());
			result.put("contentType", file.getContentType());
			result.put("ocr_text", ocrText);
			result.put("ocr_keyword", ocrKeyword);
			result.put("message", "Spring → Flask → OCR 성공 🔥");

			return ResponseEntity.ok(result);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 처리 실패: " + e.getMessage());
		}
	}


	
	// ocr 결과 저장하는 부문 (react에서 받을 데이터 : 아이디, 이미지,텍스트,키워드,과목번호)
		@PostMapping("/saveOcrData")
	    public ResponseEntity<String> saveOcrData(
	        @RequestParam("image") MultipartFile image,
	        @RequestParam("user_id") String userId,
	        @RequestParam("ocr_text") String ocrText,
	        @RequestParam("ocr_keyword") String ocrKeyword,
	        @RequestParam("subject_no") int subjectNo,
	        @RequestParam("wrote_at") String wroteDate
	    ) {
	        try {
	            // 이미지 파일을 Base64 문자열로 변환 (간단히 경로 저장용으로 대체 가능)
	            String imageName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
	            // 실제 저장 생략 - 여기선 파일 이름만 저장

	            OcrDTO dto = new OcrDTO();
	            dto.setUser_id(userId);
	            dto.setOcr_img(imageName);
	            dto.setOcr_text(ocrText);
	            dto.setOcr_keyword(ocrKeyword);
	            dto.setSubject_no(subjectNo);
	            dto.setWrote_at(Timestamp.valueOf(wroteDate + " 00:00:00"));

	            int result = mapper.insertOcr(dto);
	            if (result > 0) {
	                return ResponseEntity.ok("저장 성공");
	            } else {
	                return ResponseEntity.status(500).body("DB 저장 실패");
	            }
	        } catch (Exception e) {
	            e.printStackTrace();
	            return ResponseEntity.status(500).body("예외 발생");
	        }
	    }




}

