import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/StudyDetail.css';
import axios from 'axios';

const StudyDetail = () => {
  const { date } = useParams();
  const navigate = useNavigate();

  const [fileContent, setFileContent] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [showPreview, setShowPreview] = useState(true); // ✅ 미리보기 상태 추가
  const loginId = sessionStorage.getItem('loginId');

  // 날짜 기반으로 OCR 기록 불러오기
  useEffect(() => {
    if (!date || !loginId) return;

    axios.get(`http://localhost:8084/NewSpringProject/api/calendar/getKeywordsByDate`, {
      params: { date, userId: loginId },
      withCredentials: true
    })
      .then(res => {
        setFileContent(res.data.ocr_text || '');
        try {
          const keywordArray = Array.isArray(res.data.ocr_keywords)
            ? res.data.ocr_keywords
            : JSON.parse(res.data.ocr_keywords || '[]');
          setKeywords(keywordArray);
        } catch (e) {
          console.error('키워드 파싱 실패:', e);
        }
      })
      .catch(() => {
        console.warn('이 날짜에는 저장된 키워드가 없습니다.');
      });
  }, [date, loginId]);

  // 이미지 선택
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setShowPreview(true); // ✅ 업로드 시 미리보기 켜기

    const reader = new FileReader();
    if (file.type.startsWith('image/')) {
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        setFileContent('');
        setKeywords([]);
      };
      reader.readAsDataURL(file);
    } else {
      alert('이미지 파일만 업로드해주세요.');
    }
  };

  // OCR 추출
  const handleSave = async () => {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await axios.post(
        'http://localhost:8084/NewSpringProject/ocr/processImage',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      const keywordArray = Array.isArray(res.data.ocr_keyword)
        ? res.data.ocr_keyword
        : JSON.parse(res.data.ocr_keyword || '[]');

      setFileContent(res.data.ocr_text);
      setKeywords(keywordArray);
      setShowPreview(false); // ✅ 추출 후 미리보기 끄기
    } catch (err) {
      console.error('OCR 처리 실패:', err);
      alert('OCR 처리에 실패했습니다.');
    }
  };

  // 저장 (DB로 전송)
  const handleSubmit = () => {
    if (!fileContent || keywords.length === 0 || !subject || !selectedFile) {
      alert('이미지, 텍스트, 키워드, 과목을 모두 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', loginId);
    formData.append('ocr_text', fileContent);
    formData.append('ocr_keyword', JSON.stringify(keywords));
    formData.append('subject_no', subject);
    formData.append('wrote_at', date);
    formData.append('image', selectedFile); // 실제 파일 전송

    axios.post('http://localhost:8084/NewSpringProject/ocr/saveOcrData', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    })
      .then(() => {
        alert('저장 완료!');
      })
      .catch(err => {
        console.error('저장 실패', err);
        alert('저장 실패');
      });
  };

  return (
    <div className="detail-container">
      <div className="detail-box">
        <div className="upload-section">
          <label className="upload-btn">
            Upload
            <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
          <button className="save-btn" onClick={handleSave}>추출</button>
          <button className="save-btn" onClick={handleSubmit}>저장</button>
        </div>

        <div className="subject-select-box">
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">과목을 선택하세요</option>
            <option value="1">1과목 | 소프트웨어 설계</option>
            <option value="2">2과목 | 소프트웨어 개발</option>
            <option value="3">3과목 | 데이터베이스 구축</option>
            <option value="4">4과목 | 프로그래밍 언어 활용</option>
            <option value="5">5과목 | 정보시스템 구축관리</option>
          </select>
        </div>

        <div className="study-content">
          <h3>📄 OCR 텍스트</h3>


          {/* ✅ 미리보기 이미지 (업로드 직후) */}
          {imageSrc && showPreview && (
            <img src={imageSrc} alt="업로드된 이미지 미리보기" className="preview-image" />
          )}

          {/* 추출한 텍스트, 키워드 조회 */}
          {!imageSrc && fileContent &&(
          <div className="ocr-text-box">
            {fileContent.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
          )}



          {/* ✅ 추출 후 텍스트와 이미지 반반 배치 */}
          {imageSrc && fileContent && !showPreview && (
            <div className="image-text-row">
              <img src={imageSrc} alt="업로드된 이미지" className="ocr-image" />
              <div className="ocr-text-box">
                {fileContent.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          )}
          {!imageSrc && !fileContent && <p>파일을 업로드하거나 날짜를 선택하세요.</p>}
        </div>
      </div>


      <div className="keyword-box">
        <div className="back-arrow" onClick={() => navigate('/study')}>←</div>
        <h3>🧠 추출 키워드</h3>
        {keywords.length > 0 ? (
          <ul>
            {keywords.map((word, idx) => <li key={idx}>{word}</li>)}
          </ul>
        ) : fileContent ? (
          <p>텍스트는 있으나 키워드가 없습니다.</p>
        ) : (
          <p>키워드를 추출하려면 파일을 저장하거나 OCR 결과가 있는 날짜를 선택하세요.</p>
        )}
      </div>
    </div>
  );
};

export default StudyDetail;
