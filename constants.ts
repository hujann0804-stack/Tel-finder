
import { UserRole, Course, Room } from './types';

export const MOCK_TEACHER = {
  id: 't1',
  name: 'Budi Santoso, M.Pd',
  email: 'budi.santoso@school.id',
  role: UserRole.TEACHER,
  avatar: 'https://picsum.photos/seed/teacher/200',
  nisn: '197508122000031001'
};

export const MOCK_STUDENT = {
  id: 's1',
  name: 'Ananda Putra',
  email: 'ananda.putra@student.id',
  role: UserRole.STUDENT,
  avatar: 'https://picsum.photos/seed/student/200',
  nisn: '0056789123',
  class: 'XI-A'
};

export const INITIAL_COURSES: Course[] = [
  { id: 'c1', name: 'Matematika Peminatan', code: 'MTK101', teacherId: 't1', teacherName: 'Budi Santoso', description: 'Kalkulus Dasar & Aljabar', color: 'bg-sky-500' },
  { id: 'c2', name: 'Fisika Kuantum', code: 'FIS202', teacherId: 't1', teacherName: 'Budi Santoso', description: 'Mekanika Kuantum Sederhana', color: 'bg-indigo-500' },
];

const generateClassRooms = (): Room[] => {
  const levels = ['X', 'XI', 'XII'] as const;
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const rooms: Room[] = [];

  levels.forEach(level => {
    sections.forEach(section => {
      rooms.push({
        id: `room-${level}-${section}`,
        name: `Kelas ${level}-${section}`,
        capacity: 36,
        type: 'Classroom',
        level: level
      });
    });
  });
  return rooms;
};

const specialRooms: Room[] = [
  { id: 'av', name: 'Ruangan Audio Visual', capacity: 50, type: 'Facility' },
  { id: 'rsg', name: 'Ruangan Serba Guna', capacity: 200, type: 'Facility' },
  { id: 'l-utama', name: 'Lapangan Utama', capacity: 500, type: 'Field' },
  { id: 'l-basket', name: 'Lapangan Basket', capacity: 50, type: 'Field' },
  { id: 'l-futsal', name: 'Lapangan Futsal', capacity: 50, type: 'Field' },
  { id: 'pendopo', name: 'Pendopo', capacity: 100, type: 'Facility' },
  { id: 'l-badminton', name: 'Lapangan Badminton', capacity: 20, type: 'Field' },
  { id: 'perpus', name: 'Perpustakaan', capacity: 80, type: 'Library' },
  { id: 'r-musik', name: 'Ruang Musik', capacity: 20, type: 'Facility' },
  { id: 'm-l1', name: 'Masjid Lantai Satu', capacity: 300, type: 'Religion' },
  { id: 'm-l2', name: 'Masjid Lantai Dua', capacity: 200, type: 'Religion' },
  { id: 'lr-l1', name: 'Lorong Lantai Satu', capacity: 30, type: 'Common' },
  { id: 'lr-l2', name: 'Lorong Lantai Dua', capacity: 30, type: 'Common' },
  { id: 'lr-l3', name: 'Lorong Lantai Tiga', capacity: 30, type: 'Common' },
  { id: 'lab-kimia', name: 'Lab Kimia', capacity: 40, type: 'Laboratory' },
  { id: 'lab-fisika', name: 'Lab Fisika', capacity: 40, type: 'Laboratory' },
  { id: 'lab-biologi', name: 'Lab Biologi', capacity: 40, type: 'Laboratory' },
  { id: 'lab-komp1', name: 'Lab Komputer Satu', capacity: 40, type: 'Laboratory' },
  { id: 'lab-komp2', name: 'Lab Komputer Dua', capacity: 40, type: 'Laboratory' },
  { id: 'lab-komp3', name: 'Lab Komputer Tiga', capacity: 40, type: 'Laboratory' },
];

export const ROOMS: Room[] = [...generateClassRooms(), ...specialRooms];

export const EQUIPMENT = [
  { id: 'eq-1', name: 'Proyektor Epson EB-X05', type: 'Electronic' },
  { id: 'eq-2', name: 'Sound System Portable', type: 'Audio' },
  { id: 'eq-3', name: 'Kabel Roll 20m', type: 'Utility' },
  { id: 'eq-4', name: 'Pointer Presentasi', type: 'Electronic' },
  { id: 'eq-5', name: 'Microphone Wireless', type: 'Audio' },
  { id: 'eq-6', name: 'Layar Proyektor (Screen)', type: 'Utility' },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label_id: 'Beranda', label_en: 'Dashboard', icon: 'solar:widget-2-bold-duotone' },
  { id: 'classroom', label_id: 'Kelas', label_en: 'Classroom', icon: 'solar:book-bookmark-bold-duotone' },
  { id: 'calendar', label_id: 'Kalender', label_en: 'Calendar', icon: 'solar:calendar-bold-duotone' },
  { id: 'booking', label_id: 'Peminjaman', label_en: 'Booking', icon: 'solar:key-minimalistic-bold-duotone' },
];
