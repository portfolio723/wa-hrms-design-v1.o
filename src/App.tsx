/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  MapPin, 
  User, 
  Sparkles, 
  ChevronRight, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Bell, 
  TrendingUp, 
  Award,
  ArrowUpRight,
  Plus,
  Trash2,
  Bookmark,
  X
} from 'lucide-react';

import { 
  EmployeeProfile, 
  ClockSession, 
  LeaveRequest, 
  WFHRequest, 
  AttendanceCorrection, 
  Announcement, 
  Holiday,
  LeaveType,
  ExpenseRequest
} from './types';

import { 
  INITIAL_PROFILE, 
  INITIAL_CLOCK_SESSIONS, 
  INITIAL_LEAVE_REQUESTS, 
  INITIAL_WFH_REQUESTS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_HOLIDAYS 
} from './data';

import Sidebar from './components/Sidebar';
import ClockInHero from './components/ClockInHero';
import MetricCards from './components/MetricCards';
import TabsView from './components/TabsView';

import { 
  ApplyLeaveModal, 
  RequestWFHModal, 
  AttendanceCorrectionModal, 
  PayslipDetailModal,
  RequestExpenseModal,
  EditProfileModal
} from './components/Modals';

export default function App() {
  // Mobile sidebar status
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  
  // Tab/view state
  const [activeTab, setActiveTab] = useState('dashboard');

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = profile.name.split(' ')[0] || 'Sandeep';
    if (hour < 12) return `Good Morning, ${firstName} ☀️`;
    if (hour < 17) return `Good Afternoon, ${firstName} 🌤️`;
    return `Good Evening, ${firstName} 🌙`;
  };

  // Core HRMS State backed by LocalStorage
  const [profile, setProfile] = useState<EmployeeProfile>(() => {
    const saved = localStorage.getItem('hrms_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [isClockedIn, setIsClockedIn] = useState<boolean>(() => {
    return localStorage.getItem('hrms_is_clocked_in') === 'true';
  });

  const [sessionStartTime, setSessionStartTime] = useState<string | null>(() => {
    return localStorage.getItem('hrms_session_start_time');
  });

  const [previousWorkedSeconds, setPreviousWorkedSeconds] = useState<number>(() => {
    const saved = localStorage.getItem('hrms_prev_worked_seconds');
    return saved ? parseInt(saved, 10) : 11520; // 3.2 hours in seconds as per prompt recommendation
  });

  const [clockSessions, setClockSessions] = useState<ClockSession[]>(() => {
    const saved = localStorage.getItem('hrms_clock_sessions');
    return saved ? JSON.parse(saved) : INITIAL_CLOCK_SESSIONS;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('hrms_leave_requests');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [wfhRequests, setWfhRequests] = useState<WFHRequest[]>(() => {
    const saved = localStorage.getItem('hrms_wfh_requests');
    return saved ? JSON.parse(saved) : INITIAL_WFH_REQUESTS;
  });

  const [corrections, setCorrections] = useState<AttendanceCorrection[]>(() => {
    const saved = localStorage.getItem('hrms_corrections');
    return saved ? JSON.parse(saved) : [];
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('hrms_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [holidays] = useState<Holiday[]>(INITIAL_HOLIDAYS);

  // New announcement input state
  const [showAnnounceForm, setShowAnnounceForm] = useState(false);
  const [newAnnounceTitle, setNewAnnounceTitle] = useState('');
  const [newAnnounceCategory, setNewAnnounceCategory] = useState<'Policy' | 'Update' | 'Event' | 'Social'>('Update');
  const [newAnnounceContent, setNewAnnounceContent] = useState('');

  // Modals state
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isRequestWFHOpen, setIsRequestWFHOpen] = useState(false);
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [isRequestExpenseOpen, setIsRequestExpenseOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Notifications dropdown state
  const [showNotifications, setShowNotifications] = useState(false);

  // Expenses Claim state
  const [expenses, setExpenses] = useState<ExpenseRequest[]>(() => {
    const saved = localStorage.getItem('hrms_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 'exp-1', amount: 1500, category: 'Travel', description: 'Auto-rickshaw fares for client meeting at HITEC City', date: '2026-06-20', status: 'Approved', appliedOn: '2026-06-20' },
      { id: 'exp-2', amount: 450, category: 'Food', description: 'Team lunch at Paradise Biryani', date: '2026-06-21', status: 'Approved', appliedOn: '2026-06-21' },
      { id: 'exp-3', amount: 3000, category: 'Equipment', description: 'Logitech wireless keyboard & mouse', date: '2026-06-23', status: 'Pending', appliedOn: '2026-06-23' }
    ];
  });

  // System alert toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist state updates to LocalStorage
  useEffect(() => {
    localStorage.setItem('hrms_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('hrms_is_clocked_in', String(isClockedIn));
  }, [isClockedIn]);

  useEffect(() => {
    if (sessionStartTime) {
      localStorage.setItem('hrms_session_start_time', sessionStartTime);
    } else {
      localStorage.removeItem('hrms_session_start_time');
    }
  }, [sessionStartTime]);

  useEffect(() => {
    localStorage.setItem('hrms_prev_worked_seconds', String(previousWorkedSeconds));
  }, [previousWorkedSeconds]);

  useEffect(() => {
    localStorage.setItem('hrms_clock_sessions', JSON.stringify(clockSessions));
  }, [clockSessions]);

  useEffect(() => {
    localStorage.setItem('hrms_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('hrms_wfh_requests', JSON.stringify(wfhRequests));
  }, [wfhRequests]);

  useEffect(() => {
    localStorage.setItem('hrms_corrections', JSON.stringify(corrections));
  }, [corrections]);

  useEffect(() => {
    localStorage.setItem('hrms_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('hrms_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Live total worked hours (for dashboard stats calculations)
  const [liveWorkedHoursToday, setLiveWorkedHoursToday] = useState(previousWorkedSeconds / 3600);

  useEffect(() => {
    const updateLiveHours = () => {
      if (isClockedIn && sessionStartTime) {
        const start = new Date(sessionStartTime).getTime();
        const elapsed = Math.floor((Date.now() - start) / 1000);
        setLiveWorkedHoursToday((previousWorkedSeconds + elapsed) / 3600);
      } else {
        setLiveWorkedHoursToday(previousWorkedSeconds / 3600);
      }
    };
    
    updateLiveHours();
    const interval = setInterval(updateLiveHours, 1000);
    return () => clearInterval(interval);
  }, [isClockedIn, sessionStartTime, previousWorkedSeconds]);

  // Core state handlers
  const handleClockIn = (location: string) => {
    const startTimeStr = new Date().toISOString();
    setIsClockedIn(true);
    setSessionStartTime(startTimeStr);
    showToast(`Successfully clocked in at ${location}!`);
  };

  const handleClockOut = () => {
    if (!sessionStartTime) return;
    
    const startTime = new Date(sessionStartTime).getTime();
    const elapsed = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
    const finalSecondsToday = previousWorkedSeconds + elapsed;
    
    // Add to completed clock sessions list
    const todayStr = new Date('2026-06-24T00:27:50-07:00').toISOString().split('T')[0];
    const formatHHMMSS = (d: Date) => d.toTimeString().split(' ')[0];

    const newSession: ClockSession = {
      id: `CS-${Date.now()}`,
      date: todayStr,
      clockInTime: formatHHMMSS(new Date(startTime)),
      clockOutTime: formatHHMMSS(new Date()),
      totalHours: elapsed / 3600,
      status: 'On Time',
      location: 'Hyderabad HQ, HITEC City (Desk 4B)'
    };

    setClockSessions(prev => [newSession, ...prev]);
    setPreviousWorkedSeconds(finalSecondsToday);
    setIsClockedIn(false);
    setSessionStartTime(null);
    showToast('Successfully clocked out. Today\'s session logs have been saved!');
  };

  const handleApplyLeave = (type: LeaveType, start: string, end: string, days: number, reason: string) => {
    // Subtract from balance right away for snappy responsive visuals
    setProfile(prev => ({
      ...prev,
      availableLeave: {
        ...prev.availableLeave,
        [type]: Math.max(0, prev.availableLeave[type] - days)
      }
    }));

    const newReq: LeaveRequest = {
      id: `LR-${Date.now()}`,
      type,
      startDate: start,
      endDate: end,
      days,
      status: 'Pending',
      reason,
      appliedOn: '2026-06-24'
    };

    setLeaveRequests(prev => [newReq, ...prev]);
    showToast(`Leave application for ${days} day(s) submitted to manager!`);
  };

  const handleCancelLeave = (id: string) => {
    const target = leaveRequests.find(r => r.id === id);
    if (!target) return;
    
    // Refund balance
    setProfile(prev => ({
      ...prev,
      availableLeave: {
        ...prev.availableLeave,
        [target.type]: prev.availableLeave[target.type] + target.days
      }
    }));

    setLeaveRequests(prev => prev.filter(r => r.id !== id));
    showToast('Leave request cancelled. Balance refunded!');
  };

  const handleRequestWFH = (start: string, end: string, days: number, reason: string) => {
    const newReq: WFHRequest = {
      id: `WR-${Date.now()}`,
      startDate: start,
      endDate: end,
      days,
      status: 'Approved', // Auto-approved for hybrid standard days as per policy
      reason,
      appliedOn: '2026-06-24'
    };

    setWfhRequests(prev => [newReq, ...prev]);
    showToast(`WFH request for ${days} day(s) approved!`);
  };

  const handleCancelWFH = (id: string) => {
    setWfhRequests(prev => prev.filter(r => r.id !== id));
    showToast('WFH request cancelled successfully.');
  };

  const handleAttendanceCorrection = (
    date: string, 
    origIn: string, 
    origOut: string, 
    corrIn: string, 
    corrOut: string, 
    reason: string
  ) => {
    const newCorr: AttendanceCorrection = {
      id: `AC-${Date.now()}`,
      date,
      originalIn: origIn,
      originalOut: origOut,
      correctedIn: corrIn,
      correctedOut: corrOut,
      reason,
      status: 'Pending',
      appliedOn: '2026-06-24'
    };

    setCorrections(prev => [newCorr, ...prev]);
    showToast('Attendance correction request submitted to HR Operations!');
  };

  const handleRequestExpense = (
    amount: number,
    category: 'Travel' | 'Food' | 'Equipment' | 'Utilities' | 'Others',
    description: string,
    date: string,
    receiptName?: string
  ) => {
    const newRequest: ExpenseRequest = {
      id: `exp-${Date.now()}`,
      amount,
      category,
      description,
      date,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      receiptName
    };
    setExpenses(prev => [newRequest, ...prev]);
    showToast('Expense reimbursement request submitted successfully!');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnounceTitle || !newAnnounceContent) return;

    const newAnn: Announcement = {
      id: `A-${Date.now()}`,
      title: newAnnounceTitle,
      category: newAnnounceCategory,
      content: newAnnounceContent,
      author: 'Sandeep Sharma (Self-Posted)',
      date: '2026-06-24',
      isNew: true
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    setNewAnnounceTitle('');
    setNewAnnounceContent('');
    setShowAnnounceForm(false);
    showToast('New announcement posted successfully!');
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast('Announcement removed.');
  };

  // Helper date formatting for June 24, 2026
  const staticTodayDate = 'Wednesday, June 24, 2026';

  // Calculate leave progress variables
  const leaveEL = profile.availableLeave.EL;
  const leaveSL = profile.availableLeave.SL;
  const leaveCL = profile.availableLeave.CL;
  const totalAvailableLeaves = leaveEL + leaveSL + leaveCL;

  return (
    <div id="hrms-workspace" className="min-h-screen bg-[#FFFFFF] flex font-sans antialiased text-[#111111]">
      
      {/* Dynamic Alert Toast */}
      {toastMessage && (
        <div 
          id="system-alert-toast"
          className="fixed bottom-6 right-6 z-50 bg-[#111111] text-[#FFFFFF] border border-zinc-800 px-5 py-3.5 rounded-2xl minimal-shadow flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="w-2 h-2 rounded-full bg-[#FFDD00] animate-ping" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Grouped Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        profile={profile}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar */}
        <header id="main-header" className="h-20 border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-10 flex items-center justify-between sticky top-0 bg-[#FFFFFF]/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button 
              id="mobile-sidebar-toggle"
              onClick={() => setIsOpenMobile(true)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl border border-[#E5E7EB] text-[#111111] hover:bg-[#F7F7F8] shrink-0"
            >
              <Menu size={16} />
            </button>
            <div className="min-w-0">
              <h1 className="font-display font-extrabold text-sm xs:text-base sm:text-lg tracking-tight text-[#111111] truncate">
                {activeTab === 'dashboard' ? getGreeting() : 'HR Portal Console'}
              </h1>
              <p className="text-[9px] sm:text-[11px] text-[#6B7280] font-mono uppercase tracking-wider font-bold truncate">
                {activeTab === 'dashboard' ? `Wednesday, June 24, 2026` : `Navigation: ${activeTab}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
            {/* Location Tracker */}
            <div className="hidden sm:block text-right">
              <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-0.5">Office Location</div>
              <div className="text-xs font-semibold text-[#111111]">Headquarters, Building 4</div>
            </div>

            {/* Quick Status Pill */}
            <div className="hidden md:flex items-center gap-2 border border-[#E5E7EB] bg-[#F7F7F8] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap">
              <span className={`w-1.5 h-1.5 rounded-full ${isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
              <span className="text-[#6B7280]">Status:</span>
              <span className="text-[#111111]">{isClockedIn ? 'Active' : 'Offline'}</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative flex items-center">
              <button
                id="header-notifications-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                }}
                className="p-2 rounded-xl border border-[#E5E7EB] hover:bg-[#F7F7F8] text-[#111111] relative transition-colors duration-150 cursor-pointer z-50"
              >
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border border-white rounded-full" />
              </button>

              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/5 backdrop-blur-xs" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotifications(false);
                    }} 
                  />
                  <div 
                    id="notifications-dropdown-menu"
                    className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] xs:w-80 sm:w-96 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-3 bg-[#F7F7F8] border-b border-[#E5E7EB] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#111111]">Notifications & Announcements</span>
                        <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">6 New</span>
                      </div>
                      <button
                        id="close-notifications-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNotifications(false);
                        }}
                        className="p-1 rounded-lg text-[#6B7280] hover:bg-[#ECECEC] hover:text-[#111111] transition-colors cursor-pointer"
                        title="Close panel"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto divide-y divide-[#E5E7EB]">
                      {/* Approvals Category */}
                      <div className="px-4 py-2 bg-zinc-50/50 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider font-mono">
                        Approvals
                      </div>
                      
                      <div className="p-3.5 hover:bg-zinc-50/80 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-xs text-emerald-700">Leave Request Approved ✔</span>
                          <span className="text-[9px] text-[#6B7280] font-mono whitespace-nowrap shrink-0">June 23, 2026</span>
                        </div>
                        <p className="text-[10px] text-[#6B7280] mt-1 leading-relaxed">Your 2-day Casual Leave request has been approved by management.</p>
                      </div>

                      <div className="p-3.5 hover:bg-zinc-50/80 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-xs text-emerald-700">WFH Request Approved ✔</span>
                          <span className="text-[9px] text-[#6B7280] font-mono whitespace-nowrap shrink-0">June 22, 2026</span>
                        </div>
                        <p className="text-[10px] text-[#6B7280] mt-1 leading-relaxed">Work From Home request for June 25th has been verified.</p>
                      </div>

                      <div className="p-3.5 hover:bg-zinc-50/80 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-xs text-emerald-700">Attendance Correction Approved ✔</span>
                          <span className="text-[9px] text-[#6B7280] font-mono whitespace-nowrap shrink-0">June 18, 2026</span>
                        </div>
                        <p className="text-[10px] text-[#6B7280] mt-1 leading-relaxed">Punch-in correction for June 17th has been updated in database.</p>
                      </div>

                      {/* Announcements Category */}
                      <div className="px-4 py-2 bg-zinc-50/50 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider font-mono">
                        Portal Announcements
                      </div>

                      <div className="p-3.5 hover:bg-zinc-50/80 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-xs text-indigo-700">[Policy] Health Policy Upgrade</span>
                          <span className="text-[9px] text-[#6B7280] font-mono whitespace-nowrap shrink-0">June 22, 2026</span>
                        </div>
                        <p className="text-[10px] text-[#6B7280] mt-1 leading-relaxed">New CareFirst Gold Health policy is now active for Hyderabad HQ employees.</p>
                      </div>

                      <div className="p-3.5 hover:bg-zinc-50/80 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-xs text-[#111111]">[Update] Cyber Towers Upgrade</span>
                          <span className="text-[9px] text-[#6B7280] font-mono whitespace-nowrap shrink-0">June 18, 2026</span>
                        </div>
                        <p className="text-[10px] text-[#6B7280] mt-1 leading-relaxed">Premium sit-stand desks have been installed in Hyderabad Block A workspaces.</p>
                      </div>

                      <div className="p-3.5 hover:bg-zinc-50/80 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-xs text-indigo-700">[Event] Q3 Product & Design</span>
                          <span className="text-[9px] text-[#6B7280] font-mono whitespace-nowrap shrink-0">June 15, 2026</span>
                        </div>
                        <p className="text-[10px] text-[#6B7280] mt-1 leading-relaxed">Annual general retreat and design alignment sprint has been scheduled.</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button 
              id="header-apply-leave-btn"
              onClick={() => setIsApplyLeaveOpen(true)}
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-[#111111] text-white hover:bg-[#FFDD00] hover:text-[#111111] font-bold text-[10px] sm:text-xs rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span className="xs:hidden">Apply</span>
              <span className="hidden xs:inline">Apply Leave</span>
            </button>
          </div>
        </header>

        {/* Core Layout Content */}
        <main id="main-content-scroll" className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto bg-white">
          {activeTab === 'dashboard' ? (
            /* ==========================================================
               MAIN 12-COLUMN DASHBOARD GRID
               ========================================================== */
            <div id="dashboard-container" className="space-y-8 animate-in fade-in duration-200">
              
              {/* PRIMARY ACTION BAR: Clock-In Hero Widget */}
              <ClockInHero 
                isClockedIn={isClockedIn}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
                sessionStartTime={sessionStartTime}
                previousWorkedSeconds={previousWorkedSeconds}
              />

              {/* KEY METRICS PANEL */}
              <MetricCards 
                profile={profile}
                workedHoursToday={liveWorkedHoursToday}
                streakCount={14}
                onAction={setActiveTab}
                onOpenPayslip={() => setIsPayslipOpen(true)}
                onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
              />

              {/* TWO COLUMN CONTENT: LEFT WIDE, RIGHT NARROW (12 Column grid) */}
              <div id="content-columns-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT MAIN AREA (Span 8) */}
                <div id="dashboard-left-col" className="lg:col-span-8 space-y-8">
                  
                  {/* QUICK ACTIONS CARD */}
                  <div className="bg-[#F7F7F8] border border-[#E5E7EB] rounded-[24px] p-6 minimal-shadow space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#111111]">Quick Operations Engine</h3>
                      <p className="text-xs text-[#6B7280]">Instant shortcuts for regular administrative filings</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'act-leave', label: 'Apply Leave', action: () => setIsApplyLeaveOpen(true), style: 'hover:border-[#FFDD00] hover:bg-[#FFDD00]/5' },
                        { id: 'act-wfh', label: 'Request WFH', action: () => setIsRequestWFHOpen(true), style: 'hover:border-[#FFDD00] hover:bg-[#FFDD00]/5' },
                        { id: 'act-corr', label: 'Correction', action: () => setIsCorrectionOpen(true), style: 'hover:border-[#FFDD00] hover:bg-[#FFDD00]/5' },
                        { id: 'act-payslip', label: 'View Payslip', action: () => setIsPayslipOpen(true), style: 'hover:border-indigo-400 hover:bg-indigo-50/50' },
                      ].map((act) => (
                        <button
                          key={act.id}
                          id={act.id}
                          onClick={act.action}
                          className={`group flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-[#E5E7EB] text-center transition-all cursor-pointer ${act.style}`}
                        >
                          <span className="text-xs font-bold text-[#111111] whitespace-nowrap">{act.label}</span>
                          <div className="flex items-center justify-center mt-2.5 w-6 h-6 rounded-full bg-zinc-50 border border-zinc-100 text-[#6B7280] group-hover:bg-[#FFDD00] group-hover:border-[#FFDD00] group-hover:text-[#111111] transition-all duration-200">
                            <ChevronRight size={13} className="transform group-hover:translate-x-0.5 transition-transform duration-200" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* LEAVE OVERVIEW */}
                  <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 minimal-shadow space-y-6">
                    <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]/60">
                      <div>
                        <h3 className="text-sm font-bold text-[#111111]">Available Leave Balances</h3>
                        <p className="text-xs text-[#6B7280]">Current active quota consumption across key leave buckets</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-display font-extrabold text-[#111111]">{totalAvailableLeaves}</span>
                        <span className="text-xs text-[#6B7280] block">Days Total</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { key: 'EL', value: leaveEL, name: 'Earned Leave', max: 12, color: 'bg-emerald-500' },
                        { key: 'SL', value: leaveSL, name: 'Sick Leave', max: 5, color: 'bg-amber-500' },
                        { key: 'CL', value: leaveCL, name: 'Casual Leave', max: 5, color: 'bg-indigo-500' },
                      ].map((item) => {
                        const pct = (item.value / item.max) * 100;
                        return (
                          <div key={item.key} className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-zinc-800">{item.name} <strong className="font-mono text-[10px] text-zinc-500">({item.key})</strong></span>
                              <span className="font-mono font-bold">{item.value} / {item.max} d</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                              <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                            <p className="text-[10px] text-[#6B7280]">Used: {item.max - item.value} days</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pending leave preview inside dashboard */}
                    {leaveRequests.filter(r => r.status === 'Pending').length > 0 && (
                      <div className="mt-4 p-3 bg-zinc-50 border border-[#E5E7EB] rounded-xl flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-[#111111]">Pending leave approval with manager:</span>
                          <strong className="text-zinc-900 font-mono font-bold">
                            {leaveRequests.filter(r => r.status === 'Pending').reduce((acc, c) => acc + c.days, 0)} days total
                          </strong>
                        </div>
                        <button 
                          id="dash-view-planner-btn"
                          onClick={() => setActiveTab('leave')}
                          className="text-xs font-semibold text-[#111111] hover:underline"
                        >
                          View Planner →
                        </button>
                      </div>
                    )}
                  </div>

                </div>

                {/* RIGHT COLUMN (Span 4) */}
                <div id="dashboard-right-col" className="lg:col-span-4 space-y-8">
                  
                  {/* COMPACT PROFILE DETAILS CARD */}
                  <div className="bg-[#F7F7F8] border border-[#E5E7EB] rounded-[24px] p-6 minimal-shadow space-y-4">
                    <h3 className="text-xs font-bold uppercase font-mono text-[#6B7280] tracking-wider">Employee Snapshot</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={profile.avatarUrl} 
                          alt={profile.name} 
                          className="w-12 h-12 rounded-full object-cover border border-[#E5E7EB] minimal-shadow"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-display font-bold text-sm text-[#111111]">{profile.name}</h4>
                          <p className="text-xs text-[#6B7280]">{profile.role}</p>
                        </div>
                      </div>

                      <div className="divide-y divide-[#E5E7EB]/60 text-xs space-y-2.5 pt-2">
                        <div className="flex justify-between pt-2.5">
                          <span className="text-[#6B7280]">Department</span>
                          <span className="font-semibold">{profile.department}</span>
                        </div>
                        <div className="flex justify-between pt-2.5">
                          <span className="text-[#6B7280]">Employee ID</span>
                          <span className="font-mono font-semibold">{profile.employeeId}</span>
                        </div>
                        <div className="flex justify-between pt-2.5">
                          <span className="text-[#6B7280]">Direct VP</span>
                          <span className="font-semibold text-zinc-800">{profile.manager}</span>
                        </div>
                        <div className="flex justify-between pt-2.5">
                          <span className="text-[#6B7280]">Joined Date</span>
                          <span className="font-semibold">{profile.joinedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UPCOMING EVENTS & HOLIDAYS */}
                  <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 minimal-shadow space-y-4">
                    <h3 className="text-xs font-bold uppercase font-mono text-[#6B7280] tracking-wider">Calendar Highlights</h3>
                    
                    <div className="space-y-3">
                      {/* Highlight Next Holiday */}
                      <div className="bg-amber-50 border border-amber-200/60 p-3.5 rounded-xl space-y-1">
                        <span className="text-[9px] font-mono text-amber-800 font-bold uppercase tracking-wide">Next Company Holiday 🏖</span>
                        <h4 className="text-xs font-bold text-amber-950">Independence Day Break</h4>
                        <div className="flex justify-between text-[11px] text-amber-800 font-mono pt-1">
                          <span>Fri, July 3 (Observed)</span>
                          <span className="font-bold">Restricted Leave</span>
                        </div>
                      </div>

                      {/* Birthdays & Events feed */}
                      <div className="space-y-2.5 pt-1">
                        {[
                          { date: 'June 26', label: '🎂 Aisha Patel Birthday', sub: 'Director of Design, Experience Org' },
                          { date: 'July 17', label: '🌲 Q3 Coastal Retreat Offsite', sub: 'Redwood Lodging, Transit auto-booked' }
                        ].map((event, idx) => (
                          <div key={idx} className="flex gap-3 text-xs">
                            <span className="font-mono text-[#6B7280] text-[10px] w-12 pt-0.5 shrink-0">{event.date}</span>
                            <div>
                              <strong className="font-bold text-[#111111] block">{event.label}</strong>
                              <span className="text-[10px] text-[#6B7280]">{event.sub}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>



                </div>

              </div>

            </div>
          ) : (
            /* ==========================================================
               SUB-TAB VIEW CONTROLLER
               ========================================================== */
            <TabsView 
              activeTab={activeTab}
              profile={profile}
              clockSessions={clockSessions}
              leaveRequests={leaveRequests}
              wfhRequests={wfhRequests}
              corrections={corrections}
              holidays={holidays}
              expenses={expenses}
              onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
              onOpenRequestWFH={() => setIsRequestWFHOpen(true)}
              onOpenCorrection={() => setIsCorrectionOpen(true)}
              onOpenPayslip={() => setIsPayslipOpen(true)}
              onCancelLeave={handleCancelLeave}
              onCancelWFH={handleCancelWFH}
              onOpenRequestExpense={() => setIsRequestExpenseOpen(true)}
            />
          )}
        </main>
      </div>

      {/* ==========================================================
         MODALS CONTAINER
         ========================================================== */}
      <ApplyLeaveModal 
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        profile={profile}
        onSubmit={handleApplyLeave}
      />

      <RequestWFHModal 
        isOpen={isRequestWFHOpen}
        onClose={() => setIsRequestWFHOpen(false)}
        onSubmit={handleRequestWFH}
      />

      <AttendanceCorrectionModal 
        isOpen={isCorrectionOpen}
        onClose={() => setIsCorrectionOpen(false)}
        onSubmit={handleAttendanceCorrection}
      />

      <PayslipDetailModal 
        isOpen={isPayslipOpen}
        onClose={() => setIsPayslipOpen(false)}
        profile={profile}
      />

      <RequestExpenseModal
        isOpen={isRequestExpenseOpen}
        onClose={() => setIsRequestExpenseOpen(false)}
        onSubmit={handleRequestExpense}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onUpdate={(updated) => {
          setProfile(updated);
          showToast('Employee profile details updated successfully!');
        }}
      />

    </div>
  );
}
