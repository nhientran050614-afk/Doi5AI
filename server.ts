import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { checkMessageRules, MANDATORY_RULE_WARNING } from './src/utils/ruleEngine';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper for timeout
function withTimeout<T>(promise: Promise<T>, ms: number, fallbackValue: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallbackValue), ms)),
  ]);
}

// Lazy-initialize Gemini AI client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// API: Analyze message with 5 perspectives
app.post('/api/analyze-message', async (req, res) => {
  try {
    const { message, studentPreEval } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Nội dung tin nhắn không hợp lệ.' });
    }

    const trimmed = message.trim();
    if (trimmed.length < 10) {
      return res.status(400).json({
        error: 'Nội dung tin nhắn quá ngắn để phân tích. Em hãy nhập ít nhất 10 ký tự nhé!',
      });
    }

    // Step 1: Execute code-based rule check
    const ruleCheck = checkMessageRules(trimmed);

    // Step 2: Try Gemini API
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback mode when API key is not yet set or in offline preview
      const fallbackResult = generateDeterministicAnalysis(trimmed, ruleCheck);
      return res.json({
        ...fallbackResult,
        ruleCheck,
        analyzedAt: new Date().toISOString(),
        messageText: trimmed,
        isFallback: true,
      });
    }

    const prompt = `
Bạn là chuyên gia an toàn thông tin và nhà sư phạm công nghệ chuyên giảng dạy cho học sinh THCS (lứa tuổi 11-15 tuổi) tại Việt Nam.
Hãy phân tích nội dung tin nhắn giả lập dưới đây theo đúng phương pháp 5 Kính Lọc An Toàn:

TIN NHẮN CẦN PHÂN TÍCH:
"""${trimmed}"""

THÔNG TIN NHẬN XÉT TRƯỚC CỦA HỌC SINH (tham khảo để động viên và phản hồi tinh tế):
${studentPreEval ? JSON.stringify(studentPreEval) : 'Học sinh chưa gửi nhận xét.'}

HÃY PHÂN TÍCH THEO 5 GÓC NHÌN:
1. Người gửi: Có dấu hiệu mạo danh tổ chức/người quen không? Có yêu cầu liên hệ qua kênh bất thường không?
2. Yêu cầu: Có yêu cầu mật khẩu, OTP, mã xác thực, thông tin bí mật không? Có yêu cầu hành động nhạy cảm không?
3. Áp lực: Có tạo cảm giác khẩn cấp không? Có đe dọa khóa tài khoản, mất quyền truy cập, mất tiền không?
4. Thông tin thiếu: Có thiếu bằng chứng xác minh không? Có thiếu thông tin quan trọng để kiểm chứng không?
5. Bước an toàn: Người dùng nên làm gì tiếp theo? Có nên hỏi người lớn không? Có nên kiểm tra qua website/kênh chính thức không?

QUY TẮC BẮT BUỘC:
- Mức độ cảnh giác ("risk_level") chỉ được chọn một trong 3 giá trị: "An toàn", "Cần kiểm tra thêm", "Có dấu hiệu đáng ngờ".
- Nếu tin nhắn có yêu cầu gửi mã OTP, mật khẩu, chuyển tiền gấp vào số lạ, hoặc bấm link giả mạo thì risk_level PHẢI là "Có dấu hiệu đáng ngờ".
- Không bao giờ yêu cầu người dùng cung cấp thông tin cá nhân thật.
- Ngôn ngữ thân thiện, dễ hiểu, phù hợp học sinh THCS.
`;

    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          'Bạn là trợ lý AI giáo dục phân tích tin nhắn đáng ngờ cho học sinh THCS. Luôn trả về dữ liệu định dạng JSON đúng schema được yêu cầu.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risk_level: {
              type: Type.STRING,
              description: 'Một trong 3 giá trị: "An toàn", "Cần kiểm tra thêm", "Có dấu hiệu đáng ngờ"',
            },
            sender_analysis: {
              type: Type.STRING,
              description: 'Phân tích về danh tính người gửi, dấu hiệu mạo danh hoặc kênh liên lạc',
            },
            request_analysis: {
              type: Type.STRING,
              description: 'Phân tích về yêu cầu của tin nhắn (OTP, mật khẩu, link lạ, chuyển tiền)',
            },
            pressure_analysis: {
              type: Type.STRING,
              description: 'Phân tích về yếu tố tâm lý, cảm giác gấp gáp, đe dọa hoặc mồi nhử',
            },
            missing_information: {
              type: Type.STRING,
              description: 'Những bằng chứng hoặc thông tin quan trọng bị thiếu để kiểm chứng',
            },
            safe_actions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Danh sách 3-4 hành động an toàn học sinh nên thực hiện',
            },
            verification_questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Các câu hỏi tự vấn kiểm chứng thông tin trước khi hành động',
            },
            evidence: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Các từ khóa hoặc chi tiết cụ thể trong tin nhắn chứng minh cho đánh giá',
            },
          },
          required: [
            'risk_level',
            'sender_analysis',
            'request_analysis',
            'pressure_analysis',
            'missing_information',
            'safe_actions',
            'verification_questions',
            'evidence',
          ],
        },
      },
    });

    const response = await withTimeout(geminiPromise, 8000, null);

    let parsedData;
    if (response && response.text) {
      try {
        parsedData = JSON.parse(response.text);
      } catch {
        parsedData = generateDeterministicAnalysis(trimmed, ruleCheck);
      }
    } else {
      parsedData = generateDeterministicAnalysis(trimmed, ruleCheck);
    }

    // Safety override: if ruleCheck discovered critical violations (e.g. OTP, password),
    // enforce "Có dấu hiệu đáng ngờ" and prepend mandatory safe actions
    if (ruleCheck.hasCriticalRisk && parsedData.risk_level === 'An toàn') {
      parsedData.risk_level = 'Có dấu hiệu đáng ngờ';
    }

    return res.json({
      ...parsedData,
      ruleCheck,
      analyzedAt: new Date().toISOString(),
      messageText: trimmed,
    });
  } catch (error: any) {
    console.error('Error analyzing message:', error);
    // Graceful fallback on API error so student experience is unbroken
    const ruleCheck = checkMessageRules(req.body?.message || '');
    const fallback = generateDeterministicAnalysis(req.body?.message || '', ruleCheck);
    return res.json({
      ...fallback,
      ruleCheck,
      analyzedAt: new Date().toISOString(),
      messageText: req.body?.message,
      note: 'Phân tích tự động dự phòng do hệ thống đang cập nhật kết nối AI.',
    });
  }
});

// API: Compare two messages (Chế độ so sánh hai tin nhắn & Demo 3 phút)
app.post('/api/compare-messages', async (req, res) => {
  try {
    const { message1, message2 } = req.body;

    if (!message1 || !message2) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ cả hai tin nhắn để so sánh.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const fallbackComp = generateDeterministicComparison(message1, message2);
      return res.json(fallbackComp);
    }

    const prompt = `
Bạn là chuyên gia giáo dục an toàn số. Hãy so sánh hai tin nhắn dưới đây để dạy học sinh THCS cách một chi tiết nhỏ có thể làm thay đổi hoàn toàn mức độ an toàn của tin nhắn:

TIN NHẮN 1 (Phiên bản V1):
"""${message1}"""

TIN NHẮN 2 (Phiên bản V2):
"""${message2}"""

HÃY PHÂN TÍCH:
1. Đánh giá mức độ rủi ro của từng tin nhắn ("An toàn", "Cần kiểm tra thêm", hoặc "Có dấu hiệu đáng ngờ").
2. Điểm giống nhau giữa 2 tin nhắn (ngữ cảnh, tổ chức xưng danh, chủ đề...).
3. Những chi tiết cốt lõi đã thay đổi (Ví dụ: từ đòi mã OTP sang không đòi mã, từ link lạ sang kênh chính thống, từ đe dọa khẩn cấp sang thông báo lịch trình rõ ràng).
4. Vì sao kết quả đánh giá lại khác nhau? Giải thích logic tư duy cho học sinh.
5. Bảng ghi chi tiết các điểm khác biệt (diff_table) gồm: feature (Tiêu chí), message1 (Ở tin 1), message2 (Ở tin 2), impact (Tác động đến an toàn).
6. Lời khuyên học tập rút ra.
`;

    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction: 'So sánh chi tiết sự khác biệt giữa hai tin nhắn và xuất JSON theo đúng schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message1_risk: { type: Type.STRING },
            message2_risk: { type: Type.STRING },
            similarities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            differences: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            why_result_changed: { type: Type.STRING },
            diff_table: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  message1: { type: Type.STRING },
                  message2: { type: Type.STRING },
                  impact: { type: Type.STRING },
                },
                required: ['feature', 'message1', 'message2', 'impact'],
              },
            },
            recommendation: { type: Type.STRING },
          },
          required: [
            'message1_risk',
            'message2_risk',
            'similarities',
            'differences',
            'why_result_changed',
            'diff_table',
            'recommendation',
          ],
        },
      },
    });

    const response = await withTimeout(geminiPromise, 8000, null);
    let parsed;
    if (response && response.text) {
      try {
        parsed = JSON.parse(response.text);
      } catch {
        parsed = generateDeterministicComparison(message1, message2);
      }
    } else {
      parsed = generateDeterministicComparison(message1, message2);
    }
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error comparing messages:', error);
    const fallbackComp = generateDeterministicComparison(req.body.message1 || '', req.body.message2 || '');
    return res.json(fallbackComp);
  }
});

// Deterministic pedagogical fallback for analysis
function generateDeterministicAnalysis(text: string, ruleCheck: any) {
  const norm = text.toLowerCase();
  const hasOtp = norm.includes('otp') || norm.includes('mã xác thực') || norm.includes('mã xác nhận') || norm.includes('gửi mã');
  const hasLockThreat = norm.includes('khóa') || norm.includes('khoá') || norm.includes('hủy') || norm.includes('bị phạt') || norm.includes('mất tiền');
  const hasLink = norm.includes('link') || norm.includes('http') || norm.includes('.xyz') || norm.includes('.top');
  const hasGift = norm.includes('kim cương') || norm.includes('robux') || norm.includes('trúng') || norm.includes('miễn phí');
  const isFriendly = norm.includes('mượn vở') || norm.includes('bài tập') || norm.includes('chép bài');

  if (hasOtp || (hasLockThreat && hasLink) || hasGift) {
    return {
      risk_level: 'Có dấu hiệu đáng ngờ',
      sender_analysis: 'Người gửi tự xưng cơ quan/tổ chức hoặc game nhưng không có xác thực chính thống, liên hệ qua kênh tin nhắn không định danh.',
      request_analysis: hasOtp
        ? 'Tin nhắn yêu cầu cung cấp mã OTP/mã xác thực - đây là hành vi cực kỳ nguy hiểm nhằm chiếm đoạt tài khoản.'
        : 'Tin nhắn yêu cầu bấm link lạ hoặc cung cấp thông tin tài khoản không an toàn.',
      pressure_analysis: hasLockThreat
        ? 'Tạo áp lực tâm lý gấp gáp: đe dọa khóa tài khoản hoặc mất quyền lợi để ép người nhận không kịp suy nghĩ suy xét.'
        : 'Dùng mồi nhử phần thưởng hấp dẫn kèm giới hạn thời gian để kích thích lòng tham.',
      missing_information: 'Thiếu kênh kiểm chứng độc lập (tổng đài chính thức, thông báo trên ứng dụng chuẩn), thiếu thông tin cá nhân định danh chính xác.',
      safe_actions: [
        'Tuyệt đối không gửi mã OTP, mật khẩu hay mã xác thực cho bất kỳ ai.',
        'Không bấm vào bất kỳ đường link lạ nào được đính kèm trong tin nhắn.',
        'Hỏi ngay ý kiến của cha mẹ hoặc thầy cô giáo.',
        'Kiểm tra lại thông tin qua ứng dụng hoặc trang web chính thức của tổ chức.',
      ],
      verification_questions: [
        'Ngân hàng/Tổ chức chính thống có bao giờ nhắn tin bắt gửi mã xác thực qua chat không?',
        'Có cách nào gọi trực tiếp lên tổng đài chính thức để hỏi lại không?',
        'Nếu mình dừng lại 15 phút để hỏi người lớn, điều tồi tệ có thực sự xảy ra không?',
      ],
      evidence: [
        hasOtp ? 'Yêu cầu mã xác thực / OTP' : '',
        hasLockThreat ? 'Đe dọa tài khoản sắp bị khóa' : '',
        hasLink ? 'Đính kèm liên kết lạ' : '',
        hasGift ? 'Hứa hẹn quà tặng giá trị cao' : '',
      ].filter(Boolean),
    };
  }

  if (isFriendly) {
    return {
      risk_level: 'An toàn',
      sender_analysis: 'Tin nhắn trao đổi học tập thông thường giữa bạn bè cùng lớp, xưng hô quen thuộc.',
      request_analysis: 'Yêu cầu mượn vở học tập, không đòi hỏi tiền bạc, mã bảo mật hay mật khẩu tài khoản.',
      pressure_analysis: 'Không có yếu tố đe dọa, không ép buộc thời gian mang tính cưỡng chế.',
      missing_information: 'Nội dung rõ ràng, phù hợp bối cảnh học đường.',
      safe_actions: [
        'Có thể phản hồi bạn bè bình thường.',
        'Giao nhận vở học tập trực tiếp tại lớp học.',
      ],
      verification_questions: [
        'Người nhắn có đúng là bạn học của em không?',
        'Nội dung có liên quan đến việc học tập bình thường không?',
      ],
      evidence: ['Hỏi mượn vở học tập', 'Không yêu cầu thông tin nhạy cảm'],
    };
  }

  return {
    risk_level: 'Cần kiểm tra thêm',
    sender_analysis: 'Danh tính người gửi chưa được xác thực chắc chắn qua kênh liên lạc này.',
    request_analysis: 'Tin nhắn có thể chứa yêu cầu chưa rõ ràng hoặc liên quan đến chuyển tiền, gặp mặt.',
    pressure_analysis: 'Cần thận trọng trước các lý do gấp gáp mượn tiền hoặc nhờ hỗ trợ đột xuất.',
    missing_information: 'Thiếu cuộc gọi xác nhận bằng giọng nói hoặc gặp mặt trực tiếp.',
    safe_actions: [
      'Không vội vàng làm theo yêu cầu.',
      'Gọi điện thoại trực tiếp để kiểm tra giọng nói người quen.',
      'Hỏi ý kiến phụ huynh trước khi thực hiện hành động liên quan đến tiền bạc.',
    ],
    verification_questions: [
      'Tài khoản mạng xã hội của người này có thể bị kẻ xấu hack không?',
      'Em đã nghe trực tiếp giọng nói của người đó chưa?',
    ],
    evidence: ['Nội dung cần xác minh thêm qua kênh ngoài đời thực'],
  };
}

// Deterministic comparison fallback
function generateDeterministicComparison(m1: string, m2: string) {
  const norm1 = m1.toLowerCase();
  const norm2 = m2.toLowerCase();
  const m1HasOtp = norm1.includes('mã xác thực') || norm1.includes('otp');
  const m2HasOtp = norm2.includes('mã xác thực') || norm2.includes('otp');
  const m1Threat = norm1.includes('khóa') || norm1.includes('khoá');
  const m2Notice = norm2.includes('bảo trì') || norm2.includes('không bao giờ yêu cầu');

  return {
    message1_risk: m1HasOtp || m1Threat ? 'Có dấu hiệu đáng ngờ' : 'Cần kiểm tra thêm',
    message2_risk: m2Notice ? 'An toàn' : 'Cần kiểm tra thêm',
    similarities: [
      'Cả hai tin nhắn đều lấy danh nghĩa thông báo từ Ngân hàng / Tổ chức tài chính.',
      'Cùng nhắm tới người dùng đang sở hữu tài khoản.',
      'Đều thông báo về trạng thái dịch vụ (khóa tài khoản hoặc bảo trì định kỳ).',
    ],
    differences: [
      m1HasOtp
        ? 'Tin nhắn 1 yêu cầu người dùng gửi mã xác thực ngay lập tức.'
        : 'Tin nhắn 1 chứa nội dung yêu cầu gấp gáp.',
      m2Notice
        ? 'Tin nhắn 2 nhấn mạnh rõ ràng: Ngân hàng KHÔNG BAO GIỜ yêu cầu mã OTP/mật khẩu và người dùng không cần thao tác gì.'
        : 'Tin nhắn 2 mang tính chất thông báo minh bạch, có lịch trình cụ thể.',
      'Tin nhắn 1 dùng áp lực đe dọa khóa tài khoản; Tin nhắn 2 thông báo lịch bảo trì bình thường kèm khung giờ.',
    ],
    why_result_changed:
      'Chỉ cần thay đổi mục đích từ "đòi mã xác thực khẩn cấp" sang "thông báo thông tin không kèm yêu cầu thao tác nhạy cảm", mức độ an toàn đã chuyển từ CỰC KỲ NGUY HIỂM sang AN TOÀN. Kẻ lừa đảo luôn nhắm tới việc lấy mã OTP hoặc mật khẩu của nạn nhân!',
    diff_table: [
      {
        feature: 'Yêu cầu mã xác thực / OTP',
        message1: m1HasOtp ? 'Yêu cầu gửi ngay lập tức' : 'Có đòi hỏi thao tác',
        message2: 'Khẳng định ngân hàng không bao giờ yêu cầu',
        impact: 'Loại bỏ hoàn toàn nguy cơ chiếm đoạt tài khoản',
      },
      {
        feature: 'Yếu tố tâm lý áp lực',
        message1: 'Đe dọa khóa tài khoản khẩn cấp',
        message2: 'Lịch trình bảo trì định kỳ rõ ràng (02:00 - 04:00)',
        impact: 'Không gây hoảng loạn cho người dùng',
      },
      {
        feature: 'Hành động người nhận',
        message1: 'Phải gửi mã lại ngay',
        message2: 'Không cần làm gì cả',
        impact: 'Bảo vệ an toàn thông tin cá nhân',
      },
    ],
    recommendation:
      'Bài học cốt lõi: Các tổ chức uy tín không bao giờ bắt khách hàng gửi mã bí mật qua tin nhắn. Khi nhận tin nhắn đòi mã, đó 99.9% là lừa đảo!',
  };
}

// Vite middleware or static serving
async function startServer() {
  // Guard all unhandled /api/* routes so they return JSON instead of SPA index.html
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
