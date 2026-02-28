
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Course, AppNotification, Assignment, Submission } from '../types';
import { supabase } from '../lib/supabase';

// Fix: Added assignments, setAssignments, submissions, and setSubmissions to ClassroomProps to match the usage in App.tsx.
interface ClassroomProps {
  user: User;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  submissions: Submission[];
  setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
  addNotification: (title: string, message: string, type: AppNotification['type']) => void;
}

const Classroom: React.FC<ClassroomProps> = ({ 
  user, 
  courses, 
  setCourses, 
  assignments, 
  setAssignments, 
  submissions, 
  setSubmissions, 
  addNotification 
}) => {
  const [showAddClass, setShowAddClass] = useState(false);
  const [showJoinClass, setShowJoinClass] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [classCodeInput, setClassCodeInput] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Fungsi Mengambil Data (Fetch)
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (user.role === UserRole.TEACHER) {
        // Ambil kelas yang DIBUAT oleh guru ini
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } else {
        // Ambil kelas yang DIIKUTI oleh siswa ini via junction table
        const { data, error } = await supabase
          .from('course_enrollments')
          .select('courses (*)')
          .eq('student_id', user.id);

        if (error) throw error;
        
        const joinedData = data?.map((item: any) => item.courses).filter(Boolean) || [];
        setCourses(joinedData);
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setErrorMsg("Gagal memuat data kelas. Pastikan tabel database sudah dibuat.");
    } finally {
      setIsLoading(false);
    }
  }, [user.id, user.role, setCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // 2. Logika Buat Kelas (GURU)
  const handleCreateClass = async () => {
    if (!newClassName.trim()) return;
    setIsLoading(true);

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const colors = ['bg-teladan-blue', 'bg-teladan-red', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    try {
      const { error } = await supabase
        .from('courses')
        .insert([{
          name: newClassName,
          code: code,
          teacher_id: user.id,
          teacher_name: user.name,
          description: 'Kelas Akademik SMAN 3 Jakarta',
          color: randomColor
        }]);

      if (error) throw error;

      addNotification('Kelas Baru', `Berhasil membuat kelas ${newClassName}`, 'assignment');
      setNewClassName('');
      setShowAddClass(false);
      fetchCourses();
    } catch (err: any) {
      alert("Gagal membuat kelas: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Logika Gabung Kelas (SISWA)
  const handleJoinClass = async () => {
    if (classCodeInput.length < 6) return;
    setIsLoading(true);

    try {
      // Cari kelas
      const { data: course, error: findError } = await supabase
        .from('courses')
        .select('*')
        .eq('code', classCodeInput.toUpperCase())
        .single();

      if (findError || !course) {
        alert("Kode kelas tidak ditemukan. Silakan hubungi gurumu.");
        return;
      }

      // Daftar ke junction table
      const { error: enrollError } = await supabase
        .from('course_enrollments')
        .insert([{
          student_id: user.id,
          course_id: course.id
        }]);

      if (enrollError) {
        if (enrollError.code === '23505') alert("Anda sudah terdaftar di kelas ini.");
        else throw enrollError;
        return;
      }

      addNotification('Kelas Baru', `Berhasil bergabung di ${course.name}`, 'assignment');
      setClassCodeInput('');
      setShowJoinClass(false);
      fetchCourses();
    } catch (err: any) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedCourse) {
    return (
      <div className="space-y-4 md:space-y-6 animate-fade-slide">
        <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-teladan-blue transition-all text-sm">
          <iconify-icon icon="solar:alt-arrow-left-bold-duotone" width="20"></iconify-icon>
          Kembali
        </button>

        <div className={`p-6 md:p-10 rounded-3xl md:rounded-[3rem] ${selectedCourse.color} text-white shadow-xl relative overflow-hidden min-h-[160px] md:min-h-[240px] flex flex-col justify-end`}>
           <div className="relative z-10">
             <span className="bg-white/20 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] px-2 md:px-3 py-0.5 md:py-1 rounded-full mb-2 md:mb-4 inline-block">Mata Pelajaran</span>
             <h2 className="text-2xl md:text-5xl font-bold mb-1 md:mb-2 tracking-tight">{selectedCourse.name}</h2>
             <p className="text-sm md:text-xl opacity-80 font-medium">{selectedCourse.teacher_name}</p>
           </div>
           <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-3 md:p-6 rounded-2xl md:rounded-[2.5rem] text-center">
              <p className="text-[8px] md:text-[10px] font-bold uppercase opacity-60 mb-0.5 md:mb-1">Kode Akses</p>
              <p className="text-xl md:text-3xl font-mono font-bold tracking-tighter">{selectedCourse.code}</p>
           </div>
           <iconify-icon icon="solar:folder-bold-duotone" className="absolute -bottom-10 -left-10 opacity-10" width="200"></iconify-icon>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
           <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div className="bg-white dark:bg-slate-800 p-10 md:p-20 rounded-3xl md:rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700 text-center">
                 <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-50 dark:bg-slate-700 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 text-slate-300">
                    <iconify-icon icon="solar:ghost-bold-duotone" width="32"></iconify-icon>
                 </div>
                 <h3 className="text-lg md:text-xl font-bold text-slate-400">Belum Ada Aktivitas</h3>
                 <p className="text-xs md:text-sm text-slate-500 mt-1 md:mt-2">Semua tugas dan materi akan muncul di sini.</p>
              </div>
           </div>
           <div className="space-y-4 md:space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
                  <iconify-icon icon="solar:info-circle-bold-duotone" className="text-teladan-blue"></iconify-icon>
                  Deskripsi
                </h4>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">{selectedCourse.description}</p>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-slide">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-teladan-navy dark:text-white">Ruang Kelas</h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Manajemen belajar mengajar terpadu.</p>
        </div>
        
        <div className="flex gap-2 md:gap-3 w-full md:w-auto">
          {user.role === UserRole.TEACHER ? (
            <button onClick={() => setShowAddClass(true)} className="flex-1 md:flex-none bg-teladan-blue text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all text-sm">
              <iconify-icon icon="solar:add-circle-bold-duotone" width="20"></iconify-icon> 
              Buat Kelas
            </button>
          ) : (
            <button onClick={() => setShowJoinClass(true)} className="flex-1 md:flex-none bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-2 border-slate-100 dark:border-slate-700 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition-all text-sm">
              <iconify-icon icon="solar:key-minimalistic-bold-duotone" width="20" className="text-teladan-blue"></iconify-icon> 
              Gabung Kelas
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 md:py-32 flex flex-col items-center gap-3 md:gap-4">
           <iconify-icon icon="solar:restart-bold-duotone" className="animate-spin text-teladan-blue" width="40"></iconify-icon>
           <p className="font-bold text-slate-400 tracking-widest uppercase text-[10px]">Menyinkronkan...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-50 dark:bg-red-900/10 p-8 md:p-12 rounded-3xl md:rounded-[3rem] border border-red-100 dark:border-red-900/30 text-center">
           <iconify-icon icon="solar:danger-bold-duotone" width="48" className="text-red-400 mb-3"></iconify-icon>
           <h3 className="text-lg md:text-xl font-bold text-red-600">{errorMsg}</h3>
           <p className="text-red-500/70 mt-1 md:mt-2 text-xs">Pastikan Anda telah menjalankan SQL schema di dashboard Supabase.</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 md:p-24 rounded-3xl md:rounded-[3.5rem] border border-dashed border-slate-200 dark:border-slate-700 text-center">
           <iconify-icon icon="solar:folder-open-bold-duotone" width="60" className="text-slate-100 dark:text-slate-700 mb-4"></iconify-icon>
           <h3 className="text-xl md:text-2xl font-bold text-slate-400">Belum Ada Kelas</h3>
           <p className="text-xs md:text-sm text-slate-500 mt-1 md:mt-2 font-medium">Klik tombol di atas untuk memulai perjalanan akademik Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {courses.map(course => (
            <div 
              key={course.id} 
              onClick={() => setSelectedCourse(course)}
              className="group bg-white dark:bg-slate-800 rounded-3xl md:rounded-[3rem] border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
            >
              <div className={`h-24 md:h-32 ${course.color} p-4 md:p-8 flex justify-between items-start relative`}>
                 <div className="bg-white/20 backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold text-white uppercase tracking-widest">Aktif</div>
                 <div className="bg-white/20 backdrop-blur-md p-1.5 md:p-2 rounded-lg md:rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                   <iconify-icon icon="solar:settings-bold-duotone" width="16 md:20"></iconify-icon>
                 </div>
              </div>
              <div className="p-4 md:p-8">
                <h3 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1 group-hover:text-teladan-blue transition-colors line-clamp-1">{course.name}</h3>
                <p className="text-slate-400 text-[10px] md:text-sm font-bold mb-4 md:mb-8">{course.teacher_name}</p>
                
                <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-slate-50 dark:border-slate-700">
                  <div className="flex flex-col">
                    <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">Kode Kelas</span>
                    <span className="text-xs md:text-sm font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg">{course.code}</span>
                  </div>
                  <div className="flex -space-x-2 md:-space-x-3">
                    {[1,2,3].map(i => (
                      <img key={i} src={`https://picsum.photos/seed/${course.id+i}/100`} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 md:border-4 border-white dark:border-slate-800 shadow-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddClass && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-slate-800 w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative">
              <h3 className="text-2xl font-bold mb-2">Buat Kelas Baru</h3>
              <p className="text-slate-500 text-sm mb-8">Data akan tersimpan secara permanen di server sekolah.</p>
              <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase text-slate-400 px-1">Nama Mata Pelajaran</label>
                   <input 
                     type="text" 
                     placeholder="Misal: Biologi XI-MIPA 1" 
                     className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-teladan-blue font-bold text-lg"
                     value={newClassName}
                     onChange={(e) => setNewClassName(e.target.value)}
                     autoFocus
                   />
                 </div>
                 <div className="flex gap-3 pt-4">
                    <button onClick={() => setShowAddClass(false)} className="flex-1 py-5 font-bold text-slate-400 hover:text-slate-600 transition-colors">Batal</button>
                    <button 
                      onClick={handleCreateClass}
                      disabled={isLoading || !newClassName}
                      className="flex-[2] py-5 bg-teladan-blue text-white rounded-2xl font-bold shadow-xl shadow-blue-100 dark:shadow-none disabled:opacity-50"
                    >
                      {isLoading ? 'Menyimpan...' : 'Buat Kelas'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {showJoinClass && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-slate-800 w-full max-w-md p-12 rounded-[3.5rem] shadow-2xl relative text-center">
              <div className="w-20 h-20 bg-teladan-blue/10 text-teladan-blue rounded-3xl flex items-center justify-center mx-auto mb-8">
                 <iconify-icon icon="solar:key-minimalistic-bold-duotone" width="40"></iconify-icon>
              </div>
              <h3 className="text-2xl font-bold mb-2">Gabung Kelas</h3>
              <p className="text-slate-500 text-sm mb-10">Masukkan 6 digit kode akses yang diberikan oleh gurumu.</p>
              <div className="space-y-6">
                 <input 
                   type="text" 
                   placeholder="CODE" 
                   className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-[2rem] p-8 text-center text-4xl font-mono font-bold tracking-[0.4em] uppercase outline-none focus:ring-2 ring-teladan-blue"
                   value={classCodeInput}
                   onChange={(e) => setClassCodeInput(e.target.value)}
                   maxLength={6}
                   autoFocus
                 />
                 <div className="flex gap-3 pt-4">
                    <button onClick={() => setShowJoinClass(false)} className="flex-1 py-5 font-bold text-slate-400">Tutup</button>
                    <button 
                      onClick={handleJoinClass}
                      disabled={isLoading || classCodeInput.length < 6}
                      className="flex-[2] py-5 bg-teladan-blue text-white rounded-2xl font-bold shadow-xl disabled:opacity-50"
                    >
                      {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
