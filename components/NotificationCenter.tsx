
import React from 'react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, setNotifications, onClose }) => {
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'assignment': return 'solar:clipboard-list-bold-duotone';
      case 'submission': return 'solar:check-circle-bold-duotone';
      case 'booking': return 'solar:key-minimalistic-bold-duotone';
      case 'message': return 'solar:chat-round-dots-bold-duotone';
      default: return 'solar:bell-bold-duotone';
    }
  };

  const getColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'assignment': return 'text-orange-500 bg-orange-50';
      case 'submission': return 'text-emerald-500 bg-emerald-50';
      case 'booking': return 'text-indigo-500 bg-indigo-50';
      case 'message': return 'text-sky-500 bg-sky-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="absolute top-16 right-0 w-96 max-h-[500px] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-neutral-200 dark:border-slate-700 flex flex-col z-50 overflow-hidden animate-fade-slide">
      <div className="p-6 border-b border-neutral-100 dark:border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-bold">Notifikasi</h3>
        <button onClick={markAllAsRead} className="text-xs font-bold text-sky-500 uppercase tracking-widest hover:underline">Tandai semua dibaca</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <iconify-icon icon="solar:bell-off-bold-duotone" width="48" className="mb-4 opacity-20"></iconify-icon>
            <p className="font-bold">Belum ada notifikasi.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`p-4 rounded-2xl flex gap-4 transition-colors ${notif.read ? 'opacity-60' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getColor(notif.type)}`}>
                <iconify-icon icon={getIcon(notif.type)} width="20"></iconify-icon>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{notif.title}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {!notif.read && <div className="w-2 h-2 bg-sky-500 rounded-full mt-2"></div>}
            </div>
          ))
        )}
      </div>
      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-neutral-100 dark:border-slate-700 text-center">
        <button onClick={onClose} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Tutup</button>
      </div>
    </div>
  );
};

export default NotificationCenter;
