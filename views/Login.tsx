
import React, { useState } from 'react';
import { UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

type AuthMode = 'login' | 'register';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Konfirmasi pendaftaran telah dikirim ke email Anda!");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-teladan-navy flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teladan-blue/20 dark:bg-teladan-blue/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teladan-red/20 dark:bg-teladan-red/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="w-full max-w-lg p-10 md:p-12 rounded-[3rem] bg-white/80 dark:bg-slate-800/80 backdrop-blur-3xl shadow-2xl border border-white dark:border-slate-700 text-center animate-fade-slide relative z-10">
        <div className="w-20 h-20 mx-auto flex items-center justify-center mb-6">
          <img 
            src="https://lh3.googleusercontent.com/d/1OjBe_s-XJKZ-44j1mk3FLocHg5JjzdMd" 
            alt="Tel-Finder Logo" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-teladan-navy dark:text-white mb-1">Tel-Finder</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 font-medium">
          Sistem Monitoring Akademik Terpadu SMAN 3 Jakarta.
        </p>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3">
             <iconify-icon icon="solar:danger-bold-duotone" width="20"></iconify-icon>
             {errorMessage}
          </div>
        )}

        <form onSubmit={handleAuthAction} className="space-y-5 text-left">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Email Sekolah</label>
            <div className="relative">
              <iconify-icon icon="solar:letter-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" width="24"></iconify-icon>
              <input 
                type="email" 
                required
                placeholder="email@student.id"
                className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-5 pl-14 outline-none focus:ring-2 ring-teladan-blue font-bold transition-all text-slate-800 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="w-full bg-slate-50 dark:bg-slate-700/50 border-none rounded-2xl p-5 pl-14 outline-none focus:ring-2 ring-teladan-blue font-bold transition-all text-slate-800 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 py-5 rounded-2xl bg-teladan-blue text-white font-bold text-lg shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isLoading ? (
              <iconify-icon icon="solar:restart-bold-duotone" className="animate-spin" width="24"></iconify-icon>
            ) : (
              <>
                {authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}
                <iconify-icon icon="solar:login-bold-duotone" width="24"></iconify-icon>
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 flex items-center justify-center gap-2">
           <p className="text-sm text-slate-400 font-medium">
             {authMode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
           </p>
           <button 
             onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
             className="text-sm font-bold text-teladan-blue hover:underline"
           >
             {authMode === 'login' ? 'Daftar' : 'Masuk'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
