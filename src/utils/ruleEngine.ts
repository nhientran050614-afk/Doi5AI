import { RuleCheckResult, RuleViolation } from '../types';

export const MANDATORY_RULE_WARNING = 
  'Không chia sẻ mật khẩu hoặc mã xác thực.\n' +
  'Không tự mở liên kết đáng ngờ.\n' +
  'Hãy kiểm tra qua kênh chính thức hoặc hỏi người lớn.';

export const SENSITIVE_INPUT_WARNING = 
  'Cảnh báo: Không nhập mật khẩu, mã OTP, thông tin cá nhân thật hoặc tin nhắn riêng tư vào công cụ học tập này.';

/**
 * Code-based Rule Engine executing deterministic safety validations
 * prior to or alongside AI analysis.
 */
export function checkMessageRules(text: string): RuleCheckResult {
  const normalized = (text || '').toLowerCase().trim();
  const violations: RuleViolation[] = [];

  if (normalized.length < 10) {
    return {
      hasCriticalRisk: false,
      hasSensitiveInputNotice: false,
      isTooShort: true,
      violations: [],
      mandatoryWarning: null,
    };
  }

  // 1. Password keywords
  const passwordKeywords = ['mật khẩu', 'mat khau', 'password', 'passcode', 'pass ', 'mk '];
  const detectedPass = passwordKeywords.filter(kw => normalized.includes(kw));
  if (detectedPass.length > 0) {
    violations.push({
      key: 'password',
      category: 'Yêu cầu mật khẩu',
      detectedKeywords: detectedPass,
      message: 'Tin nhắn có chứa từ khóa liên quan đến mật khẩu cá nhân.',
    });
  }

  // 2. OTP keywords
  const otpKeywords = ['otp', 'mã otp', 'ma otp', 'mã xác thực', 'ma xac thuc', 'mã xác nhận', 'ma xac nhan', 'mã bảo mật', 'mã gửi về'];
  const detectedOtp = otpKeywords.filter(kw => normalized.includes(kw));
  if (detectedOtp.length > 0) {
    violations.push({
      key: 'otp',
      category: 'Yêu cầu mã OTP / Mã xác thực',
      detectedKeywords: detectedOtp,
      message: 'Tin nhắn đề cập đến mã xác thực hoặc OTP, nguy cơ cao chiếm đoạt tài khoản.',
    });
  }

  // 3. Request send code
  const sendCodeKeywords = ['gửi mã', 'gui ma', 'nhập mã', 'nhap ma', 'cung cấp mã', 'chụp màn hình mã', 'đọc mã', 'doc ma', 'gửi lại mã', 'gửi mã xác thực'];
  const detectedSendCode = sendCodeKeywords.filter(kw => normalized.includes(kw));
  if (detectedSendCode.length > 0) {
    violations.push({
      key: 'send_code',
      category: 'Hành vi giục gửi mã',
      detectedKeywords: detectedSendCode,
      message: 'Tin nhắn trực tiếp yêu cầu người nhận phải gửi hoặc đọc mã bảo mật.',
    });
  }

  // 4. Suspicious links / URLs
  const linkKeywords = ['bấm link', 'bam link', 'nhấp vào link', 'click link', 'truy cập link', 'liên kết', 'http://', 'https://', '.xyz', '.top', '.club', 'bit.ly', 'tinyurl', 'link bên dưới'];
  const detectedLink = linkKeywords.filter(kw => normalized.includes(kw));
  if (detectedLink.length > 0) {
    violations.push({
      key: 'suspicious_link',
      category: 'Yêu cầu bấm vào liên kết / link lạ',
      detectedKeywords: detectedLink,
      message: 'Tin nhắn hướng dẫn người nhận truy cập đường link không rõ nguồn gốc.',
    });
  }

  // 5. Secret / sensitive personal data
  const secretKeywords = ['thông tin bí mật', 'số cccd', 'cmnd', 'số thẻ', 'so the', 'mã pin', 'ma pin', 'cvv', 'ccv', 'tài khoản ngân hàng', 'chuyển tiền ngay'];
  const detectedSecrets = secretKeywords.filter(kw => normalized.includes(kw));
  if (detectedSecrets.length > 0) {
    violations.push({
      key: 'secret_info',
      category: 'Yêu cầu thông tin bí mật / tài chính',
      detectedKeywords: detectedSecrets,
      message: 'Tin nhắn gợi ý thu thập thông tin định danh hoặc dữ liệu tài chính nhạy cảm.',
    });
  }

  const hasCriticalRisk = violations.length > 0;

  return {
    hasCriticalRisk,
    hasSensitiveInputNotice: false,
    isTooShort: false,
    violations,
    mandatoryWarning: hasCriticalRisk ? MANDATORY_RULE_WARNING : null,
  };
}

/**
 * Checks if the student might be accidentally inputting real sensitive credentials.
 */
export function checkPotentialSensitiveInput(text: string): boolean {
  const normalized = text.toLowerCase();
  // Check for patterns like real 6-digit OTP, real 12-digit CCCD, or clear passwords
  const otpPattern = /\b\d{6}\b/;
  const cccdPattern = /\b\d{12}\b/;
  const passPattern = /(mật khẩu là|password is|mk là):?\s*\S+/i;

  return otpPattern.test(normalized) || cccdPattern.test(normalized) || passPattern.test(normalized);
}
