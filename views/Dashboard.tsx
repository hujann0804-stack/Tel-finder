
import React from 'react';
import { User, UserRole, Course, Assignment, RoomBooking, Submission } from '../types';

interface DashboardProps {
  user: User;
  courses: Course[];
  assignments: Assignment[];
  bookings: RoomBooking[];
  submissions: Submission[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, courses, assignments, bookings, submissions }) => {
  const userSubmissions = submissions.filter(s => s.studentId === user.id);
  const remainingAssignments = assignments.length - userSubmissions.length;

  const stats = [
    { 
      label: 'Kelas Aktif', 
      value: courses.length, 
      icon: 'solar:folder-bold-duotone', 
      color: 'text-teladan-blue', 
      bg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-950/30',
      show: true 
    },
    { 
      label: 'Sisa Tugas', 
      value: remainingAssignments < 0 ? 0 : remainingAssignments, 
      icon: 'solar:clipboard-list-bold-duotone', 
      color: 'text-teladan-red', 
      bg: 'bg-red-50',
      darkBg: 'dark:bg-red-950/30',
      show: user.role === UserRole.STUDENT
    },
    { 
      label: 'Peminjaman', 
      value: bookings.length, 
      icon: 'solar:key-minimalistic-square-bold-duotone', 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50',
      darkBg: 'dark:bg-emerald-950/30',
      show: true
    },
  ].filter(stat => stat.show);

  return (
    <div className="space-y-8 animate-fade-slide">
      {/* Stats Grid */}
      <div className={`grid grid-cols-1 ${user.role === UserRole.TEACHER ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-neutral-200 dark:border-slate-700 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
            <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.darkBg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
              <iconify-icon icon={stat.icon} width="36"></iconify-icon>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {user.role === UserRole.STUDENT && (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
               <iconify-icon icon="solar:book-bookmark-bold-duotone" className="text-teladan-blue"></iconify-icon>
               Mata Pelajaran Anda
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.length > 0 ? courses.map((course) => (
                <div key={course.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group border border-transparent hover:border-teladan-blue dark:hover:border-teladan-blue">
                  <div className={`w-14 h-14 rounded-xl ${course.color} flex items-center justify-center text-white shadow-lg shadow-blue-100 dark:shadow-none`}>
                     <iconify-icon icon="solar:folder-bold-duotone" width="28"></iconify-icon>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold text-slate-800 dark:text-white truncate text-lg">{course.name}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wider">{course.code}</p>
                  </div>
                  <iconify-icon icon="solar:alt-arrow-right-bold-duotone" className="ml-auto opacity-0 group-hover:opacity-100 text-teladan-blue" width="24"></iconify-icon>
                </div>
              )) : (
                <div className="col-span-full text-center py-12 text-slate-400 dark:text-slate-500 font-bold bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  Belum ada mata pelajaran terdaftar.
                </div>
              )}
            </div>
            <button className="w-full mt-8 py-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-bold hover:border-teladan-blue hover:text-teladan-blue transition-all flex items-center justify-center gap-2">
              <iconify-icon icon="solar:add-circle-bold-duotone"></iconify-icon>
              Tambah Mata Pelajaran
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
