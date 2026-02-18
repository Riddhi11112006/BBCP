
import { CredibilityReport, RiskLevel, TradeAction, GSTCompliance, JudicialMetadata, BehavioralPatterns } from "../types";
import { RISK_WEIGHTS, MOCK_BUSINESS_NAMES } from "../constants";

export const generateMockReport = (gstin: string): CredibilityReport => {
  // Use GSTIN as a seed for deterministic pseudo-random results for the hackathon
  const seed = gstin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const r = (offset: number) => random(seed + offset);

  // Generate sub-scores
  const taxScore = Math.floor(r(1) * 100);
  const legalScore = Math.floor(r(2) * 100);
  const behavioralScore = Math.floor(r(3) * 100);

  // Weighted calculation
  const overallScore = Math.floor(
    (taxScore * RISK_WEIGHTS.tax) +
    (legalScore * RISK_WEIGHTS.legal) +
    (behavioralScore * RISK_WEIGHTS.behavioral)
  );

  let riskLevel: RiskLevel;
  let tradeAction: TradeAction;

  if (overallScore >= 75) {
    riskLevel = RiskLevel.LOW;
    tradeAction = TradeAction.SAFE_FOR_CREDIT;
  } else if (overallScore >= 45) {
    riskLevel = RiskLevel.MEDIUM;
    tradeAction = TradeAction.PARTIAL_CREDIT;
  } else {
    riskLevel = RiskLevel.HIGH;
    tradeAction = TradeAction.ADVANCE_PAYMENT;
  }

  const compliance: GSTCompliance = {
    filingRegularity: taxScore,
    returnFrequencyConsistency: Math.floor(r(4) * 100),
    turnoverTrendStability: Math.floor(r(5) * 100),
    lastFiledMonth: "Oct 2024"
  };

  const judicial: JudicialMetadata = {
    caseCount: Math.floor(r(6) * 15),
    fraudRelatedCases: riskLevel === RiskLevel.HIGH ? Math.floor(r(7) * 3) + 1 : 0,
    chequeBounceIndicators: riskLevel === RiskLevel.HIGH ? Math.floor(r(8) * 5) + 1 : (riskLevel === RiskLevel.MEDIUM ? Math.floor(r(8) * 2) : 0),
    litigationRiskScore: legalScore
  };

  const behavioral: BehavioralPatterns = {
    turnoverSpikes: r(9) > 0.8 && riskLevel === RiskLevel.HIGH,
    irregularFilingGaps: r(10) > 0.7 && riskLevel !== RiskLevel.LOW,
    anomalyScore: behavioralScore
  };

  return {
    gstin,
    businessName: MOCK_BUSINESS_NAMES[seed % MOCK_BUSINESS_NAMES.length],
    overallScore,
    riskLevel,
    tradeAction,
    explanation: "Analysis pending...",
    compliance,
    judicial,
    behavioral,
    timestamp: new Date().toISOString()
  };
};
