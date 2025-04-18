import React, { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Menu from './components/Menu';
import Login from './components/Login';
import Join from './components/Join';
import MyCalendar from './components/MyCalendar';
import StudyCalendar from './components/StudyCalendar';
import StudyDetail from './components/StudyDetail';
import MyPage from './components/MyPage';
import StudyQuiz from './components/StudyQuiz';
import StudyStats from './components/StudyStats';

function App() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [darkMode, setDarkMode] = useState(false); // 다크모드
  const [nickname, setNickname] = useState('');

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <Sidebar setDarkMode={setDarkMode} />
      <Menu month={month} setMonth={setMonth} nickname={nickname} />

      <div className="content-container">
        <Routes>
          <Route path="/" element={<Login setNickname={setNickname} />} />
          <Route path="/join" element={<Join />} />
          <Route path="/calendar" element={<MyCalendar month={month} />} />
          <Route path="/study" element={<StudyCalendar month={month} />} />
          <Route path="/study/:date" element={<StudyDetail />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/quiz" element={<StudyQuiz />} />
          <Route path="/stats" element={<StudyStats />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
