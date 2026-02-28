
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Course, Assignment, Submission, AppNotification, RoomBooking } from './types';
import { INITIAL_COURSES, MOCK_BOOKINGS } from './constants';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Classroom from './views/Classroom';
import CalendarView from './views/CalendarView';
import BookingView from './views/BookingView';
import NotificationCenter from './components/NotificationCenter';
import Settings from './views/Settings';
import ProfileSetup from './views/ProfileSetup';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [rawAuthUser, setRawAuthUser] = useState<any>(null);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>(MOCK_BOOKINGS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'id' | 'en'>('id');

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        setIsProfileIncomplete(true);
      } else {
        setCurrentUser({
          id: data.id,
          name: data.full_name,
          email: data.email,
          role: data.role as UserRole,
          avatar: `https://picsum.photos/seed/${data.id}/200`,
          nisn: data.nisn,
          class: data.class
        });
        setIsProfileIncomplete(false);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setIsProfileIncomplete(true);
    }
  }, []);

  const handleUserSession = useCallback(async (session: any) => {
    if (session?.user) {
      setRawAuthUser(session.user);
      await fetchProfile(session.user.id);
    } else {
      setRawAuthUser(null);
      setCurrentUser(null);
      setIsProfileIncomplete(false);
    }
    setIsLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserSession(session);
    });

    return () => subscription.unsubscribe();
  }, [handleUserSession]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setRawAuthUser(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-teladan-navy text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 flex items-center justify-center sonar-effect text-teladan-red">
            <img 
              src="https://lh3.googleusercontent.com/d/1OjBe_s-XJKZ-44j1mk3FLocHg5JjzdMd" 
              alt="Tel-Finder Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <p className="text-sm font-bold animate-pulse">Sinkronisasi Database Teladan...</p>
        </div>
      </div>
    );
  }

  if (!rawAuthUser) return <Login onLogin={() => {}} />;
  if (isProfileIncomplete) return <ProfileSetup user={rawAuthUser} onComplete={(user) => { setCurrentUser(user); setIsProfileIncomplete(false); }} />;
  if (!currentUser) return null;

  const safeName = currentUser.name || "Siswa Teladan";
  const firstName = safeName.split(' ')[0];

  const t = {
    dashboard: lang === 'id' ? `Halo, ${firstName}!` : `Hello, ${firstName}!`,
    classroom: lang === 'id' ? 'Ruang Kelas' : 'Classroom',
    calendar: lang === 'id' ? 'Agenda Akademik' : 'Academic Calendar',
    booking: lang === 'id' ? 'Status Fasilitas' : 'Facility Status',
    settings: lang === 'id' ? 'Pengaturan' : 'Settings'
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'dark bg-teladan-navy text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar for Laptop & Tablet */}
      <div className="hidden md:flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={currentUser} 
          onLogout={handleLogout}
          lang={lang}
        />
      </div>

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden">
        <MobileNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          lang={lang}
          onLogout={handleLogout}
        />
      </div>
      
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-10 animate-fade-slide pt-6 md:pt-10 pb-24 md:pb-10">
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            {/* Logo only on mobile or when sidebar is hidden? 
                Actually, keeping it in header is fine as per previous design. */}
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center sonar-effect flex-shrink-0 text-teladan-red md:hidden">
              <img 
                src="https://lh3.googleusercontent.com/d/1OjBe_s-XJKZ-44j1mk3FLocHg5JjzdMd" 
                alt="Tel-Finder Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-xl md:text-4xl font-bold text-teladan-navy dark:text-white tracking-tight leading-none">
                {(activeTab === 'dashboard' && t.dashboard) ||
                 (activeTab === 'classroom' && t.classroom) ||
                 (activeTab === 'calendar' && t.calendar) ||
                 (activeTab === 'booking' && t.booking) ||
                 (activeTab === 'settings' && t.settings)}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm font-medium">
                SMAN 3 Jakarta • Tel-Finder
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 relative">
             <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-teladan-blue shadow-sm relative"
              >
                <iconify-icon icon="solar:bell-bing-bold-duotone" width="20" className="md:w-[24px]"></iconify-icon>
                {notifications.some(n => !n.read) && (
                   <span className="absolute top-2 right-2 w-2 h-2 bg-teladan-red rounded-full border-2 border-white dark:border-slate-800"></span>
                )}
             </button>
             {showNotifications && (
               <NotificationCenter 
                notifications={notifications} 
                setNotifications={setNotifications} 
                onClose={() => setShowNotifications(false)} 
               />
             )}

             <div className="flex bg-teladan-blue p-2 rounded-xl items-center gap-2 md:gap-3 shadow-lg px-3 md:px-4 h-10 md:h-12 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest">{currentUser.role}</span>
             </div>

             <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              user={currentUser} 
              courses={courses} 
              assignments={assignments} 
              submissions={submissions}
              bookings={bookings} 
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
              addNotification={(title, message, type) => {
                setNotifications([{ id: Date.now().toString(), title, message, type, timestamp: new Date().toISOString(), read: false }, ...notifications]);
              }}
            />
          )}
          {activeTab === 'calendar' && (
            <CalendarView bookings={bookings} />
          )}
          {activeTab === 'booking' && (
            <BookingView bookings={bookings} />
          )}
          {activeTab === 'settings' && (
            <Settings 
              user={currentUser}
              setUser={(updated) => { if (updated === null) handleLogout(); else setCurrentUser(updated); }}
              theme={theme}
              setTheme={setTheme}
              lang={lang}
              setLang={setLang}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
