package com.pp.db;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.pp.model.OcrDTO;

@Mapper
public interface OcrMapper {
	
	
    public int insertOcr(OcrDTO dto);
    
 // 날짜별 키워드 목록 (예: 날짜, 키워드만 Map으로)

	public List<Map<String, String>> selectDateKeywordList();
	
	List<Map<String, String>> selectDateKeywordListByUser(@Param("userId") String userId);
	
	
	public List<String> selectKeywordsBySubject(@Param("subjectNo") int subjectNo);


	
	
	// 날짜+사용자 기준 OCR 데이터 조회
	OcrDTO selectOcrByUserAndDate(@Param("userId") String userId, @Param("date") String date);
	
	
	//컨트롤러에서 호출할 수 있도록 selectKeywordStats()라는 Mapper 인터페이스 함수를 추가
	public List<Map<String, Object>> selectKeywordStats(@Param("userId") String userId);

	
}
