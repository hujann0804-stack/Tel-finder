
import React from 'react';

// Fix for 'iconify-icon' property errors in JSX by extending both global and React's internal JSX namespaces
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 
        icon?: string; 
        width?: string | number; 
        height?: string | number;
        flip?: string;
        rotate?: string | number;
        mode?: string;
        inline?: boolean;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 
        icon?: string; 
        width?: string | number; 
        height?: string | number;
        flip?: string;
        rotate?: string | number;
        mode?: string;
        inline?: boolean;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}

export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  nisn?: string;
  class?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  teacherName: string;
  description: string;
  color: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  submittedAt: string;
  grade?: number;
  status: 'submitted' | 'pending' | 'graded';
}

export interface RoomBooking {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: 'room' | 'item';
  studentName: string;
  studentClass: string;
  purpose: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  level?: 'X' | 'XI' | 'XII';
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: string;
  level?: 'X' | 'XI' | 'XII';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'submission' | 'booking' | 'message';
  timestamp: string;
  read: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}
