
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface SettingsProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  lang: 'id' | 'en';
  setLang: React.Dispatch<React.SetStateAction<'id' | 'en'>>;
}

const Settings: React.FC<SettingsProps> = ({ user, setUser, theme, setTheme, lang, setLang }) => {
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    nisn: user.nisn || '',
    class: user.class || ''
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name: profileData.name,
      email: profileData.email,
      nisn: profileData.nisn,
      class: profileData.class
    });
    alert(lang === 'id' ? 'Profil berhasil diperbarui!' : 'Profile updated successfully!');
  };

  const t = {
    profile: lang === 'id' ? 'Profil Pengguna' : 'User Profile',
    editInfo: lang === 'id' ? 'Edit Informasi Akun' : 'Edit Account Information',
    name: lang === 'id' ? 'Nama Lengkap' : 'Full Name',
    email: lang === 'id' ? 'Alamat Email' : 'Email Address',
    nisn: lang === 'id' ? (user.role === UserRole.TEACHER ? 'NIP/NIDN' : 'NISN') : (user.role === UserRole.TEACHER ? 'Employee ID' : 'Student ID'),
    class: lang === 'id' ? 'Kelas' : 'Class',
    save: lang === 'id' ? 'Simpan Perubahan' : 'Save Changes',
    appSettings: lang === 'id' ? 'Pengaturan Aplikasi' : 'App Settings',
    theme: lang === 'id' ? 'Mode Tampilan' : 'Appearance Mode',
    lang: lang === 'id' ? 'Bahasa Utama' : 'Primary Language',
    light: lang === 'id' ? 'Terang' : 'Light',
    dark: lang === 'id' ? 'Gelap' : 'Dark',
    indonesian: 'Bahasa Indonesia',
    english: 'English'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-slide pb-10">
      {/* Profile Section */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-10 shadow-sm">
        <div className="flex items-center gap-6 mb-10">
           <div className="relative group">
              <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-700 shadow-xl" />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <iconify-icon icon="solar:camera-bold-duotone" width="16"></iconify-icon>
              </button>
           </div>
           <div>
             <h2 className="text-2xl font-bold">{t.profile}</h2>
             <p className="text-slate-500 dark:text-slate-400 font-medium">{t.editInfo}</p>
           </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">{t.name}</label>
              <input 
                type="text" 
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl p-4 outline-none focus:ring-2 ring-sky-500 font-bold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">{t.email}</label>
              <input 
                type="email" 
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl p-4 outline-none focus:ring-2 ring-sky-500 font-bold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">{t.nisn}</label>
              <input 
                type="text" 
                value={profileData.nisn}
                onChange={(e) => setProfileData({...profileData, nisn: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl p-4 outline-none focus:ring-2 ring-sky-500 font-bold transition-all"
              />
            </div>
            {user.role === UserRole.STUDENT && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">{t.class}</label>
                <input 
                  type="text" 
                  value={profileData.class}
                  onChange={(e) => setProfileData({...profileData, class: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl p-4 outline-none focus:ring-2 ring-sky-500 font-bold transition-all"
                  placeholder="Misal: XI-A"
                />
              </div>
            )}
          </div>
          <button 
            type="submit"
            className="mt-4 bg-sky-500 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-sky-100 dark:shadow-none hover:bg-sky-600 transition-all hover:scale-[1.02]"
          >
            {t.save}
          </button>
        </form>
      </div>

      {/* App Settings Section */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-10 shadow-sm">
         <div className="flex items-center gap-4 mb-10">
           <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 text-sky-500 rounded-2xl flex items-center justify-center">
             <iconify-icon icon="solar:settings-bold-duotone" width="28"></iconify-icon>
           </div>
           <h2 className="text-2xl font-bold">{t.appSettings}</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Theme Toggle */}
            <div className="space-y-4">
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.theme}</p>
               <div className="flex bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl gap-2">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-800 shadow-sm text-sky-500' : 'text-slate-400'}`}
                  >
                    <iconify-icon icon="solar:sun-bold-duotone" width="20"></iconify-icon>
                    {t.light}
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-800 shadow-sm text-sky-500' : 'text-slate-400'}`}
                  >
                    <iconify-icon icon="solar:moon-bold-duotone" width="20"></iconify-icon>
                    {t.dark}
                  </button>
               </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-4">
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.lang}</p>
               <div className="flex bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl gap-2">
                  <button 
                    onClick={() => setLang('id')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${lang === 'id' ? 'bg-white dark:bg-slate-800 shadow-sm text-sky-500' : 'text-slate-400'}`}
                  >
                    🇮🇩 {t.indonesian}
                  </button>
                  <button 
                    onClick={() => setLang('en')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-800 shadow-sm text-sky-500' : 'text-slate-400'}`}
                  >
                    🇺🇸 {t.english}
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;
