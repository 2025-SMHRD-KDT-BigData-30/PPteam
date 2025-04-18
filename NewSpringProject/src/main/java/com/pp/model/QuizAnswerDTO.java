package com.pp.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizAnswerDTO {
    private String answer;        // 정답
    private String explanation;   // 해설

    // QuizDTO를 기반으로 생성
    public QuizAnswerDTO(QuizDTO quiz) {
        this.answer = quiz.getAnswer();
        this.explanation = quiz.getExplanation();
    }
}
