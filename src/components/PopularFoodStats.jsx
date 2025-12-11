import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { TrendingUp, Star, Utensils, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const typeButtons = [
  { id: 'type1', label: '1형' },
  { id: 'type2', label: '2형' },
  { id: 'gestational', label: '임신성' },
  { id: 'prediabetes', label: '전단계' },
];

const TYPE_MAPPING = {
  '1형': 'type1',
  '2형': 'type2',
  '임신성': 'gestational',
  '전단계': 'prediabetes'
};

const createEmptyData = () => ({
  summary: { total: '0', topFood: '-', topCount: 0, favFood: '-', aiRate: '-' },
  recorded: [],
  favorites: []
});

export function PopularFoodStats() {
  const [activeType, setActiveType] = useState('type1');
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const processedData = {
          type1: createEmptyData(),
          type2: createEmptyData(),
          gestational: createEmptyData(),
          prediabetes: createEmptyData(),
        };

        const [historyRes, favoriteRes] = await Promise.all([
          axios.get('/management/foods/history'),
          axios.get('/management/foods/favorite')
        ]);
        
        if (historyRes.data.success && Array.isArray(historyRes.data.data)) {
          historyRes.data.data.forEach(item => {
            const typeName = item.diabetes_type ? item.diabetes_type.trim() : '';
            const typeKey = TYPE_MAPPING[typeName];
            
            if (!typeKey) return; 

            const recordedList = [];
            for (let i = 1; i <= 10; i++) {
              const record = item[`record_top_${i}`];
              if (Array.isArray(record) && record.length >= 2) {
                recordedList.push({ name: record[0], count: record[1] });
              }
            }
            const topFoodItem = recordedList[0] || { name: '-', count: 0 };
            
            let mockAiRate = '95.4%';
            if (typeKey === 'type1') mockAiRate = '95.1%';
            else if (typeKey === 'type2') mockAiRate = '91.5%';
            else if (typeKey === 'gestational') mockAiRate = '93.0%';

            processedData[typeKey].summary.total = item.food_record ? item.food_record.toLocaleString() : '0';
            processedData[typeKey].summary.topFood = topFoodItem.name;
            processedData[typeKey].summary.topCount = topFoodItem.count;
            processedData[typeKey].summary.aiRate = mockAiRate;
            processedData[typeKey].recorded = recordedList;
          });
        }

        if (favoriteRes.data.success && Array.isArray(favoriteRes.data.data)) {
          favoriteRes.data.data.forEach(item => {
             const rawType = item.diabetesType || item.diabetes_type;
             if (!rawType) return;

             const cleanType = rawType.trim();
             const typeKey = TYPE_MAPPING[cleanType];
             
             if (typeKey && processedData[typeKey]) {
                const top1Data = item.favoriteTop1 || item.favorite_top_1;
                if (Array.isArray(top1Data) && top1Data.length > 0) {
                    processedData[typeKey].summary.favFood = top1Data[0]; 
                }

                const favoriteList = [];
                for (let i = 1; i <= 5; i++) {
                  const favRecord = item[`favoriteTop${i}`] || item[`favorite_top_${i}`]; 
                  if (Array.isArray(favRecord) && favRecord.length >= 2) {
                    favoriteList.push({ name: favRecord[0], count: favRecord[1] });
                  }
                }
                processedData[typeKey].favorites = favoriteList;
             }
          });
        }

        setStatsData(processedData);

      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">데이터 분석 중...</div>;
  if (!statsData) return <div className="p-10 text-center text-red-500">데이터를 불러오지 못했습니다.</div>;

  const currentData = statsData[activeType] || createEmptyData();

  return (
    <div className="space-y-6">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">인기 음식/식단 통계</h2>
        <p className="text-gray-600 mb-6">사용자들이 가장 많이 기록하고 즐겨찾는 음식들을 분석합니다</p>

        <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-gray-200/50">

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {typeButtons.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}

                className={`flex-1 min-w-fit md:min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeType === type.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200'
                }`}
              >
                <span className="whitespace-nowrap">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="h-12 flex items-start gap-3 mb-2">
            <Utensils className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <p className="text-gray-600 leading-tight">등록된 음식</p>
          </div>
          <p className="text-gray-900 text-2xl font-bold">{currentData.summary.total}건</p>
          <p className="text-gray-600 mt-1 text-sm">누적 기록 수</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="h-12 flex items-start gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-gray-600 leading-tight">가장 인기 음식</p>
          </div>
          <p className="text-gray-900 text-xl font-bold truncate" title={currentData.summary.topFood}>
            {currentData.summary.topFood}
          </p>
          <p className="text-gray-600 mt-1 text-sm">{currentData.summary.topCount}회 기록</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="h-12 flex items-start gap-3 mb-2">
            <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <p className="text-gray-600 leading-tight">즐겨찾기 1위</p>
          </div>
          <p className="text-gray-900 text-xl font-bold truncate" title={currentData.summary.favFood}>
            {currentData.summary.favFood}
          </p>
          <p className="text-gray-600 mt-1 text-sm">최다 저장</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="h-12 flex items-start gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0" />
            <p className="text-gray-600 leading-tight">AI 추천 채택률</p>
          </div>
          <p className="text-gray-900 text-2xl font-bold">{currentData.summary.aiRate}</p>
          <p className="text-gray-600 mt-1 text-sm">맞춤형 식단</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
        <h3 className="text-gray-900 mb-4 font-bold text-lg">가장 많이 기록된 음식 TOP 10</h3>
        <ResponsiveContainer width="100%" height={400}>
          {currentData.recorded.length > 0 ? (
            <BarChart data={currentData.recorded} layout="vertical" margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#6b7280" 
                tick={{ fontSize: 10 }}
                width={75}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
              <Bar dataKey="count" fill="#f97316" radius={[0, 8, 8, 0]} barSize={20} />
            </BarChart>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              데이터가 없습니다.
            </div>
          )}
        </ResponsiveContainer>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2 font-bold text-lg">
          <Star className="w-5 h-5 text-yellow-500" />
          즐겨찾기 TOP 5
        </h3>
        <div className="space-y-3">
          {currentData.favorites.length > 0 ? (
            currentData.favorites.map((food, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                  index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                  'bg-gray-200'
                } text-white`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-[150px]">
                  <p className="text-gray-900 font-medium">{food.name}</p>
                  <p className="text-gray-600 text-sm">{food.count}명</p>
                </div>
                <div className="flex-[4] h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500" 
                    style={{ width: currentData.favorites[0].count > 0 ? `${(food.count / currentData.favorites[0].count) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
               즐겨찾기 데이터가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}