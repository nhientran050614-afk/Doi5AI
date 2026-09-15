import React, { useState } from 'react';
import { 
  PlayCircle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  ShieldAlert, 
  HelpCircle, 
  BrainCircuit, 
  Edit3, 
  Scale, 
  Sparkles, 
  Flame, 
  FileKey, 
  SearchX, 
  ChevronRight,
  Terminal,
  Cpu,
  Radio,
  Target
} from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

interface Demo3MinGuideProps {
  onLoadIntoAnalyzer: (msg: string) => void;
  onOpenComparator: (m1: string, m2: string) => void;
}

export const Demo3MinGuide: React.FC<Demo3MinGuideProps> = ({
  onLoadIntoAnalyzer,
  onOpenComparator,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);

  const demoMessageV1 =
    'Ngân hàng thông báo tài khoản của bạn sắp bị khóa. Hãy gửi mã xác thực ngay để mở lại tài khoản.';
  const demoMessageV2 =
    'Ngân hàng thông báo bảo trì hệ thống định kỳ vào Chủ Nhật từ 02:00 - 04:00. Quý khách không cần thao tác gì và ngân hàng KHÔNG BAO GIỜ yêu cầu cung cấp mã OTP hay mật khẩu.';

  const steps = [
    { num: 1, title: 'Đọc tin nhắn giả lập', code: 'STEP_01' },
    { num: 2, title: 'Học sinh tự nhận xét', code: 'STEP_02' },
    { num: 3, title: 'AI phân tích 5 Kính Lọc', code: 'STEP_03' },
    { num: 4, title: 'Phát hiện 3 bẫy nguy cơ', code: 'STEP_04' },
    { num: 5, title: 'Hướng xử lý an toàn', code: 'STEP_05' },
    { num: 6, title: 'Thay đổi 1 chi tiết (V2)', code: 'STEP_06' },
    { num: 7, title: 'AI giải thích vì sao thay đổi', code: 'STEP_07' },
  ];

  const handleNextStep = () => {
    cyberAudio.playClick();
    if (currentStep === 2) {
      cyberAudio.playScan();
      setIsAiAnalyzing(true);
      setTimeout(() => {
        setIsAiAnalyzing(false);
        setCurrentStep(3);
        cyberAudio.playSuccess();
      }, 700);
    } else if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleStepSelect = (num: number) => {
    cyberAudio.playClick();
    setCurrentStep(num);
  };

  const handleReset = () => {
    cyberAudio.playClick();
    setCurrentStep(1);
    setIsAiAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0e1526] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl shadow-black/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500" />

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 text-white flex items-center justify-center shadow-lg border border-cyan-400/30 shrink-0">
            <PlayCircle className="w-6 h-6 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Quy Trình Demo 3 Phút (Chuẩn Sư Phạm)
              </h2>
              <span className="text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60">
                7_STEP_GUIDE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Kịch bản chuẩn mực dành cho giáo viên trình chiếu trên lớp hoặc học sinh tự học
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-demo-reset"
          onClick={handleReset}
          className="text-xs font-mono-tech text-slate-400 hover:text-slate-200 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET_DEMO</span>
        </button>
      </div>

      {/* 7-Step Progress Timeline */}
      <div className="bg-[#0e1526] rounded-2xl border border-slate-800 p-3 sm:p-4 shadow-xl shadow-black/30 overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                type="button"
                id={`demo-step-btn-${s.num}`}
                onClick={() => handleStepSelect(s.num)}
                className={`flex-1 flex flex-col items-center text-center p-2 rounded-xl transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-indigo-950/80 border-cyan-400/60 shadow-md shadow-indigo-950 text-white'
                    : isCompleted
                    ? 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-950/20 border-transparent text-slate-500 hover:text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono-tech text-xs font-bold mb-1 border ${
                    isCurrent
                      ? 'bg-indigo-600 border-cyan-300 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : `0${s.num}`}
                </div>
                <span className={`text-[10px] sm:text-[11px] font-semibold leading-tight ${isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage for the Step */}
      <div className="bg-[#0e1526] rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-xl shadow-black/30 space-y-6">
        {/* Step 1: Đọc tin nhắn */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono-tech font-bold text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>BƯỚC 01 / 07: HỌC SINH TIẾP CẬN TIN NHẮN GIẢ LẬP</span>
            </div>

            <div className="p-5 bg-slate-950 rounded-2xl text-white max-w-xl mx-auto shadow-inner border border-slate-800">
              <div className="text-[10px] font-mono-tech text-slate-400 pb-2 mb-3 border-b border-slate-800 flex justify-between">
                <span>SMS TỪ: NGÂN HÀNG (SỐ LẠ)</span>
                <span>VỪA XONG</span>
              </div>
              <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed">
                "{demoMessageV1}"
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 max-w-xl mx-auto font-sans">
              💡 <strong>GỢI Ý GIÁO VIÊN:</strong> Hướng dẫn học sinh đọc kỹ nội dung, chú ý xem tin nhắn muốn mình làm gì (gửi mã gì?) và có cảm giác hối thúc, lo lắng thế nào khi đọc tin nhắn này?
            </div>
          </div>
        )}

        {/* Step 2: Tự nhận xét */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono-tech font-bold text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>BƯỚC 02 / 07: EM NHẬN XÉT TRƯỚC (PHÁN ĐOÁN BAN ĐẦU)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-rose-500/60 bg-rose-950/40 text-rose-200">
                <span className="text-[10px] font-mono-tech uppercase font-bold text-rose-400 block mb-1">
                  1. MỨC ĐỘ NGUY CƠ
                </span>
                <p className="font-bold text-sm flex items-center gap-1.5 font-mono-tech">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  CÓ DẤU HIỆU ĐÁNG NGỜ
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200">
                <span className="text-[10px] font-mono-tech uppercase font-bold text-slate-400 block mb-1">
                  2. DẤU HIỆU PHÁT HIỆN
                </span>
                <p className="font-semibold text-xs text-slate-300">
                  • Yêu cầu mã xác thực / OTP
                </p>
                <p className="font-semibold text-xs text-slate-300 mt-1">
                  • Đe dọa khóa tài khoản ngay lập tức
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200">
                <span className="text-[10px] font-mono-tech uppercase font-bold text-slate-400 block mb-1">
                  3. HÀNH ĐỘNG CỦA EM
                </span>
                <p className="font-semibold text-xs text-slate-300">
                  • Tuyệt đối không gửi mã
                </p>
                <p className="font-semibold text-xs text-slate-300 mt-1">
                  • Báo ngay cho cha mẹ kiểm tra
                </p>
              </div>
            </div>

            <p className="text-xs font-mono-tech text-slate-400 text-center italic">
              ĐÃ GHI NHẬN PHÁN ĐOÁN CỦA HỌC SINH. BẤM "TIẾP THEO" ĐỂ AI QUÉT 5 KÍNH LỌC!
            </p>
          </div>
        )}

        {/* Step 3: AI Phân tích */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono-tech font-bold text-xs sm:text-sm">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>BƯỚC 03 / 07: AI PHÂN TÍCH ĐA CHIỀU QUA 5 KÍNH LỌC</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-blue-500/40 bg-blue-950/30 text-slate-200">
                <span className="font-mono-tech font-bold text-blue-300 block mb-1">KÍNH LỌC 1: NGƯỜI GỬI</span>
                <p className="text-slate-300 leading-relaxed">Tự xưng "Ngân hàng" chung chung qua SMS rác, không có chứng thực danh tính.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-purple-500/40 bg-purple-950/30 text-slate-200">
                <span className="font-mono-tech font-bold text-purple-300 block mb-1">KÍNH LỌC 2: YÊU CẦU</span>
                <p className="text-slate-300 leading-relaxed">Yêu cầu người nhận cung cấp "mã xác thực" - đây là chìa khóa két sắt tài khoản.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/30 text-slate-200">
                <span className="font-mono-tech font-bold text-amber-300 block mb-1">KÍNH LỌC 3: ÁP LỰC</span>
                <p className="text-slate-300 leading-relaxed">Dùng từ "sắp bị khóa" và "ngay" để ép nạn nhân phải hành động gấp gáp hoảng sợ.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-950/40 text-slate-200">
                <span className="font-mono-tech font-bold text-slate-300 block mb-1">KÍNH LỌC 4: THÔNG TIN THIẾU</span>
                <p className="text-slate-300 leading-relaxed">Không có hotline chính thức, không nêu rõ tên chủ tài khoản hay số tài khoản.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-slate-200 sm:col-span-2">
                <span className="font-mono-tech font-bold text-emerald-300 block mb-1">KÍNH LỌC 5: BƯỚC AN TOÀN</span>
                <p className="text-slate-300 leading-relaxed">Tuyệt đối không gửi mã • Không gọi lại số lạ • Hỏi người lớn • Vào ứng dụng chính thức.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Phát hiện 3 bẫy nguy cơ */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-mono-tech font-bold text-xs sm:text-sm">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>BƯỚC 04 / 07: TỔNG KẾT 3 DẤU HIỆU BẪY LỪA ĐẢO CỐT LÕI</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl border-2 border-rose-500/80 bg-rose-950/50 text-rose-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileKey className="w-5 h-5 text-rose-400" />
                  <h4 className="font-bold text-xs sm:text-sm font-mono-tech">1. ĐÒI MÃ OTP</h4>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Ngân hàng và nhà mạng luôn khẳng định: <strong>Nhân viên không bao giờ đòi mã xác thực</strong> của người dùng qua tin nhắn.
                </p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-amber-500/80 bg-amber-950/50 text-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-xs sm:text-sm font-mono-tech">2. ÁP LỰC THỜI GIAN</h4>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Dùng đòn tâm lý "sắp bị khóa", "ngay bây giờ" để khiến nạn nhân hoảng loạn, sợ mất tiền và mất tài khoản.
                </p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-slate-700 bg-slate-950/80 text-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <SearchX className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-xs sm:text-sm font-mono-tech">3. THIẾU KÊNH XÁC MINH</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tin nhắn không cung cấp mã tra cứu chính thức, không hướng dẫn gọi hotline tổng đài đã được chứng nhận.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Hướng xử lý an toàn */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-mono-tech font-bold text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>BƯỚC 05 / 07: QUY TRÌNH HÀNH ĐỘNG AN TOÀN 4 BƯỚC</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 flex items-start gap-2.5 text-xs text-emerald-200">
                <span className="w-5 h-5 rounded font-mono-tech bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                  01
                </span>
                <div>
                  <strong>Không trả lời ngay:</strong> Dừng lại và giữ bình tĩnh, kẻ gian luôn mong em phản ứng vội vàng.
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 flex items-start gap-2.5 text-xs text-emerald-200">
                <span className="w-5 h-5 rounded font-mono-tech bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                  02
                </span>
                <div>
                  <strong>Không gửi mã bí mật:</strong> Mã xác thực là chìa khóa két sắt số của em, tuyệt đối không đưa cho ai.
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 flex items-start gap-2.5 text-xs text-emerald-200">
                <span className="w-5 h-5 rounded font-mono-tech bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                  03
                </span>
                <div>
                  <strong>Kiểm tra qua kênh chính thức:</strong> Mở trực tiếp ứng dụng ngân hàng hoặc đến phòng giao dịch.
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 flex items-start gap-2.5 text-xs text-emerald-200">
                <span className="w-5 h-5 rounded font-mono-tech bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                  04
                </span>
                <div>
                  <strong>Hỏi người lớn đáng tin cậy:</strong> Đưa tin nhắn cho bố mẹ hoặc thầy cô giáo xem và hỗ trợ xử lý.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Thay đổi 1 chi tiết (V2) */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono-tech font-bold text-xs sm:text-sm">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>BƯỚC 06 / 07: THAY ĐỔI MỘT CHI TIẾT CỐT LÕI (CHUYỂN SANG BẢN V2)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-rose-900/60 bg-rose-950/30 text-xs">
                <span className="font-mono-tech font-bold text-rose-400 uppercase block mb-1.5">
                  BẢN V1 (ĐÁNG NGỜ - ĐÒI MÃ OTP)
                </span>
                <p className="text-slate-200 font-sans leading-relaxed">
                  "{demoMessageV1}"
                </p>
                <div className="mt-2 text-rose-300 font-semibold flex items-center gap-1.5">
                  ⚠️ Đòi mã xác thực ngay lập tức + đe dọa khóa tài khoản
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/30 text-xs">
                <span className="font-mono-tech font-bold text-emerald-400 uppercase block mb-1.5">
                  BẢN V2 (ĐÃ SỬA CHI TIẾT - AN TOÀN)
                </span>
                <p className="text-slate-200 font-sans leading-relaxed">
                  "{demoMessageV2}"
                </p>
                <div className="mt-2 text-emerald-300 font-semibold flex items-center gap-1.5">
                  ✅ Không đòi mã + có lịch trình cụ thể + nhắc nhở bảo mật
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: AI giải thích vì sao kết quả thay đổi */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono-tech font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>BƯỚC 07 / 07: AI GIẢI THÍCH VÌ SAO KẾT QUẢ THAY ĐỔI TỪ "ĐÁNG NGỜ" SANG "AN TOÀN"</span>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/50 text-indigo-100 space-y-3">
              <h4 className="text-xs sm:text-sm font-mono-tech font-bold text-cyan-300 flex items-center gap-2">
                <span>KẾT LUẬN SƯ PHẠM THEN CHỐT:</span>
              </h4>

              <div className="text-xs sm:text-sm leading-relaxed space-y-2 text-slate-200 font-sans">
                <p>
                  1. <strong>Mục đích tin nhắn đã thay đổi:</strong> Ở bản V1, kẻ gian nhắm đến việc <em>lấy cắp mã OTP</em>. Ở bản V2, ngân hàng chỉ <em>thông báo lịch bảo trì hệ thống</em> và chủ động nhắc nhở khách hàng không chia sẻ mã.
                </p>
                <p>
                  2. <strong>Yếu tố tâm lý:</strong> Bản V1 đe dọa ép người dùng trong vài phút; Bản V2 đưa thông tin thời gian cụ thể (Chủ Nhật, 02:00 - 04:00) và khẳng định người dùng <em>không cần làm gì cả</em>.
                </p>
                <p>
                  3. <strong>Quy tắc vàng cho học sinh:</strong> Khi một tin nhắn bắt em phải gửi mã OTP hoặc bấm link lạ ngay lập tức, đó là dấu hiệu lừa đảo. Hãy luôn bình tĩnh và hỏi người lớn!
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2.5 font-mono-tech">
                <button
                  type="button"
                  id="btn-demo-open-comparator"
                  onClick={() => {
                    cyberAudio.playClick();
                    onOpenComparator(demoMessageV1, demoMessageV2);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 flex items-center gap-1.5 cursor-pointer border border-cyan-400/40"
                >
                  <Scale className="w-3.5 h-3.5" />
                  MỞ BẢNG SO SÁNH V1 vs V2
                </button>
                <button
                  type="button"
                  id="btn-demo-load-analyzer"
                  onClick={() => {
                    cyberAudio.playClick();
                    onLoadIntoAnalyzer(demoMessageV1);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-cyan-300 font-bold text-xs hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  NẠP VÀO TRANG PHÂN TÍCH CHÍNH
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigator */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            id="btn-demo-prev-step"
            disabled={currentStep === 1}
            onClick={() => {
              cyberAudio.playClick();
              setCurrentStep((prev) => Math.max(1, prev - 1));
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-semibold border ${
              currentStep === 1
                ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer'
            }`}
          >
            &lt; QUAY LẠI
          </button>

          {currentStep < 7 ? (
            <button
              type="button"
              id="btn-demo-next-step"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono-tech font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-950 border border-cyan-400/40"
            >
              <span>BƯỚC TIẾP: {steps[currentStep]?.title || 'TIẾP TỤC'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              id="btn-demo-finish"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono-tech font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-950 border border-emerald-400/40"
            >
              <span>🎉 HOÀN THÀNH DEMO (XEM LẠI)</span>
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
