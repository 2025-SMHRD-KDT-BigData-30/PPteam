import React, { useRef, useState, useEffect } from 'react';
import '../style/MyPage.css';
import axios from 'axios';

const MyPage = () => {
  const fileInput = useRef(null);
  const [profileImage, setProfileImage] = useState('/images/default-profile.png');
  const [userId, setUserId] = useState('');
  const [userNick, setUserNick] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'pw' | 'nick'
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // 닉네임 및 비밀번호 입력 상태
  const [newPw, setNewPw] = useState('');
  const [newNick, setNewNick] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8084/NewSpringProject/member/session-check', {
      withCredentials: true
    }).then(res => {
      if (res.data?.user_id) {
        setUserId(res.data.user_id);
        setUserNick(res.data.user_nick);
        if (res.data.profilePath) {
          setProfileImage(res.data.profilePath);
        }
      }
    }).catch(err => {
      console.error('세션 확인 실패:', err);
    });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('profile', file);
    formData.append('user_id', userId);

    axios.post('http://localhost:8084/NewSpringProject/member/uploadProfile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    })
      .then(res => {
        if (res.data === 1) {
          alert('이미지 업로드 성공!');
        } else {
          alert('이미지 업로드 실패');
        }
      })
      .catch(err => {
        console.error('업로드 오류:', err);
        alert('서버 오류 발생');
      });
  };

  const confirmWithdraw = async () => {
    try {
      const res = await axios.post('http://localhost:8084/NewSpringProject/member/delete', null, {
        withCredentials: true
      });

      if (res.status === 200) {
        alert('회원 탈퇴 완료');
        window.location.href = '/';
      } else {
        alert('탈퇴 실패');
      }
    } catch (err) {
      console.error('회원 탈퇴 오류:', err);
      alert('서버 오류');
    }
  };

  const handleUpdate = () => {
    if (activeModal === 'pw') {
      if (!newPw.trim()) {
        alert('새 비밀번호를 입력해주세요.');
        return;
      }
      axios.put('http://localhost:8084/NewSpringProject/member/updateUserInfo', {
        user_id: userId,
        user_pw: newPw
      }, { withCredentials: true })
        .then(() => {
          alert('비밀번호 변경 완료');
          setNewPw('');
          setActiveModal(null);
        })
        .catch(err => {
          console.error('비밀번호 변경 실패:', err);
          alert('비밀번호 변경 실패');
        });
    } else if (activeModal === 'nick') {
      if (!newNick.trim()) {
        alert('새 닉네임을 입력해주세요.');
        return;
      }
      axios.put('http://localhost:8084/NewSpringProject/member/updateNick', {
        user_id: userId,
        user_nick: newNick
      }, { withCredentials: true })
        .then(() => {
          alert('닉네임 변경 완료');
          setUserNick(newNick);
          setNewNick('');
          setActiveModal(null);
        })
        .catch(err => {
          console.error('닉네임 변경 실패:', err);
          alert('닉네임 변경 실패');
        });
    }
  };

  const modalInfo = {
    pw: { title: '비밀번호 변경', desc: '비밀번호를 변경해주세요.' },
    nick: { title: '닉네임 변경', desc: '닉네임을 변경해주세요.' }
  };

  return (
    <div className="mypage-container">
      <div className="profile-section">
        <img
          src={profileImage}
          alt="프로필"
          className="profile-image"
          onClick={() => fileInput.current.click()}
          onError={(e) => e.target.src = '/images/default-profile.png'}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <p className="nickname">{userNick}</p>
      </div>

      <div className="info-section">
        <button className="info-btn" onClick={() => setActiveModal('pw')}>비밀번호 변경</button>
        <button className="info-btn" onClick={() => setActiveModal('nick')}>닉네임 변경</button>
        <button className="info-btn">친구에게 추천하기</button>
        <button className="withdraw-btn" onClick={() => setShowWithdrawModal(true)}>회원탈퇴</button>
      </div>

      {activeModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-top">
              <h3>{modalInfo[activeModal].title}</h3>
              <span className="close-btn" onClick={() => setActiveModal(null)}>←</span>
            </div>
            <p>{modalInfo[activeModal].desc}</p>
            <input
              type={activeModal === 'pw' ? 'password' : 'text'}
              placeholder={`새로운 ${modalInfo[activeModal].title} 입력`}
              value={activeModal === 'pw' ? newPw : newNick}
              onChange={(e) => activeModal === 'pw' ? setNewPw(e.target.value) : setNewNick(e.target.value)}
            />
            <button className="confirm-btn" onClick={handleUpdate}>지금 변경하기</button>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-top">
              <h3>회원 탈퇴</h3>
              <span className="close-btn" onClick={() => setShowWithdrawModal(false)}>×</span>
            </div>
            <p>정말 탈퇴하시겠습니까?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmWithdraw}>예</button>
              <button className="cancel-btn" onClick={() => setShowWithdrawModal(false)}>아니오</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;