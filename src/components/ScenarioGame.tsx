import React, { useState } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle,
  ShieldCheck,
  Award,
  Terminal,
  Cpu,
  Target,
  Zap,
  Radio
} from 'lucide-react';
import { GAME_SCENARIOS } from '../data/sampleMessages';
import { RiskLevel } from '../types';
import { cyberAudio } from '../utils/cyberAudio';

export const ScenarioGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedVerdict, setSelectedVerdict] = useState<RiskLevel | null>(null);
  const [selectedEvidences, setSelectedEvidences] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);

  const currentScenario = GAME_SCENARIOS[currentIndex];

  const getRank = (pts: number) => {
    if (pts >= 300) return { title: 'CHUYÊN GIA TÁC CHIẾN MẠNG', color: 'text-cyan-300 border-cyan-500 bg-cyan-950/60' };
    if (pts >= 200) return { title: 'THÁM TỬ AN TOÀN SỐ', color: 'text-emerald-300 border-emerald-500 bg-emerald-950/60' };
    return { title: 'HỌC VIÊN TẬP SỰ', color: 'text-amber-300 border-amber-500 bg-amber-950/60' };
  };

  const toggleEvidence = (ev: string) => {
    if (isSubmitted) return;
    cyberAudio.playClick();
    if (selectedEvidences.includes(ev)) {
      setSelectedEvidences(selectedEvidences.filter((e) => e !== ev));
    } else {
      setSelectedEvidences([...selectedEvidences, ev]);
    }
  };

  const handleSelectVerdict = (verdict: RiskLevel) => {
    if (isSubmitted) return;
    cyberAudio.playClick();
    setSelectedVerdict(verdict);
  };

  const handleCheckAnswer = () => {
    if (!selectedVerdict) return;

    const isVerdictCorrect = selectedVerdict === currentScenario.correctVerdict;
    const hasAtLeastOneCorrectEvidence = selectedEvidences.some((ev) =>
      currentScenario.correctEvidences.includes(ev)
    );
    const hasInvalidGround = selectedEvidences.some(
      (ev) => !currentScenario.correctEvidences.includes(ev)
    );

    const earnedPoint = isVerdictCorrect && hasAtLeastOneCorrectEvidence && !hasInvalidGround;

    if (earnedPoint) {
      cyberAudio.playSuccess();
      if (!completedScenarios.includes(currentScenario.id)) {
        setScore((prev) => prev + 100);
        setCompletedScenarios((prev) => [...prev, currentScenario.id]);
      }
    } else {
      cyberAudio.playThreatAlert();
    }

    setIsSubmitted(true);
  };

  const handleNext = () => {
    cyberAudio.playClick();
    if (currentIndex < GAME_SCENARIOS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
    setSelectedVerdict(null);
    setSelectedEvidences([]);
    setIsSubmitted(false);
  };

  const handleResetGame = () => {
    cyberAudio.playClick();
    setCurrentIndex(0);
    setSelectedVerdict(null);
    setSelectedEvidences([]);
    setIsSubmitted(false);
    setScore(0);
    setCompletedScenarios([]);
  };

  const isVerdictCorrect = selectedVerdict === currentScenario.correctVerdict;
  const hasAtLeastOneCorrectEvidence = selectedEvidences.some((ev) =>
    currentScenario.correctEvidences.includes(ev)
  );
  const hasInvalidGround = selectedEvidences.some(
    (ev) => !currentScenario.correctEvidences.includes(ev)
  );
  const isFullyCorrect = isVerdictCorrect && hasAtLeastOneCorrectEvidence && !hasInvalidGround;
  const rank = getRank(score);

  return (
    <div className="space-y-6">
      {/* Top Banner & High-Tech HUD Scoreboard */}
      <div className="bg-[#0e1526] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl shadow-black/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500" />

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 text-white flex items-center justify-center shadow-lg border border-cyan-400/30 shrink-0">
            <Gamepad2 className="w-6 h-6 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Phòng Huấn Luyện Tác Chiến: Thám Tử An Toàn Số
              </h2>
              <span className="text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60 hidden sm:inline">
                DRILL_MODE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Quy tắc chuẩn mực: Chỉ tính điểm khi học sinh chọn ĐÚNG mức độ và xác lập ĐÚNG căn cứ chứng cứ!
            </p>
          </div>
        </div>

        {/* Score, Rank & Progress HUD */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 px-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[9px] font-mono-tech uppercase font-semibold text-slate-400 block">
                SCORE_XP
              </span>
              <span className="text-sm font-mono-tech font-bold text-amber-300">{score} PTS</span>
            </div>
          </div>

          <div className="h-7 w-px bg-slate-800 hidden sm:block" />

          <div className="px-2.5">
            <span className="text-[9px] font-mono-tech uppercase font-semibold text-slate-400 block">
              QUÂN HÀM
            </span>
            <span className={`text-[10px] font-mono-tech font-bold px-1.5 py-0.5 rounded border ${rank.color}`}>
              {rank.title}
            </span>
          </div>

          <div className="h-7 w-px bg-slate-800 hidden sm:block" />

          <div className="px-2.5">
            <span className="text-[9px] font-mono-tech uppercase font-semibold text-slate-400 block">
              TIẾN ĐỘ
            </span>
            <span className="text-xs font-mono-tech font-bold text-cyan-400">
              MISSION: {currentIndex + 1} / {GAME_SCENARIOS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Scenario Cyber Terminal */}
      <div className="bg-[#0e1526] rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-xl shadow-black/30 space-y-6">
        {/* Scenario Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-950 border border-indigo-700/50 text-indigo-300 text-xs font-mono-tech flex items-center justify-center font-semibold">
              #{currentIndex + 1}
            </span>
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                {currentScenario.title}
              </span>
              <h3 className="text-xs text-slate-300 mt-0.5">
                Nguồn phát tín hiệu: <strong className="text-white">{currentScenario.senderName}</strong>
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono-tech text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            CASE_FILE_{currentIndex + 1}
          </span>
        </div>

        {/* High-Tech Intercepted Message Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white shadow-inner max-w-2xl mx-auto">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80 text-[10px] font-mono-tech text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Radio className="w-3 h-3 animate-pulse" />
              INTERCEPTED_SMS_PAYLOAD
            </span>
            <span className="bg-slate-900 px-2 py-0.5 rounded text-indigo-300 border border-slate-800">
              SIMULATED THREAT
            </span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl text-sm leading-relaxed text-slate-100 whitespace-pre-wrap font-sans border border-slate-800">
            "{currentScenario.message}"
          </div>
        </div>

        {/* Step 1: Choose Verdict */}
        <div className="space-y-3">
          <label className="block text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Bước 1: Phán đoán mức độ rủi ro của tin nhắn:</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                verdict: 'An toàn' as RiskLevel,
                label: 'An toàn // Secure',
                icon: CheckCircle2,
                active: 'border-emerald-500 bg-emerald-950/50 text-emerald-300 ring-1 ring-emerald-400',
                idle: 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-emerald-800 hover:text-emerald-300',
              },
              {
                verdict: 'Cần kiểm tra thêm' as RiskLevel,
                label: 'Chưa chắc // Cần kiểm tra',
                icon: AlertTriangle,
                active: 'border-amber-500 bg-amber-950/50 text-amber-300 ring-1 ring-amber-400',
                idle: 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-amber-800 hover:text-amber-300',
              },
              {
                verdict: 'Có dấu hiệu đáng ngờ' as RiskLevel,
                label: 'Đáng nghi // Nguy hiểm',
                icon: XCircle,
                active: 'border-rose-500 bg-rose-950/50 text-rose-300 ring-1 ring-rose-400',
                idle: 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-rose-800 hover:text-rose-300',
              },
            ].map((item) => {
              const Icon = item.icon;
              const isSel = selectedVerdict === item.verdict;
              return (
                <button
                  key={item.verdict}
                  type="button"
                  id={`game-choice-${item.verdict}`}
                  disabled={isSubmitted}
                  onClick={() => handleSelectVerdict(item.verdict)}
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSel ? item.active : item.idle
                  } ${isSubmitted ? 'opacity-80' : ''}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Grounds/Evidences */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Bước 2: Xác lập căn cứ chứng cứ (Bắt buộc phải có để tính điểm):</span>
            </label>
            <span className="text-[11px] font-mono-tech text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              ĐÃ CHỌN: {selectedEvidences.length} CĂN CỨ
            </span>
          </div>

          <div className="space-y-2">
            {currentScenario.availableEvidences.map((ev, idx) => {
              const isChecked = selectedEvidences.includes(ev);
              return (
                <button
                  key={idx}
                  type="button"
                  id={`game-evidence-${idx}`}
                  disabled={isSubmitted}
                  onClick={() => toggleEvidence(ev)}
                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all cursor-pointer ${
                    isChecked
                      ? 'border-indigo-500 bg-indigo-950/50 text-indigo-200 ring-1 ring-indigo-500/40'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  } ${isSubmitted ? 'cursor-default' : ''}`}
                >
                  <span
                    className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border font-mono-tech text-[10px] font-bold ${
                      isChecked
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'border-slate-700 bg-slate-900 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span className="leading-relaxed">{ev}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action button */}
        {!isSubmitted ? (
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
            <button
              type="button"
              id="btn-game-submit"
              disabled={!selectedVerdict || selectedEvidences.length === 0}
              onClick={handleCheckAnswer}
              className={`px-7 py-3 rounded-xl font-mono-tech font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border ${
                !selectedVerdict || selectedEvidences.length === 0
                  ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-cyan-400/50 shadow-lg shadow-indigo-950'
              }`}
            >
              <span>KIỂM TRA CHỨNG CỨ & TÍNH ĐIỂM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Feedback Banner with Tech styling */
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div
              className={`p-4 sm:p-5 rounded-2xl border ${
                isFullyCorrect
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 shadow-emerald-950/50'
                  : 'bg-amber-950/50 border-amber-500 text-amber-200 shadow-amber-950/50'
              } shadow-lg`}
            >
              <div className="flex items-start gap-3">
                {isFullyCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-mono-tech font-bold">
                      {isFullyCorrect
                        ? '🎉 CHÍNH XÁC TUYỆT ĐỐI! (+100 XP)'
                        : 'CHƯA ĐẠT ĐIỂM TRỌN VẸN! HÃY CÙNG RÀ SOÁT CĂN CỨ'}
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed">
                    <strong>Mức độ đúng:</strong>{' '}
                    <span className="font-mono-tech underline font-bold text-cyan-300">
                      {currentScenario.correctVerdict}
                    </span>
                  </p>

                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs sm:text-sm space-y-1.5 font-sans">
                    <p className="font-bold text-slate-200 font-mono-tech text-xs">
                      💡 PHÂN TÍCH SƯ PHẠM:
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      {currentScenario.explanation}
                    </p>
                    <p className="text-emerald-300 font-semibold pt-1">
                      🛡️ HƯỚNG HÀNH ĐỘNG AN TOÀN: {currentScenario.safeActionGuide}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                id="btn-game-reset"
                onClick={handleResetGame}
                className="text-xs font-mono-tech text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET_DRILL</span>
              </button>

              <button
                type="button"
                id="btn-game-next"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl font-mono-tech font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-950 border border-cyan-400/40"
              >
                <span>
                  {currentIndex < GAME_SCENARIOS.length - 1
                    ? 'TÌNH HUỐNG TIẾP THEO'
                    : 'HOÀN THÀNH HUẤN LUYỆN'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
