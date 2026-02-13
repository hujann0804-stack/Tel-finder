
import React from 'react';
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
  return (
    <aside className="w-20 md:w-72 h-full bg-white dark:bg-teladan-navy border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 z-40">
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center sonar-effect flex-shrink-0">
          <img 
            src="https://upload.wikimedia.org/wikipedia/id/3/3a/Logo_SMAN_3_Jakarta.png" 
            alt="SMAN 3 Jakarta Logo" 
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
        <div className="hidden md:flex flex-col">
          <span className="font-bold text-xl tracking-tight text-teladan-navy dark:text-white font-[Comfortaa] leading-none">
            Tel
          </span>
          <span className="font-bold text-sm tracking-widest text-teladan-blue font-[Comfortaa] uppercase">
            Finder
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 relative ${
              activeTab === item.id 
                ? 'bg-teladan-blue text-white shadow-xl shadow-blue-100 dark:shadow-none translate-x-1' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-teladan-blue'
            }`}
          >
            <iconify-icon icon={item.icon} width="26"></iconify-icon>
            <span className="hidden md:block font-bold text-base">{lang === 'id' ? item.label_id : item.label_en}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 ${
            activeTab === 'settings' 
              ? 'bg-teladan-red text-white shadow-xl' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-slate-800'
          }`}
        >
          <iconify-icon icon="solar:settings-bold-duotone" width="26"></iconify-icon>
          <span className="hidden md:block font-bold text-base">{lang === 'id' ? 'Pengaturan' : 'Settings'}</span>
        </button>

        <div className="hidden md:flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate text-slate-900 dark:text-white leading-none">{user.name}</p>
            <p className="text-xs text-teladan-blue mt-1 font-bold uppercase tracking-wider">{user.role}</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-teladan-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold hover:scale-95"
        >
          <iconify-icon icon="solar:logout-bold-duotone" width="24"></iconify-icon>
          <span className="hidden md:block">{lang === 'id' ? 'Log Keluar' : 'Log Out'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
