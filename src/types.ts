export type RiskLevel = 'An toàn' | 'Cần kiểm tra thêm' | 'Có dấu hiệu đáng ngờ';

export interface RuleViolation {
  key: string;
  category: string;
  detectedKeywords: string[];
  message: string;
}

export interface RuleCheckResult {
  hasCriticalRisk: boolean;
  hasSensitiveInputNotice: boolean;
  isTooShort: boolean;
  violations: RuleViolation[];
  mandatoryWarning: string | null;
}

export interface AnalysisResult {
  risk_level: RiskLevel;
  sender_analysis: string;
  request_analysis: string;
  pressure_analysis: string;
  missing_information: string;
  safe_actions: string[];
  verification_questions: string[];
  evidence: string[];
  ruleCheck?: RuleCheckResult;
  analyzedAt?: string;
  messageText?: string;
}

export interface StudentPreEvaluation {
  suspicion_level: RiskLevel;
  selected_signs: string[];
  planned_action: string;
  notes?: string;
}

export interface ComparisonDiffRow {
  feature: string;
  message1: string;
  message2: string;
  impact: string;
}

export interface ComparisonResult {
  message1_risk: RiskLevel;
  message2_risk: RiskLevel;
  similarities: string[];
  differences: string[];
  why_result_changed: string;
  diff_table: ComparisonDiffRow[];
  recommendation: string;
}

export interface GameScenario {
  id: string;
  title: string;
  senderName: string;
  senderType: 'bank' | 'game' | 'school' | 'friend' | 'delivery' | 'lottery';
  message: string;
  correctVerdict: RiskLevel;
  availableEvidences: string[];
  correctEvidences: string[];
  explanation: string;
  safeActionGuide: string;
}

export type AppTab = 'analyzer' | 'game' | 'comparator' | 'demo3min';
