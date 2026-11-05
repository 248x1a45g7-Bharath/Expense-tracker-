import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const AndroidStatusBar: React.FC<{ isDarkText?: boolean }> = ({ isDarkText = false }) => {
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const textColor = isDarkText ? 'text-slate-800' : 'text-white';

  return (
    <div className={`w-full px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold select-none z-30 transition-colors ${textColor}`}>
      {/* Time */}
      <span className="tracking-tight font-medium text-[13px]">{currentTime}</span>

      {/* Camera Hole Punch */}
      <div className="w-4 h-4 rounded-full bg-black/85 border border-white/20 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-950/70" />
      </div>

      {/* System Icons */}
      <div className="flex items-center space-x-2">
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">5G</span>
        <Signal size={13} strokeWidth={2.5} className="opacity-95" />
        <Wifi size={13} strokeWidth={2.5} className="opacity-95" />
        <div className="flex items-center space-x-0.5">
          <BatteryMedium size={16} strokeWidth={2.5} className="opacity-95" />
          <span className="text-[10px] font-bold">98%</span>
        </div>
      </div>
    </div>
  );
};
