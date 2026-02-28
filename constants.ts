
import { UserRole, Course, User, RoomBooking } from './types';

export const INITIAL_COURSES: Course[] = [
  // Fix: Renamed teacherId to teacher_id and teacherName to teacher_name to match the Course interface definition in types.ts.
  { id: 'c1', name: 'Matematika Peminatan', code: 'MTK101', teacher_id: 't1', teacher_name: 'Budi Santoso', description: 'Kalkulus Dasar & Aljabar', color: 'bg-teladan-blue' },
  { id: 'c2', name: 'Fisika Kuantum', code: 'FIS202', teacher_id: 't1', teacher_name: 'Budi Santoso', description: 'Mekanika Kuantum Sederhana', color: 'bg-teladan-red' },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label_id: 'Beranda', label_en: 'Dashboard', icon: 'solar:widget-2-bold-duotone' },
  { id: 'classroom', label_id: 'Kelas', label_en: 'Classroom', icon: 'solar:book-bookmark-bold-duotone' },
  { id: 'calendar', label_id: 'Kalender', label_en: 'Calendar', icon: 'solar:calendar-bold-duotone' },
  { id: 'booking', label_id: 'Fasilitas', label_en: 'Facilities', icon: 'solar:buildings-bold-duotone' },
];

export const ROOMS = [
  { id: 'r1', name: 'R. Kelas X-A', type: 'Classroom', level: 1 },
  { id: 'r2', name: 'Lab Fisika', type: 'Lab', level: 2 },
  { id: 'r3', name: 'Aula Utama', type: 'Hall', level: 1 },
  { id: 'r4', name: 'Lapangan Basket', type: 'Others', level: 0 },
];

// Fix: Added missing EQUIPMENT constant export to resolve the compilation error in BookingForm.tsx.
export const EQUIPMENT = [
  { id: 'e1', name: 'Proyektor BenQ MX550', type: 'Item' },
  { id: 'e2', name: 'Sound System Portable (Bose)', type: 'Item' },
  { id: 'e3', name: 'Kabel Roll 20 Meter', type: 'Item' },
  { id: 'e4', name: 'Microphone Wireless Shure', type: 'Item' },
];

export const MOCK_BOOKINGS: RoomBooking[] = [
  {
    id: 'b1',
    resourceId: 'r1',
    resourceName: 'R. Kelas X-A',
    resourceType: 'room',
    studentName: 'Andi Pratama',
    studentClass: 'X-A',
    purpose: 'Rapat OSIS',
    startTime: `${new Date().toISOString().split('T')[0]}T14:00:00`,
    endTime: `${new Date().toISOString().split('T')[0]}T16:00:00`,
  },
  {
    id: 'b2',
    resourceId: 'r3',
    resourceName: 'Aula Utama',
    resourceType: 'room',
    studentName: 'Siti Aminah',
    studentClass: 'XI-MIPA 1',
    purpose: 'Latihan Teater',
    startTime: `${new Date().toISOString().split('T')[0]}T15:30:00`,
    endTime: `${new Date().toISOString().split('T')[0]}T17:30:00`,
  }
];

export const MOCK_TEACHER: User = {
  id: 't1',
  name: 'Budi Santoso',
  email: 'budi@sman3jkt.sch.id',
  role: UserRole.TEACHER,
  avatar: 'https://picsum.photos/seed/teacher/200'
};

export const MOCK_STUDENT: User = {
  id: 's1',
  name: 'Siswa Teladan',
  email: 'siswa@student.id',
  role: UserRole.STUDENT,
  avatar: 'https://picsum.photos/seed/student/200'
};
