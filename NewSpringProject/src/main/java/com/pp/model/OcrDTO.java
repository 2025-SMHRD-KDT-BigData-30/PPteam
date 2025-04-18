package com.pp.model;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class OcrDTO {
	private int ocr_idx;
	private String user_id;
	private String ocr_img;
	private String ocr_text;
	private String ocr_keyword;				
	private int subject_no;		
	private Timestamp uploaded_at;
	private Timestamp wrote_at;
	


}
