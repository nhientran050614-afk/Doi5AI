import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Target, 
  GitCompare, 
  Timer, 
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
  onNavigateTab: (tab: 'analyzer' | 'game' | 'compare' | 'demo3min') => void;
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

  const handleStartPractice = (tab: 'analyzer' | 'game' | 'compare' | 'demo3min') => {
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
              <h2 className="text-base sm:text-xl font-bold text-white tracking-tight mt-1">
                Hướng Dẫn Sử Dụng Nền Tảng "AI Cảnh Báo Tin Nhắn Đáng Ngờ"
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Trang bị cho học sinh THCS tư duy phản biện và phản xạ tự bảo vệ trước cạm bẫy mạng số
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            title="Đóng bảng hướng dẫn"
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
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
              activeGuideTab === 'flow'
                ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>1. Quy Trình 3 Bước Cốt Lõi</span>
          </button>

          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setActiveGuideTab('modules');
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
              activeGuideTab === 'modules'
                ? 'bg-indigo-950/90 text-indigo-300 border-indigo-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>2. 4 Phòng Chức Năng Chính</span>
          </button>

          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setActiveGuideTab('rules');
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
              activeGuideTab === 'rules'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>3. Nguyên Tắc An Toàn Cần Nhớ</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 max-h-[58vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300">
          {/* TAB 1: 3-STEP FLOW */}
          {activeGuideTab === 'flow' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-cyan-200 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="leading-relaxed">
                  Nguyên lý cốt lõi: <strong>Học sinh tự phán đoán trước ➜ AI hỗ trợ đối chiếu bằng 5 Kính Lọc ➜ Rút ra kinh nghiệm tự bảo vệ</strong> (Không phụ thuộc mù quáng vào AI).
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Step 1 */}
                <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 hover:border-indigo-500/40 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/40 text-cyan-300 font-mono-tech font-bold flex items-center justify-center text-xs">
                        01
                      </span>
                      <span className="text-[10px] font-mono-tech text-slate-400">BƯỚC 1</span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-1.5">
                      Nhập Tin Nhắn Giả Lập
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Chọn 1 trong các mẫu tin nhắn phổ biến (giả danh thầy cô, lừa trúng thưởng, đòi mã OTP, link lạ...) hoặc dán nội dung tin nhắn bất kỳ mà em muốn kiểm tra.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-400 font-medium">
                    ✓ Có 8 tình huống chuẩn THCS
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono-tech font-bold flex items-center justify-center text-xs">
                        02
                      </span>
                      <span className="text-[10px] font-mono-tech text-slate-400">BƯỚC 2</span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-1.5">
                      Em Nhận Xét Trước
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Trước khi máy quét AI chạy, em tự đưa ra quan điểm: Tin nhắn này có đáng ngờ không? Những dấu hiệu nào gây nghi ngờ? Và em dự định sẽ làm gì?
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-indigo-400 font-medium">
                    ✓ Rèn luyện tư duy phản biện
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 hover:border-emerald-500/40 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono-tech font-bold flex items-center justify-center text-xs">
                        03
                      </span>
                      <span className="text-[10px] font-mono-tech text-slate-400">BƯỚC 3</span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-1.5">
                      Xem Báo Cáo Giám Định
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      AI quét qua <strong>5 Kính Lọc An Toàn</strong>, so sánh phán đoán của em với kết quả AI, làm rõ bằng chứng và cung cấp quy trình 3 bước xử lý an toàn.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-emerald-400 font-medium">
                    ✓ Có sẵn hướng dẫn hỏi người lớn
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MODULES */}
          {activeGuideTab === 'modules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Module 1 */}
              <div 
                onClick={() => handleStartPractice('analyzer')}
                className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-indigo-950/80 text-cyan-300 border border-indigo-700/60 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                      1. Bàn Phân Tích Tin Nhắn (Chế độ chính)
                    </h4>
                    <span className="text-[10px] font-mono-tech text-slate-400">TAB: ANALYZER</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Nơi nhập nội dung bất kỳ và thực hiện đầy đủ quy trình 3 bước sư phạm. Kết quả hiển thị trực quan mức độ rủi ro, phân tích chi tiết từng kính lọc và văn bản mẫu nhờ bố mẹ hỗ trợ.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:underline">
                  Truy cập phòng này <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Module 2 */}
              <div 
                onClick={() => handleStartPractice('game')}
                className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-700/60 group-hover:scale-105 transition-transform">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                      2. Phòng Huấn Luyện (Thám Tử Số)
                    </h4>
                    <span className="text-[10px] font-mono-tech text-slate-400">TAB: DRILL_MODE</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Chế độ trò chơi thực chiến: Bắt gặp các tình huống tin nhắn giả lập, học sinh chỉ được cộng điểm khi <strong>đúng mức độ rủi ro</strong> và <strong>chọn đúng căn cứ thuyết phục</strong>.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:underline">
                  Thử thách thăng hàm <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Module 3 */}
              <div 
                onClick={() => handleStartPractice('compare')}
                className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 group-hover:scale-105 transition-transform">
                    <GitCompare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                      3. So Sánh Quang Phổ (V1 vs V2)
                    </h4>
                    <span className="text-[10px] font-mono-tech text-slate-400">TAB: DIFF_MATRIX</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Đặt 2 phiên bản cạnh nhau: Tin nhắn đáng ngờ (V1) đối chiếu với phiên bản đã chỉnh sửa chuẩn mực (V2). Thấy rõ chỉ cần đổi 1 đường link hay bỏ đòi OTP là mức độ an toàn thay đổi 180 độ.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:underline">
                  So sánh trực quan <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Module 4 */}
              <div 
                onClick={() => handleStartPractice('demo3min')}
                className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-700/60 group-hover:scale-105 transition-transform">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                      4. Demo 3 Phút (Chuẩn Sư Phạm)
                    </h4>
                    <span className="text-[10px] font-mono-tech text-slate-400">TAB: 7_STEP_GUIDE</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Dành cho giáo viên giảng bài trên lớp hoặc học sinh thuyết trình nhóm: Dòng thời gian 7 bước dẫn dắt từ tình huống mở đầu, phản biện, AI phân tích đến thông điệp an toàn số.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 group-hover:underline">
                  Xem kịch bản mẫu <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: SAFETY RULES */}
          {activeGuideTab === 'rules' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/60 text-rose-200">
                <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>NGUYÊN TẮC VÀNG BẢO VỆ BẢN THÂN TRÊN MÔI TRƯỜNG MẠNG:</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Học sinh THCS cần khắc ghi những điều sau khi nhận bất kỳ tin nhắn nào yêu cầu hành động gấp:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">1. Tuyệt đối không chia sẻ mã OTP / Mật khẩu</strong>
                    <span className="text-slate-300">Không một ngân hàng, nhà trường hay nhà mạng nào yêu cầu bạn gửi mã OTP hay mật khẩu cá nhân qua tin nhắn.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">2. Cảnh giác với link lạ viết tắt / sai chính tả</strong>
                    <span className="text-slate-300">Tuyệt đối không nhấn vào các đường link có đuôi lạ như `.xyz`, `.cc`, `.top` hay mạo danh các tổ chức uy tín.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">3. Chậm lại khi bị dọa nạt hoặc hối thúc</strong>
                    <span className="text-slate-300">Kẻ xấu luôn tạo áp lực "khóa tài khoản trong 5 phút", "bị phạt ngay". Càng gấp càng cần dừng lại để kiểm chứng.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">4. Luôn hỏi ý kiến bố mẹ hoặc thầy cô</strong>
                    <span className="text-slate-300">Khi cảm thấy phân vân hoặc lo sợ, việc đầu tiên là cho người lớn đáng tin cậy xem tin nhắn để cùng xử lý.</span>
                  </div>
                </div>
              </div>

              {/* Privacy sandbox note */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span><strong>Hộp Cát Bảo Mật:</strong> Ứng dụng chạy trên môi trường an toàn, không lưu trữ số điện thoại hay nội dung riêng tư của học sinh.</span>
                </span>
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
              id="btn-onboarding-demo"
              onClick={() => handleStartPractice('demo3min')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Xem Demo 3 Phút
            </button>

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
