
import React, { useState } from 'react';
import { User } from '../types';
import { NAV_ITEMS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  lang: 'id' | 'en';
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout, lang }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside className={`${isExpanded ? 'w-72' : 'w-20'} h-full bg-white dark:bg-teladan-navy border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-500 z-40 relative shadow-xl`}>
      <div className="p-4 flex flex-col items-center gap-6">
        {/* Logo Section */}
        <div className="flex items-center gap-4 w-full">
          <div className="w-12 h-12 flex items-center justify-center sonar-effect flex-shrink-0 text-teladan-red">
            <img 
              src="https://lh3.googleusercontent.com/d/1OjBe_s-XJKZ-44j1mk3FLocHg5JjzdMd" 
              alt="Tel-Finder Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          {isExpanded && (
            <div className="flex flex-col animate-fade-in">
              <span className="font-bold text-xl tracking-tight text-teladan-navy dark:text-white font-heading leading-none">
                Tel-Finder
              </span>
              <span className="font-bold text-[10px] tracking-[0.2em] text-teladan-blue font-heading uppercase mt-1">
                SMAN 3 JAKARTA
              </span>
            </div>
          )}
        </div>

        {/* Toggle Button (Three Dots) - Placed below Logo */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-teladan-blue flex items-center justify-center shadow-sm hover:bg-teladan-blue hover:text-white transition-all group ${isExpanded ? 'self-end' : ''}`}
          title={isExpanded ? "Collapse" : "Expand"}
        >
          <iconify-icon icon={isExpanded ? "solar:alt-arrow-left-bold" : "solar:menu-dots-bold"} width="24" className="group-hover:scale-110 transition-transform"></iconify-icon>
        </button>
      </div>

      {/* Navigation Content - Only visible when expanded */}
      <div className={`flex-1 flex flex-col transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <nav className="flex-1 px-4 mt-2 space-y-2 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-start gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 relative ${
                activeTab === item.id 
                  ? 'bg-teladan-blue text-white shadow-xl shadow-blue-100 dark:shadow-none' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-slate-800 hover:text-teladan-red'
              }`}
            >
              <iconify-icon icon={item.icon} width="26" className="flex-shrink-0"></iconify-icon>
              <span className="font-bold text-base whitespace-nowrap">
                {lang === 'id' ? item.label_id : item.label_en}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-start gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 ${
              activeTab === 'settings' 
                ? 'bg-teladan-navy text-white dark:bg-slate-700' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <iconify-icon icon="solar:settings-bold-duotone" width="26" className="flex-shrink-0"></iconify-icon>
            <span className="font-bold text-base whitespace-nowrap">
              {lang === 'id' ? 'Pengaturan' : 'Settings'}
            </span>
          </button>

          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-l-4 border-teladan-red">
            <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-slate-900 dark:text-white leading-none">{user.name}</p>
              <p className="text-[10px] text-teladan-blue mt-1 font-bold uppercase tracking-wider">{user.role}</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-start gap-3 px-5 py-4 rounded-2xl text-teladan-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold"
          >
            <iconify-icon icon="solar:logout-bold-duotone" width="24" className="flex-shrink-0"></iconify-icon>
            <span className="whitespace-nowrap">Log Keluar</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
