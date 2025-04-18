package com.pp.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pp.db.OcrMapper;
import lombok.var;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/calendar")
public class KeywordController {
	
	@Autowired
    private OcrMapper mapper;

	@GetMapping("/keywords")
	public ResponseEntity<?> getDailyKeywords(@RequestParam String userId) {
	    try {
	        List<Map<String, String>> list = mapper.selectDateKeywordListByUser(userId);
	        return ResponseEntity.ok(list);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("키워드 조회 중 오류 발생: " + e.getMessage());
	    }
	}
	
    

	@GetMapping("/getKeywordsByDate")
	public ResponseEntity<?> getKeywordsByDate(@RequestParam String date, @RequestParam String userId) {
	    System.out.println("🟢 [진입 확인] getKeywordsByDate() 실행됨");
	    try {
	        System.out.println("📌 getKeywordsByDate 호출됨 - userId: " + userId + ", date: " + date);

	        Map<String, Object> result = new HashMap<>();

	        var dto = mapper.selectOcrByUserAndDate(userId, date);
	        if (dto == null) {
	            System.out.println("❗ 해당 데이터 없음");
	            return ResponseEntity.ok(result); // 비어 있는 응답
	        }

	        // ✅ OCR 텍스트 전달
	        result.put("ocr_text", dto.getOcr_text());

	        // ✅ OCR 이미지 파일명 전달
	        result.put("ocr_img", dto.getOcr_img());

	        // ✅ OCR 키워드 JSON → List<String> 변환 후 전달
	        String keywordJson = dto.getOcr_keyword();
	        if (keywordJson != null && !keywordJson.isEmpty()) {
	            List<String> keywordList = new ObjectMapper().readValue(keywordJson, List.class);
	            result.put("ocr_keywords", keywordList);
	        } else {
	            System.out.println("⚠️ 키워드 JSON이 null 또는 빈 문자열");
	            result.put("ocr_keywords", new ArrayList<>()); // 빈 키워드 전달
	        }

	        return ResponseEntity.ok(result);

	    } catch (Exception e) {
	        System.err.println("🔥 키워드 조회 실패: " + e.getMessage());
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("키워드 조회 실패: " + e.getMessage());
	    }
	}

    
 // 특정 사용자(userId)의 키워드 사용 빈도를 조회하기 위한 API
    @GetMapping("/stats")
    public ResponseEntity<?> getKeywordStats(@RequestParam String userId) {
        try {
            List<Map<String, Object>> rawStats = mapper.selectKeywordStats(userId);
            List<Map<String, Object>> result = new ArrayList<>();

            for (Map<String, Object> stat : rawStats) {
                Map<String, Object> item = new HashMap<>();
                item.put("keyword", stat.get("keyword"));
                item.put("count", stat.get("count"));
                result.add(item);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("\ud83d\udccb \ud0a4\uc6cc\ub4dc \ud1b5\uacc4 \ub85c\ub4dc \uc2e4\ud328: " + e.getMessage());
        }
    }
    




   
}
