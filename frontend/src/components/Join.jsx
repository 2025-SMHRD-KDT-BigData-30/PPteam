import React, { useState } from 'react';
import '../style/Join.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Join = () => {
    const [form, setForm] = useState({
        userId: '',
        password: '',
        passwordCheck: '',
        name: '',
        nickname: '',
        email: '',
        birthYear: '',
        birthMonth: '',
        birthDay: ''

    });

    const navigate = useNavigate();

    console.log('form', form)

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };


    // 아이디 중복 체크
    const handleIdCheck = () => {
        if (!form.userId) {
            alert("아이디를 입력해주세요.");
            return;
        }

        axios.get(`http://localhost:8084/NewSpringProject/member/checkId`, {
            params: { user_id: form.userId }
        })

            .then(res => {
                if (res.data === 0) {
                    alert("사용 가능한 아이디입니다.");
                    console.log(res.data);
                } else {
                    alert("이미 사용 중인 아이디입니다.");
                }
            })
            .catch(err => {
                console.error("아이디 중복 확인 중 에러:", err);
            });
    };

    // 가입하기 버튼 클릭시
    const handleSubmit = () => {
        console.log("요청 시작")

        // 생년월일 데이터 처리 (yyyy-mm-dd)
        const birthDay = `${form.birthYear}-${form.birthMonth.padStart(2, '0')}-${form.birthDay.padStart(2, '0')}`;

        const dataToSend = {
            user_id: form.userId,
            user_pw: form.password,
            user_name: form.name,
            user_nick: form.nickname,
            user_email: form.email,
            user_birthdate: birthDay
        };



        if (form.password === form.passwordCheck) {
            axios.post("http://localhost:8084/NewSpringProject/member/join", dataToSend)
                .then(res => {
                    console.log(res);

                    if (res.data === 1) {
                        alert("회원가입 성공!");
                        navigate("/");
                    } else {
                        alert("회원가입 실패");
                    }
                })
                .catch(err => {
                    console.error("에러 발생:", err);
                });
        } else {
            alert('패스워드 불일치!');
        }



        console.log('회원가입 정보:', form);
        console.log("요청 끝")
    };

    // 가입취소 시 로그인 화면으로 이동
    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="join-container">
            <h2 className="join-title">회원가입</h2>
            <div className="join-box">
                {/* 아이디 */}
                <label className="input-label">아이디</label>
                <div className="input-id-wrap">
                    <input type="text" name="userId" placeholder="아이디 입력" onChange={onChange} />
                    <button className="check-btn" onClick={handleIdCheck}>중복확인</button>
                </div>


                {/* 비밀번호 */}
                <label className="input-label">비밀번호</label>
                <input type="password" name="password" placeholder="비밀번호 입력" onChange={onChange} />

                {/* 비밀번호 확인 */}
                <label className="input-label">비밀번호 확인</label>
                <input type="password" name="passwordCheck" placeholder="비밀번호 재입력" onChange={onChange} />

                {/* 이름 */}
                <label className="input-label">이름</label>
                <input type="text" name="name" placeholder="이름을 입력해주세요" onChange={onChange} />

                {/* 닉네임 */}
                <label className="input-label">닉네임</label>
                <input type="text" name="nickname" placeholder="닉네임을 입력해주세요" onChange={onChange} />

                {/* 이메일 */}
                <label className="input-label">Email</label>
                <input type="email" name="email" placeholder="이메일을 입력해주세요" onChange={onChange} />

                <label className="input-label"> 생년월일</label>
                <div className="birth-wrap">
                    <select name="birthYear" onChange={onChange}>
                        <option>년도</option>
                        {Array.from({ length: 100 }, (_, i) => 2024 - i).map((year) => (
                            <option key={year}>{year}</option>
                        ))}
                    </select>
                    <select name="birthMonth" onChange={onChange}>
                        <option>월</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m}>{m}</option>
                        ))}
                    </select>
                    <select name="birthDay" onChange={onChange}>
                        <option>일</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                            <option key={d}>{d}</option>
                        ))}
                    </select>
                </div>

                <div className="join-btn-wrap">
                    <button className="join-btn submit" onClick={handleSubmit}>가입하기</button>
                    <button className="join-btn cancel" onClick={handleCancel}>가입취소</button>
                </div>
            </div>
        </div>
    );
};

export default Join;
