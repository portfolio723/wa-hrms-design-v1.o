/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Check, FileText, Download, Printer, User, DollarSign, RefreshCw, Info, CalendarCheck } from 'lucide-react';
import { EmployeeProfile, LeaveType } from '../types';

// Helper to calculate diff days
const calculateDaysDiff = (start: string, end: string) => {
  if (!start || !end) return 1;
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;
  const diffTime = e.getTime() - s.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 1;
};

/* ==========================================================
   1. APPLY LEAVE MODAL
   ========================================================== */
interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: EmployeeProfile;
  onSubmit: (type: LeaveType, start: string, end: string, days: number, reason: string) => void;
}

export function ApplyLeaveModal({ isOpen, onClose, profile, onSubmit }: ApplyLeaveModalProps) {
  const [leaveType, setLeaveType] = useState<LeaveType>('EL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [calculatedDays, setCalculatedDays] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      const days = calculateDaysDiff(startDate, endDate);
      setCalculatedDays(days);
      
      const balance = profile.availableLeave[leaveType];
      if (days > balance) {
        setError(`Requested ${days} days exceeds your available ${leaveType} balance of ${balance} days.`);
      } else {
        setError('');
      }
    }
  }, [startDate, endDate, leaveType, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      setError('Please fill in all fields.');
      return;
    }
    const days = calculateDaysDiff(startDate, endDate);
    const balance = profile.availableLeave[leaveType];
    if (days > balance) {
      setError(`Cannot apply. Leaves exceed available ${leaveType} balance.`);
      return;
    }
    onSubmit(leaveType, startDate, endDate, days, reason);
    // Reset
    setStartDate('');
    setEndDate('');
    setReason('');
    onClose();
  };

  const getLeaveName = (type: LeaveType) => {
    if (type === 'EL') return 'Earned Leave (EL)';
    if (type === 'SL') return 'Sick Leave (SL)';
    return 'Casual Leave (CL)';
  };

  return (
    <div id="apply-leave-modal-overlay" className="fixed inset-0 bg-[#111111]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div 
        id="apply-leave-modal-content"
        className="bg-[#FFFFFF] border border-[#ECECEC] rounded-[24px] w-full max-w-lg overflow-hidden minimal-shadow animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-6 py-5 border-b border-[#ECECEC] flex justify-between items-center bg-[#F7F7F8]">
          <div>
            <h2 className="font-display font-bold text-base text-[#111111]">Apply for Leave</h2>
            <p className="text-[11px] text-[#6B7280]">Plan your time off with transparent balance calculations</p>
          </div>
          <button id="close-leave-modal-btn" onClick={onClose} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#ECECEC] hover:text-[#111111]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Balances summary */}
          <div className="grid grid-cols-3 gap-3 bg-[#F7F7F8] p-3 rounded-xl border border-[#ECECEC]">
            {['EL', 'SL', 'CL'].map((t) => {
              const type = t as LeaveType;
              const isSelected = leaveType === type;
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => setLeaveType(type)}
                  className={`p-2.5 rounded-lg text-center border transition-all ${
                    isSelected 
                      ? 'bg-[#111111] border-[#111111] text-white' 
                      : 'bg-white border-[#ECECEC] text-[#111111] hover:border-zinc-400'
                  }`}
                >
                  <p className="text-[10px] font-mono tracking-wider font-bold opacity-80">{type}</p>
                  <p className="text-lg font-display font-bold">{profile.availableLeave[type]}</p>
                  <p className="text-[9px] opacity-60">Days Available</p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#6B7280]">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs border border-[#ECECEC] rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-[#FFDD00] focus:ring-1 focus:ring-[#FFDD00]"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#6B7280]">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs border border-[#ECECEC] rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-[#FFDD00] focus:ring-1 focus:ring-[#FFDD00]"
                  required
                />
              </div>
            </div>
          </div>

          {startDate && endDate && !error && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3 rounded-xl flex items-center gap-2 text-xs">
              <Check size={14} className="text-emerald-600 shrink-0" />
              <span>You are applying for <strong className="font-bold">{calculatedDays} day(s)</strong> of {getLeaveName(leaveType)}.</span>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 text-rose-800 border border-rose-100 p-3 rounded-xl flex items-start gap-2 text-xs">
              <Info size={14} className="text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#6B7280]">Reason for Absence</label>
            <textarea
              rows={3}
              placeholder="Please provide details for your manager to review..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs border border-[#ECECEC] rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#FFDD00] focus:ring-1 focus:ring-[#FFDD00]"
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-semibold rounded-xl border border-[#ECECEC] bg-white text-[#111111] hover:bg-[#F7F7F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-xs font-semibold rounded-xl bg-[#111111] text-white hover:bg-[#FFDD00] hover:text-[#111111] transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


/* ==========================================================
   2. REQUEST WFH MODAL
   ========================================================== */
interface RequestWFHModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (start: string, end: string, days: number, reason: string) => void;
}

export function RequestWFHModal({ isOpen, onClose, onSubmit }: RequestWFHModalProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [calculatedDays, setCalculatedDays] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      const days = calculateDaysDiff(startDate, endDate);
      setCalculatedDays(days);
      setError('');
    }
  }, [startDate, endDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      setError('Please fill in all fields.');
      return;
    }
    const days = calculateDaysDiff(startDate, endDate);
    onSubmit(startDate, endDate, days, reason);
    setStartDate('');
    setEndDate('');
    setReason('');
    onClose();
  };

  return (
    <div id="wfh-modal-overlay" className="fixed inset-0 bg-[#111111]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div 
        id="wfh-modal-content"
        className="bg-[#FFFFFF] border border-[#ECECEC] rounded-[24px] w-full max-w-lg overflow-hidden minimal-shadow animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-6 py-5 border-b border-[#ECECEC] flex justify-between items-center bg-[#F7F7F8]">
          <div>
            <h2 className="font-display font-bold text-base text-[#111111]">Request Work From Home</h2>
            <p className="text-[11px] text-[#6B7280]">Submit a remote-work proposal with schedule duration</p>
          </div>
          <button id="close-wfh-modal-btn" onClick={onClose} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#ECECEC] hover:text-[#111111]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#6B7280]">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs border border-[#ECECEC] rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-[#FFDD00] focus:ring-1 focus:ring-[#FFDD00]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#6B7280]">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs border border-[#ECECEC] rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-[#FFDD00] focus:ring-1 focus:ring-[#FFDD00]"
                required
              />
            </div>
          </div>

          {startDate && endDate && (
            <div className="bg-amber-50 text-amber-800 border border-amber-100 p-3 rounded-xl flex items-center gap-2 text-xs">
              <CalendarCheck size={14} className="text-amber-600" />
              <span>Applying for <strong className="font-bold">{calculatedDays} remote day(s)</strong>.</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#6B7280]">Reason for Remote Request</label>
            <textarea
              rows={3}
              placeholder="Specify arrangement details (e.g. focused quiet work sprint, child-care scheduling, equipment delivery)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs border border-[#ECECEC] rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#FFDD00] focus:ring-1 focus:ring-[#FFDD00]"
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-semibold rounded-xl border border-[#ECECEC] bg-white text-[#111111] hover:bg-[#F7F7F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-xs font-semibold rounded-xl bg-[#111111] text-white hover:bg-[#FFDD00] hover:text-[#111111] transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


/* ==========================================================
   3. ATTENDANCE CORRECTION MODAL
   ========================================================== */
interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (date: string, origIn: string, origOut: string, corrIn: string, corrOut: string, reason: string) => void;
}

export function AttendanceCorrectionModal({ isOpen, onClose, onSubmit }: CorrectionModalProps) {
  const [date, setDate] = useState('');
  const [originalIn, setOriginalIn] = useState('09:15');
  const [originalOut, setOriginalOut] = useState('17:30');
  const [correctedIn, setCorrectedIn] = useState('09:00');
  const [correctedOut, setCorrectedOut] = useState('18:00');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !reason) {
      setError('Please provide the date and core justification.');
      return;
    }
    onSubmit(date, originalIn, originalOut, correctedIn, correctedOut, reason);
    setDate('');
    setReason('');
    onClose();
  };

  return (
    <div id="correction-modal-overlay" className="fixed inset-0 bg-[#111111]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div 
        id="correction-modal-content"
        className="bg-[#FFFFFF] border border-[#ECECEC] rounded-[24px] w-full max-w-lg overflow-hidden minimal-shadow animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-6 py-5 border-b border-[#ECECEC] flex justify-between items-center bg-[#F7F7F8]">
          <div>
            <h2 className="font-display font-bold text-base text-[#111111]">Attendance Correction</h2>
            <p className="text-[11px] text-[#6B7280]">Request changes to automatic timesheet recordings</p>
          </div>
          <button id="close-correction-modal-btn" onClick={onClose} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#ECECEC] hover:text-[#111111]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#6B7280]">Date of Correction</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs border border-[#ECECEC] rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-[#FFDD00]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F7F7F8] p-3 rounded-xl border border-[#ECECEC] space-y-2">
              <div className="text-[10px] font-mono tracking-wider uppercase text-[#6B7280] font-bold">Recorded (Original)</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-[#6B7280]">In</label>
                  <input
                    type="time"
                    value={originalIn}
                    onChange={(e) => setOriginalIn(e.target.value)}
                    className="w-full text-xs bg-white border border-[#ECECEC] rounded-lg px-2 py-1"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-[#6B7280]">Out</label>
                  <input
                    type="time"
                    value={originalOut}
                    onChange={(e) => setOriginalOut(e.target.value)}
                    className="w-full text-xs bg-white border border-[#ECECEC] rounded-lg px-2 py-1"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F7F7F8] p-3 rounded-xl border border-[#ECECEC] space-y-2">
              <div className="text-[10px] font-mono tracking-wider uppercase text-zinc-900 font-bold">Correction (Proposed)</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-600">In</label>
                  <input
                    type="time"
                    value={correctedIn}
                    onChange={(e) => setCorrectedIn(e.target.value)}
                    className="w-full text-xs bg-white border border-[#FFDD00] rounded-lg px-2 py-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-600">Out</label>
                  <input
                    type="time"
                    value={correctedOut}
                    onChange={(e) => setCorrectedOut(e.target.value)}
                    className="w-full text-xs bg-white border border-[#FFDD00] rounded-lg px-2 py-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#6B7280]">Reason / Description of Log Discrepancy</label>
            <textarea
              rows={2}
              placeholder="e.g. Forgot to clock in due to client design sprint presentation; bio-authentication terminal failed at door..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs border border-[#ECECEC] rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#FFDD00]"
              required
            />
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-semibold rounded-xl border border-[#ECECEC] bg-white text-[#111111] hover:bg-[#F7F7F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-xs font-semibold rounded-xl bg-[#111111] text-white hover:bg-[#FFDD00] hover:text-[#111111] transition-colors"
            >
              Request Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


/* ==========================================================
   4. PAYSLIP DETAIL MODAL
   ========================================================== */
interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: EmployeeProfile;
}

export function PayslipDetailModal({ isOpen, onClose, profile }: PayslipModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }, 1500);
  };

  return (
    <div id="payslip-modal-overlay" className="fixed inset-0 bg-[#111111]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="payslip-modal-content"
        className="bg-[#FFFFFF] border border-[#ECECEC] rounded-[24px] w-full max-w-2xl overflow-hidden minimal-shadow my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header toolbar */}
        <div className="px-6 py-4 border-b border-[#ECECEC] flex justify-between items-center bg-[#F7F7F8]">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#111111]" />
            <span className="font-display font-bold text-sm text-[#111111]">Payslip Summary - June 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="download-pdf-btn"
              onClick={handleDownload}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                downloadSuccess
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white border-[#ECECEC] text-[#111111] hover:bg-[#F7F7F8]'
              }`}
              disabled={downloading}
            >
              {downloading ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : downloadSuccess ? (
                <Check size={13} />
              ) : (
                <Download size={13} />
              )}
              <span>{downloading ? 'Generating...' : downloadSuccess ? 'Downloaded' : 'Download PDF'}</span>
            </button>
            <button id="close-payslip-modal-btn" onClick={onClose} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#ECECEC] hover:text-[#111111]">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Payslip body styled beautifully like a high fidelity document */}
        <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Logo & Corporate Metadata */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#111111] flex items-center justify-center text-[#FFDD00] font-bold text-sm">H</div>
                <span className="font-display font-bold text-sm text-[#111111]">HRMS Portal Corporate Systems</span>
              </div>
              <p className="text-[10px] text-[#6B7280]">
                A-Block, 12th Floor, Cyber Towers<br />
                HITEC City, Hyderabad, TG, 500081, India
              </p>
            </div>
            <div className="text-right">
              <h3 className="font-mono text-xs font-bold text-[#6B7280] uppercase tracking-wider">OFFICIAL PAYSLIP</h3>
              <p className="text-[11px] font-mono text-[#111111] font-semibold">REF: PS-2026-06-89</p>
              <p className="text-[10px] text-[#6B7280]">Payment Date: June 25, 2026</p>
            </div>
          </div>

          {/* Employee Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#F7F7F8] border border-[#ECECEC] rounded-xl font-mono text-[10px]">
            <div>
              <span className="text-[#6B7280] block">Employee Name</span>
              <strong className="text-[#111111] text-xs font-sans">{profile.name}</strong>
            </div>
            <div>
              <span className="text-[#6B7280] block">Designation</span>
              <strong className="text-[#111111] text-xs font-sans">{profile.role}</strong>
            </div>
            <div>
              <span className="text-[#6B7280] block">Employee ID</span>
              <strong className="text-[#111111]">{profile.employeeId}</strong>
            </div>
            <div>
              <span className="text-[#6B7280] block">Department</span>
              <strong className="text-[#111111] text-xs font-sans">{profile.department}</strong>
            </div>
          </div>

          {/* Earnings vs Deductions Split Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Earnings */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#111111] pb-1 border-b border-[#ECECEC] flex justify-between uppercase">
                <span>Earnings</span>
                <span className="text-[10px] font-mono text-[#6B7280]">INR (₹)</span>
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Basic Salary</span>
                  <span className="font-mono text-[#111111]">₹75,000.00</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>House Rent Allowance (HRA)</span>
                  <span className="font-mono text-[#111111]">₹30,000.00</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Special Allowance</span>
                  <span className="font-mono text-[#111111]">₹20,000.00</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Performance Bonus</span>
                  <span className="font-mono text-[#111111]">₹10,000.00</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#ECECEC] flex justify-between font-bold text-xs text-[#111111]">
                <span>Gross Earnings</span>
                <span className="font-mono">₹1,35,000.00</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#111111] pb-1 border-b border-[#ECECEC] flex justify-between uppercase">
                <span>Deductions</span>
                <span className="text-[10px] font-mono text-[#6B7280]">INR (₹)</span>
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Provident Fund (Employer Match)</span>
                  <span className="font-mono text-[#111111]">₹4,000.00</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Professional Tax</span>
                  <span className="font-mono text-[#111111]">₹200.00</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Income Tax TDS</span>
                  <span className="font-mono text-[#111111]">₹5,800.00</span>
                </div>
              </div>
              <div className="pt-16 border-t border-[#ECECEC] flex justify-between font-bold text-xs text-[#111111]">
                <span>Total Deductions</span>
                <span className="font-mono">₹10,000.00</span>
              </div>
            </div>

          </div>

          {/* Net Pay Hero Box */}
          <div className="bg-[#111111] text-[#FFFFFF] rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p className="text-[10px] font-mono tracking-wider uppercase text-zinc-400">Net Pay Distribution</p>
              <h3 className="text-3xl font-mono font-bold text-[#FFDD00]">₹1,25,000.00</h3>
              <p className="text-xs text-zinc-400">One Lakh Twenty-Five Thousand Rupees Only</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-zinc-800 pt-3 sm:pt-0 sm:pl-5 text-xs text-zinc-300 font-mono space-y-1">
              <div>Bank: <strong className="text-white">HDFC Bank Corporate Accounts</strong></div>
              <div>Account: <strong className="text-white">************8910</strong></div>
              <div>Status: <strong className="text-emerald-400 font-bold">Transfer Settled ✔</strong></div>
            </div>
          </div>

          {/* Corporate note and audit trace */}
          <div className="text-[10px] text-[#6B7280] space-y-1 pt-4 border-t border-[#ECECEC]">
            <p><strong>Note:</strong> This is a digitally certified document generated from the HRMS Payroll Engine and requires no signature. Tax reporting (Form 16/TDS filings) is handled automatically on your behalf.</p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-right">System Hash ID: f7104b2c890de489aef340de</p>
          </div>

        </div>
      </div>
    </div>
  );
}

interface RequestExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, category: 'Travel' | 'Food' | 'Equipment' | 'Utilities' | 'Others', description: string, date: string, receiptName?: string) => void;
}

export function RequestExpenseModal({ isOpen, onClose, onSubmit }: RequestExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Travel' | 'Food' | 'Equipment' | 'Utilities' | 'Others'>('Travel');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setReceiptFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a valid expense amount.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }
    if (!date) {
      setError('Please select a transaction date.');
      return;
    }

    onSubmit(amt, category, description, date, receiptFile ? receiptFile.name : undefined);
    
    // reset state
    setAmount('');
    setCategory('Travel');
    setDescription('');
    setDate('');
    setReceiptFile(null);
    setError('');
    onClose();
  };

  return (
    <div id="expense-modal-overlay" className="fixed inset-0 bg-[#111111]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div 
        id="expense-modal-content"
        className="bg-[#FFFFFF] border border-[#ECECEC] rounded-[24px] w-full max-w-md overflow-hidden minimal-shadow animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-6 py-4 border-b border-[#ECECEC] flex justify-between items-center bg-[#F7F7F8]">
          <span className="font-display font-bold text-sm text-[#111111]">Submit Expense Reimbursement Claim</span>
          <button id="close-expense-modal-btn" onClick={onClose} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#ECECEC] hover:text-[#111111]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Amount (INR - ₹)</label>
            <input 
              id="expense-amount-input"
              type="number" 
              placeholder="e.g. 2500" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-xs border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#111111]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Category</label>
            <select
              id="expense-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full text-xs border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#111111]"
            >
              <option value="Travel">Travel & Lodging</option>
              <option value="Food">Meals & Food</option>
              <option value="Equipment">Hardware & Office Equipment</option>
              <option value="Utilities">Internet & Mobile Utilities</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Transaction Date</label>
            <input 
              id="expense-date-input"
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#111111]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Description</label>
            <textarea 
              id="expense-description-textarea"
              placeholder="Detail the business purpose of this expense..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full text-xs border border-[#E5E7EB] rounded-xl p-3 bg-white focus:outline-none focus:border-[#111111]"
              required
            />
          </div>

          {/* DRAG-AND-DROP FILE UPLOAD */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Attach Receipt / Invoice</label>
            <div
              id="expense-receipt-dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors duration-150 ${
                isDragging 
                  ? 'border-[#FFDD00] bg-[#FFDD00]/5' 
                  : receiptFile 
                    ? 'border-emerald-300 bg-emerald-50/20' 
                    : 'border-[#E5E7EB] hover:bg-zinc-50'
              }`}
              onClick={() => document.getElementById('receipt-file-input')?.click()}
            >
              <input
                id="receipt-file-input"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              {receiptFile ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-emerald-800">✓ {receiptFile.name}</p>
                  <p className="text-[10px] text-emerald-600 font-mono">{(receiptFile.size / 1024).toFixed(1)} KB • Click or drop to replace</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-700">Drag & drop your receipt here</p>
                  <p className="text-[10px] text-zinc-400">or click to browse from files (.pdf, .png, .jpg)</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button 
              id="submit-expense-btn"
              type="submit" 
              className="w-full py-3 bg-[#111111] text-white hover:bg-[#FFDD00] hover:text-[#111111] font-bold text-xs rounded-xl cursor-pointer transition-all uppercase tracking-wider font-mono shadow-sm"
            >
              Submit Reimbursement Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: EmployeeProfile;
  onUpdate: (updated: EmployeeProfile) => void;
}

export function EditProfileModal({ isOpen, onClose, profile, onUpdate }: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [role, setRole] = useState(profile.role);
  const [department, setDepartment] = useState(profile.department);
  const [employeeId, setEmployeeId] = useState(profile.employeeId);
  const [joinedDate, setJoinedDate] = useState(profile.joinedDate);
  const [manager, setManager] = useState(profile.manager);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setRole(profile.role || '');
    setDepartment(profile.department || '');
    setEmployeeId(profile.employeeId || '');
    setJoinedDate(profile.joinedDate || '');
    setManager(profile.manager || '');
    setAvatarUrl(profile.avatarUrl || '');
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    onUpdate({
      ...profile,
      name,
      email,
      role,
      department,
      employeeId,
      joinedDate,
      manager,
      avatarUrl
    });
    
    setError('');
    onClose();
  };

  return (
    <div id="profile-modal-overlay" className="fixed inset-0 bg-[#111111]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div 
        id="profile-modal-content"
        className="bg-[#FFFFFF] border border-[#ECECEC] rounded-[24px] w-full max-w-md overflow-hidden minimal-shadow animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-6 py-4 border-b border-[#ECECEC] flex justify-between items-center bg-[#F7F7F8]">
          <span className="font-display font-bold text-sm text-[#111111]">Edit Employee Profile Details</span>
          <button id="close-profile-modal-btn" onClick={onClose} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#ECECEC] hover:text-[#111111]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Full Name</label>
            <input 
              id="profile-name-input"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#111111]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Email Address</label>
            <input 
              id="profile-email-input"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#111111]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Designation / Role</label>
            <input 
              id="profile-role-input"
              type="text" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-xs border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Department</label>
            <input 
              id="profile-dept-input"
              type="text" 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Employee ID</label>
            <input 
              id="profile-empid-input"
              type="text" 
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full text-xs border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Joined Date</label>
            <input 
              id="profile-joined-input"
              type="text" 
              value={joinedDate}
              onChange={(e) => setJoinedDate(e.target.value)}
              className="w-full text-xs border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Reporting Manager</label>
            <input 
              id="profile-manager-input"
              type="text" 
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full text-xs border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#6B7280] font-mono tracking-wider">Avatar Image URL</label>
            <input 
              id="profile-avatar-input"
              type="text" 
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full text-xs border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="pt-2">
            <button 
              id="submit-profile-btn"
              type="submit" 
              className="w-full py-3 bg-[#111111] text-white hover:bg-[#FFDD00] hover:text-[#111111] font-bold text-xs rounded-xl cursor-pointer transition-all uppercase tracking-wider font-mono shadow-sm"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
