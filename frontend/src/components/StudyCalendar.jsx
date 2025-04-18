import React, { useRef, useEffect,useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../style/MyCalendar.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const StudyCalendar = ({ month }) => {
    const calendarRef = useRef(null);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            const newDate = new Date();
            newDate.setMonth(month - 1);
            calendarApi.gotoDate(newDate);
        }
    }, [month]);

    // ✅ 키워드 일정 불러오기
    useEffect(() => {

        const loginId = sessionStorage.getItem("loginId");
        console.log("🔒 현재 로그인된 사용자 ID:", loginId);
        axios.get('http://localhost:8084/NewSpringProject/api/calendar/keywords',{
            params : {userId: loginId},
            withCredentials: true
            
        })

            .then(res => {
                const keywordList = res.data; // List<Map<String, String>>
                const formattedEvents = keywordList.map(item => ({
                    title: item.keyword,
                    start: item.date,
                    allDay: true
                }));
                setEvents(formattedEvents);
            })
            .catch(err => {
                console.error('키워드 불러오기 실패:', err);
            });
    }, []);

    const onDateClick = (info) => {
        navigate(`/study/${info.dateStr}`); // 클릭한 날짜로 이동
    };

    return (
        <div className="calendar-wrap">
            <h2>공부 달력</h2>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="800px"
                dateClick={onDateClick}
                events={events}
            />
        </div>
    );
};

export default StudyCalendar;
