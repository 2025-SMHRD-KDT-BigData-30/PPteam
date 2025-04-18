import React from 'react';
import '../style/Sidebar.css';
import { IoTimer } from 'react-icons/io5';
import { BsBook, BsPerson } from 'react-icons/bs';
import { FaCalendar } from "react-icons/fa";
import { BiBarChartAlt2 } from 'react-icons/bi';
import { FaPen, FaSun } from 'react-icons/fa';
import { FaMoon } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = ({ setDarkMode }) => {
  const navigate = useNavigate();

  // 로그인 여부 체크
  const isLoggedIn = () => {
    return !!sessionStorage.getItem("loginId");
  };

  // 로그인 상태일 때만 이동 허용
  const handleProtectedNavigation = (path) => {
    if (!isLoggedIn()) {
      alert("로그인 후 이용해주세요.");
      return;
    }
    console.log(path)
    navigate(path);
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8084/NewSpringProject/member/logout", { withCredentials: true });
      sessionStorage.clear(); // 프론트 세션 제거
      alert("로그아웃 되었습니다.");
      navigate("/"); // 로그인 페이지로 이동
    } catch (err) {
      console.error("로그아웃 실패", err);
      alert("로그아웃 중 오류 발생");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="menu">

          {/* <div className='menu-item' onClick={() => handleProtectedNavigation('/timer')}>
            <IoTimer size={21} />
            <span>공부시작</span>
          </div> */}

          <div className="menu-item" onClick={() => handleProtectedNavigation('/calendar')}>
            <FaCalendar size={21} />
            <span>업무달력</span>
          </div>

          <div className="menu-item" onClick={() => handleProtectedNavigation('/study')}>
            <BsBook size={21} />
            <span>공부달력</span>
          </div>

          <div className="menu-item" onClick={() => handleProtectedNavigation('/mypage')}>
            <BsPerson size={21} />
            <span>마이페이지</span>
          </div>

          <div className="menu-item" onClick={() => handleProtectedNavigation('/stats')}>
            <BiBarChartAlt2 size={21} />
            <span>공부통계</span>
          </div>

          <div className="menu-item" onClick={() => handleProtectedNavigation('/quiz')}>
            <FaPen size={21} />
            <span>복습퀴즈</span>
          </div>

          <div className="menu-item" onClick={() => setDarkMode(true)}>
            <FaMoon size={21} />
            <span>다크모드</span>
          </div>

          <div className="menu-item" onClick={() => setDarkMode(false)}>
            <FaSun size={21} />
            <span>화이트모드</span>
          </div>

          <div className="menu-item" onClick={handleLogout}>
            <FiLogOut size={21} />
            <span>로그아웃</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;
