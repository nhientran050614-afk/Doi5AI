import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Target, 
  GitCompare, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Lock, 
  Eye, 
  Cpu,
  HelpCircle,
  Radio
} from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'analyzer' | 'game' | 'comparator') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [activeGuideTab, setActiveGuideTab] = useState<'flow' | 'modules' | 'rules'>('flow');
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    cyberAudio.playClick();
    if (dontShowAgain) {
      localStorage.setItem('cyber_onboarding_dismissed_v2', 'true');
    }
    onClose();
  };

  const handleStartPractice = (tab: 'analyzer' | 'game' | 'comparator') => {
    cyberAudio.playClick();
    if (dontShowAgain) {
      localStorage.setItem('cyber_onboarding_dismissed_v2', 'true');
    }
    onNavigateTab(tab);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-xs"
      onClick={handleDismiss}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative w-full max-w-4xl bg-[#0c1222] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/50 text-slate-100 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top High-Tech Glowing Header Line */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800/90 flex items-start justify-between gap-4 bg-[#080d19]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-600 via-indigo-600 to-slate-900 border border-cyan-400/40 flex items-center justify-center text-white shadow-md shadow-cyan-950 shrink-0">
              <BookOpen className="w-6 h-6 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60 uppercase">
                  SYSTEM_BRIEFING // HƯỚNG DẪN KHỞI ĐẦU
                </span>
                <span className="text-[10px] font-mono-tech text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SẴN SÀNG HUẤN LUYỆN
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
                Hướng Dẫn Sử Dụng Nền Tảng
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Rèn luyện kỹ năng nhận diện bẫy lừa đảo mạng cho học sinh THCS
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Navigation Switcher */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 pb-1 border-b border-slate-800/80 bg-[#0a0f1e] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setActiveGuideTab('flow');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
              activeGuideTab === 'flow'
                ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>1. Quy Trình 3 Bước</span>
          </button>

          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setActiveGuideTab('modules');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
              activeGuideTab === 'modules'
                ? 'bg-indigo-950/90 text-indigo-300 border-indigo-500/50'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>2. 3 Phòng Chức Năng</span>
          </button>

          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setActiveGuideTab('rules');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
              activeGuideTab === 'rules'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>3. 4 Nguyên Tắc Vàng</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-5 max-h-[55vh] overflow-y-auto space-y-3 text-xs sm:text-sm text-slate-300">
          {/* TAB 1: 3-STEP FLOW */}
          {activeGuideTab === 'flow' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Step 1 */}
                <div className="p-3.5 rounded-xl bg-[#090e1a] border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded bg-indigo-950 border border-indigo-500/40 text-cyan-300 font-mono-tech font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <span className="text-[10px] font-mono-tech text-slate-400">BƯỚC 1</span>
                  </div>
                  <h4 className="font-bold text-white text-xs mb-1">
                    Nhập Tin Nhắn
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    Chọn tình huống mẫu hoặc dán nội dung tin nhắn lạ cần kiểm tra.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-xl bg-[#090e1a] border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono-tech font-bold flex items-center justify-center text-xs">
                      2
                    </span>
                    <span className="text-[10px] font-mono-tech text-slate-400">BƯỚC 2</span>
                  </div>
                  <h4 className="font-bold text-white text-xs mb-1">
                    Tự Nhận Xét Trước
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    Em tự đánh giá: Mức độ đáng ngờ, dấu hiệu bất thường và cách xử lý.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-xl bg-[#090e1a] border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono-tech font-bold flex items-center justify-center text-xs">
                      3
                    </span>
                    <span className="text-[10px] font-mono-tech text-slate-400">BƯỚC 3</span>
                  </div>
                  <h4 className="font-bold text-white text-xs mb-1">
                    Xem Báo Cáo AI
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    AI đối chiếu qua 5 Kính Lọc và gợi ý quy trình 3 bước tự bảo vệ.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MODULES */}
          {activeGuideTab === 'modules' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Module 1 */}
              <div 
                onClick={() => handleStartPractice('analyzer')}
                className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-300 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs group-hover:text-cyan-300">
                    Bàn Phân Tích (Chính)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Kiểm tra chi tiết mọi tin nhắn với 5 Kính Lọc an toàn.
                  </p>
                </div>
              </div>

              {/* Module 2 */}
              <div 
                onClick={() => handleStartPractice('game')}
                className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-amber-950 text-amber-300 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs group-hover:text-amber-300">
                    Phòng Huấn Luyện (Thám Tử)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Thử thách giải đố tình huống, nhận diện cạm bẫy để thăng hạng.
                  </p>
                </div>
              </div>

              {/* Module 3 */}
              <div 
                onClick={() => handleStartPractice('comparator')}
                className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-emerald-950 text-emerald-300 shrink-0">
                  <GitCompare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs group-hover:text-emerald-300">
                    So Sánh Quang Phổ (V1 vs V2)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Đối chiếu trực quan tin nhắn nguy hiểm và phiên bản an toàn.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SAFETY RULES */}
          {activeGuideTab === 'rules' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#090e1a] border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">1. Không bao giờ gửi OTP / Mật khẩu</strong>
                  <span className="text-slate-400 text-[11px]">Không tổ chức nào yêu cầu gửi OTP qua tin nhắn.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#090e1a] border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">2. Cảnh giác với đường link lạ</strong>
                  <span className="text-slate-400 text-[11px]">Không bấm link đuôi lạ (.xyz, .cc) hay sai chính tả.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#090e1a] border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">3. Chậm lại khi bị hối thúc, dọa dẫm</strong>
                  <span className="text-slate-400 text-[11px]">Càng gấp càng cần dừng lại để kiểm chứng.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#090e1a] border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">4. Luôn hỏi ý kiến bố mẹ hoặc thầy cô</strong>
                  <span className="text-slate-400 text-[11px]">Nhờ người lớn xem và xác minh trước khi hành động.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-slate-800/90 bg-[#080d19] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Don't show again checkbox */}
          <label className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer select-none">
            <input
              type="checkbox"
              id="cb-dont-show-onboarding"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer"
            />
            <span>Không tự động hiện lại khi tải lại trang</span>
          </label>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              id="btn-onboarding-start"
              onClick={() => handleStartPractice('analyzer')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-950/60 border border-cyan-400/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Bắt Đầu Thực Hành Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
