package com.pp.controller;

import com.pp.model.QuizAnswerDTO;
import com.pp.model.QuizDTO;
import com.pp.db.QuizMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizMapper quizMapper;

    // ✅ OCR 키워드 기반 퀴즈 추천
    @PostMapping("/recommend")
    public List<QuizDTO> recommendQuiz(@RequestBody Map<String, Object> req) {
        try {
            int subjectNo = (Integer) req.get("subjectNo");
            List<String> keywords = (List<String>) req.get("keywords");

            System.out.println("📥 subjectNo: " + subjectNo);
            System.out.println("📥 keywords: " + keywords);

            return quizMapper.selectQuizByKeywords(subjectNo, keywords);
        } catch (Exception e) {
            System.out.println("❌ 추천 중 오류: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    // ✅ 퀴즈 정답 + 해설 반환
    @GetMapping("/answer/{quizIdx}")
    public ResponseEntity<QuizAnswerDTO> getAnswer(@PathVariable Long quizIdx) {
        QuizDTO quiz = quizMapper.findQuizById(quizIdx);
        if (quiz != null) {
            QuizAnswerDTO dto = new QuizAnswerDTO(quiz);
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ 퀴즈 등록 (선택 사항)
    @PostMapping("/insert")
    public ResponseEntity<String> insertQuiz(@RequestBody QuizDTO dto) {
        try {
            quizMapper.insertQuiz(dto);
            return ResponseEntity.ok("등록 성공");
        } catch (Exception e) {
            System.out.println("❌ 등록 중 오류: " + e.getMessage());
            return ResponseEntity.status(500).body("등록 실패");
        }
    }
}
