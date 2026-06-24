/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LeaveType = 'EL' | 'SL' | 'CL'; // Earned Leave, Sick Leave, Casual Leave

export interface ClockSession {
  id: string;
  date: string; // YYYY-MM-DD
  clockInTime: string; // HH:MM:SS
  clockOutTime: string | null; // HH:MM:SS
  totalHours: number; // in hours
  status: 'On Time' | 'Late' | 'WFH' | 'Half Day';
  location: string;
}

export interface LeaveRequest {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
  appliedOn: string;
}

export interface WFHRequest {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
  appliedOn: string;
}

export interface AttendanceCorrection {
  id: string;
  date: string;
  originalIn: string;
  originalOut: string;
  correctedIn: string;
  correctedOut: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Policy' | 'Update' | 'Event' | 'Social';
  content: string;
  author: string;
  date: string;
  isNew?: boolean;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  dayOfWeek: string;
  type: 'National' | 'Restricted' | 'Company';
}

export interface ExpenseRequest {
  id: string;
  amount: number;
  category: 'Travel' | 'Food' | 'Equipment' | 'Utilities' | 'Others';
  description: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  receiptName?: string;
}

export interface EmployeeProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  employeeId: string;
  joinedDate: string;
  manager: string;
  avatarUrl?: string;
  availableLeave: {
    EL: number; // Earned Leave
    SL: number; // Sick Leave
    CL: number; // Casual Leave
  };
}
