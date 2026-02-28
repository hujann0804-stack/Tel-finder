
import React from 'react';
import { NAV_ITEMS } from '../constants';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'id' | 'en';
}

const MobileNav: React.FC<MobileNavProps & { onLogout: () => void }> = ({ activeTab, setActiveTab, lang, onLogout }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-teladan-navy/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-4 py-3 md:px-10 flex items-center justify-around z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 ${
            activeTab === item.id 
              ? 'text-teladan-blue scale-110' 
              : 'text-slate-400 dark:text-slate-500 hover:text-teladan-blue'
          }`}
        >
          <iconify-icon icon={item.icon} width="24"></iconify-icon>
          <span className="text-[10px] font-bold whitespace-nowrap hidden sm:block">
            {lang === 'id' ? item.label_id : item.label_en}
          </span>
        </button>
      ))}
      <button
        onClick={() => setActiveTab('settings')}
        className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 ${
          activeTab === 'settings' 
            ? 'text-teladan-blue scale-110' 
            : 'text-slate-400 dark:text-slate-500 hover:text-teladan-blue'
        }`}
      >
        <iconify-icon icon="solar:settings-bold-duotone" width="24"></iconify-icon>
        <span className="text-[10px] font-bold whitespace-nowrap hidden sm:block">
          {lang === 'id' ? 'Pengaturan' : 'Settings'}
        </span>
      </button>
      <button
        onClick={onLogout}
        className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-teladan-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
      >
        <iconify-icon icon="solar:logout-bold-duotone" width="24"></iconify-icon>
        <span className="text-[10px] font-bold whitespace-nowrap hidden sm:block">
          {lang === 'id' ? 'Keluar' : 'Logout'}
        </span>
      </button>
    </div>
  );
};

export default MobileNav;
