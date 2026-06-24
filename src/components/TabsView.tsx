/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Hourglass, 
  Plus, 
  Download, 
  FileText, 
  Eye, 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Briefcase, 
  TrendingUp, 
  FileDown,
  CalendarCheck,
  Plane,
  Home,
  Check,
  RefreshCw
} from 'lucide-react';
import { EmployeeProfile, ClockSession, LeaveRequest, WFHRequest, AttendanceCorrection, Holiday, LeaveType, ExpenseRequest } from '../types';

interface TabsViewProps {
  activeTab: string;
  profile: EmployeeProfile;
  clockSessions: ClockSession[];
  leaveRequests: LeaveRequest[];
  wfhRequests: WFHRequest[];
  corrections: AttendanceCorrection[];
  holidays: Holiday[];
  expenses: ExpenseRequest[];
  onOpenApplyLeave: () => void;
  onOpenRequestWFH: () => void;
  onOpenCorrection: () => void;
  onOpenPayslip: () => void;
  onCancelLeave: (id: string) => void;
  onCancelWFH: (id: string) => void;
  onOpenRequestExpense: () => void;
}

export default function TabsView({
  activeTab,
  profile,
  clockSessions,
  leaveRequests,
  wfhRequests,
  corrections,
  holidays,
  expenses,
  onOpenApplyLeave,
  onOpenRequestWFH,
  onOpenCorrection,
  onOpenPayslip,
  onCancelLeave,
  onCancelWFH,
  onOpenRequestExpense
}: TabsViewProps) {
  
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [helpSearchQuery, setHelpSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [downloadSuccessDocId, setDownloadSuccessDocId] = useState<string | null>(null);

  // Download logic helper
  const triggerDocDownload = (docId: string) => {
    setDownloadingDocId(docId);
    setTimeout(() => {
      setDownloadingDocId(null);
      setDownloadSuccessDocId(docId);
      setTimeout(() => setDownloadSuccessDocId(null), 2500);
    }, 1200);
  };

  /* ==========================================================
     1. ATTENDANCE LOG VIEW
     ========================================================== */
  if (activeTab === 'attendance') {
    return (
      <div id="attendance-log-tab" className="space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[#111111]">Attendance & Timesheet Logs</h2>
            <p className="text-xs text-[#6B7280]">View chronological punch-in records, working duration, and pending corrections</p>
          </div>
          <button
            id="tab-request-correction-btn"
            onClick={onOpenCorrection}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white hover:bg-[#FFDD00] hover:text-[#111111] font-semibold text-xs transition-colors cursor-pointer minimal-shadow"
          >
            <Plus size={14} />
            <span>Request Correction</span>
          </button>
        </div>

        {/* Correction proposals status table */}
        {corrections.length > 0 && (
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <AlertCircle size={14} className="text-amber-700" />
              Active Correction Requests ({corrections.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-amber-200/50 text-amber-800 font-mono text-[10px]">
                    <th className="pb-2">Date Requested</th>
                    <th className="pb-2">Affected Date</th>
                    <th className="pb-2">Proposed Timings</th>
                    <th className="pb-2">Reason</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200/30 text-amber-950 font-medium">
                  {corrections.map((corr) => (
                    <tr key={corr.id} className="hover:bg-amber-100/10">
                      <td className="py-2.5 font-mono">{corr.appliedOn}</td>
                      <td className="py-2.5 font-semibold">{corr.date}</td>
                      <td className="py-2.5 font-mono text-[11px]">
                        <span className="line-through text-amber-700 opacity-60 mr-1.5">{corr.originalIn} - {corr.originalOut}</span>
                        <span className="bg-amber-200 px-1.5 py-0.5 rounded text-[#111111] font-bold">{corr.correctedIn} - {corr.correctedOut}</span>
                      </td>
                      <td className="py-2.5 truncate max-w-xs">{corr.reason}</td>
                      <td className="py-2.5 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200 font-mono">
                          Pending Approval
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Primary log table */}
        <div className="bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl overflow-hidden minimal-shadow">
          <div className="px-6 py-4 border-b border-[#ECECEC] bg-[#F7F7F8] flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider font-mono">Chronological Logs</h3>
            <span className="text-[11px] text-[#6B7280] font-mono">Showing last 5 active shifts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ECECEC] text-[10px] font-mono text-[#6B7280] bg-[#F7F7F8]/40 uppercase">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Punch In</th>
                  <th className="px-6 py-3">Punch Out</th>
                  <th className="px-6 py-3">Hours Logged</th>
                  <th className="px-6 py-3">Session Status</th>
                  <th className="px-6 py-3">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC] text-xs font-medium text-[#111111]">
                {clockSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-[#F7F7F8] transition-colors">
                    <td className="px-6 py-4 font-mono font-bold">{session.date}</td>
                    <td className="px-6 py-4 font-mono text-zinc-600">{session.clockInTime}</td>
                    <td className="px-6 py-4 font-mono text-zinc-600">{session.clockOutTime || '--:--:--'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#111111]">{session.totalHours.toFixed(2)}h</span>
                        <div className="w-12 h-1 bg-zinc-200 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className="h-full bg-[#111111]" 
                            style={{ width: `${Math.min(100, (session.totalHours / 9) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {session.status === 'On Time' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono">
                          On Time
                        </span>
                      )}
                      {session.status === 'Late' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-100 font-mono">
                          Late Punch
                        </span>
                      )}
                      {session.status === 'WFH' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-100 font-mono">
                          Remote WFH
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-sans flex items-center gap-1.5">
                      <MapPin size={12} className="text-zinc-400" />
                      {session.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     2. LEAVE PLANNER VIEW
     ========================================================== */
  if (activeTab === 'leave') {
    return (
      <div id="leave-planner-tab" className="space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[#111111]">Leave Planner & Balances</h2>
            <p className="text-xs text-[#6B7280]">Book paid time off and review historical absence summaries</p>
          </div>
          <button
            id="tab-apply-leave-btn"
            onClick={onOpenApplyLeave}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white hover:bg-[#FFDD00] hover:text-[#111111] font-semibold text-xs transition-colors cursor-pointer minimal-shadow"
          >
            <Plus size={14} />
            <span>Apply For Leave</span>
          </button>
        </div>

        {/* Dynamic Balances breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { key: 'EL', label: 'Earned Leave (EL)', desc: 'Annual quota, accrues monthly', color: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-800 border-emerald-100' },
            { key: 'SL', label: 'Sick Leave (SL)', desc: 'Medical emergencies & dental', color: 'bg-amber-500', bg: 'bg-amber-50 text-amber-800 border-amber-100' },
            { key: 'CL', label: 'Casual Leave (CL)', desc: 'Unplanned short absences', color: 'bg-indigo-500', bg: 'bg-indigo-50 text-indigo-800 border-indigo-100' }
          ].map((type) => {
            const code = type.key as LeaveType;
            const balance = profile.availableLeave[code];
            const max = code === 'EL' ? 12 : code === 'SL' ? 5 : 5;
            const percentage = (balance / max) * 100;

            return (
              <div key={code} className="bg-white border border-[#ECECEC] rounded-2xl p-5 minimal-shadow space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-[#111111] font-display">{type.label}</h3>
                    <p className="text-[10px] text-[#6B7280]">{type.desc}</p>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${type.bg} font-bold`}>
                    {balance}/{max} Left
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-[#6B7280]">
                    <span>Quota Consumption</span>
                    <span>{percentage.toFixed(0)}% Available</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${type.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leave Requests historical lists */}
        <div className="bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl overflow-hidden minimal-shadow">
          <div className="px-6 py-4 border-b border-[#ECECEC] bg-[#F7F7F8] flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider font-mono">Leave Applications</h3>
            <span className="text-[11px] text-[#6B7280] font-mono">Current & Historical Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ECECEC] text-[10px] font-mono text-[#6B7280] bg-[#F7F7F8]/40 uppercase">
                  <th className="px-6 py-3">Applied On</th>
                  <th className="px-6 py-3">Absence Period</th>
                  <th className="px-6 py-3">Leave Type</th>
                  <th className="px-6 py-3">Total Days</th>
                  <th className="px-6 py-3">Reason / Justification</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC] text-xs font-medium text-[#111111]">
                {leaveRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#F7F7F8] transition-colors">
                    <td className="px-6 py-4 font-mono text-zinc-500">{req.appliedOn}</td>
                    <td className="px-6 py-4 font-bold text-[#111111]">
                      {req.startDate} <span className="text-[#6B7280] font-normal mx-1">to</span> {req.endDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        req.type === 'EL' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                        req.type === 'SL' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                        'bg-indigo-50 text-indigo-800 border border-indigo-100'
                      }`}>
                        {req.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-[#111111]">{req.days} Day(s)</td>
                    <td className="px-6 py-4 text-zinc-500 truncate max-w-[200px]" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-6 py-4">
                      {req.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono">
                          Approved
                        </span>
                      )}
                      {req.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-100 font-mono animate-pulse">
                          Pending Approval
                        </span>
                      )}
                      {req.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-100 font-mono">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'Pending' ? (
                        <button
                          id={`cancel-leave-btn-${req.id}`}
                          onClick={() => onCancelLeave(req.id)}
                          className="text-rose-600 hover:text-rose-800 font-semibold hover:underline text-xs"
                        >
                          Cancel Request
                        </button>
                      ) : (
                        <span className="text-[#6B7280] font-mono text-[10px]">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     3. WFH REQUESTS VIEW
     ========================================================== */
  if (activeTab === 'wfh') {
    return (
      <div id="wfh-requests-tab" className="space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[#111111]">Work From Home (WFH) Proposals</h2>
            <p className="text-xs text-[#6B7280]">File custom telecommuting requests and view calendar distribution</p>
          </div>
          <button
            id="tab-request-wfh-btn"
            onClick={onOpenRequestWFH}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white hover:bg-[#FFDD00] hover:text-[#111111] font-semibold text-xs transition-colors cursor-pointer minimal-shadow"
          >
            <Plus size={14} />
            <span>Request WFH Date</span>
          </button>
        </div>

        {/* Simple visual checklist explaining WFH policy */}
        <div className="bg-[#F7F7F8] border border-[#ECECEC] rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[#111111]">Active Company WFH Guidelines</h4>
            <p className="text-xs text-[#6B7280] max-w-xl">
              Our hybrid framework supports up to <strong>2 remote days per week</strong>. Any requests exceeding 3 consecutive business days require VP direct approval.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-mono">
            <div className="border-l-2 border-indigo-500 pl-3">
              <span className="text-[#6B7280] block text-[10px]">Used This Month</span>
              <strong className="text-zinc-900 font-bold">4 Days</strong>
            </div>
            <div className="border-l-2 border-emerald-500 pl-3">
              <span className="text-[#6B7280] block text-[10px]">Approved Pending</span>
              <strong className="text-zinc-900 font-bold">1 Day</strong>
            </div>
          </div>
        </div>

        {/* WFH historical table */}
        <div className="bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl overflow-hidden minimal-shadow">
          <div className="px-6 py-4 border-b border-[#ECECEC] bg-[#F7F7F8] flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider font-mono">Active Remote Schedules</h3>
            <span className="text-[11px] text-[#6B7280] font-mono">Approved telecommute bookings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ECECEC] text-[10px] font-mono text-[#6B7280] bg-[#F7F7F8]/40 uppercase">
                  <th className="px-6 py-3">Applied On</th>
                  <th className="px-6 py-3">WFH Date Range</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Primary Justification</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC] text-xs font-medium text-[#111111]">
                {wfhRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#F7F7F8] transition-colors">
                    <td className="px-6 py-4 font-mono text-zinc-500">{req.appliedOn}</td>
                    <td className="px-6 py-4 font-bold text-[#111111]">
                      {req.startDate} <span className="text-[#6B7280] font-normal mx-1">to</span> {req.endDate}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">{req.days} Day(s)</td>
                    <td className="px-6 py-4 text-zinc-500 max-w-[240px] truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-6 py-4">
                      {req.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono">
                          Approved
                        </span>
                      )}
                      {req.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-100 font-mono animate-pulse">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'Pending' ? (
                        <button
                          id={`cancel-wfh-btn-${req.id}`}
                          onClick={() => onCancelWFH(req.id)}
                          className="text-rose-600 hover:text-rose-800 font-semibold hover:underline text-xs"
                        >
                          Cancel Request
                        </button>
                      ) : (
                        <span className="text-[#6B7280] font-mono text-[10px]">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     4. PAYSLIP & EQUITY VIEW
     ========================================================== */
  if (activeTab === 'payslip') {
    return (
      <div id="payroll-tab" className="space-y-6 animate-in fade-in duration-200">
        <div>
          <h2 className="font-display font-bold text-lg text-[#111111]">Payslips & Equity Compensation</h2>
          <p className="text-xs text-[#6B7280]">Review your financial payouts, tax filings, and equity vesting status</p>
        </div>

        {/* Financial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Recent Payments Card */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 minimal-shadow space-y-4">
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Briefcase size={14} className="text-zinc-600" />
              Recent Salary Payouts
            </h3>
            
            <div className="divide-y divide-[#ECECEC] text-xs font-medium">
              {[
                { cycle: 'June 2026', amount: '₹1,25,000.00', date: 'June 25, 2026', status: 'Succeeded' },
                { cycle: 'May 2026', amount: '₹1,25,000.00', date: 'May 25, 2026', status: 'Succeeded' },
                { cycle: 'April 2026', amount: '₹1,25,000.00', date: 'April 25, 2026', status: 'Succeeded' },
                { cycle: 'March 2026', amount: '₹1,25,000.00', date: 'March 25, 2026', status: 'Succeeded' },
              ].map((slip, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <p className="font-bold text-[#111111]">{slip.cycle}</p>
                    <p className="text-[10px] text-[#6B7280]">{slip.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-[#111111]">{slip.amount}</span>
                    <button 
                      id={`view-payslip-row-btn-${idx}`}
                      onClick={onOpenPayslip}
                      className="p-1.5 rounded-lg border border-[#ECECEC] bg-white text-zinc-700 hover:bg-[#F7F7F8] hover:text-[#111111]"
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equity Stock Tracker */}
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 minimal-shadow space-y-4">
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-zinc-600" />
              Stock Options Vesting (ISO)
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-[#6B7280] font-semibold">Total Shares Granted</span>
                  <p className="text-2xl font-display font-bold text-[#111111]">24,000 Shares</p>
                  <p className="text-[10px] font-mono text-emerald-600 font-bold">Options price: INR 1,025 / Grant value: INR 2.46 Crores</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#6B7280] font-semibold">Vesting Completion</span>
                  <p className="text-2xl font-display font-bold text-indigo-600">52.0%</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#111111] to-indigo-600 rounded-full" style={{ width: '52%' }} />
                </div>
                <div className="flex justify-between font-mono text-[9px] text-[#6B7280]">
                  <span>Vested: 12,480 Shares</span>
                  <span>Unvested: 11,520 Shares</span>
                </div>
              </div>

              {/* Vesting details timeline info */}
              <div className="bg-[#F7F7F8] border border-[#ECECEC] p-3 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Next Vest Date</span>
                  <span className="font-mono font-bold text-[#111111]">July 15, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Shares to Vest</span>
                  <span className="font-mono font-bold text-[#111111]">500 Shares</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#6B7280]">Vesting Schedule</span>
                  <span className="font-semibold text-indigo-700">4-Year vesting (1-Yr Cliff)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ==========================================================
     5. DOCUMENTS VIEW
     ========================================================== */
  if (activeTab === 'documents') {
    const documentsList = [
      { id: 'doc-01', name: 'CareFirst Gold Select Coverage Brochure.pdf', category: 'Health & Wellness', size: '2.4 MB', date: 'June 20, 2026' },
      { id: 'doc-02', name: 'Q2 Company OKRs & Design Goals.pdf', category: 'Operational', size: '1.1 MB', date: 'April 02, 2026' },
      { id: 'doc-03', name: 'Employee Handbook & Code of Conduct.pdf', category: 'Policy Documents', size: '4.8 MB', date: 'Jan 10, 2026' },
      { id: 'doc-04', name: 'IRS W-4 Federal Tax Withholding.pdf', category: 'Payroll & Tax', size: '512 KB', date: 'Jan 02, 2026' },
      { id: 'doc-05', name: 'Direct Deposit Enrollment Authorization.pdf', category: 'Payroll & Tax', size: '720 KB', date: 'Dec 18, 2025' }
    ];

    const filteredDocs = documentsList.filter(doc => 
      doc.name.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(docSearchQuery.toLowerCase())
    );

    return (
      <div id="documents-tab" className="space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[#111111]">Documents Directory</h2>
            <p className="text-xs text-[#6B7280]">Download active policies, operational handouts, and signed W-2 tax slips</p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-zinc-400" size={14} />
            <input
              id="doc-search-input"
              type="text"
              placeholder="Search documents..."
              value={docSearchQuery}
              onChange={(e) => setDocSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 border border-[#ECECEC] rounded-xl bg-white focus:outline-none focus:border-[#FFDD00]"
            />
          </div>
        </div>

        {/* Directory Listing */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl overflow-hidden minimal-shadow">
          <div className="divide-y divide-[#ECECEC] font-medium text-xs text-[#111111]">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => {
                const isDownloading = downloadingDocId === doc.id;
                const isSuccess = downloadSuccessDocId === doc.id;
                return (
                  <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F7F7F8] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 shrink-0">
                        <FileText size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#111111]">{doc.name}</h4>
                        <div className="flex gap-2 text-[10px] text-[#6B7280] font-mono mt-0.5">
                          <span>{doc.category}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Updated {doc.date}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`download-doc-btn-${doc.id}`}
                      onClick={() => triggerDocDownload(doc.id)}
                      disabled={isDownloading}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold self-start sm:self-center transition-all ${
                        isSuccess
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-white border-[#ECECEC] text-[#111111] hover:bg-[#F7F7F8]'
                      }`}
                    >
                      {isDownloading ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : isSuccess ? (
                        <Check size={12} />
                      ) : (
                        <Download size={12} />
                      )}
                      <span>{isDownloading ? 'Downloading...' : isSuccess ? 'Downloaded!' : 'Download'}</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-zinc-500">
                <Search size={24} className="mx-auto mb-2 opacity-30 text-[#111111]" />
                <p>No matching corporate documents found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     6. HELP CENTER VIEW
     ========================================================== */
  if (activeTab === 'help') {
    const faqs = [
      { id: 1, q: 'How do I submit an attendance correction for a missed punch?', a: 'Click the "Attendance Correction" quick action button on the dashboard, specify the date and proposed timings, input the core justification, and click submit. Your direct VP or manager will review and approve within 24 hours.' },
      { id: 2, q: 'When is our monthly payroll cycle settled?', a: 'Payroll is processed on the 23rd of each month. Disbursements/bank transfers are initiated on the 24th, with funds usually clearing on the 25th depending on Citibank and local routing schedules.' },
      { id: 3, q: 'How do I download the health insurance active cards?', a: 'Navigate to the Resources > Documents section in the left sidebar, locate the document named "CareFirst Gold Select Coverage Brochure.pdf" and click Download. Updated cards are included on page 3.' },
      { id: 4, q: 'What is the company policy regarding hybrid remote work?', a: 'Employees can work remotely up to 2 days per week (hybrid plan) without prior approval, provided their presence isn\'t required for in-person design sprints or client meetings. Simply file a WFH Request for tracking purposes.' },
      { id: 5, q: 'Are unused casual leaves carried forward to the next year?', a: 'Casual leaves (CL) and Sick leaves (SL) expire annually on December 31st and do not carry forward. Earned leaves (EL) can be rolled over up to a maximum accumulation limit of 30 days.' }
    ];

    const filteredFaqs = faqs.filter(faq =>
      faq.q.toLowerCase().includes(helpSearchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(helpSearchQuery.toLowerCase())
    );

    return (
      <div id="help-tab" className="space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[#111111]">HR Help Center & FAQ</h2>
            <p className="text-xs text-[#6B7280]">Find solutions to common operational workflows and payroll guidelines</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-zinc-400" size={14} />
            <input
              id="help-search-input"
              type="text"
              placeholder="Search help guide..."
              value={helpSearchQuery}
              onChange={(e) => setHelpSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 border border-[#ECECEC] rounded-xl bg-white focus:outline-none focus:border-[#FFDD00]"
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl overflow-hidden minimal-shadow divide-y divide-[#ECECEC]">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="transition-all duration-150">
                  <button
                    id={`faq-btn-${faq.id}`}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 font-bold text-sm text-[#111111] hover:bg-[#F7F7F8] flex justify-between items-center gap-4 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} className="text-[#6B7280]" /> : <ChevronDown size={16} className="text-[#6B7280]" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#6B7280] leading-relaxed bg-[#F7F7F8]/40 border-t border-[#ECECEC]/30 font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-zinc-500">
              <HelpCircle size={24} className="mx-auto mb-2 opacity-30 text-[#111111]" />
              <p>No matching guidelines or articles found.</p>
            </div>
          )}
        </div>

        {/* HR escalation block */}
        <div className="p-6 bg-[#F7F7F8] border border-[#ECECEC] rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#111111]">Need direct assistance or escalation?</h4>
            <p className="text-xs text-[#6B7280] max-w-xl">
              If you have specific questions about contracts, compensation, or personal accommodations, reach out to our support ticket system.
            </p>
          </div>
          <a
            href="mailto:723msfree@gmail.com?subject=HRMS%20Support%20Ticket"
            className="px-4 py-2 bg-zinc-900 hover:bg-[#FFDD00] hover:text-[#111111] text-white rounded-xl text-xs font-bold transition-all inline-block text-center whitespace-nowrap"
          >
            Email HR Desk
          </a>
        </div>
      </div>
    );
  }

  /* ==========================================================
     7. EXPENSES VIEW
     ========================================================== */
  if (activeTab === 'expenses') {
    const totalClaimed = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const approvedAmount = expenses.filter(e => e.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0);
    const pendingAmount = expenses.filter(e => e.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

    return (
      <div id="expenses-tab" className="space-y-6 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[#111111]">Expense Claims & Reimbursements</h2>
            <p className="text-xs text-[#6B7280]">Request and track claims for business travel, meals, utilities, and equipment</p>
          </div>
          <button
            id="file-expense-tab-btn"
            onClick={onOpenRequestExpense}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white hover:bg-[#FFDD00] hover:text-[#111111] font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer self-start sm:self-center whitespace-nowrap"
          >
            <Plus size={14} />
            <span>File Expense Claim</span>
          </button>
        </div>

        {/* Expenses Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-5 minimal-shadow">
            <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider font-mono">Total Claims Filed</span>
            <p className="text-2xl font-display font-bold text-[#111111] mt-1">{expenses.length} Claims</p>
            <p className="text-[10px] text-[#6B7280] mt-0.5">Cumulative: ₹{totalClaimed.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-5 minimal-shadow">
            <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider font-mono">Approved Amount</span>
            <p className="text-2xl font-display font-bold text-emerald-600 mt-1">₹{approvedAmount.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">Reimbursements disbursed</p>
          </div>
          <div className="bg-white border border-[#ECECEC] rounded-2xl p-5 minimal-shadow">
            <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider font-mono">Pending Verification</span>
            <p className="text-2xl font-display font-bold text-[#FFDD00] mt-1">₹{pendingAmount.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Awaiting management audit</p>
          </div>
        </div>

        {/* Previous Claims Table */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl overflow-hidden minimal-shadow">
          <div className="px-6 py-4 border-b border-[#ECECEC] bg-zinc-50/40">
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-[#6B7280]">Reimbursement Ledger</h3>
          </div>

          <div className="overflow-x-auto font-sans">
            {expenses.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#ECECEC] text-[10px] font-bold uppercase font-mono text-[#6B7280] bg-zinc-50/20">
                    <th className="p-4 pl-6">Claim Date</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Attachment</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-center pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECECEC] text-xs font-medium text-[#111111]">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-zinc-50/30 transition-colors">
                      <td className="p-4 pl-6 font-mono text-[11px] text-[#6B7280] whitespace-nowrap">{exp.date}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          exp.category === 'Travel' ? 'bg-amber-50 text-amber-800' :
                          exp.category === 'Food' ? 'bg-orange-50 text-orange-800' :
                          exp.category === 'Equipment' ? 'bg-indigo-50 text-indigo-800' :
                          exp.category === 'Utilities' ? 'bg-sky-50 text-sky-800' :
                          'bg-zinc-100 text-zinc-800'
                        }`}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs truncate" title={exp.description}>
                        {exp.description}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {exp.receiptName ? (
                          <div className="flex items-center gap-1.5 text-[#6B7280] font-mono text-[10px]">
                            <FileText size={12} className="text-zinc-500 shrink-0" />
                            <span className="truncate max-w-[120px]" title={exp.receiptName}>{exp.receiptName}</span>
                          </div>
                        ) : (
                          <span className="text-[#6B7280] italic text-[10px]">No attachment</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono font-bold whitespace-nowrap">₹{exp.amount.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-center pr-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          exp.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                          exp.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${
                            exp.status === 'Approved' ? 'bg-emerald-500' :
                            exp.status === 'Pending' ? 'bg-amber-500' :
                            'bg-rose-500'
                          }`} />
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-10 text-center text-zinc-400 space-y-2">
                <FileText size={32} className="mx-auto text-zinc-300" />
                <p className="text-xs">No expense reimbursement requests logged yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
