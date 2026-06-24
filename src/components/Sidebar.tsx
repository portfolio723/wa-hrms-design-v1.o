/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  Home, 
  Receipt, 
  CreditCard, 
  FolderOpen, 
  HelpCircle,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { EmployeeProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: EmployeeProfile;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenEditProfile?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  profile,
  isOpenMobile,
  setIsOpenMobile,
  onOpenEditProfile
}: SidebarProps) {
  
  const navGroups = [
    {
      title: 'Attendance',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'attendance', label: 'Attendance Log', icon: Clock },
      ]
    },
    {
      title: 'Requests',
      items: [
        { id: 'leave', label: 'Leave Planner', icon: Calendar },
        { id: 'wfh', label: 'WFH Requests', icon: Home },
        { id: 'expenses', label: 'Expenses', icon: Receipt },
      ]
    },
    {
      title: 'Payroll',
      items: [
        { id: 'payslip', label: 'Payslip & Equity', icon: CreditCard },
      ]
    },
    {
      title: 'Resources',
      items: [
        { id: 'documents', label: 'Documents', icon: FolderOpen },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
      ]
    }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          id="sidebar-backdrop"
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside 
        id="sidebar-nav"
        className={`fixed inset-y-0 left-0 w-64 bg-[#FFFFFF] border-r border-[#E5E7EB] flex flex-col z-50 transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header Branding */}
        <div className="h-20 px-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#FFDD00] flex items-center justify-center text-[#111111] font-extrabold text-sm select-none shadow-xs">
              WA
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-tight text-[#111111] whitespace-nowrap">HRMS</span>
              <div className="text-[10px] text-[#6B7280] font-bold tracking-wider uppercase font-mono whitespace-nowrap">Portal</div>
            </div>
          </div>

          <button 
            id="close-sidebar-mobile-btn"
            className="lg:hidden p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111111]"
            onClick={() => setIsOpenMobile(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <h3 className="px-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        id={`nav-item-${item.id}`}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                          isActive 
                            ? 'bg-[#F3F4F6] text-[#111111]' 
                            : 'text-[#6B7280] hover:text-[#111111] hover:bg-[#F7F7F8]'
                        }`}
                      >
                        <Icon 
                          size={16} 
                          className={isActive ? 'text-[#111111]' : 'text-[#6B7280]'} 
                        />
                        <span>{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FFDD00]" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer profile container */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F7F7F8]">
          <button 
            id="sidebar-profile-card"
            onClick={onOpenEditProfile}
            title="Click to edit profile details"
            className="w-full text-left flex items-center gap-3 p-2 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#FFDD00] hover:shadow-md shadow-xs transition-all duration-200 cursor-pointer group"
          >
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB] group-hover:scale-105 transition-transform duration-150"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#111111] group-hover:text-[#FFDD00] lg:group-hover:text-indigo-600 truncate transition-colors duration-150">{profile.name}</p>
              <p className="text-[11px] text-[#6B7280] font-mono truncate">{profile.role || 'Senior Developer'}</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
