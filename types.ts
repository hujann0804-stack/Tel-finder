
import React from 'react';

// Fix: Added missing Room interface required by BookingForm.tsx.
export interface Room {
  id: string;
  name: string;
  type: string;
  level: number;
}

// Fix: Added missing Message interface required by Messaging.tsx.
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
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
        className?: string;
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
  teacher_id: string;
  teacher_name: string;
  description: string;
  color: string;
  created_at?: string;
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

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'submission' | 'message' | 'booking';
  timestamp: string;
  read: boolean;
}

export interface RoomBooking {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: 'room' | 'item';
  studentName: string;
  studentClass: string;
  purpose: string;
  startTime: string;
  endTime: string;
  level?: number;
}
