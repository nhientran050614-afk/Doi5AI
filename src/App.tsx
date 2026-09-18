import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Info, 
  Sparkles, 
  RotateCcw, 
  ExternalLink,
  BookOpen,
  GraduationCap,
  Terminal,
  Cpu,
  Radio,
  Layers,
  ArrowRight,
  Cog
} from 'lucide-react';
import { Header } from './components/Header';
import { MessageInputSection } from './components/MessageInputSection';
import { StudentPreEvaluationSection } from './components/StudentPreEvaluationSection';
import { ResultReportSection } from './components/ResultReportSection';
import { ScenarioGame } from './components/ScenarioGame';
import { MessageComparator } from './components/MessageComparator';
import { CyberClickEffect } from './components/CyberClickEffect';
import { OnboardingModal } from './components/OnboardingModal';
import { Team5IntroSplash } from './components/Team5IntroSplash';
import { SAMPLE_MESSAGES, SampleMessageItem } from './data/sampleMessages';
import { 
  AnalysisResult, 
  AppTab, 
  RiskLevel, 
  StudentPreEvaluation 
} from './types';
import { checkMessageRules } from './utils/ruleEngine';
import { analyzeMessageLocally } from './utils/localAnalyzer';
import { cyberAudio } from './utils/cyberAudio';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<AppTab>('analyzer');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);

  // Input & Pre-Evaluation state
  const defaultSample = SAMPLE_MESSAGES[0]; // Demo 3-phút message
  const [messageText, setMessageText] = useState<string>(defaultSample.content);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(defaultSample.id);

  const [studentPreEval, setStudentPreEval] = useState<StudentPreEvaluation>({
    suspicion_level: 'Có dấu hiệu đáng ngờ',
    selected_signs: ['Yêu cầu mã OTP / Mật khẩu / Mã xác thực', 'Tạo áp lực khẩn cấp (sắp bị khóa, trễ hẹn)'],
    planned_action: 'Không trả lời và không gửi bất kỳ mã hay mật khẩu nào',
    notes: '',
  });

  // Analysis Result state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Comparator preloaded states
  const [comparatorM1, setComparatorM1] = useState<string>('');
  const [comparatorM2, setComparatorM2] = useState<string>('');

  const handleSelectSample = (sample: SampleMessageItem) => {
    cyberAudio.playClick();
    setSelectedSampleId(sample.id);
    setMessageText(sample.content);
    setAnalysisResult(null);
    setErrorMessage(null);

    // Provide student-friendly sensible pre-eval suggestions
    if (sample.expectedRisk === 'Có dấu hiệu đáng ngờ') {
      setStudentPreEval({
        suspicion_level: 'Có dấu hiệu đáng ngờ',
        selected_signs: [
          sample.content.toLowerCase().includes('otp') || sample.content.toLowerCase().includes('mã')
            ? 'Yêu cầu mã OTP / Mật khẩu / Mã xác thực'
            : 'Tạo áp lực khẩn cấp (sắp bị khóa, trễ hẹn)',
        ],
        planned_action: 'Hỏi ngay ý kiến của bố mẹ hoặc thầy cô giáo',
        notes: '',
      });
    } else if (sample.expectedRisk === 'An toàn') {
      setStudentPreEval({
        suspicion_level: 'An toàn',
        selected_signs: ['Không có dấu hiệu đáng ngờ nào'],
        planned_action: 'Phản hồi tin nhắn bình thường (nếu chắc chắn an toàn)',
        notes: '',
      });
    } else {
      setStudentPreEval({
        suspicion_level: 'Cần kiểm tra thêm',
        selected_signs: ['Không xưng hô tên cụ thể của em'],
        planned_action: 'Gọi trực tiếp số điện thoại đã biết của người gửi để xác minh',
        notes: '',
      });
    }
  };

  const handleRunAnalysis = async () => {
    const trimmed = messageText.trim();
    if (trimmed.length < 10) {
      cyberAudio.playThreatAlert();
      setErrorMessage('Nội dung tin nhắn cần có tối thiểu 10 ký tự để phân tích.');
      return;
    }

    cyberAudio.playScan();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Execute code-based rule check
      const ruleCheck = checkMessageRules(trimmed);

      let data: AnalysisResult | null = null;

      try {
        const response = await fetch('/api/analyze-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            studentPreEval,
          }),
        });

        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          console.warn('API returned non-JSON or error status, switching to local analysis engine');
        }
      } catch (fetchErr) {
        console.warn('Network fetch error, switching to local analysis engine:', fetchErr);
      }

      // If backend was unreachable or returned non-JSON (e.g. proxy HTML error), use resilient local analyzer
      if (!data) {
        data = analyzeMessageLocally(trimmed, studentPreEval);
      }

      setAnalysisResult({
        ...data,
        ruleCheck: data.ruleCheck || ruleCheck,
        messageText: trimmed,
      });

      if (data.risk_level === 'Có dấu hiệu đáng ngờ') {
        cyberAudio.playThreatAlert();
      } else {
        cyberAudio.playSuccess();
      }

      // Smooth scroll down to result
      setTimeout(() => {
        const element = document.getElementById('suspicious-signs-report-card');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err: any) {
      console.error(err);
      cyberAudio.playThreatAlert();
      setErrorMessage(err.message || 'Không thể thực hiện phân tích. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCompareWithThis = (msg: string) => {
    cyberAudio.playClick();
    setComparatorM1(msg);
    setComparatorM2(
      'Ngân hàng thông báo bảo trì hệ thống định kỳ vào Chủ Nhật từ 02:00 - 04:00. Quý khách không cần thao tác gì và ngân hàng KHÔNG BAO GIỜ yêu cầu cung cấp mã OTP hay mật khẩu.'
    );
    setCurrentTab('comparator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Intro Splash with Water-Blue Gear & 'PROJECT BY TEAM 5' */}
      {showIntro && (
        <Team5IntroSplash onComplete={() => setShowIntro(false)} />
      )}

      {/* Global Interactive Cyber Click Shockwave & Sparks */}
      <CyberClickEffect />

      {/* Onboarding / Quick Start Guide Modal */}
      <OnboardingModal
        isOpen={showOnboarding && !showIntro}
        onClose={() => setShowOnboarding(false)}
        onNavigateTab={(tab) => {
          cyberAudio.playClick();
          setCurrentTab(tab);
        }}
      />

      {/* Top Header */}
      <Header 
        currentTab={currentTab} 
        onSelectTab={(tab) => {
          cyberAudio.playClick();
          setCurrentTab(tab);
        }} 
        onOpenGuide={() => setShowOnboarding(true)}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: PHÂN TÍCH TIN NHẮN (Core Workflow) */}
        {currentTab === 'analyzer' && (
          <div className="space-y-6">
            {/* High-Tech Clean Banner */}
            <div className="bg-[#0e1526] rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl shadow-black/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-transparent" />

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono-tech px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                    3 BƯỚC
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Cảnh Báo Tin Nhắn Đáng Ngờ
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
                  <span className="text-slate-300 font-medium">1. Chọn tin</span>
                  <span className="text-slate-500">➜</span>
                  <span className="text-slate-300 font-medium">2. Tự nhận xét</span>
                  <span className="text-slate-500">➜</span>
                  <span className="text-cyan-300 font-semibold">3. AI đối chiếu</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  type="button"
                  id="btn-banner-open-guide"
                  onClick={() => {
                    cyberAudio.playClick();
                    setShowOnboarding(true);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono-tech text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700 hover:border-cyan-500/50 cursor-pointer"
                  title="Mở hướng dẫn sử dụng"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>HƯỚNG DẪN</span>
                </button>
              </div>
            </div>

            {/* Step 1: Input Section */}
            <MessageInputSection
              messageText={messageText}
              onChangeMessage={(text) => {
                setMessageText(text);
                setSelectedSampleId('');
                if (errorMessage) setErrorMessage(null);
              }}
              onSelectSample={handleSelectSample}
              selectedSampleId={selectedSampleId}
            />

            {/* Step 2: Student Pre-Evaluation Section */}
            <StudentPreEvaluationSection
              evaluation={studentPreEval}
              onChangeEvaluation={setStudentPreEval}
              onRunAnalysis={handleRunAnalysis}
              isLoading={isLoading}
              canAnalyze={messageText.trim().length >= 10}
              messageLength={messageText.trim().length}
            />

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 text-xs sm:text-sm font-mono-tech flex items-center gap-2">
                <span>[ERROR_ALERT]:</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 3: Analysis Results - "Phiếu Dấu Hiệu Đáng Ngờ" */}
            {analysisResult && (
              <ResultReportSection
                result={analysisResult}
                studentPreEval={studentPreEval}
                onOpenCompareWithThis={handleOpenCompareWithThis}
              />
            )}
          </div>
        )}

        {/* TAB 2: TRÒ CHƠI TÌNH HUỐNG (Mode 1) */}
        {currentTab === 'game' && <ScenarioGame />}

        {/* TAB 3: SO SÁNH HAI TIN NHẮN (Mode 2) */}
        {currentTab === 'comparator' && (
          <MessageComparator
            initialMessage1={comparatorM1}
            initialMessage2={comparatorM2}
          />
        )}
      </main>

      {/* High-Tech Educational Footer with 5 Filters Matrix */}
      <footer className="bg-slate-950 border-t border-slate-800/80 mt-12 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-mono-tech text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              KHUNG SƯ PHẠM AN TOÀN SỐ: HỆ THỐNG 5 KÍNH LỌC NHẬN DIỆN
            </span>
            <span className="font-mono-tech text-[10px] text-slate-400">FRAMEWORK_VER: 2.4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="font-mono-tech font-bold text-cyan-300 block mb-1 text-[11px]">KÍNH LỌC 1: NGƯỜI GỬI</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">Kiểm tra dấu hiệu mạo danh người quen, thầy cô, nhà trường, hoặc số điện thoại lạ không chính chủ.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="font-mono-tech font-bold text-purple-300 block mb-1 text-[11px]">KÍNH LỌC 2: YÊU CẦU</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">Cảnh giác tối đa trước yêu cầu cung cấp mã xác thực OTP, mật khẩu, nạp thẻ game hoặc chuyển khoản.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="font-mono-tech font-bold text-amber-300 block mb-1 text-[11px]">KÍNH LỌC 3: ÁP LỰC</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">Nhận diện thủ thuật tâm lý: đe dọa khóa tài khoản khẩn cấp, kỷ luật, hoặc giục giã trong vài phút.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="font-mono-tech font-bold text-slate-200 block mb-1 text-[11px]">KÍNH LỌC 4: THÔNG TIN THIẾU</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">Truy tìm chứng cứ xác minh còn thiếu: hotline chính thống, tên miền chuẩn, văn bản chính thức của nhà trường.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
              <span className="font-mono-tech font-bold text-emerald-300 block mb-1 text-[11px]">KÍNH LỌC 5: BƯỚC AN TOÀN</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">4 nguyên tắc: Không trả lời ngay • Không gửi mã bí mật • Xác minh kênh chính thức • Hỏi người lớn tin cậy.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-800/80 gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-slate-200">
                AI Cảnh Báo Tin Nhắn Đáng Ngờ
              </span>
              <span className="text-slate-400 hidden md:inline">— Nền tảng thực hành an toàn số dành cho học sinh THCS và giáo viên</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setShowIntro(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/70 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono-tech transition-all cursor-pointer"
                title="Nhấn để xem lại màn hình giới thiệu"
              >
                <Cog className="w-3 h-3 text-cyan-400 animate-spin-slow" />
                <span className="font-bold">PROJECT BY TEAM 5</span>
              </button>
              <div className="font-mono-tech text-[10px] text-slate-400 hidden sm:block">
                AN TOÀN TUYỆT ĐỐI • KHÔNG LƯU DỮ LIỆU CÁ NHÂN
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
