
import React, { useState } from 'react';
import { RoomBooking } from '../types';
import { ROOMS } from '../constants';

interface CalendarViewProps {
  bookings: RoomBooking[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ bookings }) => {
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const today = new Date();
  const [activeFilters, setActiveFilters] = useState<string[]>(['akademik', 'sarpras']);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [activeFacilityType, setActiveFacilityType] = useState<string | null>(null);

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const levels = ['X', 'XI', 'XII'];
  const facilityTypes = Array.from(new Set(ROOMS.map(r => r.type)));

  const filteredBookings = bookings.filter(b => {
    if (!activeFilters.includes('sarpras')) return false;
    if (activeLevel && b.level !== activeLevel) return false;
    if (activeFacilityType) {
        const room = ROOMS.find(r => r.id === b.resourceId);
        if (room && room.type !== activeFacilityType) return false;
        if (b.resourceType === 'item') return false; 
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-slide">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm space-y-8">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest w-full md:w-auto">
            <iconify-icon icon="solar:globus-bold-duotone" width="18"></iconify-icon>
            Tipe Data:
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => toggleFilter('akademik')}
              className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all border ${
                activeFilters.includes('akademik') 
                  ? 'bg-teladan-blue text-white border-teladan-blue shadow-lg shadow-blue-100 dark:shadow-none' 
                  : 'bg-transparent text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
            >
              Akademik
            </button>
            <button 
              onClick={() => toggleFilter('sarpras')}
              className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all border ${
                activeFilters.includes('sarpras') 
                  ? 'bg-teladan-red text-white border-teladan-red shadow-lg shadow-red-100 dark:shadow-none' 
                  : 'bg-transparent text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
            >
              Sarana Prasarana
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-50 dark:border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest w-full md:w-auto">
            <iconify-icon icon="solar:ranking-bold-duotone" width="18"></iconify-icon>
            Tingkat Kelas:
          </div>
          <div className="flex gap-3">
            {levels.map(lvl => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(activeLevel === lvl ? null : lvl)}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  activeLevel === lvl 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Kelas {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Oktober 2023</h2>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
               <span className="w-2.5 h-2.5 rounded-full bg-teladan-blue"></span> Akademik
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
               <span className="w-2.5 h-2.5 rounded-full bg-teladan-red"></span> Sarpras
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {days.map(day => (
            <div key={day} className="text-center font-bold text-slate-400 text-xs py-2 uppercase tracking-[0.2em]">{day}</div>
          ))}
          {Array.from({length: 31}).map((_, i) => {
            const date = i + 1;
            const isToday = date === today.getDate();
            const dayBookings = filteredBookings.filter(b => new Date(b.startTime).getDate() === date);
            const hasAcademic = activeFilters.includes('akademik') && (date === 12 || date === 15 || date === 22);

            return (
              <div key={i} className={`min-h-[140px] p-4 rounded-[2rem] border border-slate-50 dark:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-teladan-blue' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-sm font-bold ${isToday ? 'text-teladan-blue' : 'text-slate-400 dark:text-slate-500'}`}>{date}</span>
                </div>
                <div className="space-y-1.5">
                  {hasAcademic && (
                    <div className="bg-blue-100 dark:bg-blue-900/60 text-teladan-blue dark:text-blue-100 text-[9px] p-2 rounded-xl font-bold truncate border border-blue-200/50">
                      Tugas: Kalkulus
                    </div>
                  )}
                  {dayBookings.map(b => (
                    <div key={b.id} className="bg-red-100 dark:bg-red-900/60 text-teladan-red dark:text-red-100 text-[9px] p-2 rounded-xl font-bold truncate border border-red-200/50">
                      {b.resourceName}
                    </div>
                  ))}
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
