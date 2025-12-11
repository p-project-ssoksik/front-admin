import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

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

function MainLayout({ isLoggedIn, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

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

  const handleSectionChange = (section) => {
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
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Sidebar
        currentSection={getCurrentSection()}
        onSectionChange={handleSectionChange}
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
          <Routes>
            <Route path="/stats/service" element={<ServiceStats />} />
            <Route path="/stats/allergy" element={<AllergyStats />} />
            <Route path="/stats/bloodsugar" element={<BloodSugarStats />} />
            <Route path="/stats/popularfood" element={<PopularFoodStats />} />
            <Route path="/stats/goals" element={<GoalStats />} />
            <Route path="/stats/mealpattern" element={<MealPatternStats />} />
            <Route path="/users/list" element={<UserList />} />
            <Route path="/users/reports" element={<ReportManagement />} />
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
        <Route 
          path="/login" 
          element={
            isLoggedIn ? <Navigate to="/stats/service" /> : <LoginPage onLogin={handleLogin} />
          } 
        />
        
        <Route 
          path="/*" 
          element={<MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}