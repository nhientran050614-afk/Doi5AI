import React from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  BrainCircuit, 
  ArrowRight,
  ShieldQuestion,
  Terminal,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { RiskLevel, StudentPreEvaluation } from '../types';
import { cyberAudio } from '../utils/cyberAudio';

interface StudentPreEvaluationSectionProps {
  evaluation: StudentPreEvaluation;
  onChangeEvaluation: (evalData: StudentPreEvaluation) => void;
  onRunAnalysis: () => void;
  isLoading: boolean;
  canAnalyze: boolean;
  messageLength: number;
}

export const StudentPreEvaluationSection: React.FC<StudentPreEvaluationSectionProps> = ({
  evaluation,
  onChangeEvaluation,
  onRunAnalysis,
  isLoading,
  canAnalyze,
  messageLength,
}) => {
  const suspicionLevels: { level: RiskLevel; label: string; code: string; icon: any; activeClass: string; idleClass: string }[] = [
    {
      level: 'An toàn',
      label: 'An toàn (Bình thường)',
      code: 'STATUS: SECURE',
      icon: CheckCircle2,
      activeClass: 'border-emerald-500 bg-emerald-950/50 text-emerald-300 ring-1 ring-emerald-400 shadow-md shadow-emerald-950',
      idleClass: 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-emerald-800/60 hover:text-emerald-300',
    },
    {
      level: 'Cần kiểm tra thêm',
      label: 'Cần kiểm tra thêm (Chưa chắc)',
      code: 'STATUS: CAUTION',
      icon: AlertTriangle,
      activeClass: 'border-amber-500 bg-amber-950/50 text-amber-300 ring-1 ring-amber-400 shadow-md shadow-amber-950',
      idleClass: 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-amber-800/60 hover:text-amber-300',
    },
    {
      level: 'Có dấu hiệu đáng ngờ',
      label: 'Có dấu hiệu đáng ngờ (Nguy hiểm)',
      code: 'STATUS: SUSPICIOUS',
      icon: XCircle,
      activeClass: 'border-rose-500 bg-rose-950/50 text-rose-300 ring-1 ring-rose-400 shadow-md shadow-rose-950',
      idleClass: 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-rose-800/60 hover:text-rose-300',
    },
  ];

  const commonSigns = [
    'Yêu cầu mã OTP / Mật khẩu / Mã xác thực',
    'Tạo áp lực khẩn cấp (sắp bị khóa, trễ hẹn)',
    'Đòi bấm vào đường link lạ có đuôi lạ (.xyz, .top)',
    'Mạo danh người quen, thầy cô hoặc ngân hàng',
    'Hứa hẹn quà tặng lớn, kim cương game, trúng thưởng',
    'Yêu cầu chuyển tiền vào tài khoản cá nhân lạ',
    'Không xưng hô tên cụ thể của em',
    'Không có dấu hiệu đáng ngờ nào',
  ];

  const actionChoices = [
    'Không trả lời và không gửi bất kỳ mã hay mật khẩu nào',
    'Hỏi ngay ý kiến của bố mẹ hoặc thầy cô giáo',
    'Gọi trực tiếp số điện thoại đã biết của người gửi để xác minh',
    'Kiểm tra lại trên ứng dụng/website chính thức của tổ chức',
    'Bấm thử vào đường link xem có đúng không (Không khuyến khích)',
    'Phản hồi tin nhắn bình thường (nếu chắc chắn an toàn)',
  ];

  const toggleSign = (sign: string) => {
    cyberAudio.playClick();
    let nextSigns = [...evaluation.selected_signs];
    if (nextSigns.includes(sign)) {
      nextSigns = nextSigns.filter((s) => s !== sign);
    } else {
      nextSigns.push(sign);
    }
    onChangeEvaluation({
      ...evaluation,
      selected_signs: nextSigns,
    });
  };

  const handleLevelSelect = (level: RiskLevel) => {
    cyberAudio.playClick();
    onChangeEvaluation({
      ...evaluation,
      suspicion_level: level,
    });
  };

  const handleActionSelect = (action: string) => {
    cyberAudio.playClick();
    onChangeEvaluation({
      ...evaluation,
      planned_action: action,
    });
  };

  const handleTriggerAnalysis = () => {
    cyberAudio.playScan();
    onRunAnalysis();
  };

  return (
    <div className="bg-[#0e1526] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl shadow-black/30 relative overflow-hidden">
      {/* Top accent border */}
      <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono-tech font-semibold text-sm shadow-xs">
            02
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Khu Vực "Em Nhận Xét Trước"
              <span className="text-[10px] font-mono-tech font-medium text-indigo-300 bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-700/60">
                STUDENT_INTUITION_RADAR
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Rèn luyện trực giác thám tử an toàn số trước khi kích hoạt máy quét 5 Kính Lọc AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono-tech">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>STATUS: READY_FOR_EVALUATION</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Câu hỏi 1: Tin nhắn này có đáng ngờ không? */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2.5 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>1. Nhận định bước đầu: Tin nhắn này có đáng ngờ không?</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {suspicionLevels.map((item) => {
              const Icon = item.icon;
              const isSelected = evaluation.suspicion_level === item.level;
              return (
                <button
                  key={item.level}
                  type="button"
                  id={`eval-level-${item.level}`}
                  onClick={() => handleLevelSelect(item.level)}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected ? item.activeClass : item.idleClass
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono-tech font-medium opacity-80">
                      {item.code}
                    </span>
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Câu hỏi 2: Dấu hiệu nào khiến em nghi ngờ? */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ShieldQuestion className="w-4 h-4 text-indigo-400" />
              <span>2. Dấu hiệu nghi ngờ phát hiện qua quan sát:</span>
            </label>
            <span className="text-[11px] font-mono-tech text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              ĐÃ CHỌN: {evaluation.selected_signs.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {commonSigns.map((sign, idx) => {
              const isChecked = evaluation.selected_signs.includes(sign);
              return (
                <button
                  key={idx}
                  type="button"
                  id={`sign-checkbox-${idx}`}
                  onClick={() => toggleSign(sign)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                    isChecked
                      ? 'border-indigo-500/80 bg-indigo-950/50 text-indigo-200 font-medium ring-1 ring-indigo-500/40'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border font-mono-tech text-[10px] font-bold ${
                      isChecked
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-xs'
                        : 'border-slate-700 bg-slate-900 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span className="leading-relaxed">{sign}</span>
                </button>
              );
            })}
          </div>

          {/* Ô nhập ghi chú lý do thêm */}
          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono-tech text-[11px] text-slate-400">GHI CHÚ SUY NGHĨ RIÊNG CỦA HỌC SINH (TÙY CHỌN):</span>
            </div>
            <input
              type="text"
              id="student-notes-input"
              value={evaluation.notes || ''}
              onChange={(e) =>
                onChangeEvaluation({
                  ...evaluation,
                  notes: e.target.value,
                })
              }
              placeholder="Ví dụ: Em thấy người gửi không ghi tên trường, mà lại hối thúc trong vòng 5 phút..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-700 bg-slate-950/70 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 font-sans"
            />
          </div>
        </div>

        {/* Câu hỏi 3: Em sẽ làm gì tiếp theo? */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2.5 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <span>3. Quyết định hành động an toàn của em:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {actionChoices.map((action, idx) => {
              const isSelected = evaluation.planned_action === action;
              const isDangerous = action.includes('Bấm thử');
              return (
                <button
                  key={idx}
                  type="button"
                  id={`action-choice-${idx}`}
                  onClick={() => handleActionSelect(action)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? isDangerous
                        ? 'border-rose-500 bg-rose-950/60 text-rose-200 font-semibold ring-1 ring-rose-400'
                        : 'border-cyan-500 bg-cyan-950/60 text-cyan-200 font-semibold ring-1 ring-cyan-400'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full shrink-0 border flex items-center justify-center ${
                      isSelected
                        ? isDangerous
                          ? 'border-rose-400 bg-rose-500'
                          : 'border-cyan-400 bg-cyan-500'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nút Phân Tích Bằng AI - High-Tech Cyber Action */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono-tech text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {messageLength < 10 ? (
              <span className="text-amber-400 font-medium">
                CẦN TỐI THIỂU 10 KÝ TỰ Ở BƯỚC 1 ĐỂ KÍCH HOẠT QUÉT.
              </span>
            ) : (
              <span>SẴN SÀNG QUÉT 5 KÍNH LỌC AN TOÀN SỐ</span>
            )}
          </div>

          <button
            type="button"
            id="btn-run-ai-analysis"
            disabled={!canAnalyze || isLoading}
            onClick={handleTriggerAnalysis}
            className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-mono-tech font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer border ${
              !canAnalyze || isLoading
                ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white border-cyan-400/60 shadow-lg shadow-indigo-950/70 hover:shadow-cyan-950/80 active:scale-98'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin" />
                <span className="text-cyan-200">ĐANG QUÉT 5 KÍNH LỌC AI...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-5 h-5 text-cyan-300" />
                <span className="tracking-wide">KÍCH HOẠT QUÉT 5 KÍNH LỌC AI</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
