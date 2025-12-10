import { useState } from 'react';
import { Users, BarChart3, Shield, X, ChevronDown, ChevronRight } from 'lucide-react';
import { PieChart, Activity, Utensils, Clock, AlertTriangle } from 'lucide-react';

export function Sidebar({ currentSection, onSectionChange, isOpen, onClose }) {
  const [expandedMenu, setExpandedMenu] = useState('stats');

  const mainMenuItems = [
    { 
      id: 'stats', 
      label: '대시보드', 
      icon: BarChart3, 
      color: 'from-blue-500 to-cyan-500',
      subItems: [
        { id: 'stats-service', label: '서비스 통계', icon: BarChart3 },
        { id: 'stats-allergy', label: '알레르기', icon: PieChart },
        { id: 'stats-bloodsugar', label: '혈당 관리', icon: Activity },
        { id: 'stats-popularfood', label: '인기 음식', icon: Utensils },
        { id: 'stats-mealpattern', label: '식사 패턴', icon: Clock },
      ]
    },
    { 
      id: 'users', 
      label: '사용자 관리', 
      icon: Users, 
      color: 'from-purple-500 to-pink-500',
      subItems: [
        { id: 'users-list', label: '사용자 리스트', icon: Users },
        { id: 'users-reports', label: '신고 관리', icon: AlertTriangle },
      ]
    },
  ];

  const handleMainMenuClick = (menuId) => {
    if (expandedMenu === menuId) {
      setExpandedMenu('');
    } else {
      setExpandedMenu(menuId);
    }
  };

  const handleSubMenuClick = (section) => {
    onSectionChange(section);
    onClose();
  };

  const isMenuExpanded = (menuId) => expandedMenu === menuId;
   
  const isSubMenuActive = (item) => {
    if (currentSection.startsWith(item.id)) return true;
    
    if (item.subItems && item.subItems.some(sub => sub.id === currentSection)) {
      return true;
    }
    
    return false;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50
          transform transition-transform duration-300 ease-in-out
          shadow-xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <h2 className="text-gray-900">메뉴</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 88px)' }}>
          <ul className="space-y-2">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = isMenuExpanded(item.id);
              const isActive = isSubMenuActive(item);

              return (
                <li key={item.id}>
                  {/* 메인 메뉴 */}
                  <button
                    onClick={() => handleMainMenuClick(item.id)}
                    className={`
                      w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                      transition-all duration-300
                      ${
                        isActive
                          ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100/80'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>

                  {/* 서브 메뉴 */}
                  {isExpanded && item.subItems && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = currentSection === subItem.id;

                        return (
                          <li key={subItem.id}>
                            <button
                              onClick={() => handleSubMenuClick(subItem.id)}
                              className={`
                                w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                                transition-all duration-200
                                ${
                                  isSubActive
                                    ? 'bg-white text-gray-900 shadow-sm font-medium'
                                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                                }
                              `}
                            >
                              <SubIcon className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm whitespace-nowrap">{subItem.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}