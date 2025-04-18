package com.pp.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizDTO {
    private Long quizId;
    private String question;
    private String questionDetail;
    private String choice_1;
    private String choice_2;
    private String choice_3;
    private String choice_4;
    private String answer;
    private String explanation;
    private String exam_year;
    private String exam_round;
}