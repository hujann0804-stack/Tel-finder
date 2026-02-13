
import React, { useState } from 'react';
import { User, UserRole, Course, Assignment, Submission, AppNotification } from '../types';

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

const Classroom: React.FC<ClassroomProps> = ({ user, courses, setCourses, assignments, setAssignments, submissions, setSubmissions, addNotification }) => {
  const [showAddClass, setShowAddClass] = useState(false);
  const [showJoinClass, setShowJoinClass] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [classCodeInput, setClassCodeInput] = useState('');
  
  // Teachers state
  const [newClassName, setNewClassName] = useState('');

  const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCreateClass = () => {
    if (!newClassName) return;
    const newCourse: Course = {
      id: Date.now().toString(),
      name: newClassName,
      code: generateCode(),
      teacherId: user.id,
      teacherName: user.name,
      description: 'Kelas Baru',
      color: 'bg-indigo-500'
    };
    setCourses([...courses, newCourse]);
    setNewClassName('');
    setShowAddClass(false);
    addNotification('Kelas Dibuat', `Anda telah membuat kelas baru: ${newClassName}`, 'assignment');
  };

  const handleJoinClass = () => {
    alert(`Mencoba bergabung dengan kode: ${classCodeInput}`);
    setShowJoinClass(false);
    setClassCodeInput('');
  };

  const handleAddAssignment = (courseId: string) => {
    const title = prompt("Judul Tugas:");
    if (!title) return;
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      courseId,
      title,
      description: 'Silakan kerjakan instruksi yang diberikan di kelas.',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      totalPoints: 100
    };
    setAssignments([...assignments, newAssignment]);
    addNotification('Tugas Baru', `Tugas "${title}" telah diposting di kelas.`, 'assignment');
  };

  const handleSubmitTask = (assignmentId: string) => {
    const content = prompt("Masukkan link tugas atau deskripsi:");
    if (!content) return;
    const newSubmission: Submission = {
      id: Date.now().toString(),
      assignmentId,
      studentId: user.id,
      studentName: user.name,
      content,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      grade: Math.floor(Math.random() * 21) + 80 // Mock random grade between 80-100
    };
    setSubmissions([...submissions, newSubmission]);
    alert("Tugas berhasil dikirim!");
    addNotification('Tugas Terkirim', `Tugas Anda telah diterima oleh pengajar.`, 'submission');
  };

  if (selectedCourse) {
    const courseAssignments = assignments.filter(a => a.courseId === selectedCourse.id);
    return (
      <div className="space-y-6 animate-fade-slide">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-teladan-blue transition-colors"
        >
          <iconify-icon icon="solar:alt-arrow-left-bold-duotone" width="24"></iconify-icon>
          Kembali ke Daftar Kelas
        </button>

        <div className={`p-8 rounded-[2.5rem] ${selectedCourse.color} text-white shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-6`}>
           <div>
             <h2 className="text-4xl font-bold mb-2">{selectedCourse.name}</h2>
             <p className="opacity-90 flex items-center gap-2 font-medium">
               <iconify-icon icon="solar:user-bold-duotone"></iconify-icon>
               {selectedCourse.teacherName}
             </p>
           </div>
           <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/20">
             <p className="text-xs uppercase font-bold tracking-widest opacity-80 mb-1">Kode Kelas</p>
             <p className="text-2xl font-mono font-bold">{selectedCourse.code}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Daftar Tugas</h3>
              {user.role === UserRole.TEACHER && (
                <button 
                  onClick={() => handleAddAssignment(selectedCourse.id)}
                  className="bg-teladan-blue text-white px-6 py-2 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 transition-transform"
                >
                  <iconify-icon icon="solar:add-circle-bold-duotone" width="20"></iconify-icon>
                  Buat Tugas
                </button>
              )}
            </div>
            
            {courseAssignments.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 text-center">
                <iconify-icon icon="solar:document-add-bold-duotone" width="64" className="text-slate-300 mb-4"></iconify-icon>
                <p className="text-slate-400 font-bold">Belum ada tugas yang dibagikan.</p>
              </div>
            ) : (
              courseAssignments.map(task => {
                const isSubmitted = submissions.some(s => s.assignmentId === task.id && s.studentId === user.id);
                const taskSubmissions = submissions.filter(s => s.assignmentId === task.id);

                return (
                  <div key={task.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-neutral-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-teladan-blue">
                      <iconify-icon icon="solar:clipboard-text-bold-duotone" width="32"></iconify-icon>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-1">{task.title}</h4>
                      <p className="text-slate-500 text-sm mb-4">{task.description}</p>
                      <div className="flex flex-wrap gap-4 items-center">
                        <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase bg-slate-50 dark:bg-slate-700 px-3 py-1 rounded-full">
                          <iconify-icon icon="solar:calendar-date-bold-duotone"></iconify-icon>
                          Batas: {task.dueDate}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase bg-slate-50 dark:bg-slate-700 px-3 py-1 rounded-full">
                          <iconify-icon icon="solar:star-bold-duotone"></iconify-icon>
                          {task.totalPoints} Poin
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {user.role === UserRole.STUDENT ? (
                        isSubmitted ? (
                          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-6 py-2 rounded-2xl font-bold flex items-center gap-2">
                            <iconify-icon icon="solar:check-circle-bold-duotone" width="20"></iconify-icon>
                            Selesai
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleSubmitTask(task.id)}
                            className="bg-teladan-blue text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-600 transition-colors"
                          >
                            Kirim Tugas
                          </button>
                        )
                      ) : (
                        <button className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 px-6 py-2 rounded-2xl font-bold hover:bg-slate-200 transition-colors">
                          Lihat {taskSubmissions.length} Pengumpulan
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm">
               <h3 className="text-xl font-bold mb-6">Informasi Kelas</h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                     <iconify-icon icon="solar:users-group-rounded-bold-duotone" width="20"></iconify-icon>
                   </div>
                   <div>
                     <p className="text-xs text-slate-400 font-bold uppercase">Siswa Terdaftar</p>
                     <p className="font-bold">24 Siswa</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                     <iconify-icon icon="solar:notebook-bold-duotone" width="20"></iconify-icon>
                   </div>
                   <div>
                     <p className="text-xs text-slate-400 font-bold uppercase">Materi Dibagikan</p>
                     <p className="font-bold">12 Modul</p>
                   </div>
                 </div>
               </div>
            </div>
            {/* Fitur Rekap Nilai telah dihapus dari sini untuk menyederhanakan tampilan */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-slide">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Kelas yang Diikuti</h2>
        <div className="flex items-center gap-3">
          {user.role === UserRole.TEACHER ? (
            <button 
              onClick={() => setShowAddClass(true)}
              className="bg-teladan-blue text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 transition-all"
            >
              <iconify-icon icon="solar:add-circle-bold-duotone" width="24"></iconify-icon>
              Buat Kelas
            </button>
          ) : (
            <button 
              onClick={() => setShowJoinClass(true)}
              className="bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-neutral-200 dark:border-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
            >
              <iconify-icon icon="solar:key-minimalistic-bold-duotone" width="24" className="text-teladan-blue"></iconify-icon>
              Gabung Kelas
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div 
            key={course.id} 
            onClick={() => setSelectedCourse(course)}
            className="group relative bg-white dark:bg-slate-800 rounded-[2rem] border border-neutral-200 dark:border-slate-700 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`h-24 ${course.color} relative overflow-hidden`}>
              <div className="absolute top-[-20%] right-[-10%] opacity-20">
                <iconify-icon icon="solar:folder-bold-duotone" width="120"></iconify-icon>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-teladan-blue transition-colors">{course.name}</h3>
                  <p className="text-slate-500 text-sm font-bold">{course.teacherName}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-xl text-slate-400">
                   <iconify-icon icon="solar:settings-bold-duotone" width="20"></iconify-icon>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Kode: {course.code}</span>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/${course.id+i}/100`} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800" />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold">+21</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddClass(false)}></div>
           <div className="relative bg-white dark:bg-slate-800 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-fade-slide">
              <h3 className="text-2xl font-bold mb-6">Buat Kelas Baru</h3>
              <input 
                type="text" 
                placeholder="Nama Mata Pelajaran" 
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-4 mb-4 outline-none focus:ring-2 ring-teladan-blue"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
              <div className="flex gap-4">
                <button onClick={() => setShowAddClass(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-500">Batal</button>
                <button onClick={handleCreateClass} className="flex-1 py-4 bg-teladan-blue text-white rounded-2xl font-bold shadow-lg shadow-blue-100">Simpan</button>
              </div>
           </div>
        </div>
      )}

      {showJoinClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowJoinClass(false)}></div>
           <div className="relative bg-white dark:bg-slate-800 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-fade-slide">
              <h3 className="text-2xl font-bold mb-2">Gabung Kelas</h3>
              <p className="text-slate-500 text-sm mb-6">Masukkan kode kelas yang dibagikan oleh gurumu.</p>
              <input 
                type="text" 
                placeholder="X6A7B2" 
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-4 mb-4 text-center text-3xl font-mono uppercase font-bold tracking-widest outline-none focus:ring-2 ring-teladan-blue"
                value={classCodeInput}
                onChange={(e) => setClassCodeInput(e.target.value)}
              />
              <div className="flex gap-4">
                <button onClick={() => setShowJoinClass(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-500">Batal</button>
                <button onClick={handleJoinClass} className="flex-1 py-4 bg-teladan-blue text-white rounded-2xl font-bold shadow-lg shadow-blue-100">Gabung</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
