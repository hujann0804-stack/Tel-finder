
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

type LoginStep = 'role' | 'auth';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<LoginStep>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('auth');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
      if (selectedRole) {
        onLogin(selectedRole);
      }
      setIsLoading(false);
    }, 1500);
  };

  const renderRoleSelection = () => (
    <div className="space-y-4 animate-fade-slide">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Masuk Sebagai</p>
      
      <button 
        onClick={() => handleRoleSelect(UserRole.TEACHER)}
        className="w-full group flex items-center gap-5 p-5 rounded-[1.5rem] bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 hover:border-teladan-blue dark:hover:border-teladan-blue hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
          <iconify-icon icon="solar:user-speak-bold-duotone" width="32"></iconify-icon>
        </div>
        <div className="text-left flex-1">
          <p className="font-bold text-xl text-slate-900 dark:text-white">Pengajar / Staf</p>
          <p className="text-sm text-slate-500 font-medium">Kelola kelas, tugas & penjadwalan</p>
        </div>
        <iconify-icon icon="solar:alt-arrow-right-bold-duotone" className="text-slate-300 group-hover:text-teladan-blue group-hover:translate-x-2 transition-all" width="28"></iconify-icon>
      </button>

      <button 
        onClick={() => handleRoleSelect(UserRole.STUDENT)}
        className="w-full group flex items-center gap-5 p-5 rounded-[1.5rem] bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 hover:border-teladan-red dark:hover:border-teladan-red hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-teladan-blue dark:text-blue-400 group-hover:scale-110 transition-transform">
          <iconify-icon icon="solar:users-group-rounded-bold-duotone" width="32"></iconify-icon>
        </div>
        <div className="text-left flex-1">
          <p className="font-bold text-xl text-slate-900 dark:text-white">Siswa</p>
          <p className="text-sm text-slate-500 font-medium">Cek tugas, jadwal & pinjam ruang</p>
        </div>
        <iconify-icon icon="solar:alt-arrow-right-bold-duotone" className="text-slate-300 group-hover:text-teladan-red group-hover:translate-x-2 transition-all" width="28"></iconify-icon>
      </button>
    </div>
  );

  const renderAuthForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-slide text-left">
      <button 
        type="button"
        onClick={() => setStep('role')}
        className="flex items-center gap-2 text-slate-400 hover:text-teladan-blue font-bold text-sm transition-colors mb-4"
      >
        <iconify-icon icon="solar:alt-arrow-left-bold-duotone" width="20"></iconify-icon>
        Ganti Peran
      </button>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">
          {selectedRole === UserRole.TEACHER ? 'NIP / Email Instansi' : 'NISN / Email Siswa'}
        </label>
        <div className="relative">
          <iconify-icon icon="solar:user-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" width="24"></iconify-icon>
          <input 
            type="text" 
            required
            placeholder={selectedRole === UserRole.TEACHER ? "198XXXXX" : "005XXXXX"}
            className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 pl-14 outline-none focus:ring-2 ring-teladan-blue font-bold transition-all text-slate-800 dark:text-white"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Kata Sandi</label>
        <div className="relative">
          <iconify-icon icon="solar:lock-password-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" width="24"></iconify-icon>
          <input 
            type="password" 
            required
            placeholder="••••••••"
            className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 pl-14 outline-none focus:ring-2 ring-teladan-blue font-bold transition-all text-slate-800 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-teladan-blue focus:ring-teladan-blue" />
          <span className="text-sm font-bold text-slate-500">Ingat Saya</span>
        </label>
        <button type="button" className="text-sm font-bold text-teladan-blue hover:underline">Lupa Password?</button>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className={`w-full py-5 rounded-2xl bg-teladan-blue text-white font-bold text-lg shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-600 transition-all flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
      >
        {isLoading ? (
          <>
            <iconify-icon icon="solar:restart-bold-duotone" className="animate-spin" width="24"></iconify-icon>
            Memverifikasi...
          </>
        ) : (
          <>
            Masuk ke Tel-Finder
            <iconify-icon icon="solar:login-bold-duotone" width="24"></iconify-icon>
          </>
        )}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-teladan-navy flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teladan-blue/20 dark:bg-teladan-blue/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teladan-red/20 dark:bg-teladan-red/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="w-full max-w-lg p-12 rounded-[3rem] bg-white/80 dark:bg-slate-800/80 backdrop-blur-3xl shadow-2xl border border-white dark:border-slate-700 text-center animate-fade-slide relative z-10">
        <div className="w-32 h-32 mx-auto flex items-center justify-center mb-8">
          <img 
            src="https://upload.wikimedia.org/wikipedia/id/3/3a/Logo_SMAN_3_Jakarta.png" 
            alt="SMAN 3 Jakarta Logo" 
            className="w-full h-full object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-teladan-navy dark:text-white mb-2">Tel-Finder</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 px-6 font-medium">
          {step === 'role' 
            ? 'Pusat Monitoring Akademik SMAN 3 Jakarta.' 
            : `Selamat Datang Kembali, ${selectedRole === UserRole.TEACHER ? 'Bapak/Ibu Guru' : 'Siswa Teladan'}.`}
        </p>
        
        {step === 'role' ? renderRoleSelection() : renderAuthForm()}

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col items-center gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Atau masuk melalui</p>
          <button className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-50 transition-all">
            <iconify-icon icon="logos:google-icon" width="20"></iconify-icon>
            Google Authentication
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
