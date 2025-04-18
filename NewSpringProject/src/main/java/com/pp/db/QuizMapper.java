package com.pp.db;

import com.pp.model.QuizDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;


@Mapper
public interface QuizMapper {
	 List<QuizDTO> selectQuizByKeywords(@Param("subjectNo") int subjectNo, @Param("keywords") List<String> keywords);
	    QuizDTO findQuizById(@Param("quizIdx") Long quizIdx);
	    void insertQuiz(QuizDTO dto); // 예: 퀴즈 등록용
	
}
