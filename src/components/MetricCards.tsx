/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Hourglass, 
  CalendarCheck, 
  Palmtree, 
  FileText, 
  ArrowUpRight, 
  Flame, 
  ChevronRight,
  Download
} from 'lucide-react';
import { EmployeeProfile } from '../types';

interface MetricCardsProps {
  profile: EmployeeProfile;
  workedHoursToday: number;
  streakCount: number;
  onAction: (tabId: string) => void;
  onOpenPayslip: () => void;
  onOpenApplyLeave: () => void;
}

export default function MetricCards({
  profile,
  workedHoursToday,
  streakCount,
  onAction,
  onOpenPayslip,
  onOpenApplyLeave
}: MetricCardsProps) {
  
  const totalLeave = profile.availableLeave.EL + profile.availableLeave.SL + profile.availableLeave.CL;

  return (
    <div id="metric-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      
      {/* 1. Hours Today Card */}
      <div 
        id="metric-hours-card"
        className="bg-[#F7F7F8] border border-[#ECECEC] rounded-[24px] p-5 shadow-xs flex flex-col justify-between group hover:border-[#111111] transition-colors duration-200"
      >
        <div className="flex justify-between items-start">
          <p className="text-[11px] text-[#6B7280] uppercase font-bold tracking-wide">Hours Today</p>
          <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200/50">
            Shift Progress
          </span>
        </div>
        
        <div className="mt-3 space-y-1">
          <p className="text-2xl font-bold text-[#111111]">{workedHoursToday.toFixed(1)}h / 9.0h</p>
          <div className="mt-3 h-1 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
            <div 
              className="bg-[#111111] h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (workedHoursToday / 9.0) * 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#ECECEC]/60 flex items-center justify-between text-[11px] text-[#6B7280]">
          <span>Min. requirement: 4.5h</span>
          <button 
            id="view-timesheet-btn"
            onClick={() => onAction('attendance')}
            className="text-[#111111] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            Timesheet <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* 2. Attendance Stats Card */}
      <div 
        id="metric-attendance-card"
        className="bg-[#F7F7F8] border border-[#ECECEC] rounded-[24px] p-5 shadow-xs flex flex-col justify-between group hover:border-[#111111] transition-colors duration-200"
      >
        <div className="flex justify-between items-start">
          <p className="text-[11px] text-[#6B7280] uppercase font-bold tracking-wide">Work Streak</p>
          <span className="text-[10px] font-mono bg-orange-50 text-orange-800 px-2 py-0.5 rounded-md border border-orange-200/50">
            Active 🔥
          </span>
        </div>
        
        <div className="mt-3 space-y-1">
          <p className="text-2xl font-bold text-[#111111]">{streakCount} Days</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">On-Time Attendance: 98%</p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#ECECEC]/60 flex items-center justify-between text-[11px] text-[#6B7280]">
          <span>June Attendance: 100%</span>
          <button 
            id="correction-request-btn"
            onClick={() => onAction('attendance')}
            className="text-[#111111] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            Correction <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* 3. Leave Balance Card */}
      <div 
        id="metric-leave-card"
        className="bg-[#F7F7F8] border border-[#ECECEC] rounded-[24px] p-5 shadow-xs flex flex-col justify-between group hover:border-[#111111] transition-colors duration-200"
      >
        <div className="flex justify-between items-start">
          <p className="text-[11px] text-[#6B7280] uppercase font-bold tracking-wide">Leave Balance</p>
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200/50">
            Available Balance
          </span>
        </div>
        
        <div className="mt-3 space-y-1">
          <p className="text-2xl font-bold text-[#111111]">{totalLeave} Days</p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Ready to use this cycle</p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#ECECEC]/60 flex items-center justify-between text-[11px] text-[#6B7280]">
          <div className="flex gap-2 font-mono text-[10px]">
            <span>EL <strong className="text-[#111111]">{profile.availableLeave.EL}</strong></span>
            <span>SL <strong className="text-[#111111]">{profile.availableLeave.SL}</strong></span>
            <span>CL <strong className="text-[#111111]">{profile.availableLeave.CL}</strong></span>
          </div>
          <button 
            id="apply-leave-metric-btn"
            onClick={onOpenApplyLeave}
            className="text-[#111111] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            Apply <ArrowUpRight size={12} />
          </button>
        </div>
      </div>

      {/* 4. Latest Payslip Card */}
      <div 
        id="metric-payroll-card"
        className="bg-[#F7F7F8] border border-[#ECECEC] rounded-[24px] p-5 shadow-xs flex flex-col justify-between group hover:border-[#111111] transition-colors duration-200"
      >
        <div className="flex justify-between items-start">
          <p className="text-[11px] text-[#6B7280] uppercase font-bold tracking-wide">Latest Payslip</p>
          <span className="text-[10px] font-mono bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-md border border-[#E5E7EB]">
            Released
          </span>
        </div>
        
        <div className="mt-3 space-y-1">
          <p className="text-2xl font-bold text-[#111111]">₹1,25,000.00</p>
          <p className="text-[11px] text-[#6B7280] mt-1">Released 4 days ago</p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#ECECEC]/60 flex items-center justify-between text-[11px] text-[#6B7280]">
          <span>Cycle: June 2026</span>
          <button 
            id="view-payslip-metric-btn"
            onClick={onOpenPayslip}
            className="text-[#111111] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Download size={11} />
            <span>Details</span>
          </button>
        </div>
      </div>

    </div>
  );
}
