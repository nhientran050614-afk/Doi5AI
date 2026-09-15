import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Smartphone, 
  Sparkles, 
  Edit3, 
  Eye, 
  FileText, 
  ShieldAlert,
  RotateCcw,
  Terminal,
  Wifi,
  Battery,
  Lock,
  Radio,
  Cpu
} from 'lucide-react';
import { SAMPLE_MESSAGES, SampleMessageItem } from '../data/sampleMessages';
import { checkPotentialSensitiveInput } from '../utils/ruleEngine';
import { cyberAudio } from '../utils/cyberAudio';

interface MessageInputSectionProps {
  messageText: string;
  onChangeMessage: (text: string) => void;
  onSelectSample: (sample: SampleMessageItem) => void;
  selectedSampleId?: string;
}

export const MessageInputSection: React.FC<MessageInputSectionProps> = ({
  messageText,
  onChangeMessage,
  onSelectSample,
  selectedSampleId,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const isPotentialSensitive = checkPotentialSensitiveInput(messageText);

  const handleModeSwitch = (mode: boolean) => {
    cyberAudio.playClick();
    setIsPreviewMode(mode);
  };

  const handleSampleClick = (sample: SampleMessageItem) => {
    cyberAudio.playClick();
    onSelectSample(sample);
  };

  return (
    <div className="bg-[#0e1526] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl shadow-black/30 relative overflow-hidden">
      {/* Decorative cyber corner accents */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-16 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/40 text-cyan-300 flex items-center justify-center font-mono-tech font-semibold text-sm shadow-xs">
            01
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Trang Nhập Nội Dung Tin Nhắn Giả Lập
              <span className="text-[11px] font-mono-tech font-normal text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60 hidden md:inline">
                SIMULATION_PACKET_INPUT
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Chọn mẫu tình huống có sẵn hoặc dán tin nhắn SMS/Zalo để phân tích
            </p>
          </div>
        </div>

        {/* View mode toggle: Edit vs Preview */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
          <button
            type="button"
            id="btn-input-edit-mode"
            onClick={() => handleModeSwitch(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !isPreviewMode
                ? 'bg-indigo-600 text-white shadow-xs border border-indigo-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Soạn thảo / Sửa</span>
          </button>
          <button
            type="button"
            id="btn-input-preview-mode"
            onClick={() => handleModeSwitch(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isPreviewMode
                ? 'bg-indigo-600 text-white shadow-xs border border-indigo-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Mô phỏng SMS</span>
          </button>
        </div>
      </div>

      {/* Mandatory Safety Notice Banner */}
      <div className="mb-4 p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200 flex items-start gap-3 text-xs sm:text-sm leading-relaxed">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300 block mb-0.5">
            Lưu ý an toàn bắt buộc cho học sinh:
          </span>
          Không nhập mật khẩu thật, mã OTP thật hay thông tin cá nhân. Hệ thống hoạt động trong môi trường mô phỏng an toàn tuyệt đối phục vụ học tập an toàn mạng.
        </div>
      </div>

      {/* Sensitive Input Warning if detected */}
      {isPotentialSensitive && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/60 text-rose-200 flex items-start gap-2.5 text-xs">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-rose-300">CẢNH BÁO PHÁT HIỆN DỮ LIỆU NHẠY CẢM:</strong> Hệ thống phát hiện chuỗi ký tự giống mã OTP hoặc số định danh. Hãy xóa ngay nếu đây là thông tin thật của em!
          </div>
        </div>
      )}

      {/* Sample Messages Quick Picker */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            Dữ liệu mẫu thử nghiệm an toàn:
          </label>
          {messageText && (
            <button
              type="button"
              id="btn-clear-message"
              onClick={() => {
                cyberAudio.playClick();
                onChangeMessage('');
              }}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer font-mono-tech"
            >
              <RotateCcw className="w-3 h-3" />
              CLEAR_BUFFER
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SAMPLE_MESSAGES.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                id={`sample-msg-${sample.id}`}
                onClick={() => handleSampleClick(sample)}
                className={`text-left p-3 rounded-xl border transition-all relative cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/30 text-white ring-1 ring-cyan-400/50 shadow-md shadow-cyan-950/50'
                    : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-cyan-200' : 'text-slate-200'}`}>
                    {sample.title}
                  </span>
                  <span
                    className={`text-[9px] font-mono-tech px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                      sample.isDemoMain
                        ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                        : sample.expectedRisk === 'An toàn'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {sample.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {sample.preview}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input vs Phone Simulator */}
      {!isPreviewMode ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="message-textarea-input"
              className="text-xs font-mono-tech font-semibold text-slate-300 flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              PACKET_BODY (Nội dung tin nhắn cần quét):
            </label>
            <span
              className={`text-xs font-mono-tech ${
                messageText.length < 10
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {messageText.length} bytes (min: 10)
            </span>
          </div>

          <div className="relative">
            <textarea
              id="message-textarea-input"
              rows={4}
              value={messageText}
              onChange={(e) => onChangeMessage(e.target.value)}
              placeholder="Dán hoặc nhập nội dung tin nhắn giả lập tại đây (ví dụ: tin nhắn SMS mạo danh ngân hàng, tin nhắn nạp game, trúng thưởng...)..."
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950/70 text-slate-100 text-sm leading-relaxed focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all placeholder:text-slate-500 font-sans resize-y"
            />
          </div>
        </div>
      ) : (
        /* High-Tech Smartphone Simulator Frame */
        <div className="p-4 bg-slate-950 rounded-2xl border-2 border-slate-700/80 max-w-sm mx-auto my-2 shadow-2xl shadow-black/80 relative">
          {/* Phone Speaker & Camera Island */}
          <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-center gap-1.5 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-800" />
            <div className="w-8 h-1 rounded-full bg-slate-800" />
          </div>

          {/* Phone Top Status Bar */}
          <div className="flex items-center justify-between px-2 pb-2 mb-3 border-b border-slate-800/80 text-[10px] font-mono-tech text-slate-400">
            <span>10:42 AM</span>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">5G</span>
              <Wifi className="w-3 h-3 text-slate-300" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Secure Channel Badge */}
          <div className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-md bg-indigo-950/40 border border-indigo-800/40 text-[10px] font-mono-tech text-indigo-300 mb-3">
            <Lock className="w-2.5 h-2.5 text-indigo-400" />
            <span>SANDBOX_CHANNEL // UNVERIFIED_SENDER</span>
          </div>

          {/* Sender Header */}
          <div className="bg-slate-900/90 rounded-xl p-3 mb-3 flex items-center justify-between border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center font-bold text-xs">
                SMS
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <span>+84 9xx xxx xxx</span>
                  <span className="text-[9px] px-1 bg-rose-950 text-rose-400 border border-rose-800 rounded font-mono-tech">
                    UNVERIFIED
                  </span>
                </p>
                <p className="text-[10px] text-slate-400">Dịch vụ tin nhắn thông báo</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono-tech">Vừa xong</span>
          </div>

          {/* Message Bubble with Cyber Aesthetic */}
          <div className="py-2">
            <div className="bg-indigo-950/60 border border-indigo-500/40 text-slate-100 p-3.5 rounded-2xl rounded-tl-sm text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-md">
              {messageText || (
                <span className="italic text-slate-500">
                  (Chưa có nội dung tin nhắn. Hãy bấm "Soạn thảo / Sửa" để nhập nội dung)
                </span>
              )}
            </div>
          </div>

          <div className="text-center pt-3 border-t border-slate-800/80 mt-2">
            <button
              type="button"
              id="btn-edit-from-preview"
              onClick={() => handleModeSwitch(false)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono-tech underline cursor-pointer"
            >
              &lt; EDIT_MESSAGE_PAYLOAD /&gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
