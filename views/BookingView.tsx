
import React from 'react';
import { RoomBooking } from '../types';

interface BookingViewProps {
  bookings: RoomBooking[];
}

const BookingView: React.FC<BookingViewProps> = ({ bookings }) => {
  return (
    <div className="space-y-8 animate-fade-slide">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-teladan-navy dark:text-white tracking-tight">Status Penggunaan Fasilitas</h2>
          <p className="text-slate-500 font-medium italic">Data peminjaman bersifat view-only untuk pemantauan sarpras.</p>
        </div>
        <div className="bg-teladan-red/10 text-teladan-red px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border border-teladan-red/20">
          <iconify-icon icon="solar:info-circle-bold-duotone" width="20"></iconify-icon>
          Hubungi Sarpras untuk Izin Baru
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <iconify-icon icon="solar:list-bold-duotone" className="text-teladan-blue"></iconify-icon>
            Daftar Pemakaian Aktif
          </h3>
          
          {bookings.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 p-20 rounded-[2.5rem] text-center border border-dashed border-slate-200 dark:border-slate-700">
               <iconify-icon icon="solar:cloud-check-bold-duotone" width="64" className="text-slate-200 mb-4"></iconify-icon>
               <p className="text-slate-400 font-bold">Semua fasilitas tersedia saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map(b => (
                <div key={b.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-neutral-200 dark:border-slate-700 shadow-sm flex items-center gap-6 group hover:border-teladan-blue transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center">
                    <iconify-icon icon="solar:buildings-bold-duotone" width="32"></iconify-icon>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">{b.resourceName}</h4>
                    <p className="text-sm text-slate-500 font-medium">{b.purpose}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                        <iconify-icon icon="solar:user-bold" width="10"></iconify-icon>
                        {b.studentName} ({b.studentClass})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-teladan-blue bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full uppercase">
                      {new Date(b.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold">TERPAKAI</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-teladan-navy p-8 rounded-[2.5rem] text-white shadow-xl">
             <h3 className="text-xl font-bold mb-4">Informasi Sarpras</h3>
             <p className="text-sm text-white/70 mb-6">Untuk pengajuan peminjaman ruangan atau barang baru, silakan hubungi bagian Sarana Prasarana di Lantai 1.</p>
             <div className="space-y-3">
               <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl">
                 <iconify-icon icon="solar:user-id-bold-duotone" className="text-teladan-red"></iconify-icon>
                 <span className="text-xs font-bold uppercase">Bpk. H. Ahmad Fauzi</span>
               </div>
               <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl">
                 <iconify-icon icon="solar:phone-bold-duotone" className="text-teladan-blue"></iconify-icon>
                 <span className="text-xs font-bold uppercase">EXT: 104 (Sarpras)</span>
               </div>
             </div>
           </div>

           <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm">
             <h3 className="text-lg font-bold mb-4">Ketersediaan Lab</h3>
             <div className="space-y-4">
                {['Lab Fisika', 'Lab Biologi', 'Lab Komputer'].map(lab => (
                  <div key={lab} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{lab}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookingView;
