package com.pp.db;

import org.apache.ibatis.annotations.Param;

import com.pp.model.MemberDTO;

public interface MemberMapper {
	public int insertMember(MemberDTO dto); // 회원가입

	public MemberDTO login(MemberDTO dto); // 로그인

	public MemberDTO checkId(@Param("user_id") String user_id);// 아이디중복체크

	public int updateUserInfo(MemberDTO dto);

	public int updateProfileImage(@Param("user_id") String user_id, @Param("user_img") String user_img); // 회원 프로필 이미지

	public String findUserId(@Param("user_name") String user_name, @Param("user_email") String user_email); // 아이디 찾기

	public MemberDTO findPassword(@Param("user_id") String user_id, // 비밀번호 찾기
			@Param("user_name") String user_name, @Param("user_email") String user_email);

	public int updateUserNick(@Param("user_id") String user_id, @Param("user_nick") String user_nick); // 닉네임 변경

	int deleteUserStudyTime(@Param("user_id") String user_id);
		
	int deleteUserSchedules(@Param("user_id") String user_id); // 회원탈퇴
	
	public int deleteUserOcr(@Param("user_id") String user_id); // ocr 삭제
	

	int deleteUser(@Param("user_id") String user_id);

}
