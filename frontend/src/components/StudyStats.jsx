import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import axios from 'axios';
import '../style/StudyStats.css';

const StudyStats = () => {
  // const userId = sessionStorage.getItem('userId');
  const userId = localStorage.getItem('userId');
  
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8084/NewSpringProject/api/calendar/stats?userId=${userId}`)
      .then((res) => {
        const formatted = res.data.map((item) => ({
          id: item.keyword,
          label: item.keyword,
          value: item.count
        }));
        setChartData(formatted);
      })
      .catch((err) => {
        console.error('📛 키워드 통계 로딩 실패:', err);
      });
  }, [userId]);

  return (
    <div className="stats-container">
      <div className="stats-left">
        <img
          src="/images/default-profile.png"
          alt="프로필"
          className="stats-profile"
        />
        <p className="stats-nickname">{userId}</p>
      </div>

      <div className="stats-right">
        <div className="stats-box">
          <h2>📊 키워드 빈도 시각화</h2>
          {chartData.length > 0 ? (
            <div className="chart-wrapper" style={{ height: '400px', width: '500px' }}>
              <ResponsivePie
                data={chartData}
                margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              />
            </div>
          ) : (
            <p>등록된 키워드가 존재하지 않습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyStats;
