import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Utensils, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// [임시값] 막대 그래프용
const mealRecordsData = [
  { date: '12/09', day: '화', records: 296 },
  { date: '12/10', day: '수', records: 327 },
  { date: '12/11', day: '목', records: 312 },
  { date: '12/12', day: '금', records: 206 },
  { date: '12/13', day: '토', records: 135 },
  { date: '12/14', day: '일', records: 187 },
  { date: '12/15', day: '월', records: 352 },
];

export function ServiceStats() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  // 화면 크기에 따라 원 그래프 크기를 조절하기 위한 상태
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 화면 리사이즈 감지 이벤트 리스너
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/management/users/service_stats');
        if (response.data.success) {
          setStatsData(response.data.data);
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const safeStats = statsData || { type1: 0, type2: 0, gestational: 0, before: 0 };

  const totalUsers = 
    (safeStats.type1 || 0) + 
    (safeStats.type2 || 0) + 
    (safeStats.before || 0) + 
    (safeStats.gestational || 0);

  const diabetesTypeData = [
    { name: '1형', value: safeStats.type1 || 0, color: '#3b82f6' },
    { name: '2형', value: safeStats.type2 || 0, color: '#10b981' },
    { name: '임신성', value: safeStats.gestational || 0, color: '#f59e0b' },
    { name: '당뇨 전단계', value: safeStats.before || 0, color: '#8b5cf6' },
  ];

  const stats = [
    {
      label: '총 사용자 수',
      value: loading ? '...' : `${totalUsers}`,
      change: '+5.1%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: '하루 평균 식사 기록수',
      value: '259',
      change: '+2.3%',
      icon: Utensils,
      color: 'bg-green-500',
    },
    {
      label: '평균 칼로리',
      value: '1,942 kcal',
      change: '-2.1%',
      icon: Flame,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">서비스 사용 통계</h2>
        <p className="text-gray-600">전체 서비스 사용 현황을 확인할 수 있습니다</p>
      </div>

      {/* 상단 카드 3개 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl shadow-md transition-all duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 mb-1">{stat.label}</p>
              <p className="text-gray-900 font-bold text-xl">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 당뇨 유형 파이 차트 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">당뇨 유형별 사용자</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diabetesTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={isMobile ? 100 : 130} // 원 크기 확대 (모바일 100, PC 130)
                fill="#8884d8"
                dataKey="value"
                nameKey="name" // 툴팁에 '유형명' 표시를 위한 키 지정
              >
                {diabetesTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {/* 툴팁 포맷 지정: "1형 : 100명" 형태로 표시 */}
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                formatter={(value, name) => [`${value}명`, name]}
              />
              <Legend verticalAlign="bottom" height={36} formatter={(value) => {
                  const data = diabetesTypeData.find(d => d.name === value);
                  return `${value} (${data?.value || 0}명)`;
              }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 일일 식사 기록 막대 차트 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">일일 식사 기록 수</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={mealRecordsData}
              // 왼쪽 여백을 줄여서 차트를 중앙으로 당김
              margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                height={60} 
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={16} textAnchor="middle" fill="#6b7280" fontSize={12}>{payload.value}</text>
                    <text x={0} y={0} dy={32} textAnchor="middle" fill="#9ca3af" fontSize={11}>
                      ({mealRecordsData.find(d => d.date === payload.value)?.day})
                    </text>
                  </g>
                )}
              />
              <YAxis stroke="#6b7280" width={50} tick={{ fontSize: 12 }}
              />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
              <Bar dataKey="records" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}