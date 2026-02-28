
import React, { useState, useEffect } from 'react';
import { UserRole, User } from '../types';
import { supabase } from '../lib/supabase';

interface ProfileSetupProps {
  user: any; // Raw user from Supabase Auth
  onComplete: (updatedUser: User) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onComplete }) => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  // Efek untuk mendeteksi Role berdasarkan Email secara otomatis
  useEffect(() => {
    const email = user.email?.toLowerCase() || '';
    
    // Logika Deteksi:
    // 1. Jika ada kata 'guru' atau domain staf -> TEACHER
    // 2. Jika ada angka (NISN) atau kata 'siswa'/'student' -> STUDENT
    if (email.includes('guru') || email.includes('admin') || email.endsWith('sman3jkt.sch.id')) {
      setRole(UserRole.TEACHER);
      setIsAutoDetected(true);
    } else if (/\d/.test(email) || email.includes('siswa') || email.includes('student')) {
      setRole(UserRole.STUDENT);
      setIsAutoDetected(true);
    }
  }, [user.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !fullName) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          role: role,
          email: user.email,
          updated_at: new Date()
        });

      if (error) throw error;

      onComplete({
        id: user.id,
        name: fullName,
        email: user.email || '',
        role: role,
        avatar: `https://picsum.photos/seed/${user.id}/200`
      });
    } catch (error: any) {
      alert("Gagal menyimpan profil: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-teladan-navy flex items-center justify-center p-6">
      <div className="w-full max-w-xl p-10 md:p-14 rounded-[3.5rem] bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 text-center animate-fade-slide">
        <div className="w-20 h-20 bg-teladan-blue/10 text-teladan-blue rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
          <iconify-icon icon="solar:user-circle-bold-duotone" width="48"></iconify-icon>
          {isAutoDetected && (
            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 animate-bounce">
              <iconify-icon icon="solar:check-read-bold" width="16"></iconify-icon>
            </div>
          )}
        </div>
        
        <h2 className="text-3xl font-bold mb-2">Lengkapi Profil Anda</h2>
        <p className="text-slate-500 mb-10 font-medium">
          {isAutoDetected 
            ? `Sistem mendeteksi Anda sebagai ${role === UserRole.TEACHER ? 'Pengajar' : 'Siswa'}.` 
            : 'Selamat datang! Mohon lengkapi identitas Anda.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8 text-left">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Nama Lengkap</label>
            <input 
              type="text" 
              required
              placeholder="Masukkan nama lengkap sesuai absen"
              className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-teladan-blue font-bold transition-all text-slate-800 dark:text-white"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Pilih Peran Anda</label>
              {isAutoDetected && <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md">Terdeteksi Otomatis</span>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { setRole(UserRole.TEACHER); setIsAutoDetected(false); }}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${role === UserRole.TEACHER ? 'border-teladan-blue bg-blue-50 dark:bg-blue-900/20' : 'border-transparent bg-slate-50 dark:bg-slate-700 opacity-40 hover:opacity-100'}`}
              >
                <iconify-icon icon="solar:user-speak-bold-duotone" width="32" className={role === UserRole.TEACHER ? 'text-teladan-blue' : 'text-slate-400'}></iconify-icon>
                <span className={`font-bold ${role === UserRole.TEACHER ? 'text-teladan-blue' : 'text-slate-500'}`}>Pengajar</span>
              </button>
              
              <button
                type="button"
                onClick={() => { setRole(UserRole.STUDENT); setIsAutoDetected(false); }}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${role === UserRole.STUDENT ? 'border-teladan-red bg-red-50 dark:bg-red-900/20' : 'border-transparent bg-slate-50 dark:bg-slate-700 opacity-40 hover:opacity-100'}`}
              >
                <iconify-icon icon="solar:users-group-rounded-bold-duotone" width="32" className={role === UserRole.STUDENT ? 'text-teladan-red' : 'text-slate-400'}></iconify-icon>
                <span className={`font-bold ${role === UserRole.STUDENT ? 'text-teladan-red' : 'text-slate-500'}`}>Siswa</span>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !role || !fullName}
            className="w-full py-5 rounded-2xl bg-teladan-navy dark:bg-teladan-blue text-white font-bold text-lg shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-30 active:scale-95"
          >
            {isLoading ? <iconify-icon icon="solar:restart-bold-duotone" className="animate-spin" width="24"></iconify-icon> : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
