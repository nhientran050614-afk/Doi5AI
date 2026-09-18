import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

interface Team5IntroSplashProps {
  onComplete?: () => void;
}

export const Team5IntroSplash: React.FC<Team5IntroSplashProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'enter' | 'active' | 'exit' | 'hidden'>('enter');

  useEffect(() => {
    // Play cyber boot audio sound
    const audioTimer = setTimeout(() => {
      cyberAudio.playScan();
    }, 200);

    // Transition to active display
    const activeTimer = setTimeout(() => {
      setStage('active');
    }, 400);

    // Auto trigger exit after 2.8s
    const exitTimer = setTimeout(() => {
      setStage('exit');
    }, 2800);

    // Fully hide after fade transition completes
    const hideTimer = setTimeout(() => {
      setStage('hidden');
      if (onComplete) onComplete();
    }, 3400);

    return () => {
      clearTimeout(audioTimer);
      clearTimeout(activeTimer);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    cyberAudio.playClick();
    setStage('exit');
    setTimeout(() => {
      setStage('hidden');
      if (onComplete) onComplete();
    }, 400);
  };

  if (stage === 'hidden') return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060b17] select-none transition-all duration-700 cursor-pointer ${
        stage === 'exit' ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
      aria-label="Màn hình giới thiệu Project by Team 5"
    >
      {/* Background Cyber Grid & Glowing Ambient Water-Blue Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.22)_0%,rgba(8,145,178,0.08)_45%,transparent_75%)]" 
      />

      {/* Subtle Digital Scanline Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:100%_4px]"
      />

      {/* Main Showcase Container */}
      <div className="relative flex flex-col items-center justify-center p-6 text-center max-w-lg z-10">
        
        {/* BÁNH RĂNG MÀU XANH NƯỚC (Aqua / Water-Blue Mechanical Cyber Gear) */}
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center mb-6">
          
          {/* External Water-Blue Glow Aura */}
          <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-cyan-500/20 blur-2xl animate-pulse pointer-events-none" />

          {/* Outermost Orbit Tech Track */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed animate-spin-slow pointer-events-none" />

          {/* Secondary Counter-Rotating Tech Reticle */}
          <div className="absolute inset-3 rounded-full border border-sky-400/20 animate-spin-slow-reverse pointer-events-none" />

          {/* Precision Tick Marks on Orbit */}
          <div className="absolute inset-2 flex items-center justify-center pointer-events-none">
            <span className="absolute top-0 w-1 h-3 bg-cyan-400/80 rounded-full" />
            <span className="absolute bottom-0 w-1 h-3 bg-cyan-400/80 rounded-full" />
            <span className="absolute left-0 w-3 h-1 bg-cyan-400/80 rounded-full" />
            <span className="absolute right-0 w-3 h-1 bg-cyan-400/80 rounded-full" />
          </div>

          {/* PRIMARY WATER-BLUE GEAR (Bánh Răng Màu Xanh Nước Biển) */}
          <svg
            viewBox="0 0 200 200"
            className="w-36 h-36 sm:w-44 sm:h-44 text-cyan-400 animate-spin-slow drop-shadow-[0_0_20px_rgba(6,182,212,0.85)] filter"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="waterBlueGearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="waterBlueInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>
            </defs>

            {/* 12 Mechanical Gear Teeth (Bánh Răng 12 Răng Khía) */}
            <g fill="url(#waterBlueGearGrad)">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <rect
                  key={deg}
                  x="90"
                  y="10"
                  width="20"
                  height="26"
                  rx="4"
                  transform={`rotate(${deg} 100 100)`}
                  stroke="#67e8f9"
                  strokeWidth="1.5"
                />
              ))}
            </g>

            {/* Gear Outer Ring Body */}
            <circle
              cx="100"
              cy="100"
              r="76"
              fill="url(#waterBlueInnerGrad)"
              stroke="#22d3ee"
              strokeWidth="4"
            />

            {/* Inner Recessed Mechanical Groove */}
            <circle
              cx="100"
              cy="100"
              r="62"
              fill="#081426"
              stroke="#06b6d4"
              strokeWidth="2.5"
            />

            {/* 6 Structural Gear Spokes (Nan hoa cơ học) */}
            <g stroke="#38bdf8" strokeWidth="4" strokeLinecap="round">
              <line x1="100" y1="38" x2="100" y2="162" />
              <line x1="46" y1="69" x2="154" y2="131" />
              <line x1="46" y1="131" x2="154" y2="69" />
            </g>

            {/* Inner Central Hub Ring */}
            <circle
              cx="100"
              cy="100"
              r="34"
              fill="#040914"
              stroke="#67e8f9"
              strokeWidth="3"
            />

            {/* Center Core Dot */}
            <circle
              cx="100"
              cy="100"
              r="14"
              fill="url(#waterBlueGearGrad)"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </svg>

          {/* Concentric Center HUD Ring with Counter-Spin */}
          <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-cyan-300/40 border-t-transparent animate-spin-slow-reverse pointer-events-none" />
        </div>

        {/* CHỮ "PROJECT BY TEAM 5" XUẤT HIỆN DƯỚI BÁNH RĂNG */}
        <div className="space-y-2">
          {/* MAIN PROMINENT TITLE: PROJECT BY TEAM 5 */}
          <div className="relative">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wider font-mono-tech uppercase drop-shadow-[0_2px_12px_rgba(6,182,212,0.8)]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-cyan-400">
                PROJECT BY TEAM 5
              </span>
            </h1>
            <div className="h-0.5 w-28 sm:w-36 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-2" />
          </div>

          {/* App Name - Short & Crisp */}
          <p className="text-xs sm:text-sm text-cyan-200/90 font-medium">
            AI Cảnh Báo Tin Nhắn Đáng Ngờ
          </p>

          {/* Subtle loading bar */}
          <div className="pt-2 flex justify-center">
            <div className="w-36 sm:w-44 h-1 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-500 w-full animate-[pulse_1s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>

        {/* Skip hint button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSkip();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 text-xs font-mono-tech border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            <span>Bấm để vào nhanh</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
