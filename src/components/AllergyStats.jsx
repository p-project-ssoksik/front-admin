import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// 차트 색상 팔레트
const ALLERGY_COLORS = {
  '우유': '#3b82f6',
  '땅콩': '#10b981',
  '갑각류': '#f59e0b',
  '계란': '#ef4444',
  '밀': '#8b5cf6',
  '콩': '#ec4899',
  '생선': '#06b6d4',
  '기타': '#6b7280'
};

const COLORS_POOL = [
  '#F472B6', '#A78BFA', '#34D399', '#FBBF24', '#60A5FA',
  '#FB7185', '#818CF8', '#2DD4BF', '#A3E635', '#FB923C',
];

export function AllergyStats() {
  const [loading, setLoading] = useState(true);
  const [allergyData, setAllergyData] = useState([]);
  const [ageGroupData, setAgeGroupData] = useState([]);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    topAllergy: '-',
    topAllergyCount: 0,
    avgAllergyPerUser: 0
  });

  // 화면 크기 감지 (모바일 여부 확인용)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
        const response = await axios.get('/management/users/allergy');
        if (response.data.success) {
          processData(response.data.data);
        }
      } catch (error) {
        console.error("알레르기 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processData = (users) => {
    const allergyCounts = {};
    let totalAllergyCount = 0;

    users.forEach(user => {
      if (Array.isArray(user.allergy)) {
        user.allergy.forEach(item => {
          allergyCounts[item] = (allergyCounts[item] || 0) + 1;
          totalAllergyCount++;
        });
      }
    });

    const processedAllergyData = Object.entries(allergyCounts)
      .map(([name, value], index) => {
        let color = ALLERGY_COLORS[name];
        if (!color) {
          color = COLORS_POOL[index % COLORS_POOL.length];
        }
        return { name, value, color };
      })
      .sort((a, b) => b.value - a.value);

    const ageCounts = { '10대': 0, '20대': 0, '30대': 0, '40대': 0, '50대 이상': 0 };
    
    users.forEach(user => {
      const age = user.age;
      if (age < 20) ageCounts['10대']++;
      else if (age < 30) ageCounts['20대']++;
      else if (age < 40) ageCounts['30대']++;
      else if (age < 50) ageCounts['40대']++;
      else ageCounts['50대 이상']++;
    });

    const processedAgeData = [
      { age: '10-19세', count: ageCounts['10대'] },
      { age: '20-29세', count: ageCounts['20대'] },
      { age: '30-39세', count: ageCounts['30대'] },
      { age: '40-49세', count: ageCounts['40대'] },
      { age: '50세+', count: ageCounts['50대 이상'] },
    ];

    const totalUsers = users.length;
    const topAllergyItem = processedAllergyData.length > 0 ? processedAllergyData[0] : { name: '-', value: 0 };
    const avgAllergy = totalUsers > 0 ? (totalAllergyCount / totalUsers).toFixed(1) : 0;

    setAllergyData(processedAllergyData);
    setAgeGroupData(processedAgeData);
    setSummary({
      totalUsers,
      topAllergy: topAllergyItem.name,
      topAllergyCount: topAllergyItem.value,
      avgAllergyPerUser: avgAllergy
    });
  };

  if (loading) return <div className="p-10 text-center">데이터 분석 중...</div>;

  const totalAllergies = allergyData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">알레르기 통계</h2>
        <p className="text-gray-600">사용자들의 알레르기 정보를 분석한 통계입니다</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-gray-600 mb-2">알레르기 등록자</p>
          <p className="text-gray-900 font-bold text-xl">{summary.totalUsers}명</p>
          <p className="text-green-600 mt-1 text-sm">데이터 기반 집계</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-gray-600 mb-2">가장 많은 알레르기</p>
          <p className="text-gray-900 font-bold text-xl">{summary.topAllergy}</p>
          <p className="text-blue-600 mt-1 text-sm">{summary.topAllergyCount}명 해당</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-gray-600 mb-2">평균 알레르기 수</p>
          <p className="text-gray-900 font-bold text-xl">{summary.avgAllergyPerUser}개</p>
          <p className="text-gray-600 mt-1 text-sm">사용자당</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 flex flex-col">
          <h3 className="text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">알레르기 유형별 분포</h3>
          
          {/* 차트 영역 */}
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allergyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false} // 여기를 false로 바꿔서 외부 라벨 제거
                  outerRadius={isMobile ? 80 : 100} // 모바일에서 원 크기 적절히 조정
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {allergyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value, name) => [`${value}명`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 하단 텍스트 범례 */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
            {allergyData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 truncate">{item.name}</span>
                <span className="text-gray-900 font-medium ml-auto">
                   {totalAllergies > 0 ? ((item.value / totalAllergies) * 100).toFixed(0) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart - Age Groups */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">연령대별 알레르기 등록자</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={ageGroupData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="age" stroke="#6b7280" />
              <YAxis width={40} stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Allergy List Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="p-6 border-b border-gray-200/50">
          <h3 className="text-gray-900 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">알레르기 상세 목록</h3>
        </div>
        
        {/* overflow-x-auto 제거: 스크롤 기능 삭제 */}
        <div className="w-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {/* whitespace-nowrap 제거: 글자가 길면 줄바꿈 허용 */}
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">알레르기 유형</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">사용자 수</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">비율</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allergyData.map((allergy, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: allergy.color }} />
                      <span className="text-gray-900 break-words">{allergy.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{allergy.value.toLocaleString()}명</td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {totalAllergies > 0 ? ((allergy.value / totalAllergies) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}