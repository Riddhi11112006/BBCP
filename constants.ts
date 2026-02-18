
import { ScoringWeights } from './types';

export const RISK_WEIGHTS: ScoringWeights = {
  legal: 0.45,
  tax: 0.30,
  behavioral: 0.25
};

export const MOCK_BUSINESS_NAMES = [
  "Shiv Shakti Enterprises",
  "Arora Logistics Pvt Ltd",
  "Bharat Steel & Alloys",
  "Deepak Textiles",
  "Mehra Trading Co.",
  "Modern Infrastructure Group",
  "Vardhaman Polymers",
  "Ojas Electronics",
  "Jai Hind Chemicals",
  "Quality Packaging Solutions"
];

export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
