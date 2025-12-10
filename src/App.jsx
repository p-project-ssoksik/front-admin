import { useState } from 'react';
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

export default function App() {
  const [currentSection, setCurrentSection] = useState('stats-service');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (email, password) => {
    console.log('Login attempt:', { email, password });
    setIsLoggedIn(true);
    setCurrentSection('ServiceStats'); // 로그인 시 화면을 'ServiceStats' 으로 초기화
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'stats-service':
        return <ServiceStats />;
      case 'stats-allergy':
        return <AllergyStats />;
      case 'stats-bloodsugar':
        return <BloodSugarStats />;
      case 'stats-popularfood':
        return <PopularFoodStats />;
      case 'stats-goals':
        return <GoalStats />;
      case 'stats-mealpattern':
        return <MealPatternStats />;
      case 'users-list':
        return <UserList />;
      case 'users-reports':
        return <ReportManagement />;
      default:
        return <ServiceStats />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Sidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          isLoggedIn={isLoggedIn}
          onLoginClick={() => {}}
          onLogoutClick={handleLogout}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}