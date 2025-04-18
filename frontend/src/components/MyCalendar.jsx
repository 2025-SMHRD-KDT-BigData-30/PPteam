import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import '../style/MyCalendar.css';
import axios from 'axios';

Modal.setAppElement('#root');

const MyCalendar = ({ month }) => {
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [input, setInput] = useState({ title: '', start: '', end: '' });
  const [userId, setUserId] = useState('');

  // 🔥 FullCalendar DOM 직접 참조
  const calendarRef = useRef(null);

  // 📦 month 값 바뀔 때 달 이동
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const now = new Date();
      now.setMonth(month - 1);
      calendarApi.gotoDate(now); // 이동
    }
  }, [month]);

  useEffect(() => {
    axios.get('http://localhost:8084/NewSpringProject/member/session-check', {
      withCredentials: true
    })
      .then(res => {
        if (res.data) {
          setUserId(res.data.user_id);
        }
      })
      .catch(err => console.error('세션 확인 실패', err));
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios.get('http://localhost:8084/NewSpringProject/schedule/getSchedules', {
      params: { user_id: userId },
      withCredentials: true
    })
      .then(res => {
        const fetched = res.data.map((item) => ({
          id: item.sche_idx.toString(),
          title: item.sche_title,
          start: new Date(item.st_dt).toISOString().slice(0, 10),
          end: new Date(item.ed_dt).toISOString().slice(0, 10),
        }));
        setList(fetched);
      })
      .catch(err => console.error('일정 불러오기 실패', err));
  }, [userId]);

  const onDateClick = (info) => {
    setSelectedEvent(null);
    setInput({ title: '', start: info.dateStr, end: info.dateStr });
    setModalOpen(true);
  };

  const onEventClick = (info) => {
    const item = info.event;
    setSelectedEvent(item);
    setInput({
      title: item.title,
      start: item.startStr.slice(0, 10),
      end: item.endStr?.slice(0, 10) || item.startStr.slice(0, 10)
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!input.title.trim()) return;

    const getAdjustedEnd = (dateStr) => {
      const date = new Date(dateStr);
      date.setDate(date.getDate() + 1);
      return date.toISOString().slice(0, 10);
    };

    const adjustedEnd = getAdjustedEnd(input.end);

    if (selectedEvent) {
      axios.put('http://localhost:8084/NewSpringProject/schedule/updateSchedule', {
        sche_idx: parseInt(selectedEvent.id),
        user_id: userId,
        sche_title: input.title,
        st_dt: input.start,
        ed_dt: adjustedEnd,
        sche_color: '#3788d8'
      }, { withCredentials: true })
        .then(() => {
          const updated = list.map(item =>
            item.id === selectedEvent.id
              ? { ...item, title: input.title, start: input.start, end: adjustedEnd }
              : item
          );
          setList(updated);
          setModalOpen(false);
          setSelectedEvent(null);
        })
        .catch(err => {
          console.error('수정 오류:', err);
          alert('일정 수정 실패');
        });
    } else {
      axios.post('http://localhost:8084/NewSpringProject/schedule/addSchedule', {
        user_id: userId,
        sche_title: input.title,
        st_dt: input.start,
        ed_dt: adjustedEnd,
        sche_color: '#3788d8'
      }, { withCredentials: true })
        .then((res) => {
          const newId = res.data && typeof res.data === 'number'
            ? res.data
            : new Date().getTime();

          const newEvent = {
            id: newId.toString(),
            title: input.title,
            start: input.start,
            end: adjustedEnd
          };

          setList(prev => [...prev, newEvent]);

          setModalOpen(false);
          setSelectedEvent(null);
        })
        .catch((err) => {
          console.error('일정 저장 실패:', err);
          alert('일정 저장 실패');
        });
    }
  };

  const handleDelete = () => {
    if (!selectedEvent) return;

    axios.delete('http://localhost:8084/NewSpringProject/schedule/deleteSchedule', {
      params: { sche_idx: parseInt(selectedEvent.id) },
      withCredentials: true
    })
      .then(() => {
        setList((prev) => prev.filter((event) => event.id !== selectedEvent.id));
        setModalOpen(false);
        setSelectedEvent(null);
      })
      .catch((err) => {
        console.error('삭제 오류:', err);
        alert('일정 삭제 실패');
      });
  };

  const onSelect = (info) => {
    const start = new Date(info.startStr);
    const end = new Date(info.endStr);
    const gap = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (gap <= 1) return;

    const title = prompt('일정 제목을 입력하세요:');
    if (!title || title.trim() === '') return;

    const newId = new Date().getTime().toString();
    setList(prev => [
      ...prev,
      {
        id: newId,
        title,
        start: info.startStr,
        end: info.endStr,
        allDay: info.allDay
      }
    ]);
  };

  const validList = list.filter(e => e && e.id && e.title && e.start);

  return (
    <div className='calendar-wrap'>
      <h2>일정 달력</h2>
      {userId && (
        <FullCalendar
          ref={calendarRef}  // 🔥 여기 ref 연결
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="800px"
          dateClick={onDateClick}
          eventClick={onEventClick}
          selectable={true}
          select={onSelect}
          events={validList}
          eventDataTransform={(data) => {
            if (!data) return {};
            return {
              ...data,
              id: data.id?.toString() || new Date().getTime().toString()
            };
          }}
          eventContent={(arg) => {
            const date = arg.event.startStr.slice(0, 10);
            const count = validList.filter(item => item.start.slice(0, 10) === date).length;
            if (count === 1) {
              const wrapper = document.createElement('div');
              wrapper.style.backgroundColor = '#3788d8';
              wrapper.style.color = '#fff';
              wrapper.style.padding = '4px 6px';
              wrapper.style.borderRadius = '6px';
              wrapper.style.fontSize = '14px';
              wrapper.style.fontWeight = 'normal';
              wrapper.style.textAlign = 'left';
              wrapper.style.display = 'block';
              wrapper.style.width = '100%';
              wrapper.textContent = arg.event.title;
              return { domNodes: [wrapper] };
            }
            return { html: `<div>${arg.event.title}</div>` };
          }}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 999
          },
          content: {
            width: '320px',
            height: '320px',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        <h2>{selectedEvent ? '일정 수정' : '일정 추가'}</h2>

        <label>제목</label>
        <input
          type="text"
          value={input.title}
          onChange={(e) => setInput({ ...input, title: e.target.value })}
          className="modal-input"
        />

        <label>시작 날짜</label>
        <input
          type="date"
          value={input.start}
          onChange={(e) => setInput({ ...input, start: e.target.value })}
          className="modal-input"
        />

        <label>종료 날짜</label>
        <input
          type="date"
          value={input.end}
          onChange={(e) => setInput({ ...input, end: e.target.value })}
          className="modal-input"
        />

        <div className="modal-btn-wrap">
          <button onClick={handleSave} className="modal-btn save">
            {selectedEvent ? '수정' : '추가'}
          </button>
          {selectedEvent && (
            <button onClick={handleDelete} className="modal-btn delete">
              삭제
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MyCalendar;
