
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

type Category = 'classroom' | 'facility' | 'item' | null;

const BookingForm: React.FC<BookingFormProps> = ({ user, bookings, setBookings, onSuccess }) => {
  const [view, setView] = useState<'schedule' | 'selection' | 'form'>('schedule');
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [category, setCategory] = useState<Category>(null);
  const [formData, setFormData] = useState({
    resourceId: '',
    purpose: '',
    organization: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
  });
  const [isChecking, setIsChecking] = useState(false);

  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resourceId || !formData.date || !formData.startTime) {
      alert("Harap isi semua kolom wajib!");
      return;
    }

    setIsChecking(true);
    try {
      // Simulasi pengecekan konflik dengan AI
      const scheduleStr = bookings.map(b => `${b.resourceName} pada ${b.startTime}`).join(', ');
      const bookingStr = `${formData.resourceId} pada ${formData.date} ${formData.startTime}`;
      await analyzeScheduleConflict(bookingStr, scheduleStr);

      const resource = category === 'item' 
        ? EQUIPMENT.find(e => e.id === formData.resourceId)
        : ROOMS.find(r => r.id === formData.resourceId);

      const newBooking: RoomBooking = {
        id: Date.now().toString(),
        resourceId: formData.resourceId,
        resourceName: resource?.name || 'Unknown',
        resourceType: category === 'item' ? 'item' : 'room',
        studentName: user.name,
        studentClass: user.class || 'X-A',
        purpose: formData.organization ? `[${formData.organization}] ${formData.purpose}` : formData.purpose,
        startTime: `${formData.date}T${formData.startTime}:00`,
        endTime: `${formData.date}T${formData.endTime}:00`,
        level: (resource as Room)?.level
      };

      setBookings([...bookings, newBooking]);
      alert(`Peminjaman ${resource?.name} berhasil diajukan!`);
      resetForm();
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat pengecekan jadwal.");
    } finally {
      setIsChecking(false);
    }
  };

  const resetForm = () => {
    setView('schedule');
    setCategory(null);
    setFormData({
      resourceId: '',
      purpose: '',
      organization: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
    });
  };

  const getBookingsForDate = (day: number) => {
    return bookings.filter(b => new Date(b.startTime).getDate() === day);
  };

  // 1. Dashboard Jadwal
  if (view === 'schedule') {
    const selectedDayBookings = getBookingsForDate(selectedDate);
    return (
      <div className="space-y-8 animate-fade-slide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Status Fasilitas & Inventaris</h2>
            <p className="text-slate-500 font-medium">Monitoring penggunaan aset sekolah SMAN 3 Jakarta.</p>
          </div>
          <button 
            onClick={() => setView('selection')}
            className="bg-teladan-blue text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-all"
          >
            <iconify-icon icon="solar:calendar-add-bold-duotone" width="24"></iconify-icon>
            Ajukan Peminjaman
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="grid grid-cols-7 gap-3">
              {days.map(d => <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-3">{d}</div>)}
              {Array.from({length: 31}).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = dayNum === selectedDate;
                const dayBookings = getBookingsForDate(dayNum);
                return (
                  <button key={i} onClick={() => setSelectedDate(dayNum)} className={`min-h-[100px] p-3 rounded-3xl border transition-all text-left ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 border-teladan-blue ring-1 ring-teladan-blue' : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200'}`}>
                    <span className={`text-sm font-bold ${isSelected ? 'text-teladan-blue' : 'text-slate-400'}`}>{dayNum}</span>
                    <div className="mt-2 flex flex-col gap-1">
                      {dayBookings.slice(0, 3).map(b => (
                        <div key={b.id} className={`h-1.5 w-full rounded-full ${b.resourceType === 'room' ? 'bg-teladan-red' : 'bg-indigo-500'}`}></div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 className="text-xl font-bold mb-6">Detail {selectedDate} Okt</h3>
             <div className="space-y-4">
               {selectedDayBookings.length === 0 ? <p className="text-slate-400 text-sm italic">Tidak ada agenda.</p> : 
                selectedDayBookings.map(b => (
                  <div key={b.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50">
                    <p className="font-bold text-sm">{b.resourceName}</p>
                    <p className="text-[10px] text-slate-500">{b.studentName} | {new Date(b.startTime).getHours()}:00</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Pemilihan Kategori
  if (view === 'selection') {
    const categories = [
      { id: 'classroom' as Category, title: 'Ruang Kelas', sub: 'Belajar kelompok atau rapat kelas', icon: 'solar:home-2-bold-duotone', color: 'bg-teladan-blue' },
      { id: 'facility' as Category, title: 'Fasilitas Umum', sub: 'Lab, Aula, Lapangan, atau Masjid', icon: 'solar:buildings-bold-duotone', color: 'bg-teladan-red' },
      { id: 'item' as Category, title: 'Alat & Barang', sub: 'Proyektor, Sound, atau Kabel Roll', icon: 'solar:box-bold-duotone', color: 'bg-indigo-500' }
    ];

    return (
      <div className="max-w-5xl mx-auto space-y-12 animate-fade-slide text-center pt-10 pb-20">
        <button onClick={() => setView('schedule')} className="mb-4 flex items-center gap-2 text-slate-400 font-bold hover:text-teladan-blue mx-auto transition-colors">
          <iconify-icon icon="solar:alt-arrow-left-bold-duotone" width="24"></iconify-icon> Kembali ke Jadwal
        </button>
        <div className="space-y-2">
          <h2 className="text-4xl font-bold">Apa yang ingin Anda pinjam?</h2>
          <p className="text-slate-500 text-lg">Pilih kategori fasilitas sekolah yang dibutuhkan.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => { setCategory(cat.id); setView('form'); }} className="group bg-white dark:bg-slate-800 p-10 rounded-[3rem] border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-600 shadow-xl transition-all hover:-translate-y-2">
              <div className={`w-20 h-20 ${cat.color} rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-2xl sonar-effect`}>
                <iconify-icon icon={cat.icon} width="40"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
              <p className="text-slate-400 text-xs font-medium">{cat.sub}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 3. Form Peminjaman
  const filteredOptions = category === 'classroom' 
    ? ROOMS.filter(r => r.type === 'Classroom')
    : category === 'facility'
      ? ROOMS.filter(r => r.type !== 'Classroom')
      : EQUIPMENT;

  return (
    <div className="max-w-4xl mx-auto animate-fade-slide pb-20">
      <button onClick={() => setView('selection')} className="mb-8 flex items-center gap-2 text-slate-400 font-bold hover:text-teladan-blue">
        <iconify-icon icon="solar:alt-arrow-left-bold-duotone" width="24"></iconify-icon> Ganti Kategori
      </button>

      <div className="bg-white dark:bg-slate-800 p-10 md:p-14 rounded-[3.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-8 mb-12">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-teladan-blue shadow-inner">
            <iconify-icon icon={category === 'item' ? 'solar:box-bold-duotone' : 'solar:map-point-bold-duotone'} width="40"></iconify-icon>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Formulir Pengajuan</h2>
            <p className="text-slate-500 font-medium">Kategori: {category === 'classroom' ? 'Ruang Kelas' : category === 'facility' ? 'Fasilitas Umum' : 'Alat & Barang'}</p>
          </div>
        </div>

        <form onSubmit={handleBooking} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Pilih {category === 'item' ? 'Barang' : 'Ruangan'}</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-teladan-blue font-bold text-slate-800 dark:text-white"
                value={formData.resourceId}
                onChange={(e) => setFormData({...formData, resourceId: e.target.value})}
                required
              >
                <option value="">-- Pilih Aset --</option>
                {filteredOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Organisasi / Eskul (Opsional)</label>
              <input 
                type="text" 
                placeholder="Misal: OSIS / MPK / Basket" 
                className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-teladan-blue font-medium"
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Tujuan Penggunaan</label>
            <textarea 
              placeholder="Jelaskan secara singkat alasan peminjaman..." 
              className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-teladan-blue font-medium h-24 resize-none"
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Tanggal</label>
              <input type="date" className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl p-5 font-bold" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Jam Mulai</label>
              <input type="time" className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl p-5 font-bold" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Jam Selesai</label>
              <input type="time" className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl p-5 font-bold" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} required />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isChecking}
            className={`w-full py-6 rounded-3xl bg-teladan-blue text-white font-bold text-xl shadow-2xl flex items-center justify-center gap-4 transition-all ${isChecking ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
          >
            {isChecking ? <iconify-icon icon="solar:restart-bold-duotone" className="animate-spin" width="30"></iconify-icon> : 'Kirim Pengajuan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
