
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum TradeAction {
  SAFE_FOR_CREDIT = 'Safe for Credit',
  PARTIAL_CREDIT = 'Partial Credit',
  ADVANCE_PAYMENT = 'Advance Payment Only'
}

export interface GSTCompliance {
  filingRegularity: number; // 0-100
  returnFrequencyConsistency: number; // 0-100
  turnoverTrendStability: number; // 0-100
  lastFiledMonth: string;
}

export interface JudicialMetadata {
  caseCount: number;
  fraudRelatedCases: number;
  chequeBounceIndicators: number;
  litigationRiskScore: number; // 0-100
}

export interface BehavioralPatterns {
  turnoverSpikes: boolean;
  irregularFilingGaps: boolean;
  anomalyScore: number; // 0-100
}

export interface CredibilityReport {
  gstin: string;
  businessName: string;
  overallScore: number; // 0-100
  riskLevel: RiskLevel;
  tradeAction: TradeAction;
  explanation: string;
  compliance: GSTCompliance;
  judicial: JudicialMetadata;
  behavioral: BehavioralPatterns;
  timestamp: string;
}

export interface ScoringWeights {
  legal: number;
  tax: number;
  behavioral: number;
}
