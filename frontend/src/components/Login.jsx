import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';
import axios from 'axios';
import img from '../img/카카오이미지.png'
import img2 from '../img/MakePlanD.png'

const Login = ({ setNickname }) => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const [showFindPwModal, setShowFindPwModal] = useState(false);
    const [showFindIdModal, setShowFindIdModal] = useState(false);

    const [findId, setFindId] = useState('');
    const [findName, setFindName] = useState('');
    const [findEmail, setFindEmail] = useState('');

    const [idFindName, setIdFindName] = useState('');
    const [idFindEmail, setIdFindEmail] = useState('');

    useEffect(() => {
        if (!window.Kakao?.isInitialized()) {
            window.Kakao.init('f9b92ded3634e6afc5926bf118b59984');
            console.log("Kakao SDK 초기화 완료");
        }
    }, []);

    const handleKakaoLogin = () => {
        window.Kakao.Auth.login({
            success: function (authObj) {
                console.log("카카오 로그인 성공", authObj);
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: function (res) {
                        console.log("카카오 사용자 정보", res);
                        const kakaoEmail = res.kakao_account.email;
                        const kakaoName = res.kakao_account.profile.nickname;

                        sessionStorage.setItem('kakaoEmail', kakaoEmail);
                        sessionStorage.setItem('kakaoName', kakaoName);

                        alert(`${kakaoName}님 환영합니다!`);
                        navigate('/calendar');
                    },
                    fail: function (error) {
                        console.error("카카오 사용자 정보 요청 실패", error);
                    }
                });
            },
            fail: function (err) {
                console.error("카카오 로그인 실패", err);
            }
        });
    };

    const handleLogin = () => {
        if (!id || !pw) {
            alert('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        axios.post(`http://localhost:8084/NewSpringProject/member/login`, {
            user_id: id,
            user_pw: pw
        }, { withCredentials: true })
            .then((res) => {
                console.log("서버 응답:", res);
                if (res.data && res.data.user_id) {
                    sessionStorage.setItem('loginId', res.data.user_id);
                    alert(`${res.data.user_name}님 환영합니다!`);

                    localStorage.setItem('userId', res.data.user_id);

                    setNickname(res.data.user_nick);
                    navigate('/calendar');
                } else {
                    alert("로그인 실패");
                }
            })
            .catch((err) => {
                console.error('로그인 요청 오류', err);
                alert("로그인 실패");
            });
    };

    const closeModal = () => {
        setShowFindPwModal(false);
        setShowFindIdModal(false);
        setFindId('');
        setFindName('');
        setFindEmail('');
        setIdFindName('');
        setIdFindEmail('');
    };

    const handleFindPassword = () => {
        if (!findId || !findName || !findEmail) {
            alert("모든 정보를 입력해주세요.");
            return;
        }

        axios.get('http://localhost:8084/NewSpringProject/member/findPassword', {
            params: {
                user_id: findId,
                user_name: findName,
                user_email: findEmail
            }
        }, { withCredentials: true })
            .then(res => {
                if (res.data) {
                    alert(`회원님의 비밀번호는 "${res.data}" 입니다.`);
                } else {
                    alert("일치하는 회원 정보가 없습니다.");
                }
                closeModal();
            })
            .catch(err => {
                console.error("비밀번호 찾기 오류:", err);
                alert("비밀번호 찾기에 실패했습니다.");
            });
    };

    const handleFindId = () => {
        if (!idFindName || !idFindEmail) {
            alert("이름과 이메일을 모두 입력해주세요.");
            return;
        }

        axios.get('http://localhost:8084/NewSpringProject/member/findId', {
            params: {
                user_name: idFindName,
                user_email: idFindEmail
            }
        }, { withCredentials: true })
            .then(res => {
                if (res.data) {
                    alert(`회원님의 아이디는 "${res.data}" 입니다.`);
                } else {
                    alert("일치하는 회원 정보가 없습니다.");
                }
                closeModal();
            })
            .catch(err => {
                console.error("아이디 찾기 오류:", err);
                alert("아이디 찾기에 실패했습니다.");
            });
    };

    return (

        <div className="login-container">
            <img
                src={img2}
                style={{ width: '450px', marginBottom: '-70px', marginLeft: '-38px', marginTop: '-50px' }}
            />
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                <input
                    type="text"
                    placeholder="아이디"
                    className="login-input"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    className="login-input"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                />
                <button className="login-btn" onClick={handleLogin}>로그인</button>

                <div className="login-links">
                    <span onClick={() => setShowFindIdModal(true)}>아이디 찾기</span>
                    <span>|</span>
                    <span onClick={() => setShowFindPwModal(true)}>비밀번호 찾기</span>
                </div>

                <div className="login-divider">간편로그인</div>

                <img
                    src={img}
                    alt="카카오 로그인"
                    style={{ width: '155px', margin: '20px auto', display: 'block' }}
                    onClick={handleKakaoLogin}
                />
            </div>

            <div className="signup-box">
                계정이 없으신가요? <span className="signup-link" onClick={() => navigate('/join')}>가입하기</span>
            </div>

            {showFindPwModal && (
                <div className="login-modal-overlay">
                    <div className="login-modal-box">
                        <div className="login-modal-top">
                            <h3>비밀번호 찾기</h3>
                            <span className="login-close-btn" onClick={closeModal}>X</span>
                        </div>
                        <input type="text" placeholder="아이디" value={findId} onChange={(e) => setFindId(e.target.value)} />
                        <input type="text" placeholder="이름" value={findName} onChange={(e) => setFindName(e.target.value)} />
                        <input type="email" placeholder="이메일" value={findEmail} onChange={(e) => setFindEmail(e.target.value)} />
                        <button className="login-confirm-btn" onClick={handleFindPassword}>비밀번호 찾기</button>
                    </div>
                </div>
            )}

            {showFindIdModal && (
                <div className="login-modal-overlay">
                    <div className="login-modal-box">
                        <div className="login-modal-top">
                            <h3>아이디 찾기</h3>
                            <span className="login-close-btn" onClick={closeModal}>X</span>
                        </div>
                        <input type="text" placeholder="이름" value={idFindName} onChange={(e) => setIdFindName(e.target.value)} />
                        <input type="email" placeholder="이메일" value={idFindEmail} onChange={(e) => setIdFindEmail(e.target.value)} />
                        <button className="login-confirm-btn" onClick={handleFindId}>아이디 찾기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
