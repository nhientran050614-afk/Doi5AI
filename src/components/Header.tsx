import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Gamepad2, 
  Scale, 
  PlayCircle,
  Cpu,
  Radio,
  Volume2,
  VolumeX,
  Terminal,
  BookOpen,
  Cog
} from 'lucide-react';
import { AppTab } from '../types';
import { cyberAudio } from '../utils/cyberAudio';

interface HeaderProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenGuide?: () => void;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onOpenGuide, onReplayIntro }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    cyberAudio.setEnabled(next);
    if (next) cyberAudio.playClick();
  };

  const handleTabClick = (tabId: AppTab) => {
    cyberAudio.playClick();
    onSelectTab(tabId);
  };

  const tabs = [
    {
      id: 'analyzer' as AppTab,
      label: 'Phân Tích Tin Nhắn',
      code: 'SCAN_CORE',
      icon: Search,
      desc: '5 Kính lọc AI & Nhận xét',
    },
    {
      id: 'demo3min' as AppTab,
      label: 'Demo 3 Phút',
      code: 'DEMO_FLOW',
      icon: PlayCircle,
      desc: 'Quy trình chuẩn mực',
      badge: 'Chuẩn sư phạm',
    },
    {
      id: 'game' as AppTab,
      label: 'Trò Chơi Tình Huống',
      code: 'MISSION_HQ',
      icon: Gamepad2,
      desc: 'Luyện tập căn cứ nhận diện',
    },
    {
      id: 'comparator' as AppTab,
      label: 'So Sánh V1 - V2',
      code: 'DIFF_MATRIX',
      icon: Scale,
      desc: 'Quan sát chi tiết thay đổi',
    },
  ];

  return (
    <header className="bg-[#0b101d] border-b border-slate-800 sticky top-0 z-30 shadow-md shadow-black/40">
      {/* Top Cyber Telemetry Bar */}
      <div className="border-b border-slate-800/80 bg-[#070a12] text-[11px] font-mono-tech py-1.5 px-4 sm:px-8 text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              SYS_RADAR: ACTIVE
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 hidden sm:inline">
              CORE: <span className="text-indigo-400 font-medium">GEMINI 3.8 FLASH</span>
            </span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden md:inline">
              SECURITY_PROTOCOL: <span className="text-cyan-400 font-medium">5-FILTERS v2.4</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-slate-400 text-[10px] hidden lg:inline tracking-normal font-sans">
              ENCRYPTED SANDBOX • KHÔNG LƯU DỮ LIỆU CÁ NHÂN
            </span>
            {onOpenGuide && (
              <button
                type="button"
                id="btn-open-guide"
                onClick={() => {
                  cyberAudio.playClick();
                  onOpenGuide();
                }}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-600/50 hover:border-cyan-400 transition-colors cursor-pointer text-[10px] font-semibold"
                title="Mở bảng hướng dẫn sử dụng nền tảng"
              >
                <BookOpen className="w-3 h-3 text-cyan-400" />
                <span>Hướng Dẫn</span>
              </button>
            )}
            {onReplayIntro && (
              <button
                type="button"
                id="btn-replay-team5"
                onClick={() => {
                  cyberAudio.playClick();
                  onReplayIntro();
                }}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 hover:border-cyan-300 transition-colors cursor-pointer text-[10px] font-mono-tech"
                title="Xem lại màn hình giới thiệu Project by Team 5"
              >
                <Cog className="w-3 h-3 text-cyan-400 animate-spin-slow" />
                <span className="font-bold">TEAM 5</span>
              </button>
            )}
            <button
              type="button"
              id="btn-toggle-sound"
              onClick={toggleSound}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Bật/Tắt âm thanh hiệu ứng công nghệ"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] text-cyan-300">SFX: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] text-slate-400">SFX: OFF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 gap-3">
          {/* Brand & High-Tech Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-700 text-white flex items-center justify-center shadow-md shadow-indigo-950/50 border border-indigo-400/30 shrink-0">
                <ShieldCheck className="w-6 h-6 text-cyan-200" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>AI Cảnh Báo Tin Nhắn Đáng Ngờ</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono-tech font-semibold bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 shadow-xs">
                  <Terminal className="w-2.5 h-2.5" />
                  EDTECH v2.4
                </span>
                {onReplayIntro && (
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playClick();
                      onReplayIntro();
                    }}
                    className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono-tech font-bold bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/60 shadow-xs cursor-pointer hover:border-cyan-400 transition-colors"
                    title="Dự án thực hiện bởi Team 5 - Nhấn để xem intro"
                  >
                    <Cog className="w-3 h-3 text-cyan-400 animate-spin-slow" />
                    <span>PROJECT BY TEAM 5</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5 mt-0.5 leading-normal">
                <Cpu className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>Nền tảng thực hành an toàn thông tin số & 5 Kính Lọc tư duy cho học sinh THCS</span>
              </p>
            </div>
          </div>

          {/* High-Tech Navigation tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  id={`tab-btn-${tab.id}`}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap relative cursor-pointer border ${
                    isActive
                      ? 'bg-indigo-600/90 text-white border-cyan-400/50 shadow-md shadow-indigo-950 ring-1 ring-cyan-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border-transparent hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono-tech font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-600/50'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
