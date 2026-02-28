
import React, { useState } from 'react';
import { RoomBooking } from '../types';

interface CalendarViewProps {
  bookings: RoomBooking[];
}

type FilterType = 'all' | 'academic' | 'sarpras';
type GradeType = 'X' | 'XI' | 'XII' | 'All';

const CalendarView: React.FC<CalendarViewProps> = ({ bookings }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedGrade, setSelectedGrade] = useState<GradeType>('All');
  
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const today = new Date();

  // Mock data akademik dengan kategori jenjang kelas
  const academicEvents = [
    { date: 12, title: 'UTS Matematika', grade: 'All', type: 'exam' },
    { date: 15, title: 'Praktikum Kimia', grade: 'XI', type: 'assignment' },
    { date: 18, title: 'Sosialisasi PTN', grade: 'XII', type: 'info' },
    { date: 20, title: 'Field Trip Sejarah', grade: 'X', type: 'activity' },
    { date: 22, title: 'Rapat Koordinasi Guru', grade: 'All', type: 'meeting' },
    { date: 25, title: 'Try Out Nasional', grade: 'XII', type: 'exam' },
    { date: 28, title: 'Hari Sumpah Pemuda', grade: 'All', type: 'holiday' },
  ];

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'X': return 'bg-sky-500';
      case 'XI': return 'bg-emerald-500';
      case 'XII': return 'bg-teladan-red';
      default: return 'bg-teladan-blue';
    }
  };

  const getGradeLabel = (grade: string) => {
    if (grade === 'All') return 'Umum';
    return `Kelas ${grade}`;
  };

  return (
    <div className="space-y-8 animate-fade-slide">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 md:gap-6">
        <div className="space-y-1 md:space-y-2">
          <h2 className="text-xl md:text-3xl font-bold text-teladan-navy dark:text-white tracking-tight">Agenda & Monitoring</h2>
          <p className="text-xs md:text-slate-500 font-medium text-slate-400">Oktober 2023 • SMAN 3 Jakarta</p>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 w-full lg:w-auto">
          {/* Main Category Filter */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 md:p-1.5 rounded-xl md:rounded-2xl flex gap-0.5 md:gap-1 border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`flex-1 sm:flex-none px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-white dark:bg-slate-700 text-teladan-blue shadow-sm' : 'text-slate-400'}`}
            >
              Semua
            </button>
            <button 
              onClick={() => setActiveFilter('academic')}
              className={`flex-1 sm:flex-none px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all ${activeFilter === 'academic' ? 'bg-white dark:bg-slate-700 text-teladan-blue shadow-sm' : 'text-slate-400'}`}
            >
              Akademik
            </button>
            <button 
              onClick={() => setActiveFilter('sarpras')}
              className={`flex-1 sm:flex-none px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all ${activeFilter === 'sarpras' ? 'bg-white dark:bg-slate-700 text-teladan-blue shadow-sm' : 'text-slate-400'}`}
            >
              Sarpras
            </button>
          </div>

          {/* Grade Sub-filter (Only shown if academic or all is active) */}
          {(activeFilter === 'all' || activeFilter === 'academic') && (
            <div className="bg-slate-100 dark:bg-slate-800 p-1 md:p-1.5 rounded-xl md:rounded-2xl flex gap-0.5 md:gap-1 border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
              {['All', 'X', 'XI', 'XII'].map((g) => (
                <button 
                  key={g}
                  onClick={() => setSelectedGrade(g as GradeType)}
                  className={`flex-1 sm:flex-none px-2 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all ${selectedGrade === g ? 'bg-white dark:bg-slate-700 text-teladan-red shadow-sm' : 'text-slate-400'}`}
                >
                  {g === 'All' ? 'Semua' : g}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legend Area */}
      <div className="flex flex-wrap gap-3 md:gap-6 px-1 md:px-2">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-sky-500"></span>
          <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Kelas X</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-500"></span>
          <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Kelas XI</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-teladan-red"></span>
          <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Kelas XII</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-teladan-blue"></span>
          <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Umum</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 border-l border-slate-200 dark:border-slate-700 pl-3 md:pl-6">
          <iconify-icon icon="solar:buildings-bold" className="text-slate-300 md:w-[14px]" width="12"></iconify-icon>
          <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Sarpras</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-800 p-3 md:p-8 rounded-2xl md:rounded-[3rem] border border-neutral-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 gap-1 md:gap-4">
          {days.map(day => (
            <div key={day} className="text-center font-bold text-slate-400 text-[8px] md:text-xs py-2 md:py-4 uppercase tracking-wider md:tracking-[0.2em]">{day}</div>
          ))}
          
          {Array.from({length: 31}).map((_, i) => {
            const date = i + 1;
            const isToday = date === today.getDate();
            
            // Filtering logic
            const dayAcademic = academicEvents.filter(e => {
              const isDate = e.date === date;
              const isGrade = selectedGrade === 'All' || e.grade === 'All' || e.grade === selectedGrade;
              return isDate && isGrade && (activeFilter === 'all' || activeFilter === 'academic');
            });

            const dateBookings = bookings.filter(b => {
              const isDate = new Date(b.startTime).getDate() === date;
              return isDate && (activeFilter === 'all' || activeFilter === 'sarpras');
            });

            return (
              <div 
                key={i} 
                className={`min-h-[60px] md:min-h-[140px] p-1 md:p-3 rounded-lg md:rounded-[2.5rem] border transition-all duration-300 group
                  ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/20 border-teladan-blue ring-1 ring-teladan-blue shadow-lg shadow-blue-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:shadow-md'}
                `}
              >
                <div className="flex justify-between items-start mb-1 md:mb-3">
                  <span className={`text-xs md:text-base font-bold ${isToday ? 'text-teladan-blue' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                    {date}
                  </span>
                  {isToday && <span className="hidden md:block text-[8px] font-bold uppercase text-teladan-blue tracking-widest">Hari Ini</span>}
                </div>

                <div className="space-y-0.5 md:space-y-1.5">
                  {/* Combined Events limited to 2 */}
                  {[
                    ...dayAcademic.map(e => ({ ...e, eventType: 'academic' })),
                    ...dateBookings.map(b => ({ ...b, eventType: 'booking' }))
                  ].slice(0, 2).map((event: any, idx) => (
                    event.eventType === 'academic' ? (
                      <div 
                        key={`ac-${idx}`} 
                        className={`${getGradeColor(event.grade)} text-white text-[7px] md:text-[9px] p-0.5 md:p-2 rounded md:rounded-xl font-bold truncate shadow-sm relative overflow-hidden`}
                      >
                        <div className="flex items-center gap-0.5 md:gap-1">
                          <span className="md:hidden w-1 h-1 bg-white rounded-full shrink-0"></span>
                          <span className="hidden md:inline-flex">
                            {event.type === 'exam' && <iconify-icon icon="solar:pen-bold" width="10"></iconify-icon>}
                          </span>
                          <span className="truncate">{event.title}</span>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-0.5 md:w-1 bg-white/20"></div>
                      </div>
                    ) : (
                      <div 
                        key={`bk-${idx}`} 
                        className="bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[7px] md:text-[9px] p-0.5 md:p-2 rounded md:rounded-xl font-bold truncate flex items-center gap-0.5 md:gap-1.5 border border-white/10"
                      >
                        <iconify-icon icon="solar:buildings-bold" className="w-2 h-2 md:w-[10px] md:h-[10px]"></iconify-icon>
                        <span className="truncate">{event.resourceName}</span>
                      </div>
                    )
                  ))}
                  
                  {dayAcademic.length + dateBookings.length > 2 && (
                    <div className="text-[6px] md:text-[8px] font-bold text-slate-400 text-center">
                      +{dayAcademic.length + dateBookings.length - 2} lainnya
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
