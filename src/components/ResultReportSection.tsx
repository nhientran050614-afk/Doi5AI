import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  UserCheck, 
  FileKey, 
  Flame, 
  SearchX, 
  Footprints, 
  HelpCircle, 
  CheckSquare2, 
  Sparkles,
  ClipboardList,
  Printer,
  Scale,
  Terminal,
  Cpu,
  Radio,
  Lock,
  Eye
} from 'lucide-react';
import { AnalysisResult, StudentPreEvaluation, RiskLevel } from '../types';
import { cyberAudio } from '../utils/cyberAudio';

interface ResultReportSectionProps {
  result: AnalysisResult;
  studentPreEval?: StudentPreEvaluation;
  onOpenCompareWithThis?: (message: string) => void;
}

export const ResultReportSection: React.FC<ResultReportSectionProps> = ({
  result,
  studentPreEval,
  onOpenCompareWithThis,
}) => {
  const getRiskConfig = (level: RiskLevel) => {
    switch (level) {
      case 'An toàn':
        return {
          title: 'AN TOÀN // SECURE',
          sub: 'Chưa phát hiện dấu hiệu mạo danh, mã độc hay yêu cầu đánh cắp thông tin.',
          bgColor: 'bg-emerald-950/40',
          borderColor: 'border-emerald-500/60',
          textColor: 'text-emerald-300',
          badgeBg: 'bg-emerald-600 text-white shadow-emerald-900/50',
          icon: ShieldCheck,
          meterWidth: 'w-1/4',
          meterColor: 'bg-emerald-400',
          percentage: '15%',
          statusTag: 'STATUS: THREAT_MINIMAL',
        };
      case 'Cần kiểm tra thêm':
        return {
          title: 'CẦN KIỂM TRA THÊM // CAUTION',
          sub: 'Chưa đủ bằng chứng xác thực, nguồn gửi chưa được chứng thực hoặc thiếu tên cụ thể.',
          bgColor: 'bg-amber-950/40',
          borderColor: 'border-amber-500/60',
          textColor: 'text-amber-300',
          badgeBg: 'bg-amber-600 text-white shadow-amber-900/50',
          icon: AlertTriangle,
          meterWidth: 'w-3/5',
          meterColor: 'bg-amber-400',
          percentage: '60%',
          statusTag: 'STATUS: REQUIRES_VERIFICATION',
        };
      case 'Có dấu hiệu đáng ngờ':
      default:
        return {
          title: 'CÓ DẤU HIỆU ĐÁNG NGỜ // HIGH THREAT',
          sub: 'Phát hiện các yếu tố lừa đảo nguy hiểm: đòi OTP/mật khẩu, đường link lạ hoặc gây áp lực khẩn cấp.',
          bgColor: 'bg-rose-950/40',
          borderColor: 'border-rose-500/60',
          textColor: 'text-rose-300',
          badgeBg: 'bg-rose-600 text-white shadow-rose-900/50',
          icon: ShieldAlert,
          meterWidth: 'w-full',
          meterColor: 'bg-rose-500',
          percentage: '92%',
          statusTag: 'STATUS: HIGH_RISK_DETECTED',
        };
    }
  };

  const riskConfig = getRiskConfig(result.risk_level);
  const RiskIcon = riskConfig.icon;

  const fiveFilters = [
    {
      code: 'FILTER_01',
      name: '1. Người gửi (Sender)',
      tag: 'Danh tính & Kênh truyền',
      icon: UserCheck,
      content: result.sender_analysis,
      accentBorder: 'border-blue-500/40',
      iconColor: 'text-blue-400',
      tagBg: 'bg-blue-950/60 text-blue-300',
    },
    {
      code: 'FILTER_02',
      name: '2. Yêu cầu (Request)',
      tag: 'OTP / Mật khẩu / Dữ liệu',
      icon: FileKey,
      content: result.request_analysis,
      accentBorder: 'border-purple-500/40',
      iconColor: 'text-purple-400',
      tagBg: 'bg-purple-950/60 text-purple-300',
    },
    {
      code: 'FILTER_03',
      name: '3. Áp lực (Pressure)',
      tag: 'Tâm lý khẩn cấp & Đe dọa',
      icon: Flame,
      content: result.pressure_analysis,
      accentBorder: 'border-amber-500/40',
      iconColor: 'text-amber-400',
      tagBg: 'bg-amber-950/60 text-amber-300',
    },
    {
      code: 'FILTER_04',
      name: '4. Thông tin thiếu (Missing Info)',
      tag: 'Bằng chứng xác thực bị thiếu',
      icon: SearchX,
      content: result.missing_information,
      accentBorder: 'border-cyan-500/40',
      iconColor: 'text-cyan-400',
      tagBg: 'bg-cyan-950/60 text-cyan-300',
    },
    {
      code: 'FILTER_05',
      name: '5. Bước an toàn (Safe Protocol)',
      tag: 'Hành động được khuyến nghị',
      icon: Footprints,
      content: result.safe_actions.join(' • '),
      accentBorder: 'border-emerald-500/40',
      iconColor: 'text-emerald-400',
      tagBg: 'bg-emerald-950/60 text-emerald-300',
    },
  ];

  const standardActionGuides = [
    { text: 'Không trả lời ngay', desc: 'Dành thời gian bình tĩnh suy xét, không phản xạ theo cảm xúc hối thúc.' },
    { text: 'Không gửi thông tin bí mật', desc: 'Tuyệt đối không gửi mã OTP, mật khẩu hay số định danh cá nhân.' },
    { text: 'Kiểm tra qua kênh chính thức', desc: 'Truy cập cổng chính thức hoặc gọi số điện thoại đã biết trước.' },
    { text: 'Hỏi người lớn đáng tin cậy', desc: 'Hỏi ngay cha mẹ hoặc thầy cô giáo để nhận sự hỗ trợ an toàn.' },
  ];

  const studentAgreed = studentPreEval && studentPreEval.suspicion_level === result.risk_level;

  return (
    <div id="suspicious-signs-report-card" className="bg-[#0e1526] rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-xl shadow-black/40 space-y-6 relative overflow-hidden">
      {/* Top Cyber Accent */}
      <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />

      {/* Title & Cyber Forensic Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/50 text-cyan-300 flex items-center justify-center shadow-md shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Phiếu Dấu Hiệu Đáng Ngờ
              </h2>
              <span className="text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60">
                FORENSIC_REPORT
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Kết quả giám định an toàn qua Lớp Quy Tắc Mã Lệnh & 5 Kính Lọc Trí Tuệ Nhân Tạo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCompareWithThis && result.messageText && (
            <button
              type="button"
              id="btn-compare-from-result"
              onClick={() => {
                cyberAudio.playClick();
                onOpenCompareWithThis(result.messageText!);
              }}
              className="text-xs font-mono-tech font-semibold px-3 py-1.5 rounded-lg border border-cyan-500/50 text-cyan-300 hover:bg-cyan-950/40 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>SO SÁNH V1 - V2</span>
            </button>
          )}
          <button
            type="button"
            id="btn-print-report"
            onClick={() => {
              cyberAudio.playClick();
              window.print();
            }}
            className="text-xs font-mono-tech px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
            title="In phiếu học tập cho học sinh"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">IN PHIẾU</span>
          </button>
        </div>
      </div>

      {/* 1. MỨC ĐỘ CẢNH GIÁC - CYBER THREAT GAUGE */}
      <div className={`p-4 sm:p-5 rounded-2xl border ${riskConfig.borderColor} ${riskConfig.bgColor} transition-colors`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${riskConfig.badgeBg} flex items-center justify-center shadow-lg shrink-0`}>
              <RiskIcon className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono-tech uppercase font-semibold tracking-wider text-slate-400 block mb-0.5">
                {riskConfig.statusTag}
              </span>
              <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${riskConfig.textColor}`}>
                {riskConfig.title}
              </h3>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
            <span className={`text-xs font-mono-tech font-bold px-3 py-1 rounded-full ${riskConfig.badgeBg}`}>
              KẾT LUẬN: {result.risk_level}
            </span>
            <span className="text-[11px] font-mono-tech text-slate-400">
              CHỈ SỐ RỦI RO: <strong className={riskConfig.textColor}>{riskConfig.percentage}</strong>
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 mb-3.5 leading-relaxed">
          {riskConfig.sub}
        </p>

        {/* Visual High-Tech Risk Meter Bar */}
        <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-[10px] font-mono-tech font-semibold text-slate-400">
            <span className="text-emerald-400">● 01. AN TOÀN</span>
            <span className="text-amber-400">▲ 02. KIỂM TRA THÊM</span>
            <span className="text-rose-400">■ 03. ĐÁNG NGỜ</span>
          </div>
          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div className={`h-full rounded-full transition-all duration-700 ${riskConfig.meterColor} ${riskConfig.meterWidth}`} />
          </div>
        </div>
      </div>

      {/* 2. LỚP KIỂM TRA QUY TẮC MÃ LỆNH (CYBER DEFENSE RULE ENGINE TERMINAL) */}
      {result.ruleCheck?.hasCriticalRisk && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/50 border-2 border-rose-500/80 text-rose-100 shadow-lg shadow-rose-950/40">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-2.5 w-full">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono-tech font-bold text-rose-300 uppercase tracking-wide flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CYBER_RULE_ENGINE: CẢNH BÁO BẮT BUỘC ĐÃ KÍCH HOẠT</span>
                </h4>
                <span className="text-[10px] font-mono-tech bg-rose-900 px-2 py-0.5 rounded text-rose-200 border border-rose-700">
                  VIOLATION_INTERCEPTED
                </span>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-rose-500/40 text-xs sm:text-sm font-semibold text-rose-200 leading-relaxed font-sans whitespace-pre-line">
                {result.ruleCheck.mandatoryWarning}
              </div>

              <div className="text-xs text-rose-300 flex flex-wrap items-center gap-2 font-mono-tech pt-1">
                <span className="text-slate-400 text-[11px]">TỪ KHÓA ĐÁNG NGỜ:</span>
                {result.ruleCheck.violations.map((v, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-0.5 rounded bg-rose-900/60 text-rose-200 border border-rose-700 text-[11px]"
                  >
                    [{v.category}]: {v.detectedKeywords.join(', ')}
                  </span>
                ))}
              </div>

              <div className="text-[11px] font-mono-tech text-slate-400 pt-1 border-t border-rose-900/50">
                * Lưu ý quy chuẩn: Hệ thống không xác minh danh tính người gửi thật, không kiểm tra độ an toàn trực tiếp của URL, và tuyệt đối không thu thập dữ liệu cá nhân thật của học sinh.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SO SÁNH VỚI NHẬN XÉT CỦA HỌC SINH (Student Pre-Eval vs AI) */}
      {studentPreEval && (
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs sm:text-sm font-mono-tech font-bold text-white">
              ĐỐI CHIẾU: NHẬN XÉT CỦA EM vs KẾT QUẢ AI
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono-tech uppercase font-bold text-slate-400 block mb-1.5">
                [STUDENT_VERDICT] Phán đoán của em
              </span>
              <p className="font-bold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Mức độ: <span className="text-cyan-300">{studentPreEval.suspicion_level}</span>
              </p>
              <p className="text-slate-400 mt-1.5 leading-relaxed">
                Dấu hiệu đã chọn: {studentPreEval.selected_signs.length > 0 ? studentPreEval.selected_signs.join(', ') : 'Chưa chọn'}
              </p>
              <p className="text-slate-400 mt-1">
                Hành động dự định: {studentPreEval.planned_action || 'Chưa chọn'}
              </p>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] font-mono-tech uppercase font-bold text-slate-400 block mb-1.5">
                [EVALUATION_FEEDBACK] Nhận định sư phạm
              </span>
              {studentAgreed ? (
                <div className="text-emerald-300 font-medium leading-relaxed">
                  🎉 <strong>Rất xuất sắc!</strong> Trực giác của em hoàn toàn trùng khớp với kết luận của AI. Em có năng lực quan sát dấu hiệu đáng ngờ rất nhạy bén!
                </div>
              ) : (
                <div className="text-indigo-300 font-medium leading-relaxed">
                  💡 <strong>Góc nhìn mở rộng:</strong> Em đã bước đầu có phán đoán riêng. Hãy đối chiếu chi tiết 5 kính lọc dưới đây để rèn luyện mắt nhìn sắc sảo hơn!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. BẢNG 5 KÍNH LỌC AN TOÀN SỐ (CYBER RADAR CARDS) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-mono-tech font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>2. MA TRẬN 5 KÍNH LỌC AN TOÀN SỐ</span>
          </h3>
          <span className="text-[11px] font-mono-tech text-slate-400 hidden sm:inline">
            5_FILTERS_AI_ANALYSIS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {fiveFilters.map((filter, index) => {
            const Icon = filter.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-xl border bg-slate-950/60 ${filter.accentBorder} hover:bg-slate-950/80 transition-all ${
                  index === 4 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0">
                      <Icon className={`w-4 h-4 ${filter.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">
                        {filter.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block font-mono-tech">
                        {filter.tag}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono-tech px-1.5 py-0.5 rounded font-bold ${filter.tagBg}`}>
                    {filter.code}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {filter.content || 'Không phát hiện dấu hiệu bất thường.'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. CÁC CÂU HỎI TỰ VẤN KIỂM CHỨNG (VERIFICATION QUERIES) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-indigo-800/50">
        <h3 className="text-xs sm:text-sm font-mono-tech font-bold text-indigo-300 flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>3. CÂU HỎI TRUY VẤN XÁC MINH (Học sinh nên tự hỏi trước khi thao tác)</span>
        </h3>

        <div className="space-y-2">
          {result.verification_questions && result.verification_questions.length > 0 ? (
            result.verification_questions.map((q, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200"
              >
                <CheckSquare2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{q}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400">
              Người gửi có phải nguồn chính thức không? Có cách nào kiểm tra thông tin mà không cung cấp dữ liệu bí mật không? Có thể hỏi giáo viên hoặc phụ huynh không?
            </div>
          )}
        </div>
      </div>

      {/* 6. HƯỚNG DẪN HÀNH ĐỘNG AN TOÀN (SAFE ACTION PROTOCOL) */}
      <div>
        <h3 className="text-xs sm:text-sm font-mono-tech font-bold text-white mb-3 flex items-center gap-2">
          <Footprints className="w-4 h-4 text-emerald-400" />
          <span>4. QUY TRÌNH HÀNH ĐỘNG AN TOÀN 4 BƯỚC</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {standardActionGuides.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-700/50 flex items-center justify-center font-mono-tech font-bold text-xs shrink-0 mt-0.5">
                0{idx + 1}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">
                  {item.text}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Căn cứ phát hiện cụ thể (Evidence Telemetry) */}
      {result.evidence && result.evidence.length > 0 && (
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-mono-tech text-[11px] text-cyan-400 font-bold">CHỨNG CỨ TRUY VẾT:</span>
          {result.evidence.map((ev, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono-tech text-[11px]"
            >
              #{ev}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
