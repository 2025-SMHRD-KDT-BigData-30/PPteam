import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../style/StudyQuiz.css';

const StudyQuiz = () => {
  const location = useLocation();
  const subjectNo = location.state?.subjectNo;

  const [quizList, setQuizList] = useState([]);
  const [availableKeywords, setAvailableKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [page, setPage] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({}); // ✅ 선택된 번호 상태 추가

  const pageSize = 2;

  useEffect(() => {
    if (subjectNo) {
      axios.get(`http://localhost:8084/NewSpringProject/ocr/userkeywords?subjectNo=${subjectNo}`)
        .then(res => {
          const parsedKeywords = res.data.flatMap(item => {
            if (typeof item === 'string') {
              try {
                return JSON.parse(item);
              } catch (e) {
                return [item];
              }
            }
            return item;
          });
          setAvailableKeywords(parsedKeywords);
        })
        .catch(err => {
          console.error('키워드 불러오기 실패:', err);
        });
    }
  }, [subjectNo]);

  const handleKeywordClick = async (keyword) => {
    setSelectedKeyword(keyword);
    try {
      const res = await axios.post('http://localhost:8084/NewSpringProject/api/quiz/recommend', {
        subjectNo,
        keywords: [keyword]
      });
      setQuizList(res.data);
      setPage(0);
      setRevealedAnswers({});
      setSelectedChoices({});
    } catch (error) {
      console.error('퀴즈 불러오기 실패:', error);
    }
  };

  const toggleAnswer = (index) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleChoiceClick = (questionIndex, choice) => {
    setSelectedChoices(prev => ({
      ...prev,
      [questionIndex]: choice
    }));
  };

  const currentQuizzes = quizList.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="quiz-container">
      <div className="keyword-buttons">
        <h3>📌 저장된 키워드</h3>
        <div className="keyword-buttons">
          {availableKeywords.map((kw, idx) => (
            <button
              key={idx}
              onClick={() => handleKeywordClick(kw)}
              className={`keyword-button ${selectedKeyword === kw ? 'selected' : ''}`}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-content">
        <div className="quiz-question-box">
          {currentQuizzes.map((quiz, idx) => {
            const questionIndex = page * pageSize + idx;
            return (
              <div className="quiz-question" key={quiz.quizId}>
                <p className="quiz-meta"> {quiz.exam_year}년 {quiz.exam_round}회차 문제</p>
                <p>{questionIndex + 1}. {quiz.question}</p>
                <p
                  className={selectedChoices[questionIndex] === 1 ? 'highlight-choice' : ''}
                  onClick={() => handleChoiceClick(questionIndex, 1)}
                >
                  ① {quiz.choice_1}
                </p>
                <p
                  className={selectedChoices[questionIndex] === 2 ? 'highlight-choice' : ''}
                  onClick={() => handleChoiceClick(questionIndex, 2)}
                >
                  ② {quiz.choice_2}
                </p>
                <p
                  className={selectedChoices[questionIndex] === 3 ? 'highlight-choice' : ''}
                  onClick={() => handleChoiceClick(questionIndex, 3)}
                >
                  ③ {quiz.choice_3}
                </p>
                <p
                  className={selectedChoices[questionIndex] === 4 ? 'highlight-choice' : ''}
                  onClick={() => handleChoiceClick(questionIndex, 4)}
                >
                  ④ {quiz.choice_4}
                </p>

                <button onClick={() => toggleAnswer(questionIndex)}>
                  {revealedAnswers[questionIndex] ? '숨기기' : '정답 보기'}
                </button>

                {revealedAnswers[questionIndex] && (
                  <div className="quiz-answer-box">
                    <p><strong>정답:</strong> {quiz.answer}</p>
                    <p><strong>해설:</strong>{' '}
                      {quiz.explanation?.startsWith("http") ? (
                        <a href={quiz.explanation} target="_blank" rel="noopener noreferrer">해설 보러 가기</a>
                      ) : (
                        quiz.explanation || '해설 없음'
                      )}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="quiz-pagination">
        <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>이전</button>


        <span className="pagination-current">
        📄 {page + 1} / {Math.ceil(quizList.length / pageSize)}
        </span>



        <button
          onClick={() => setPage((p) => (p + 1 < Math.ceil(quizList.length / pageSize) ? p + 1 : p))}
          disabled={(page + 1) * pageSize >= quizList.length}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default StudyQuiz;
