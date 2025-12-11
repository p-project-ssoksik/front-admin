import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'; // 라우터 기능 불러오기

// 컴포넌트들
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { UserList } from './components/UserList';
import { ServiceStats } from './components/ServiceStats';
import { AllergyStats } from './components/AllergyStats';
import { BloodSugarStats } from './components/BloodSugarStats';
import { PopularFoodStats } from './components/PopularFoodStats';
import { GoalStats } from './components/GoalStats';
import { MealPatternStats } from './components/MealPatternStats';
import { ReportManagement } from './components/ReportManagement';
import { LoginPage } from './components/LoginPage';

// 내부 컨텐츠를 감싸는 컴포넌트 (로그인 상태에서만 보임)
function MainLayout({ isLoggedIn, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const location = useLocation(); // 현재 주소를 알아내는 훅

  // 로그인이 안 되어 있으면 로그인 페이지로 튕겨내기
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  // 현재 주소(URL)를 기반으로 사이드바에 '어떤 메뉴가 선택됐는지' 알려줌
  // 예: /stats/allergy -> 'stats-allergy' 로 변환 (Sidebar가 기존 방식을 쓴다고 가정)
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === '/stats/service') return 'stats-service';
    if (path === '/stats/allergy') return 'stats-allergy';
    if (path === '/stats/bloodsugar') return 'stats-bloodsugar';
    if (path === '/stats/popularfood') return 'stats-popularfood';
    if (path === '/stats/goals') return 'stats-goals';
    if (path === '/stats/mealpattern') return 'stats-mealpattern';
    if (path === '/users/list') return 'users-list';
    if (path === '/users/reports') return 'users-reports';
    return 'stats-service';
  };

  // 사이드바에서 메뉴를 클릭했을 때 실행될 함수
  const handleSectionChange = (section) => {
    // 기존의 setSection 대신 navigate로 주소를 바꿈!
    switch (section) {
      case 'stats-service': navigate('/stats/service'); break;
      case 'stats-allergy': navigate('/stats/allergy'); break;
      case 'stats-bloodsugar': navigate('/stats/bloodsugar'); break;
      case 'stats-popularfood': navigate('/stats/popularfood'); break;
      case 'stats-goals': navigate('/stats/goals'); break;
      case 'stats-mealpattern': navigate('/stats/mealpattern'); break;
      case 'users-list': navigate('/users/list'); break;
      case 'users-reports': navigate('/users/reports'); break;
      default: navigate('/stats/service');
    }
    // 모바일에서 사이드바 닫기
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Sidebar
        currentSection={getCurrentSection()} // 현재 주소에 맞는 메뉴 하이라이트
        onSectionChange={handleSectionChange} // 클릭 시 URL 변경 함수 실행
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          isLoggedIn={isLoggedIn}
          onLoginClick={() => {}}
          onLogoutClick={onLogout}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {/* 여기가 핵심! 주소에 따라 컴포넌트가 바뀝니다 */}
          <Routes>
            <Route path="/stats/service" element={<ServiceStats />} />
            <Route path="/stats/allergy" element={<AllergyStats />} />
            <Route path="/stats/bloodsugar" element={<BloodSugarStats />} />
            <Route path="/stats/popularfood" element={<PopularFoodStats />} />
            <Route path="/stats/goals" element={<GoalStats />} />
            <Route path="/stats/mealpattern" element={<MealPatternStats />} />
            <Route path="/users/list" element={<UserList />} />
            <Route path="/users/reports" element={<ReportManagement />} />
            {/* 이상한 주소로 오면 서비스 통계로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/stats/service" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (email, password) => {
    console.log('Login attempt:', { email, password });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 */}
        <Route 
          path="/login" 
          element={
            isLoggedIn ? <Navigate to="/stats/service" /> : <LoginPage onLogin={handleLogin} />
          } 
        />
        
        {/* 메인 레이아웃 (로그인 필요한 페이지들) */}
        <Route 
          path="/*" 
          element={<MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}