import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Activity, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// [임시값]
const FALSE_TIME_DATA = {
  '1형': [
    { time: '00-03시', avg: 139, high: 0, low: 0}, { time: '03-06시', avg: 145, high: 0, low: 0 },
    { time: '06-09시', avg: 151, high: 0, low: 0 }, { time: '09-12시', avg: 152, high: 0, low: 0 },
    { time: '12-15시', avg: 153, high: 0, low: 0 }, { time: '15-18시', avg: 148, high: 0, low: 0 },
    { time: '18-21시', avg: 146, high: 0, low: 0 }, { time: '21-24시', avg: 142, high: 0, low: 0 },
  ],
  '2형': [
    { time: '00-03시', avg: 148, high: 7, low: 0 }, { time: '03-06시', avg: 145, high: 3, low: 0 },
    { time: '06-09시', avg: 156, high: 23, low: 0 }, { time: '09-12시', avg: 160, high: 64, low: 0 },
    { time: '12-15시', avg: 165, high: 102, low: 0 }, { time: '15-18시', avg: 164, high: 74, low: 0 },
    { time: '18-21시', avg: 157, high: 59, low: 0 }, { time: '21-24시', avg: 153, high: 12, low: 0 },
  ],
  '임신성': [
    { time: '00-03시', avg: 155, high: 2, low: 0 }, { time: '03-06시', avg: 153, high: 0, low: 0 },
    { time: '06-09시', avg: 160, high: 2, low: 0 }, { time: '09-12시', avg: 163, high: 6, low: 0 },
    { time: '12-15시', avg: 168, high: 18, low: 0 }, { time: '15-18시', avg: 163, high: 13, low: 0 },
    { time: '18-21시', avg: 161, high: 4, low: 0 }, { time: '21-24시', avg: 157, high: 3, low: 0 },
  ],
  '전단계': [
    { time: '00-03시', avg: 148, high: 4, low: 0 }, { time: '03-06시', avg: 147, high: 1, low: 0 },
    { time: '06-09시', avg: 156, high: 20, low: 0 }, { time: '09-12시', avg: 155, high: 19, low: 0 },
    { time: '12-15시', avg: 160, high: 38, low: 0 }, { time: '15-18시', avg: 157, high: 22, low: 0 },
    { time: '18-21시', avg: 155, high: 19, low: 0 }, { time: '21-24시', avg: 154, high: 12, low: 0 },
  ]
};

export function BloodSugarStats() {
  const [selectedType, setSelectedType] = useState('1형');
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const diabetesTypes = ['1형', '2형', '임신성', '전단계'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/management/blood_sugar');
        
        if (response.data.success && Array.isArray(response.data.data)) {
           const processedData = {};
           
           response.data.data.forEach(item => {
             // 백엔드가 보내준 불규칙한 키 이름들을 정확하게 매핑
             const weeklyData = [
               { day: '월', dayName: '월요일', avg: item.mon_bs_Mean },
               { day: '화', dayName: '화요일', avg: item.tue_bs_Mean },
               { day: '수', dayName: '수요일', avg: item.wen_bs_Mean },
               { day: '목', dayName: '목요일', avg: item.thu_bsMean },
               { day: '금', dayName: '금요일', avg: item.fri_bsMean },
               { day: '토', dayName: '토요일', avg: item.sat_bsMean },
               { day: '일', dayName: '일요일', avg: item.sun_bs_Mean },
             ];

             // 평균 계산을 위해 유효한 값만 필터링
             const validMeans = [
               item.mon_bs_Mean, item.tue_bs_Mean, item.wen_bs_Mean, 
               item.thu_bsMean, item.fri_bsMean, item.sat_bsMean, 
               item.sun_bs_Mean
             ].filter(v => v > 0);

             const totalAvg = validMeans.length > 0 
               ? Math.round(validMeans.reduce((a, b) => a + b, 0) / validMeans.length) 
               : 0;
 
             const totalCount = item.count_per_month || 1;
             const highRate = ((item.high_bs / totalCount) * 100).toFixed(1) + '%';
             const lowRate = ((item.low_bs / totalCount) * 100).toFixed(1) + '%';
             
             // [임시값] 시간 데이터 연결
             const fakeTimeData = FALSE_TIME_DATA[item.diabetes_type] || FALSE_TIME_DATA['1형'];
 
             processedData[item.diabetes_type] = {
               summary: { 
                 avg: totalAvg, 
                 high: item.high_bs, 
                 low: item.low_bs, 
                 highRate, 
                 lowRate, 
                 total: item.count_per_month 
               },
               weekly: weeklyData,
               time: fakeTimeData
             };
           });
           setStatsData(processedData);
        } else {
          const rawData = JSON.stringify(response.data); 
          setErrorMsg(`서버 응답 내용이 예상과 다릅니다: ${rawData}`);
        }
      } catch (error) {
        setErrorMsg(`에러 발생: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">데이터 분석 중...</div>;
  
  if (!statsData) return (
    <div className="p-10 text-center text-red-500 border border-red-200 bg-red-50 rounded-lg overflow-auto">
      <h3 className="font-bold mb-2">데이터를 불러오지 못했습니다.</h3>
      <p className="font-mono text-sm break-all">{errorMsg}</p> 
    </div>
  );

  const currentData = statsData[selectedType] || {
    summary: { avg: 0, high: 0, highRate: '0%', low: 0, lowRate: '0%', total: 0 },
    weekly: [],
    time: []
  };

  return (
    <div className="space-y-6">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="mb-8">
        <h2 className="text-gray-900 mb-2 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">혈당 관리 통계</h2>
        <p className="text-gray-600">당뇨 유형별 혈당 데이터를 분석합니다</p>
      </div>

      {/* 탭 버튼 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {diabetesTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex-1 min-w-fit md:min-w-[80px] px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${selectedType === type ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <p className="text-gray-600">평균 혈당</p>
          </div>
          <p className="text-gray-900 text-2xl font-bold">{currentData.summary.avg} mg/dL</p>
          <p className="text-green-600 mt-1 text-sm font-medium">
             {currentData.summary.avg > 0 
                ? (currentData.summary.avg < 120 ? '정상 범위' : '주의 필요')
                : '-'}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <p className="text-gray-600">고혈당 발생</p>
          </div>
          <p className="text-gray-900 text-2xl font-bold">{currentData.summary.high}건</p>
          <p className="text-gray-600 mt-1 text-sm">전체의 {currentData.summary.highRate}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-5 h-5 text-yellow-500" />
            <p className="text-gray-600">저혈당 발생</p>
          </div>
          <p className="text-gray-900 text-2xl font-bold">{currentData.summary.low}건</p>
          <p className="text-gray-600 mt-1 text-sm">전체의 {currentData.summary.lowRate}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <p className="text-gray-600">총 측정 횟수</p>
          </div>
          <p className="text-gray-900 text-2xl font-bold">{currentData.summary.total.toLocaleString()}건</p>
          <p className="text-gray-600 mt-1 text-sm">최근 30일</p>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 요일별 평균 혈당 (API 연동됨) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-gray-900 mb-4 font-bold text-lg">요일별 평균 혈당 ({selectedType})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData.weekly} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis width={40} stroke="#6b7280" tick={{ fontSize: 12 }} domain={[50, 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px' }}
                labelFormatter={(value) => {
                  const day = currentData.weekly.find(d => d.day === value);
                  return day ? day.dayName : value;
                }}
                formatter={(value) => [`${value} mg/dL`, '평균 혈당']}
              />
              <Line type="monotone" dataKey="avg" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 시간대별 혈당 분포 (임시값 사용) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-gray-900 font-bold text-lg">시간대별 혈당 분포 ({selectedType})</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={currentData.time} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis width={40} stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px' }}
              />
              <Legend />
              <Bar dataKey="avg" fill="#3b82f6" name="평균 혈당 (mg/dL)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="high" fill="#ef4444" name="고혈당 발생 (건)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="low" fill="#f59e0b" name="저혈당 발생 (건)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}