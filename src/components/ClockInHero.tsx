/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, Square, MapPin, CheckCircle, Clock, Coffee, AlertCircle } from 'lucide-react';

interface ClockInHeroProps {
  isClockedIn: boolean;
  onClockIn: (location: string) => void;
  onClockOut: () => void;
  sessionStartTime: string | null; // ISO string
  previousWorkedSeconds: number; // accumulated seconds from completed sessions today
}

export default function ClockInHero({
  isClockedIn,
  onClockIn,
  onClockOut,
  sessionStartTime,
  previousWorkedSeconds
}: ClockInHeroProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad HQ, HITEC City (Desk 4B)');
  const [customLocation, setCustomLocation] = useState('');
  const [showLocationSelect, setShowLocationSelect] = useState(false);

  // Compute live ticking elapsed time if clocked in
  useEffect(() => {
    if (!isClockedIn || !sessionStartTime) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsed = () => {
      const startTime = new Date(sessionStartTime).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((now - startTime) / 1000));
      setElapsedSeconds(diff);
    };

    // Initial run
    calculateElapsed();

    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [isClockedIn, sessionStartTime]);

  const totalWorkedSeconds = previousWorkedSeconds + elapsedSeconds;
  
  // Format seconds to HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  const workedHoursDecimal = totalWorkedSeconds / 3600;
  const targetHours = 9.0;
  const remainingHoursDecimal = Math.max(0, targetHours - workedHoursDecimal);
  const progressPercent = Math.min(100, (workedHoursDecimal / targetHours) * 100);

  const handleStartClockIn = () => {
    const loc = customLocation.trim() || selectedLocation;
    onClockIn(loc);
    setShowLocationSelect(false);
  };

  return (
    <div 
      id="clock-in-hero-card"
      className="bg-[#111111] text-[#FFFFFF] rounded-[32px] p-5 sm:p-6 lg:p-8 minimal-shadow relative overflow-hidden"
    >
      {/* Decorative subtle background design elements */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#FFDD00]/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-[#FFFFFF]/2 rounded-full blur-2xl pointer-events-none -mb-32" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Side: Status & Live Metrics */}
        <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {isClockedIn ? (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Session
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Clocked Out
                </span>
              )}
              
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                <MapPin size={13} className="text-zinc-500" />
                <span className="text-zinc-200">
                  {isClockedIn ? 'Recorded Session' : selectedLocation}
                </span>
              </span>
            </div>

            {/* Current Session Highlight Block */}
            <div className="bg-[#222222] px-4 py-3 sm:px-6 sm:py-4 rounded-2xl border border-[#333333] inline-block min-w-[180px] sm:min-w-[200px]">
              <p className="text-[10px] sm:text-[11px] text-[#888888] uppercase tracking-widest mb-1 font-mono font-medium">Current Session</p>
              <p className="text-3xl sm:text-4xl font-mono tracking-tighter font-bold text-white">
                {formatTime(totalWorkedSeconds)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 self-start lg:self-center">
            <div>
              <p className="text-[11px] text-[#888888] uppercase tracking-widest font-mono">Worked</p>
              <p className="text-xl font-semibold font-mono">{workedHoursDecimal.toFixed(1)}h</p>
            </div>
            <div className="h-10 w-px bg-[#333333]"></div>
            <div>
              <p className="text-[11px] text-[#888888] uppercase tracking-widest font-mono">Remaining</p>
              <p className="text-xl font-semibold font-mono">{remainingHoursDecimal.toFixed(1)}h</p>
            </div>
          </div>

          {/* Clean Progress Bar matching Deel/Stripe style */}
          <div className="space-y-1.5 flex-1 max-w-xs">
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FFDD00] to-[#FACC15] rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>{progressPercent.toFixed(0)}% Shift Done</span>
              <span>Target: {targetHours}h</span>
            </div>
          </div>
        </div>

        {/* Right Side: Primary Toggle Buttons & Location Selector */}
        <div className="flex flex-col items-stretch md:items-end justify-center gap-3.5 min-w-[240px] w-full md:w-auto">
          {isClockedIn ? (
            <div className="w-full space-y-3">
              <div className="flex items-center gap-1.5 justify-center md:justify-end text-xs text-zinc-400 font-mono">
                <MapPin size={13} className="text-emerald-400" />
                <span className="text-emerald-300 font-semibold">{selectedLocation}</span>
              </div>
              <button
                id="clock-out-hero-btn"
                onClick={onClockOut}
                className="group flex items-center justify-center gap-2.5 px-10 py-4 rounded-2xl bg-[#FFDD00] text-[#111111] hover:bg-[#FACC15] active:scale-98 font-bold text-sm tracking-wide transition-all duration-150 shadow-lg shadow-yellow-400/10 cursor-pointer w-full md:w-auto"
              >
                <Square size={16} fill="#111111" className="group-hover:scale-110 transition-transform" />
                Clock Out
              </button>
            </div>
          ) : (
            <div className="w-full space-y-3.5">
              {/* Location Select Div - positioned above the clock-in button */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-2xl space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#FFDD00]" />
                  <span>Clock-In Location</span>
                </label>
                <select
                  id="clock-in-location-select"
                  value={selectedLocation}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedLocation(val);
                    if (val !== 'Custom') {
                      setCustomLocation('');
                    }
                  }}
                  className="w-full text-xs bg-zinc-850 border border-zinc-700/60 text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#FFDD00] cursor-pointer"
                >
                  <option value="Hyderabad HQ, HITEC City (Desk 4B)">Hyderabad HQ, HITEC City (Desk 4B)</option>
                  <option value="Remote (Home Office)">Remote (Home Office)</option>
                  <option value="Custom">Custom Location...</option>
                </select>

                {selectedLocation === 'Custom' && (
                  <input 
                    id="custom-location-input"
                    type="text" 
                    placeholder="Specify location..." 
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="w-full text-xs bg-zinc-800 border border-zinc-700 text-white rounded-xl px-2.5 py-1.5 mt-1.5 focus:outline-none focus:border-[#FFDD00]"
                  />
                )}
              </div>

              <button
                id="clock-in-hero-btn"
                onClick={handleStartClockIn}
                className="group flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#FFDD00] text-[#111111] hover:bg-[#FACC15] active:scale-98 font-bold text-sm tracking-wide transition-all duration-150 minimal-shadow cursor-pointer w-full"
              >
                <Play size={16} fill="#111111" className="group-hover:scale-110 transition-transform" />
                Clock In Session
              </button>
            </div>
          )}

          {/* Quick micro-actions below clock-in */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 justify-center md:justify-end font-mono">
            <Clock size={11} className="text-zinc-500" />
            <span>Shift hours auto-approve at 18:00</span>
          </div>
        </div>

      </div>
    </div>
  );
}
