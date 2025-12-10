import { Target, TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

// 목표별 사용자 분포
const goalDistributionData = [
  { name: '체중 감량', value: 458, color: '#ef4444', percent: 52.7 },
  { name: '체중 증가', value: 187, color: '#3b82f6', percent: 21.5 },
  { name: '체중 유지', value: 225, color: '#10b981', percent: 25.9 },
];

// 목표별 달성률
const achievementData = [
  { goal: '체중 감량', achieved: 234, inProgress: 187, notAchieved: 37 },
  { goal: '체중 증가', achieved: 98, inProgress: 76, notAchieved: 13 },
  { goal: '체중 유지', achieved: 156, inProgress: 58, notAchieved: 11 },
];

// 기간별 목표 달성 추이
const monthlyAchievement = [
  { month: '6월', achieved: 45 },
  { month: '7월', achieved: 58 },
  { month: '8월', achieved: 67 },
  { month: '9월', achieved: 72 },
  { month: '10월', achieved: 85 },
  { month: '11월', achieved: 161 },
];

export function GoalStats() {
  const totalUsers = goalDistributionData.reduce((sum, item) => sum + item.value, 0);
  const totalAchieved = achievementData.reduce((sum, item) => sum + item.achieved, 0);
  const totalInProgress = achievementData.reduce((sum, item) => sum + item.inProgress, 0);
  const achievementRate = ((totalAchieved / totalUsers) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">건강 목표 분포 통계</h2>
        <p className="text-gray-600">사용자들의 목표 설정 및 달성 현황을 분석합니다</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-purple-500" />
            <p className="text-gray-600">전체 사용자</p>
          </div>
          <p className="text-gray-900">{totalUsers}명</p>
          <p className="text-gray-600 mt-1">목표 설정 완료</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-green-500" />
            <p className="text-gray-600">목표 달성</p>
          </div>
          <p className="text-gray-900">{totalAchieved}명</p>
          <p className="text-gray-600 mt-1">달성률 {achievementRate}%</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <p className="text-gray-600">진행중</p>
          </div>
          <p className="text-gray-900">{totalInProgress}명</p>
          <p className="text-gray-600 mt-1">목표 향해 노력중</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <p className="text-gray-600">가장 인기 목표</p>
          </div>
          <p className="text-gray-900">체중 감량</p>
          <p className="text-gray-600 mt-1">52.7%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 목표별 사용자 분포 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-gray-900 mb-4">목표별 사용자 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={goalDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {goalDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {goalDistributionData.map((item) => (
              <div key={item.name} className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200/50">
                <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
                <p className="text-gray-600 mb-1">{item.name}</p>
                <p className="text-gray-900">{item.value}명</p>
              </div>
            ))}
          </div>
        </div>

        {/* 목표별 달성률 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <h3 className="text-gray-900 mb-4">목표별 달성 현황</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={achievementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="goal" 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
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
              />
              <Legend />
              <Bar dataKey="achieved" stackId="a" fill="#10b981" name="달성" radius={[0, 0, 0, 0]} />
              <Bar dataKey="inProgress" stackId="a" fill="#3b82f6" name="진행중" radius={[0, 0, 0, 0]} />
              <Bar dataKey="notAchieved" stackId="a" fill="#ef4444" name="미달성" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 월별 목표 달성 추이 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
        <h3 className="text-gray-900 mb-4">월별 목표 달성 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyAchievement}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
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
              formatter={(value) => [`${value}명`, '달성자 수']}
            />
            <Bar dataKey="achieved" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 목표별 상세 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 shadow-lg border border-red-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">체중 감량</h3>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-gray-900 mb-2">458명 (52.7%)</p>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>달성</span>
              <span>{achievementData[0].achieved}명</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>진행중</span>
              <span>{achievementData[0].inProgress}명</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>미달성</span>
              <span>{achievementData[0].notAchieved}명</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-red-200">
            <p className="text-gray-600">달성률</p>
            <p className="text-gray-900">{((achievementData[0].achieved / goalDistributionData[0].value) * 100).toFixed(1)}%</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg border border-blue-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">체중 증가</h3>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-gray-900 mb-2">187명 (21.5%)</p>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>달성</span>
              <span>{achievementData[1].achieved}명</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>진행중</span>
              <span>{achievementData[1].inProgress}명</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>미달성</span>
              <span>{achievementData[1].notAchieved}명</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-gray-600">달성률</p>
            <p className="text-gray-900">{((achievementData[1].achieved / goalDistributionData[1].value) * 100).toFixed(1)}%</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">체중 유지</h3>
            <Minus className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-gray-900 mb-2">225명 (25.9%)</p>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>달성</span>
              <span>{achievementData[2].achieved}명</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>진행중</span>
              <span>{achievementData[2].inProgress}명</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>미달성</span>
              <span>{achievementData[2].notAchieved}명</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-gray-600">달성률</p>
            <p className="text-gray-900">{((achievementData[2].achieved / goalDistributionData[2].value) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}