import { AnalysisResult, ComparisonResult, RiskLevel, StudentPreEvaluation } from '../types';
import { checkMessageRules } from './ruleEngine';

/**
 * Client-Side Pedagogical Fallback Engine
 * Đảm bảo 100% người dùng (kể cả khách truy cập ngoài qua link chia sẻ khi backend chưa sẵn sàng)
 * đều nhận được kết quả phân tích 5 Kính Lọc An Toàn và So Sánh tin nhắn chuẩn mực,
 * không bao giờ bị văng lỗi [Unexpected token 'T' / The page cannot be found].
 */

export function analyzeMessageLocally(
  text: string,
  _studentPreEval?: StudentPreEvaluation
): AnalysisResult {
  const trimmed = text.trim();
  const norm = trimmed.toLowerCase();
  const ruleCheck = checkMessageRules(trimmed);

  // Phân tích các yếu tố nhận diện
  const hasOtp =
    norm.includes('otp') ||
    norm.includes('mã xác thực') ||
    norm.includes('mã xác nhận') ||
    norm.includes('gửi mã') ||
    norm.includes('mật khẩu') ||
    norm.includes('password');

  const hasUrgency =
    norm.includes('khóa') ||
    norm.includes('khoá') ||
    norm.includes('hủy') ||
    norm.includes('ngay lập tức') ||
    norm.includes('trong vòng') ||
    norm.includes('5 phút') ||
    norm.includes('khẩn cấp') ||
    norm.includes('bị phạt') ||
    norm.includes('mất tiền');

  const hasLink =
    norm.includes('http') ||
    norm.includes('www.') ||
    norm.includes('.xyz') ||
    norm.includes('.top') ||
    norm.includes('.vip') ||
    norm.includes('link') ||
    norm.includes('đường dẫn') ||
    norm.includes('nhấp vào') ||
    norm.includes('bấm vào');

  const hasGift =
    norm.includes('trúng thưởng') ||
    norm.includes('miễn phí') ||
    norm.includes('quà tặng') ||
    norm.includes('kim cương') ||
    norm.includes('robux') ||
    norm.includes('nhận ngay') ||
    norm.includes('tri ân');

  const hasMoney =
    norm.includes('chuyển khoản') ||
    norm.includes('nộp tiền') ||
    norm.includes('đặt cọc') ||
    norm.includes('học phí') ||
    norm.includes('số tài khoản') ||
    norm.includes('stk');

  const hasAuthority =
    norm.includes('ngân hàng') ||
    norm.includes('công an') ||
    norm.includes('thầy') ||
    norm.includes('cô') ||
    norm.includes('nhà trường') ||
    norm.includes('bộ giáo dục') ||
    norm.includes('viện kiểm sát');

  const isFriendlyStudy =
    (norm.includes('mượn vở') ||
      norm.includes('bài tập') ||
      norm.includes('chép bài') ||
      norm.includes('ngày mai đi học') ||
      norm.includes('tiết toán')) &&
    !hasOtp &&
    !hasLink &&
    !hasMoney;

  // XÁC ĐỊNH MỨC ĐỘ RỦI RO
  let riskLevel: RiskLevel = 'Cần kiểm tra thêm';

  if (ruleCheck.hasCriticalRisk || hasOtp || (hasUrgency && (hasLink || hasMoney)) || hasGift) {
    riskLevel = 'Có dấu hiệu đáng ngờ';
  } else if (isFriendlyStudy) {
    riskLevel = 'An toàn';
  } else if (hasAuthority || hasMoney || hasLink || hasUrgency) {
    riskLevel = 'Cần kiểm tra thêm';
  }

  // TỔNG HỢP 5 KÍNH LỌC THEO TỪNG TÌNH HUỐNG
  if (riskLevel === 'Có dấu hiệu đáng ngờ') {
    const evidenceList: string[] = [];
    if (hasOtp) evidenceList.push('Yêu cầu cung cấp mã OTP / Mật khẩu / Mã xác thực');
    if (hasUrgency) evidenceList.push('Tạo áp lực tâm lý khẩn cấp (đe dọa khóa tài khoản/xử lý gấp)');
    if (hasLink) evidenceList.push('Chứa đường link lạ chưa qua kiểm chứng');
    if (hasGift) evidenceList.push('Mồi nhử quà tặng, phần thưởng giá trị cao hoặc miễn phí');
    if (hasMoney) evidenceList.push('Đòi hỏi giao dịch tiền bạc hoặc chuyển khoản khẩn cấp');
    if (evidenceList.length === 0) evidenceList.push('Nội dung có cấu trúc bất thường thường thấy ở tin nhắn lừa đảo');

    return {
      risk_level: 'Có dấu hiệu đáng ngờ',
      sender_analysis: hasAuthority
        ? 'Người gửi mạo danh cơ quan, tổ chức hoặc ban giám hiệu nhà trường nhưng liên hệ qua số điện thoại lạ hoặc kênh không chính thống.'
        : 'Người gửi là tài khoản ẩn danh, mạo danh dịch vụ uy tín hoặc tài khoản người quen đã bị kẻ gian chiếm quyền kiểm soát.',
      request_analysis: hasOtp
        ? 'Yêu cầu cực kỳ nguy hiểm: Đòi cung cấp mã OTP hoặc thông tin bảo mật. Các tổ chức uy tín không bao giờ bắt gửi mã qua tin nhắn!'
        : hasLink
        ? 'Yêu cầu nhấn vào đường link giả mạo nhằm đánh cắp tài khoản hoặc cài mã độc vào thiết bị.'
        : 'Yêu cầu thao tác tài chính, chuyển tiền hoặc cung cấp thông tin cá nhân quan trọng.',
      pressure_analysis: hasUrgency
        ? 'Kẻ gian đánh vào tâm lý lo sợ, tạo áp lực khẩn cấp để em hoảng hốt và làm theo mà không kịp suy nghĩ hoặc hỏi người lớn.'
        : 'Dùng mồi nhử phần thưởng hấp dẫn kèm giới hạn thời gian gấp gáp để kích thích sự tò mò và lòng tham.',
      missing_information:
        'Thiếu hoàn toàn các bằng chứng xác thực: không có tên người nhận rõ ràng, không có văn bản đóng dấu, không cung cấp hotline tổng đài chính thống.',
      safe_actions: [
        'Tuyệt đối KHÔNG cung cấp mã OTP, mật khẩu hay chuyển bất kỳ khoản tiền nào.',
        'Không bấm vào các đường liên kết đính kèm trong tin nhắn.',
        'Báo ngay cho cha mẹ hoặc thầy cô giáo chủ nhiệm để được hỗ trợ.',
        'Chụp ảnh màn hình làm bằng chứng và chặn số điện thoại/tài khoản đáng ngờ này.',
      ],
      verification_questions: [
        'Tổ chức chính thống có bao giờ nhắn tin bắt gửi mã OTP hoặc mật khẩu riêng tư không?',
        'Em có thể gọi trực tiếp lên số điện thoại của nhà trường hoặc người thân để kiểm tra lại không?',
        'Nếu em dừng lại 15 phút để hỏi người lớn, chuyện gì tồi tệ có thực sự xảy ra không?',
      ],
      evidence: evidenceList,
      ruleCheck,
      analyzedAt: new Date().toISOString(),
      messageText: trimmed,
    };
  }

  if (riskLevel === 'An toàn') {
    return {
      risk_level: 'An toàn',
      sender_analysis: 'Người gửi có dấu hiệu là bạn bè quen thuộc, nội dung trao đổi học tập thông thường, xưng hô tự nhiên.',
      request_analysis: 'Yêu cầu bình thường về việc mượn vở, trao đổi bài tập học đường; không liên quan đến tiền bạc, mã xác thực hay link lạ.',
      pressure_analysis: 'Không có yếu tố đe dọa, không ép buộc thời gian mang tính cưỡng chế hay gây hoảng sợ.',
      missing_information: 'Nội dung ngắn gọn, đủ thông tin phục vụ cho nhu cầu học tập thông thường.',
      safe_actions: [
        'Em có thể phản hồi tin nhắn bạn bè bình thường.',
        'Nên trao đổi và giao nhận tài liệu, bài tập trực tiếp tại trường học.',
        'Vẫn giữ thói quen không gửi mật khẩu cá nhân cho bạn bè.',
      ],
      verification_questions: [
        'Người nhắn tin có đúng là bạn học cùng lớp của em không?',
        'Nội dung có liên quan thuần túy đến việc học tập không?',
      ],
      evidence: ['Nội dung học tập thông thường', 'Không đòi hỏi thông tin nhạy cảm hay tài chính'],
      ruleCheck,
      analyzedAt: new Date().toISOString(),
      messageText: trimmed,
    };
  }

  // Cần kiểm tra thêm
  return {
    risk_level: 'Cần kiểm tra thêm',
    sender_analysis: 'Danh tính người gửi chưa thể xác minh chắc chắn chỉ qua nội dung tin nhắn dạng văn bản này.',
    request_analysis: 'Nội dung có thể chứa yêu cầu chưa rõ ràng hoặc liên quan đến nhờ vả, chuyển đồ, hẹn gặp.',
    pressure_analysis: 'Có yếu tố hối thúc hoặc nhờ hỗ trợ đột xuất, cần cẩn trọng tránh các tình huống tài khoản bạn bè bị kẻ xấu chiếm đoạt.',
    missing_information: 'Thiếu bước xác thực độc lập như gọi điện nghe giọng nói thật hoặc gặp mặt trực tiếp ngoài đời.',
    safe_actions: [
      'Tạm thời KHÔNG thực hiện bất kỳ yêu cầu nào trong tin nhắn.',
      'Gọi điện thoại trực tiếp bằng số di động quen thuộc để nghe giọng nói xác nhận.',
      'Hỏi ý kiến của bố mẹ hoặc người lớn trước khi đưa ra quyết định.',
    ],
    verification_questions: [
      'Tài khoản mạng xã hội của người nhắn có thể vừa bị kẻ gian đánh cắp không?',
      'Em đã nghe trực tiếp giọng nói hoặc gặp trực tiếp người đó ngoài đời chưa?',
      'Tại sao người gửi lại chọn kênh nhắn tin này thay vì gọi điện trực tiếp?',
    ],
    evidence: ['Nội dung cần được đối chiếu thêm qua kênh liên lạc trực tiếp ngoài đời'],
    ruleCheck,
    analyzedAt: new Date().toISOString(),
    messageText: trimmed,
  };
}

/**
 * Phân tích so sánh 2 tin nhắn ngoại tuyến
 */
export function compareMessagesLocally(m1: string, m2: string): ComparisonResult {
  const r1 = analyzeMessageLocally(m1);
  const r2 = analyzeMessageLocally(m2);

  const norm1 = m1.toLowerCase();
  const norm2 = m2.toLowerCase();

  const m1HasOtp = norm1.includes('otp') || norm1.includes('mã xác thực') || norm1.includes('mật khẩu');
  const m2Notice = norm2.includes('bảo trì') || norm2.includes('không bao giờ yêu cầu') || norm2.includes('khuyến cáo');

  return {
    message1_risk: r1.risk_level,
    message2_risk: r2.risk_level,
    similarities: [
      'Cả hai tin nhắn đều đề cập đến dịch vụ hoặc thông báo gửi tới người dùng.',
      'Đều sử dụng hình thức tin nhắn văn bản gửi tới thiết bị cá nhân.',
      'Đều liên quan đến tài khoản hoặc quyền lợi của người nhận.',
    ],
    differences: [
      m1HasOtp
        ? 'Tin nhắn 1 thúc ép gửi mã OTP hoặc truy cập link gấp để tránh bị khóa.'
        : 'Tin nhắn 1 chứa nội dung yêu cầu mang tính cưỡng chế và vội vã.',
      m2Notice
        ? 'Tin nhắn 2 minh bạch thông tin, có lịch trình rõ ràng và khẳng định KHÔNG yêu cầu mã bảo mật.'
        : 'Tin nhắn 2 mang tính chất khuyến cáo, không bắt buộc người nhận phải phản hồi nhạy cảm.',
      'Tin nhắn 1 đánh vào tâm lý lo sợ; Tin nhắn 2 tôn trọng sự chủ động và an toàn của người dùng.',
    ],
    why_result_changed:
      'Chỉ cần loại bỏ yêu cầu mã bí mật (OTP) và yếu tố đe dọa khẩn cấp, mức độ nguy hiểm đã thay đổi hoàn toàn. Kẻ lừa đảo luôn nhắm tới mã xác thực để chiếm đoạt tài khoản!',
    diff_table: [
      {
        feature: 'Yêu cầu mã xác thực / OTP',
        message1: m1HasOtp ? 'Yêu cầu gửi ngay lập tức' : 'Có đòi hỏi thao tác nhạy cảm',
        message2: 'Khẳng định không bao giờ yêu cầu mã bảo mật',
        impact: 'Ngăn chặn hoàn toàn nguy cơ mất tài khoản',
      },
      {
        feature: 'Yếu tố tâm lý áp lực',
        message1: 'Tạo cảm giác hoảng hốt, giục giã',
        message2: 'Thông tin có kế hoạch, lịch trình rõ ràng',
        impact: 'Giúp người dùng bình tĩnh xử lý an toàn',
      },
      {
        feature: 'Hành động người nhận',
        message1: 'Bị thúc ép làm theo ngay',
        message2: 'Không cần gửi lại thông tin bí mật',
        impact: 'Đảm bảo quyền riêng tư và an toàn số',
      },
    ],
    recommendation:
      'Bài học then chốt: Cơ quan và tổ chức uy tín không bao giờ bắt gửi mã xác thực qua tin nhắn. Khi gặp tin nhắn đòi mã bí mật, 99.9% đó là hành vi lừa đảo!',
  };
}
