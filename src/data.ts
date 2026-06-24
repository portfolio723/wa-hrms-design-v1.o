/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmployeeProfile, ClockSession, LeaveRequest, WFHRequest, Holiday, Announcement } from './types';

export const INITIAL_PROFILE: EmployeeProfile = {
  name: 'Sandeep M',
  email: 'sandeep.m@company.com',
  role: 'Senior Product Designer',
  department: 'Product & Design',
  employeeId: 'EMP-2024-0342',
  joinedDate: 'Oct 15, 2022',
  manager: 'Sarah Jenkins (VP of Design)',
  avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVufGVufDB8fDB8fHww', // Elegant portrait of professional Indian man
  availableLeave: {
    EL: 8,
    SL: 2,
    CL: 2,
  }
};

export const INITIAL_CLOCK_SESSIONS: ClockSession[] = [
  {
    id: 'CS-103',
    date: '2026-06-23',
    clockInTime: '09:02:15',
    clockOutTime: '18:15:40',
    totalHours: 9.22,
    status: 'On Time',
    location: 'Hyderabad HQ, HITEC City (Desk 4B)'
  },
  {
    id: 'CS-102',
    date: '2026-06-22',
    clockInTime: '09:45:00',
    clockOutTime: '18:30:20',
    totalHours: 8.75,
    status: 'Late', // Late because threshold is 09:15 AM
    location: 'Hyderabad HQ, HITEC City (Desk 4B)'
  },
  {
    id: 'CS-101',
    date: '2026-06-19',
    clockInTime: '08:55:10',
    clockOutTime: '17:58:30',
    totalHours: 9.05,
    status: 'WFH',
    location: 'Remote (Hyderabad, India)'
  },
  {
    id: 'CS-100',
    date: '2026-06-18',
    clockInTime: '09:05:00',
    clockOutTime: '18:02:10',
    totalHours: 8.95,
    status: 'On Time',
    location: 'Hyderabad HQ, HITEC City (Desk 4B)'
  },
  {
    id: 'CS-099',
    date: '2026-06-17',
    clockInTime: '09:10:00',
    clockOutTime: '18:12:00',
    totalHours: 9.03,
    status: 'On Time',
    location: 'Hyderabad HQ, HITEC City (Desk 4B)'
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR-101',
    type: 'EL',
    startDate: '2026-07-06',
    endDate: '2026-07-10',
    days: 5,
    status: 'Pending',
    reason: 'Annual family summer vacation trip',
    appliedOn: '2026-06-20'
  },
  {
    id: 'LR-100',
    type: 'SL',
    startDate: '2026-05-12',
    endDate: '2026-05-13',
    days: 2,
    status: 'Approved',
    reason: 'Dental wisdom tooth extraction recovery',
    appliedOn: '2026-05-10'
  },
  {
    id: 'LR-099',
    type: 'CL',
    startDate: '2026-04-03',
    endDate: '2026-04-03',
    days: 1,
    status: 'Approved',
    reason: 'Personal home utility setup & inspection',
    appliedOn: '2026-04-01'
  }
];

export const INITIAL_WFH_REQUESTS: WFHRequest[] = [
  {
    id: 'WR-101',
    startDate: '2026-06-26',
    endDate: '2026-06-26',
    days: 1,
    status: 'Approved',
    reason: 'Package delivery window requirement',
    appliedOn: '2026-06-22'
  },
  {
    id: 'WR-100',
    startDate: '2026-06-19',
    endDate: '2026-06-19',
    days: 1,
    status: 'Approved',
    reason: 'High heat warning, working from home setup',
    appliedOn: '2026-06-18'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'A-01',
    title: 'New CareFirst Health Insurance Policy Active',
    category: 'Policy',
    content: 'We have updated our employee health care coverage to CareFirst Gold Select. Active starting July 1, 2026. Please check the Documents section to download your updated insurance cards and coverage details.',
    author: 'Rebecca Vance (HR Director)',
    date: '2026-06-22',
    isNew: true,
  },
  {
    id: 'A-02',
    title: 'Office Upgrade: Premium Sit-Stand Desks in Wing B',
    category: 'Update',
    content: 'As part of our workplace wellness initiative, Wing B workstations are being equipped with fully pneumatic motorized standup desks. Installation will be complete by Friday evening.',
    author: 'Marcus Brody (Workplace Ops)',
    date: '2026-06-18'
  },
  {
    id: 'A-03',
    title: 'Q3 Product & Design All-Hands Retreat Scheduled',
    category: 'Event',
    content: 'Our quarterly team offsite will take place on July 17th at the Redwood Coastal Lodge. Agenda includes design sprints, feedback circles, and outdoor team-building activities. Transit details will follow.',
    author: 'Sarah Jenkins (VP of Design)',
    date: '2026-06-15'
  }
];

export const INITIAL_HOLIDAYS: Holiday[] = [
  {
    id: 'H-01',
    name: 'Independence Day (India)',
    date: '2026-08-15',
    dayOfWeek: 'Saturday',
    type: 'National'
  },
  {
    id: 'H-02',
    name: 'Hyderabad Liberation Day',
    date: '2026-09-17',
    dayOfWeek: 'Thursday',
    type: 'Restricted'
  },
  {
    id: 'H-03',
    name: 'Gandhi Jayanti',
    date: '2026-10-02',
    dayOfWeek: 'Friday',
    type: 'National'
  },
  {
    id: 'H-04',
    name: 'Diwali (Festival of Lights)',
    date: '2026-11-08',
    dayOfWeek: 'Sunday',
    type: 'National'
  },
  {
    id: 'H-05',
    name: 'Christmas Day',
    date: '2026-12-25',
    dayOfWeek: 'Friday',
    type: 'National'
  }
];
