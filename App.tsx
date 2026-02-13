
import React, { useState, useEffect } from 'react';
import { User, UserRole, Course, Assignment, Submission, RoomBooking, AppNotification } from './types';
import { MOCK_TEACHER, MOCK_STUDENT, INITIAL_COURSES } from './constants';
import Sidebar from './components/Sidebar';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Classroom from './views/Classroom';
import CalendarView from './views/CalendarView';
import BookingForm from './views/BookingForm';
import NotificationCenter from './components/NotificationCenter';
import Settings from './views/Settings';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'id' | 'en'>('id');

  const handleLogin = (role: UserRole) => {
    setCurrentUser(role === UserRole.TEACHER ? MOCK_TEACHER : MOCK_STUDENT);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addNotification = (title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const t = {
    dashboard: lang === 'id' ? `Halo, ${currentUser.name.split(' ')[0]}!` : `Hello, ${currentUser.name.split(' ')[0]}!`,
    dashboardSub: lang === 'id' ? 'Selamat datang di Tel-Finder. Pusat kendali akademik terpadu Anda.' : 'Welcome to Tel-Finder. Your integrated academic command center.',
    classroom: lang === 'id' ? 'Classroom' : 'Classroom',
    classroomSub: lang === 'id' ? 'Kelola materi dan tugas akademikmu secara terpadu.' : 'Manage your course materials and academic tasks in one place.',
    calendar: lang === 'id' ? 'Kalender' : 'Calendar',
    calendarSub: lang === 'id' ? 'Lihat ketersediaan fasilitas sekolah hari ini.' : 'See school facility availability today.',
    booking: lang === 'id' ? 'Pinjam Ruang' : 'Room Booking',
    bookingSub: lang === 'id' ? 'Pesan ruangan untuk kegiatan belajarmu.' : 'Book a room for your study activities.',
    settings: lang === 'id' ? 'Pengaturan' : 'Settings',
    settingsSub: lang === 'id' ? 'Kelola profil dan preferensi aplikasi.' : 'Manage your profile and app preferences.'
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'dark bg-teladan-navy text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser} 
        onLogout={handleLogout}
        lang={lang}
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-10 animate-fade-slide">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white tracking-tight leading-none">
              {(activeTab === 'dashboard' && t.dashboard) ||
               (activeTab === 'classroom' && t.classroom) ||
               (activeTab === 'calendar' && t.calendar) ||
               (activeTab === 'booking' && t.booking) ||
               (activeTab === 'settings' && t.settings)}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl">
              {(activeTab === 'dashboard' && t.dashboardSub) ||
               (activeTab === 'classroom' && t.classroomSub) ||
               (activeTab === 'calendar' && t.calendarSub) ||
               (activeTab === 'booking' && t.bookingSub) ||
               (activeTab === 'settings' && t.settingsSub)}
            </p>
          </div>
          <div className="flex items-center gap-4 relative">
             <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-teladan-blue hover:border-teladan-blue transition-all shadow-sm relative"
              >
                <iconify-icon icon="solar:bell-bing-bold-duotone" width="28"></iconify-icon>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-teladan-red text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-teladan-navy">
                    {unreadNotifications}
                  </span>
                )}
             </button>
             {showNotifications && (
               <NotificationCenter 
                notifications={notifications} 
                setNotifications={setNotifications} 
                onClose={() => setShowNotifications(false)} 
               />
             )}

             <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm px-5 h-14">
                <span className={`w-3 h-3 rounded-full ${currentUser.role === UserRole.TEACHER ? 'bg-emerald-500' : 'bg-teladan-blue'} animate-pulse`}></span>
                <span className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200">{currentUser.role}</span>
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <Dashboard 
            user={currentUser} 
            courses={courses} 
            assignments={assignments} 
            bookings={bookings}
            submissions={submissions}
          />
        )}
        {activeTab === 'classroom' && (
          <Classroom 
            user={currentUser} 
            courses={courses} 
            setCourses={setCourses}
            assignments={assignments}
            setAssignments={setAssignments}
            submissions={submissions}
            setSubmissions={setSubmissions}
            addNotification={addNotification}
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarView bookings={bookings} />
        )}
        {activeTab === 'booking' && (
          <BookingForm 
            user={currentUser} 
            bookings={bookings} 
            setBookings={setBookings} 
            onSuccess={() => {
              addNotification(lang === 'id' ? 'Booking Berhasil' : 'Booking Successful', 
                             lang === 'id' ? 'Peminjaman ruangan Anda telah dijadwalkan.' : 'Your room booking has been scheduled.', 
                             'booking');
              setActiveTab('calendar');
            }}
          />
        )}
        {activeTab === 'settings' && (
          <Settings 
            user={currentUser}
            setUser={setCurrentUser}
            theme={theme}
            setTheme={setTheme}
            lang={lang}
            setLang={setLang}
          />
        )}
      </main>
    </div>
  );
};

export default App;
