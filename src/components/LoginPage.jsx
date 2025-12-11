import { useState } from 'react';
import { Lock, Mail, Brain, Users, TrendingUp, Shield, ChevronRight } from 'lucide-react';
import logoImage from '/logo.png';

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email !== 'admin@gachon.ac.kr' || password !== '1234') {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      onLogin(email, password);
      setIsLoading(false);
    }, 1000);
  };

  const features = [
    {
      icon: Brain,
      title: 'AI 기반 분석',
      description: '머신러닝으로 식단을 정확하게 분석',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: '사용자 관리',
      description: '모든 사용자 데이터를 한눈에 관리',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: '실시간 통계',
      description: '서비스 전반의 인사이트 제공',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const stats = [
    { label: '총 사용자', value: '143' },
    { label: 'AI 정확도', value: '93.3%' },
    { label: '일일 기록', value: '259' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 flex items-center justify-center">
                <img src={logoImage} alt="쏙식 로고" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-white">쏙식 Admin</h1>
                <p className="text-white/80">AI 식단 추천 관리 시스템</p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-white mb-4">
                스마트한 건강 관리의 시작점
              </h2>
              <p className="text-white/90 text-lg">
                AI 기반 식단 추천 서비스를 효율적으로 관리하고
                <br />
                사용자 경험을 지속적으로 개선하세요.
              </p>
            </div>

            <div className="space-y-4 mb-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white mb-1">{feature.title}</h3>
                      <p className="text-white/80">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-white mb-1">{stat.value}</div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl p-2">
              <img src={logoImage} alt="쏙식 로고" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              쏙식 Admin
            </h1>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-gray-900 mb-2">관리자 로그인</h2>
              <p className="text-gray-600">
                관리자 계정으로 로그인하여 대시보드에 접속하세요
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  이메일
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white/50"
                    placeholder="admin@gachon.ac.kr"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white/50"
                    placeholder="••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                    로그인 상태 유지
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>로그인 중...</span>
                  </>
                ) : (
                  <>
                    <span>로그인</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-900 mb-1">보안 안내</p>
                <p className="text-blue-700">
                  이 페이지는 관리자 전용입니다.
                  <br />
                  승인된 관리자만 접근할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-600">
            <p>© 2025 쏙식 Admin. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}