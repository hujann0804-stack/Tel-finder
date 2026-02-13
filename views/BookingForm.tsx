
import React, { useState } from 'react';
import { User, RoomBooking, Room } from '../types';
import { ROOMS, EQUIPMENT } from '../constants';
import { analyzeScheduleConflict } from '../services/geminiService';

interface BookingFormProps {
  user: User;
  bookings: RoomBooking[];
  setBookings: React.Dispatch<React.SetStateAction<RoomBooking[]>>;
  onSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ user, bookings, setBookings, onSuccess }) => {
  const [resourceType, setResourceType] = useState<'room' | 'item' | null>(null);
  const [formData, setFormData] = useState({
    resourceId: '',
    purpose: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  const [isChecking, setIsChecking] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resourceId || !formData.date || !formData.startTime) {
      alert("Harap isi semua kolom!");
      return;
    }

    setIsChecking(true);
    const scheduleStr = bookings.map(b => `${b.resourceName} pada ${b.startTime}`).join(', ');
    const bookingStr = `${formData.resourceId} pada ${formData.date} ${formData.startTime}`;
    
    await analyzeScheduleConflict(bookingStr, scheduleStr);
    setIsChecking(false);

    const conflict = bookings.find(b => 
      b.resourceId === formData.resourceId && 
      new Date(b.startTime).toDateString() === new Date(formData.date).toDateString()
    );

    if (conflict) {
      alert("Maaf, sumber daya sudah dipesan pada waktu tersebut. Cek kalender!");
      return;
    }

    const resource = resourceType === 'room' 
      ? ROOMS.find(r => r.id === formData.resourceId)
      : EQUIPMENT.find(e => e.id === formData.resourceId);

    const newBooking: RoomBooking = {
      id: Date.now().toString(),
      resourceId: formData.resourceId,
      resourceName: resource?.name || 'Unknown',
      resourceType: resourceType as 'room' | 'item',
      studentName: user.name,
      studentClass: user.class || 'X-A',
      purpose: formData.purpose,
      startTime: `${formData.date}T${formData.startTime}:00`,
      endTime: `${formData.date}T${formData.endTime}:00`,
      level: (resource as Room)?.level // Automatically assign level from room data
    };

    setBookings([...bookings, newBooking]);
    alert(`Peminjaman ${resourceType === 'room' ? 'ruangan' : 'barang'} berhasil didaftarkan!`);
    onSuccess();
  };

  if (!resourceType) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-slide text-center">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Apa yang ingin Anda pinjam?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Pilih kategori fasilitas yang Anda butuhkan untuk kegiatan akademik.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <button 
             onClick={() => setResourceType('room')}
             className="group relative bg-white dark:bg-slate-800 p-12 rounded-[3rem] border-2 border-transparent hover:border-sky-500 shadow-xl transition-all hover:-translate-y-2 overflow-hidden"
           >
              <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-sky-50 dark:bg-sky-900/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-24 h-24 bg-sky-500 rounded-3xl mx-auto flex items-center justify-center text-white mb-8 shadow-2xl shadow-sky-200 dark:shadow-none relative z-10">
                <iconify-icon icon="solar:home-bold-duotone" width="48"></iconify-icon>
              </div>
              <h3 className="text-2xl font-bold mb-2 relative z-10">Pinjam Ruangan</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium relative z-10">Kelas, Lab, Lapangan, atau Ruang Multimedia</p>
           </button>

           <button 
             onClick={() => setResourceType('item')}
             className="group relative bg-white dark:bg-slate-800 p-12 rounded-[3rem] border-2 border-transparent hover:border-indigo-500 shadow-xl transition-all hover:-translate-y-2 overflow-hidden"
           >
              <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-indigo-50 dark:bg-indigo-900/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-24 h-24 bg-indigo-500 rounded-3xl mx-auto flex items-center justify-center text-white mb-8 shadow-2xl shadow-indigo-200 dark:shadow-none relative z-10">
                <iconify-icon icon="solar:box-bold-duotone" width="48"></iconify-icon>
              </div>
              <h3 className="text-2xl font-bold mb-2 relative z-10">Pinjam Barang</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium relative z-10">Proyektor, Sound System, Kabel, dan Peralatan lainnya</p>
           </button>
        </div>

        <div className="pt-8">
           <p className="text-sm font-bold text-slate-400 flex items-center justify-center gap-2 uppercase tracking-widest">
             <iconify-icon icon="solar:info-circle-bold-duotone" width="18"></iconify-icon>
             Proses verifikasi otomatis akan aktif setelah konfirmasi
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-slide pb-20">
      <button 
        onClick={() => setResourceType(null)}
        className="mb-8 flex items-center gap-2 text-slate-500 font-bold hover:text-sky-500 transition-colors"
      >
        <iconify-icon icon="solar:alt-arrow-left-bold-duotone" width="24"></iconify-icon>
        Pilih Kategori Lain
      </button>

      <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3rem] border border-neutral-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full ${resourceType === 'room' ? 'bg-sky-500' : 'bg-indigo-500'}`}></div>

        <div className="flex items-center gap-6 mb-12">
          <div className={`w-20 h-20 rounded-[2rem] ${resourceType === 'room' ? 'bg-sky-500 shadow-sky-100' : 'bg-indigo-500 shadow-indigo-100'} flex items-center justify-center text-white shadow-2xl dark:shadow-none sonar-effect`}>
            <iconify-icon icon={resourceType === 'room' ? 'solar:home-bold-duotone' : 'solar:box-bold-duotone'} width="40"></iconify-icon>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Detail Peminjaman {resourceType === 'room' ? 'Ruang' : 'Barang'}</h2>
            <p className="text-slate-500 font-medium">Mohon lengkapi detail penggunaan fasilitas berikut.</p>
          </div>
        </div>

        <form onSubmit={handleBooking} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                {resourceType === 'room' ? 'Pilih Ruangan' : 'Pilih Barang'}
              </label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-sky-500 font-bold transition-all"
                value={formData.resourceId}
                onChange={(e) => setFormData({...formData, resourceId: e.target.value})}
              >
                <option value="">-- Pilih {resourceType === 'room' ? 'Ruangan' : 'Inventaris'} --</option>
                {resourceType === 'room' ? (
                  ROOMS.map(room => (
                    <option key={room.id} value={room.id}>{room.name} ({room.type})</option>
                  ))
                ) : (
                  EQUIPMENT.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))
                )}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Keperluan</label>
              <input 
                type="text" 
                placeholder="Misal: Rapat OSIS / Latihan Teater" 
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-sky-500 font-medium"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Tanggal</label>
              <input 
                type="date" 
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-sky-500 font-bold"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Mulai</label>
              <input 
                type="time" 
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-sky-500 font-bold"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Selesai</label>
              <input 
                type="time" 
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-sky-500 font-bold"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              />
            </div>
          </div>

          <div className="p-8 bg-sky-50 dark:bg-slate-700/30 rounded-[2rem] border-2 border-dashed border-sky-100 dark:border-slate-700">
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white shrink-0">
                <iconify-icon icon="solar:info-circle-bold-duotone" width="24"></iconify-icon>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider text-xs">AI Smart Verifier</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Sistem kami akan mengecek konflik jadwal secara otomatis. Anda akan menerima notifikasi jika peminjaman disetujui.
                </p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isChecking}
            className={`w-full py-6 rounded-[2rem] ${resourceType === 'room' ? 'bg-sky-500 shadow-sky-100' : 'bg-indigo-500 shadow-indigo-100'} text-white font-bold text-xl shadow-2xl dark:shadow-none hover:opacity-90 transition-all flex items-center justify-center gap-4 ${isChecking ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isChecking ? (
              <>
                <iconify-icon icon="solar:loading-bold-duotone" className="animate-spin" width="32"></iconify-icon>
                Menghubungkan ke Calendar...
              </>
            ) : (
              <>
                <iconify-icon icon="solar:check-circle-bold-duotone" width="32"></iconify-icon>
                Ajukan Peminjaman
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
