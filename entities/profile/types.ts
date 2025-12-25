export type UserRole = 'student' | 'employee';

export interface BaseProfile {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  birthDate: string;
  avatarUrl?: string | null;
  role: UserRole;
}

export interface StudentProfile extends BaseProfile {
  role: 'student';
  group?: string;
  major?: string;
  educationForm?: 'full-time' | 'part-time';
  studentId?: string;
}

export interface EmployeeProfile extends BaseProfile {
  role: 'employee';
  position?: string;
  department?: string;
  employeeId?: string;
}

export type Profile = StudentProfile | EmployeeProfile;

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  avatar?: string; // base64 or URL
  // Student specific
  group?: string;
  major?: string;
  educationForm?: 'full-time' | 'part-time';
  // Employee specific
  position?: string;
  department?: string;
}

export interface ProfileValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  [key: string]: string | undefined;
}

