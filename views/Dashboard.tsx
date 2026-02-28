
import React from 'react';
import { User, UserRole, Course, Assignment, Submission } from '../types';

interface DashboardProps {
  user: User;
  courses: Course[];
  assignments: Assignment[];
  bookings: any[]; 
  submissions: Submission[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, courses, assignments, submissions }) => {
  const userSubmissions = submissions.filter(s => s.studentId === user.id);
  const remainingAssignments = assignments.length - userSubmissions.length;

  const stats = [
    { 
      label: 'Kelas Aktif', 
      value: courses.length, 
      icon: 'solar:folder-bold-duotone', 
      color: 'text-white', 
      bg: 'bg-teladan-blue',
      show: true 
    },
    { 
      label: 'Tugas Belum Selesai', 
      value: remainingAssignments < 0 ? 0 : remainingAssignments, 
      icon: 'solar:clipboard-list-bold-duotone', 
      color: 'text-white', 
      bg: 'bg-teladan-red',
      show: user.role === UserRole.STUDENT
    },
    { 
      label: 'Total Siswa', 
      value: '1.200+', 
      icon: 'solar:users-group-rounded-bold-duotone', 
      color: 'text-white', 
      bg: 'bg-teladan-navy',
      show: user.role === UserRole.TEACHER
    },
  ].filter(stat => stat.show);

  return (
    <div className="space-y-8 animate-fade-slide">
      {/* Stats Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-${stats.length} gap-2 md:gap-6`}>
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.bg} p-2.5 md:p-8 rounded-xl md:rounded-[2rem] shadow-lg md:shadow-xl flex flex-col md:flex-row items-center md:items-center gap-1.5 md:gap-6 group hover:scale-[1.02] transition-all overflow-hidden`}>
            <div className={`w-7 h-7 md:w-16 md:h-16 rounded-lg md:rounded-2xl bg-white/20 flex items-center justify-center ${stat.color} group-hover:rotate-12 transition-transform shrink-0`}>
              <iconify-icon icon={stat.icon} className="text-base md:text-4xl"></iconify-icon>
            </div>
            <div className="text-center md:text-left min-w-0 flex-1 w-full">
              <p className="text-[8px] md:text-sm font-bold text-white/70 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">{stat.label}</p>
              <p className="text-base md:text-3xl font-bold text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white dark:bg-slate-800 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-teladan-navy dark:text-white flex items-center gap-2 md:gap-3">
             <iconify-icon icon="solar:book-bookmark-bold-duotone" className="text-teladan-blue"></iconify-icon>
             Mata Pelajaran Unggulan
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {courses.map((course) => (
              <div key={course.id} className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group border border-transparent hover:border-teladan-red overflow-hidden">
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl ${course.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                   <iconify-icon icon="solar:folder-bold-duotone" className="text-xl md:text-[28px]"></iconify-icon>
                </div>
                <div className="flex-1 min-w-0 text-center md:text-left w-full">
                   <h4 className="font-bold text-slate-800 dark:text-white truncate text-xs md:text-lg">{course.name}</h4>
                   <p className="text-[8px] md:text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wider truncate">{course.code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
