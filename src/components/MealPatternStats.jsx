import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 시간대별 식사 기록 빈도
const hourlyData = [
  { hour: '00시', count: 3 },
  { hour: '01시', count: 2 },
  { hour: '02시', count: 0 },
  { hour: '03시', count: 1 },
  { hour: '04시', count: 0 },
  { hour: '05시', count: 1 },
  { hour: '06시', count: 5 },
  { hour: '07시', count: 8 },
  { hour: '08시', count: 18 },
  { hour: '09시', count: 17 },
  { hour: '10시', count: 9 },
  { hour: '11시', count: 29 },
  { hour: '12시', count: 46 },
  { hour: '13시', count: 43 },
  { hour: '14시', count: 28 },
  { hour: '15시', count: 16 },
  { hour: '16시', count: 12 },
  { hour: '17시', count: 12 },
  { hour: '18시', count: 31 },
  { hour: '19시', count: 29 },
  { hour: '20시', count: 25 },
  { hour: '21시', count: 8 },
  { hour: '22시', count: 6 },
  { hour: '23시', count: 3 },
];

// 월별 사용 트렌드
const monthlyTrend = [
  { month: '5월', total: 2811 },
  { month: '6월', total: 3110 },
  { month: '7월', total: 4920 },
  { month: '8월', total: 5702 },
  { month: '9월', total: 6211 },
  { month: '10월', total: 6543 },
];

export function MealPatternStats() {
  const totalRecords = 7551

  // 가장 활발한 시간대 찾기
  const peakHour = hourlyData.reduce((max, item) => item.count > max.count ? item : max, hourlyData[0]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">식사 기록 패턴 분석</h2>
        <p className="text-gray-600">사용자들의 식사 기록 행동을 분석합니다</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-cyan-500" />
            <p className="text-gray-600">총 기록 수</p>
          </div>
          <p className="text-gray-900">{totalRecords.toLocaleString()}건</p>
          <p className="text-gray-600 mt-1">최근 30일</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <p className="text-gray-600">피크 시간대</p>
          </div>
          <p className="text-gray-900">{peakHour.hour}</p>
          <p className="text-gray-600 mt-1">{peakHour.count}건 기록</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <p className="text-gray-600">월간 성장률</p>
          </div>
          <p className="text-gray-900">+15.4%</p>
          <p className="text-gray-600 mt-1">전월 대비</p>
        </div>
      </div>

      {/* 차트 영역: items-start 제거하여 높이 맞춤(Stretch) 복원 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 시간대별 식사 기록 빈도 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-gray-900 mb-4">시간대별 식사 기록 빈도</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={hourlyData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="hour" 
                stroke="#6b7280"
                tick={{ fontSize: 10 }}
                interval={2}
              />
              <YAxis 
                width={40}
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px'
                }}
                formatter={(value) => [`${value}건`, '기록 횟수']}
              />
              <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-200/50">
              <p className="text-orange-600 mb-1 text-sm font-bold">아침</p>
              <p className="text-gray-900 font-medium">48건</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200/50">
              <p className="text-blue-600 mb-1 text-sm font-bold">점심</p>
              <p className="text-gray-900 font-medium">117건</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200/50">
              <p className="text-purple-600 mb-1 text-sm font-bold">저녁</p>
              <p className="text-gray-900 font-medium">85건</p>
            </div>
          </div>
        </div>

        {/* 월별 사용 트렌드 (flex-col 적용 및 그래프 확장) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 flex flex-col">
          <h3 className="text-gray-900 mb-4 flex-none">월별 사용 트렌드</h3>
          
          {/* flex-1을 주어 남은 공간을 모두 차지하게 함 */}
          <div className="flex-1 w-full min-h-[300px]">
            {/* height를 100%로 설정하여 부모 div에 꽉 차게 함 */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  width={40}
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                  formatter={(value) => [`${value.toLocaleString()}건`, '총 기록']}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 주요 인사이트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-purple-200/50">
          <h3 className="text-gray-900 mb-2">가장 활발한 요일</h3>
          <p className="text-gray-900 mb-1">월요일</p>
          <p className="text-gray-600">352건 기록</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 shadow-lg border border-orange-200/50">
          <h3 className="text-gray-900 mb-2">평균 일일 기록</h3>
          <p className="text-gray-900 mb-1">259건</p>
          <p className="text-gray-600">사용자 1인당 1.8건</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-200/50">
          <h3 className="text-gray-900 mb-2">AI 선호도</h3>
          <p className="text-gray-900 mb-1">증가 추세</p>
          <p className="text-gray-600">주초에 더 많이 사용</p>
        </div>
      </div>
    </div>
  );
}