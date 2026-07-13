export interface HistoricalPrice {
  date: string;
  close: number;
}

export interface TechnicalIndicators {
  sma50: number | null;
  sma200: number | null;
  rsi: number | null;
  macd: {
    macdLine: number | null;
    signalLine: number | null;
    histogram: number | null;
  } | null;
  trend: "Bullish" | "Bearish" | "Neutral";
}

export interface FinancialRatios {
  revenueGrowth: number | null;
  netIncomeGrowth: number | null;
  eps: number | null;
  peRatio: number | null;
  pegRatio: number | null;
  roe: number | null;
  roa: number | null;
  currentRatio: number | null;
  debtToEquity: number | null;
  operatingMargin: number | null;
  profitMargin: number | null;
  freeCashFlow: number | null;
}

export interface ScoreBreakdown {
  financialHealthScore: number;
  growthScore: number;
  valuationScore: number;
  technicalScore: number;
  newsScore: number;
  riskScore: number;
  overallScore: number;
}

export interface InvestmentReport {
  ticker: string;
  name: string;
  timestamp: string;
  scores: ScoreBreakdown;
  recommendation: "Strong Buy" | "Buy" | "Hold" | "Avoid" | "Strong Avoid";
  confidenceScore: number;
  news?: {
    uuid: string;
    title: string;
    publisher: string;
    link: string;
    providerPublishTime: number;
    type: string;
  }[];
  companyResearch: {
    businessSummary: string;
    industryAnalysis: string;
    productsAndServices: string;
    competitivePosition: string;
  };
  financialAnalysis: {
    growthEvaluation: string;
    profitabilityEvaluation: string;
    liquidityAndDebtEvaluation: string;
    cashFlowEvaluation: string;
  };
  technicalAnalysis: {
    trendEvaluation: string;
    momentumEvaluation: string;
    movingAveragesEvaluation: string;
  };
  newsSentiment: {
    summary: string;
    sentimentClassification: "Positive" | "Neutral" | "Negative";
  };
  finalSynthesizer: {
    detailedReasoning: string;
    pros: string[];
    cons: string[];
    risks: string[];
    shortTermOutlook: string;
    longTermOutlook: string;
  };
  metrics: {
    price: number;
    fiftyTwoWeekHigh: number | null;
    fiftyTwoWeekLow: number | null;
    marketCap: number;
    revenueGrowth: number | null;
    netIncomeGrowth: number | null;
    eps: number | null;
    peRatio: number | null;
    pegRatio: number | null;
    roe: number | null;
    roa: number | null;
    currentRatio: number | null;
    debtToEquity: number | null;
    operatingMargin: number | null;
    profitMargin: number | null;
    freeCashFlow: number | null;
    sma50: number | null;
    sma200: number | null;
    rsi: number | null;
    macdLine: number | null;
    signalLine: number | null;
    macdHistogram: number | null;
    trend: string;
  };
  historicalPrices: HistoricalPrice[];
}
