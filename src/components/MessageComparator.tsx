import React, { useState } from 'react';
import { 
  Scale, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  AlertTriangle, 
  Table, 
  Lightbulb, 
  Layers,
  Terminal,
  Cpu,
  Zap,
  Radio
} from 'lucide-react';
import { ComparisonResult, RiskLevel } from '../types';
import { cyberAudio } from '../utils/cyberAudio';
import { compareMessagesLocally } from '../utils/localAnalyzer';

interface MessageComparatorProps {
  initialMessage1?: string;
  initialMessage2?: string;
}

export const MessageComparator: React.FC<MessageComparatorProps> = ({
  initialMessage1 = '',
  initialMessage2 = '',
}) => {
  const [message1, setMessage1] = useState<string>(
    initialMessage1 ||
      'Ngân hàng thông báo tài khoản của bạn sắp bị khóa. Hãy gửi mã xác thực ngay để mở lại tài khoản.'
  );
  const [message2, setMessage2] = useState<string>(
    initialMessage2 ||
      'Ngân hàng thông báo bảo trì hệ thống định kỳ vào Chủ Nhật từ 02:00 - 04:00. Quý khách không cần thao tác gì và ngân hàng KHÔNG BAO GIỜ yêu cầu cung cấp mã OTP hay mật khẩu.'
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const samplePairs = [
    {
      title: 'Cặp 1 (Demo chuẩn): Ngân hàng đòi OTP vs Thông báo bảo trì',
      m1: 'Ngân hàng thông báo tài khoản của bạn sắp bị khóa. Hãy gửi mã xác thực ngay để mở lại tài khoản.',
      m2: 'Ngân hàng thông báo bảo trì hệ thống định kỳ vào Chủ Nhật từ 02:00 - 04:00. Quý khách không cần thao tác gì và ngân hàng KHÔNG BAO GIỜ yêu cầu cung cấp mã OTP hay mật khẩu.',
    },
    {
      title: 'Cặp 2: Nhận Kim Cương Game qua link lạ vs Sự kiện trong game',
      m1: 'Nhận 9999 Kim Cương miễn phí tại nap-the-freefire.xyz, gửi mã OTP để nhận quà ngay!',
      m2: 'Sự kiện sinh nhật: Đăng nhập trực tiếp trong ứng dụng game vào ngày 20/10 để nhận quà điểm danh. Nhà phát hành không yêu cầu cung cấp mật khẩu.',
    },
    {
      title: 'Cặp 3: Giáo viên thu tiền vào tài khoản lạ vs Thông báo sổ liên lạc',
      m1: 'Cô chủ nhiệm đây, nộp gấp 100k vào STK cá nhân 0987xxx trước 12h, nếu không sẽ bị trừ điểm.',
      m2: 'Nhà trường gửi thông báo thu tiền bảo hiểm y tế qua cổng thanh toán VnEdu hoặc phụ huynh nộp trực tiếp tại phòng tài vụ.',
    },
  ];

  const handleSelectPair = (pair: { m1: string; m2: string }) => {
    cyberAudio.playClick();
    setMessage1(pair.m1);
    setMessage2(pair.m2);
    setComparisonResult(null);
    setError(null);
  };

  const handleRunComparison = async () => {
    if (!message1.trim() || !message2.trim()) {
      setError('Vui lòng nhập đầy đủ nội dung cho cả hai tin nhắn để so sánh.');
      return;
    }

    cyberAudio.playScan();
    setIsLoading(true);
    setError(null);

    try {
      let data: ComparisonResult | null = null;

      try {
        const res = await fetch('/api/compare-messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message1: message1.trim(), message2: message2.trim() }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          data = await res.json();
        } else {
          console.warn('Compare API returned non-JSON, using local comparison engine');
        }
      } catch (fetchErr) {
        console.warn('Network error on compare API, using local comparison engine:', fetchErr);
      }

      if (!data) {
        data = compareMessagesLocally(message1.trim(), message2.trim());
      }

      setComparisonResult(data);
      cyberAudio.playSuccess();
    } catch (err: any) {
      console.error('Error during comparison:', err);
      // Fallback guarantees it never fails
      const fallbackData = compareMessagesLocally(message1.trim(), message2.trim());
      setComparisonResult(fallbackData);
      cyberAudio.playSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (risk: string) => {
    if (risk.includes('An toàn')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-mono-tech text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/60">
          <CheckCircle2 className="w-3.5 h-3.5" />
          AN TOÀN // SECURE
        </span>
      );
    }
    if (risk.includes('Cần kiểm tra')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-mono-tech text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/60">
          <AlertTriangle className="w-3.5 h-3.5" />
          CẦN KIỂM TRA // CAUTION
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-mono-tech text-xs font-bold bg-rose-950 text-rose-300 border border-rose-500/60">
        <ShieldAlert className="w-3.5 h-3.5" />
        ĐÁNG NGỜ // HIGH_RISK
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0e1526] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl shadow-black/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500" />

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 text-white flex items-center justify-center shadow-lg border border-cyan-400/30 shrink-0">
            <Scale className="w-6 h-6 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Chế Độ 2: So Sánh Quang Phổ Tin Nhắn (V1 vs V2)
              </h2>
              <span className="text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60">
                DIFF_MATRIX
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Quan sát cách một chi tiết nhỏ (mã xác thực, đường link, thái độ hối thúc) làm đảo ngược hoàn toàn mức độ an toàn!
            </p>
          </div>
        </div>
      </div>

      {/* Quick sample pairs */}
      <div className="bg-[#0e1526] rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl shadow-black/30">
        <label className="text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>CÁC CẶP TIN NHẮN ĐỐI CHIẾU MẪU:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {samplePairs.map((pair, idx) => (
            <button
              key={idx}
              type="button"
              id={`btn-sample-pair-${idx}`}
              onClick={() => handleSelectPair(pair)}
              className="text-left p-3 rounded-xl border border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 hover:bg-slate-950/90 text-xs text-slate-300 transition-all cursor-pointer"
            >
              <span className="font-semibold text-white block mb-1 text-xs">{pair.title}</span>
              <p className="text-[11px] text-slate-300 line-clamp-2 font-sans leading-relaxed">V1: {pair.m1}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Two Messages Input Dual-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Message 1 */}
        <div className="bg-[#0e1526] rounded-2xl border border-rose-900/60 p-5 shadow-xl shadow-black/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-mono-tech text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-700/60">
                PAYLOAD_V1 (Bản Gốc - Nghi Ngờ)
              </span>
              <span className="text-xs font-mono-tech text-slate-400">{message1.length} chars</span>
            </div>
            <label className="text-xs font-sans text-slate-300 block mb-1.5 font-medium">
              Tin nhắn ban đầu (thường chứa bẫy tâm lý hoặc đòi OTP):
            </label>
            <textarea
              rows={4}
              id="compare-input-m1"
              value={message1}
              onChange={(e) => setMessage1(e.target.value)}
              placeholder="Nhập tin nhắn phiên bản 1..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/70 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Message 2 */}
        <div className="bg-[#0e1526] rounded-2xl border border-emerald-900/60 p-5 shadow-xl shadow-black/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-mono-tech text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                PAYLOAD_V2 (Bản Đã Sửa - An Toàn)
              </span>
              <span className="text-xs font-mono-tech text-slate-400">{message2.length} chars</span>
            </div>
            <label className="text-xs font-sans text-slate-300 block mb-1.5 font-medium">
              Tin nhắn đã sửa đổi (bỏ đòi OTP, thêm kênh xác minh):
            </label>
            <textarea
              rows={4}
              id="compare-input-m2"
              value={message2}
              onChange={(e) => setMessage2(e.target.value)}
              placeholder="Nhập tin nhắn phiên bản 2..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/70 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans resize-y leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Compare Action Button */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          id="btn-run-comparison"
          disabled={isLoading || !message1.trim() || !message2.trim()}
          onClick={handleRunComparison}
          className={`px-8 py-3.5 rounded-xl font-mono-tech font-bold text-sm flex items-center gap-3 transition-all cursor-pointer border ${
            isLoading || !message1.trim() || !message2.trim()
              ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white border-cyan-400/50 shadow-lg shadow-indigo-950 active:scale-98'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin" />
              <span className="text-cyan-200">ĐANG PHÂN TÍCH SO SÁNH QUANG PHỔ...</span>
            </>
          ) : (
            <>
              <Scale className="w-4 h-4 text-cyan-300" />
              <span>KÍCH HOẠT SO SÁNH V1 - V2 BẰNG AI</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 text-xs font-mono-tech">
          {error}
        </div>
      )}

      {/* Comparison Results Card */}
      {comparisonResult && (
        <div className="bg-[#0e1526] rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-xl shadow-black/30 space-y-6">
          {/* Header with Risk comparison */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>KẾT QUẢ PHÂN TÍCH SO SÁNH V1 VÀ V2</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Rà soát những chi tiết mấu chốt quyết định tính an toàn thông tin
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-mono-tech">V1:</span>
                {getRiskBadge(comparisonResult.message1_risk)}
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-mono-tech">V2:</span>
                {getRiskBadge(comparisonResult.message2_risk)}
              </div>
            </div>
          </div>

          {/* Core Reasoning */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/50 text-indigo-100 space-y-2">
            <h4 className="text-xs sm:text-sm font-mono-tech font-bold flex items-center gap-2 text-cyan-300">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>VÌ SAO KẾT QUẢ ĐÁNH GIÁ LẠI KHÁC NHAU?</span>
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
              {comparisonResult.why_result_changed}
            </p>
          </div>

          {/* Similarities & Differences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                <span>ĐIỂM TƯƠNG ĐỒNG:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {comparisonResult.similarities.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-mono-tech">[-]</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/50 space-y-2">
              <h4 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ĐIỂM KHÁC BIỆT CỐT LÕI (MUTATIONS):</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-200">
                {comparisonResult.differences.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-mono-tech">[+]</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Diff Table */}
          <div>
            <h4 className="text-xs sm:text-sm font-mono-tech font-bold text-white mb-3 flex items-center gap-2">
              <Table className="w-4 h-4 text-cyan-400" />
              <span>BẢNG ĐỐI CHIẾU THAY ĐỔI CHI TIẾT (DIFF MATRIX)</span>
            </h4>

            <div className="overflow-hidden rounded-xl border border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-mono-tech">
                      <th className="py-2.5 px-3 font-bold w-1/4">YẾU TỐ</th>
                      <th className="py-2.5 px-3 font-bold w-1/3 text-rose-300">BẢN V1 (GỐC)</th>
                      <th className="py-2.5 px-3 font-bold w-1/3 text-emerald-300">BẢN V2 (ĐÃ SỬA)</th>
                      <th className="py-2.5 px-3 font-bold text-cyan-300">TÁC ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                    {comparisonResult.diff_table.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-200 align-top font-mono-tech text-[11px]">
                          {row.feature}
                        </td>
                        <td className="py-3 px-3 text-rose-300 bg-rose-950/20 align-top leading-relaxed">
                          {row.message1}
                        </td>
                        <td className="py-3 px-3 text-emerald-300 bg-emerald-950/20 align-top leading-relaxed">
                          {row.message2}
                        </td>
                        <td className="py-3 px-3 text-cyan-200 font-medium align-top leading-relaxed">
                          {row.impact}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          {comparisonResult.recommendation && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs font-medium leading-relaxed font-sans">
              🎓 <strong>BÀI HỌC RÚT RA:</strong> {comparisonResult.recommendation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
