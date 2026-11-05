import React, { ReactNode } from 'react';
import { Smartphone, Monitor, ShieldCheck, Cpu } from 'lucide-react';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidNavBar } from './AndroidNavBar';

interface PhoneFrameProps {
  children: ReactNode;
  isPhoneView: boolean;
  onToggleView: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  isPhoneView,
  onToggleView,
}) => {
  if (!isPhoneView) {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-900 overflow-auto">
      {/* Phone Hardware Mockup Outer Shell */}
      <div className="relative w-full max-w-[420px] h-[860px] max-h-[96vh] bg-slate-950 rounded-[48px] p-3 shadow-2xl shadow-black/80 border-4 border-slate-700/80 flex flex-col shrink-0 ring-1 ring-white/10">
        {/* Antenna bands & buttons hints on phone frame */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-12 bg-slate-700 rounded-l" />
        <div className="absolute -left-[7px] top-44 w-[3px] h-12 bg-slate-700 rounded-l" />
        <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-slate-700 rounded-r" />

        {/* Screen Bezel Inner Border */}
        <div className="w-full h-full bg-slate-900 rounded-[38px] overflow-hidden flex flex-col relative border border-black/40">
          {/* Hardware Speaker Ear Piece */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1 bg-slate-800 rounded-full z-40" />

          {/* Android Status Bar */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 shrink-0">
            <AndroidStatusBar />
          </div>

          {/* Active Screen Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
            {children}
          </div>

          {/* Android System 3-Button Navigation Bar */}
          <div className="shrink-0">
            <AndroidNavBar />
          </div>
        </div>
      </div>
    </div>
  );
};
