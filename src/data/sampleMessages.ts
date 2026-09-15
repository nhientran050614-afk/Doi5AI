import { GameScenario } from '../types';

export interface SampleMessageItem {
  id: string;
  title: string;
  category: 'bank' | 'game' | 'teacher' | 'friend' | 'package' | 'lottery' | 'school';
  badge: string;
  preview: string;
  content: string;
  expectedRisk: 'An toàn' | 'Cần kiểm tra thêm' | 'Có dấu hiệu đáng ngờ';
  isDemoMain?: boolean;
}

export const SAMPLE_MESSAGES: SampleMessageItem[] = [
  {
    id: 'demo-bank-v1',
    title: 'Ngân hàng cảnh báo khóa tài khoản (Demo 3 phút)',
    category: 'bank',
    badge: 'Mẫu Demo Chuẩn',
    preview: 'Ngân hàng thông báo tài khoản của bạn sắp bị khóa...',
    content: 'Ngân hàng thông báo tài khoản của bạn sắp bị khóa. Hãy gửi mã xác thực ngay để mở lại tài khoản.',
    expectedRisk: 'Có dấu hiệu đáng ngờ',
    isDemoMain: true,
  },
  {
    id: 'demo-bank-v2',
    title: 'Thông báo ngân hàng chính thống (Bản sửa V2)',
    category: 'bank',
    badge: 'Mẫu So Sánh V2',
    preview: 'Ngân hàng thông báo bảo trì hệ thống định kỳ...',
    content: 'Ngân hàng thông báo bảo trì hệ thống định kỳ từ 02:00 đến 04:00 Chủ Nhật ngày 15/10. Quý khách không cần thao tác gì và ngân hàng KHÔNG BAO GIỜ yêu cầu cung cấp mã OTP hay mật khẩu.',
    expectedRisk: 'An toàn',
  },
  {
    id: 'sample-game-diamonds',
    title: 'Tặng 9.999 Kim Cương Game',
    category: 'game',
    badge: 'Học sinh hay gặp',
    preview: 'Chúc mừng bạn trúng 9.999 Kim Cương Free Fire/Robux...',
    content: 'CHÚC MỪNG BẠN! Bạn là người may mắn nhận 9.999 Kim Cương Free Fire miễn phí nhân dịp sinh nhật game. Hãy bấm vào link nap-the-nhan-kim-cuong.xyz và gửi mã OTP gửi về máy để nhận ngay trong 10 phút!',
    expectedRisk: 'Có dấu hiệu đáng ngờ',
  },
  {
    id: 'sample-teacher-urgent',
    title: 'Giả danh giáo viên chủ nhiệm thu quỹ',
    category: 'teacher',
    badge: 'Mạo danh người quen',
    preview: 'Chào em, cô Hoa chủ nhiệm đây. Lớp mình cần đóng gấp...',
    content: 'Chào em, cô Hoa chủ nhiệm đây. Lớp mình cần đóng gấp 150.000đ tiền quỹ dã ngoại trước 11h30 trưa nay. Em chuyển gấp vào STK 0912345678 tên TRAN THI C nhé, nếu không nộp ngay sẽ bị gạch tên khỏi chuyến đi.',
    expectedRisk: 'Có dấu hiệu đáng ngờ',
  },
  {
    id: 'sample-package-delivery',
    title: 'Tin nhắn giao bưu kiện nhầm địa chỉ',
    category: 'package',
    badge: 'Bẫy đường link',
    preview: 'Bưu kiện VN-9823 không thể giao vì thiếu thông tin...',
    content: 'Bưu cục thông báo: Đơn hàng số VN-88912 của bạn không thể giao do sai số nhà. Vui lòng bấm vào liên kết http://tra-cuu-buu-ta.top/xac-nhan để cập nhật địa chỉ và nộp phí lưu kho 20.000đ.',
    expectedRisk: 'Có dấu hiệu đáng ngờ',
  },
  {
    id: 'sample-friend-study',
    title: 'Bạn cùng lớp hỏi mượn vở ghi chép',
    category: 'friend',
    badge: 'Đời thường an toàn',
    preview: 'Mai ơi, chiều nay tan học cậu cho tớ mượn vở Sử...',
    content: 'Mai ơi, chiều nay tan học cậu cho tớ mượn vở Lịch Sử để chép bù bài hôm thứ Ba tớ nghỉ ốm nhé! Cảm ơn cậu nhiều.',
    expectedRisk: 'An toàn',
  },
  {
    id: 'sample-friend-unusual',
    title: 'Bạn bè nhờ chuyển tiền gấp vì mất ví',
    category: 'friend',
    badge: 'Bị hack nick',
    preview: 'Alo bạn ơi, tớ đang đi ngoài đường mà bị rơi ví...',
    content: 'Alo bạn ơi, tớ đang ở tiệm net/ngoài đường mà bị rơi mất ví, cậu có tài khoản Momo không chuyển cho tớ vay tạm 200k tớ trả tiền xe gấp với, tối về tớ trả liền!',
    expectedRisk: 'Cần kiểm tra thêm',
  },
  {
    id: 'sample-school-notice',
    title: 'Thông báo nghỉ học diễn tập PCCC',
    category: 'school',
    badge: 'Thông báo trường',
    preview: 'Trường THCS thông báo diễn tập PCCC vào sáng Thứ Hai...',
    content: 'Trường THCS Thông báo: Toàn trường nghỉ học buổi sáng thứ Hai (16/10) để tổ chức diễn tập PCCC. Lịch học bù được cập nhật trên cổng thông tin điện tử thcs.edu.vn và bảng tin trường.',
    expectedRisk: 'An toàn',
  },
];

export const GAME_SCENARIOS: GameScenario[] = [
  {
    id: 'game-1',
    title: 'Tình huống 1: Tin nhắn "Nhận Robux / Kim Cương miễn phí"',
    senderName: 'Sự Kiện Game Tri Ân',
    senderType: 'game',
    message: 'Tặng ngay 5.000 Robux miễn phí cho 100 bạn nhanh tay nhất! Hãy đăng nhập tài khoản và gửi mã xác nhận 6 số từ tin nhắn điện thoại để kích hoạt quà.',
    correctVerdict: 'Có dấu hiệu đáng ngờ',
    availableEvidences: [
      'Đòi hỏi mã xác nhận / OTP gửi về điện thoại',
      'Đánh vào lòng tham quà tặng miễn phí và tạo áp lực "100 bạn nhanh nhất"',
      'Người gửi không có tên miền chính thức của nhà phát hành game',
      'Lời mời chơi game thông thường giữa bạn bè',
      'Đã có xác nhận bằng văn bản của giáo viên',
    ],
    correctEvidences: [
      'Đòi hỏi mã xác nhận / OTP gửi về điện thoại',
      'Đánh vào lòng tham quà tặng miễn phí và tạo áp lực "100 bạn nhanh nhất"',
      'Người gửi không có tên miền chính thức của nhà phát hành game',
    ],
    explanation: 'Không có nhà phát hành game uy tín nào tặng quà mà lại đòi mã xác nhận (OTP) gửi về số điện thoại của em. Kẻ gian dùng mã này để chiếm quyền tài khoản.',
    safeActionGuide: 'Không gửi bất kỳ mã số nào. Báo ngay cho phụ huynh hoặc thầy cô giáo phụ trách tin học.',
  },
  {
    id: 'game-2',
    title: 'Tình huống 2: Bạn thân nhắn tin nhờ nạp tiền hộ',
    senderName: 'Nick Facebook của bạn thân',
    senderType: 'friend',
    message: 'Bạn ơi, tớ đang vội quá, cậu có tài khoản nạp hộ tớ cái thẻ điện thoại 50k vào số 0938.xxx này với, lát tan học tớ gửi tiền mặt ngay!',
    correctVerdict: 'Cần kiểm tra thêm',
    availableEvidences: [
      'Tài khoản mạng xã hội của bạn có thể đã bị chiếm quyền điều khiển (hack nick)',
      'Lời nhờ cậy tài chính đột ngột qua tin nhắn mạng xã hội',
      'Cần gọi điện thoại trực tiếp hoặc hỏi trực tiếp mặt đối mặt để xác minh',
      'Chắc chắn 100% là bạn thân nên nạp ngay không cần nghĩ',
      'Người gửi tự xưng là ngân hàng',
    ],
    correctEvidences: [
      'Tài khoản mạng xã hội của bạn có thể đã bị chiếm quyền điều khiển (hack nick)',
      'Lời nhờ cậy tài chính đột ngột qua tin nhắn mạng xã hội',
      'Cần gọi điện thoại trực tiếp hoặc hỏi trực tiếp mặt đối mặt để xác minh',
    ],
    explanation: 'Đây là trường hợp kinh điển kẻ xấu hack nick mạng xã hội rồi nhắn tin cho danh sách bạn bè để mượn tiền hoặc nhờ nạp thẻ. Em không nên chuyển tiền ngay mà phải gọi điện thoại thoại hoặc gặp trực tiếp để hỏi.',
    safeActionGuide: 'Gọi điện thoại nói chuyện trực tiếp với bạn hoặc hỏi trực tiếp khi đến lớp, không chuyển tiền hay mua mã thẻ qua tin nhắn mạng xã hội.',
  },
  {
    id: 'game-3',
    title: 'Tình huống 3: Thông báo điểm thi học kỳ từ nhà trường',
    senderName: 'Ban Giám Hiệu THCS',
    senderType: 'school',
    message: 'Kính gửi Phụ huynh và Học sinh: Kết quả kiểm tra giữa học kỳ 1 đã được cập nhật trên cổng VnEdu/sổ liên lạc điện tử chính thức. Phụ huynh vui lòng đăng nhập ứng dụng nhà trường để tra cứu.',
    correctVerdict: 'An toàn',
    availableEvidences: [
      'Chỉ hướng dẫn tra cứu trên cổng thông tin/ứng dụng chính thức đã biết của trường',
      'Không yêu cầu gửi mã OTP, mật khẩu hay chuyển tiền',
      'Không tạo áp lực đe dọa trừng phạt',
      'Bắt buộc phải bấm vào link lạ có đuôi .xyz',
      'Đòi hỏi mật khẩu tài khoản cá nhân',
    ],
    correctEvidences: [
      'Chỉ hướng dẫn tra cứu trên cổng thông tin/ứng dụng chính thức đã biết của trường',
      'Không yêu cầu gửi mã OTP, mật khẩu hay chuyển tiền',
      'Không tạo áp lực đe dọa trừng phạt',
    ],
    explanation: 'Tin nhắn mang tính chất thông báo thuần túy, điều hướng người dùng về kênh chính thống quen thuộc mà không yêu cầu cung cấp thông tin mật hay chuyển khoản.',
    safeActionGuide: 'Mở ứng dụng hoặc website chính thức của nhà trường để tra cứu thông thường.',
  },
  {
    id: 'game-4',
    title: 'Tình huống 4: Cảnh báo "Tài khoản của bạn bị vi phạm bản quyền"',
    senderName: 'Trung Tâm Hỗ Trợ TikTok/Instagram',
    senderType: 'bank',
    message: 'Tài khoản của bạn đã vi phạm nghiêm trọng chính sách cộng đồng và sẽ bị xóa vĩnh viễn trong 24 giờ. Bấm vào link http://khieu-nai-tiktok.top để xác minh quyền sở hữu ngay lập tức.',
    correctVerdict: 'Có dấu hiệu đáng ngờ',
    availableEvidences: [
      'Tạo áp lực thời gian khẩn cấp (xóa vĩnh viễn trong 24 giờ)',
      'Dùng đường link giả mạo với đuôi tên miền bất thường (.top)',
      'Các nền tảng mạng xã hội luôn gửi cảnh báo qua trung tâm thông báo trong app chứ không qua link lạ bên ngoài',
      'Đây là tin nhắn an toàn vì có chữ TikTok',
    ],
    correctEvidences: [
      'Tạo áp lực thời gian khẩn cấp (xóa vĩnh viễn trong 24 giờ)',
      'Dùng đường link giả mạo với đuôi tên miền bất thường (.top)',
      'Các nền tảng mạng xã hội luôn gửi cảnh báo qua trung tâm thông báo trong app chứ không qua link lạ bên ngoài',
    ],
    explanation: 'Đòn tâm lý đe dọa khóa/xóa tài khoản để khiến nạn nhân hoảng sợ và vội vã bấm vào link giả nhằm đánh cắp tài khoản.',
    safeActionGuide: 'Tuyệt đối không bấm link lạ. Mở trực tiếp ứng dụng chính thức và vào mục Thông báo / Cài đặt bảo mật để kiểm tra.',
  },
];
