
import { GoogleGenAI } from "@google/genai";
import { CredibilityReport, RiskLevel, TradeAction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRiskExplanation = async (reportData: Partial<CredibilityReport>): Promise<string> => {
  try {
    const prompt = `
      Act as a senior credit risk analyst for MSMEs in India. 
      Analyze the following business data for GSTIN ${reportData.gstin}:
      
      - Overall Risk Score: ${reportData.overallScore}/100
      - Risk Category: ${reportData.riskLevel}
      - GST Compliance (Tax): Filing regularity ${reportData.compliance?.filingRegularity}%, Turnover stability ${reportData.compliance?.turnoverTrendStability}%
      - Judicial Data (Legal): ${reportData.judicial?.caseCount} total cases, ${reportData.judicial?.fraudRelatedCases} fraud cases, ${reportData.judicial?.chequeBounceIndicators} cheque bounce indicators.
      - Behavioral: Anomaly score ${reportData.behavioral?.anomalyScore}% with ${reportData.behavioral?.turnoverSpikes ? 'significant' : 'no'} turnover spikes.
      
      Provide a concise, 3-4 sentence professional summary of WHY this risk level was assigned and the logic behind the suggested trade action: ${reportData.tradeAction}.
      Focus on the specific red flags or positive indicators.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate explanation at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI-driven analysis is temporarily unavailable. Based on metadata weights, this score reflects aggregated compliance and judicial signals.";
  }
};
