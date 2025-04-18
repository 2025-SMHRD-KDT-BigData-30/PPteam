import React, { useEffect, useState } from 'react';
import '../style/Menu.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Menu = ({ month, setMonth, nickname}) => {
  const location = useLocation();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate(); // 과목번호 전송

  // 타이머 동작
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePrev = () => {
    setMonth((prev) => (prev === 1 ? 12 : prev - 1));
  };

  const handleNext = () => {
    setMonth((prev) => (prev === 12 ? 1 : prev + 1));
  };

  // 공부 시작 버튼
  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    setTimer(0);
  };

  // 공부 종료 버튼
  const handleStop = () => {
    const now = new Date();
    setEndTime(now);
    setIsRunning(false);

    const durationMs = now - startTime;
    const durationSec = Math.floor(durationMs / 1000);
    setDuration(durationSec);

    // 서버로 저장 요청
    axios.post('http://localhost:8084/NewSpringProject/member/study/saveTime', {
      user_id: sessionStorage.getItem('loginId'),
      st_tm: startTime,
      ed_tm: now,
      st_duration: durationSec
    }, { withCredentials: true })
    .then(() => {
      alert(`${durationSec}초 공부 하셨습니다.`);
    })
    .catch(err => {
      console.error('공부 시간 저장 실패', err);
      alert('공부 시간 저장 실패');
    });
  };
  console.log("현재 month:", month, " / setMonth 함수:", setMonth);
  const handleSubjectChange = (e) => {

    const selectedValue = e.target.value;
    if (!selectedValue) return;

    // 예: subject1 → 1 추출
    const subjectNo = parseInt(selectedValue.replace('subject', ''), 10);
    console.log('선택한 과목 번호:', subjectNo);

    navigate('/quiz', { state: { subjectNo } }); // 이동하면서 값 넘기기
    console.log('선택한 과목:', e.target.value);
  };

  return (
    <div className="menu-fixed">
      <div className="menu-top">
        <div className="menu-month">
          <FaChevronLeft onClick={handlePrev} />
          <span className="month-text">{month.toString().padStart(2, '0')}</span>
          <FaChevronRight onClick={handleNext} />
        </div>
        <div className="menu-welcome">
          {nickname && `${nickname}님 환영합니다`}
        </div>
      </div>

      {/* 타이머 표시 및 버튼 */}
      <div className="study-timer-box">
        <p className="study-timer"> ⏱ {formatTime(timer)}</p>
        <div className="study-btns">
          <button onClick={handleStart} disabled={isRunning}>시작</button>
          <button onClick={handleStop} disabled={!isRunning}>종료</button>
        </div>
      </div>

      {location.pathname === '/quiz' && (
        <div className="subject-select-box">
          <select onChange={handleSubjectChange}>
            <option value="">과목을 선택하세요</option>
            <option value="subject1">1과목 | 소프트웨어 설계</option>
            <option value="subject2">2과목 | 소프트웨어 개발</option>
            <option value="subject3">3과목 | 데이터베이스 구축</option>
            <option value="subject4">4과목 | 프로그래밍 언어 활용</option>
            <option value="subject5">5과목 | 정보시스템 구축관리</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default Menu;