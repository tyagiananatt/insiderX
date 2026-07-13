/**
 * Financial Calculations and Technical Analysis Utilities
 */

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
  revenueGrowth: number | null; // %
  netIncomeGrowth: number | null; // %
  eps: number | null;
  peRatio: number | null;
  pegRatio: number | null;
  roe: number | null; // %
  roa: number | null; // %
  currentRatio: number | null;
  debtToEquity: number | null;
  operatingMargin: number | null; // %
  profitMargin: number | null; // %
  freeCashFlow: number | null; // in USD
}

/**
 * Calculates Simple Moving Average
 */
export function calculateSMA(prices: number[], period: number): number | null {
  if (prices.length < period) return null;
  const sum = prices.slice(-period).reduce((acc, val) => acc + val, 0);
  return sum / period;
}

/**
 * Calculates Exponential Moving Average
 */
export function calculateEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const ema: number[] = [];
  if (prices.length === 0) return [];
  
  // Start with simple average
  let sum = 0;
  const startPeriod = Math.min(prices.length, period);
  for (let i = 0; i < startPeriod; i++) {
    sum += prices[i];
  }
  let prevEma = sum / startPeriod;
  ema.push(prevEma);

  for (let i = startPeriod; i < prices.length; i++) {
    const curEma = prices[i] * k + prevEma * (1 - k);
    ema.push(curEma);
    prevEma = curEma;
  }
  return ema;
}

/**
 * Calculates 14-day RSI (Relative Strength Index)
 */
export function calculateRSI(prices: number[], period: number = 14): number | null {
  if (prices.length <= period) return null;

  let gains = 0;
  let losses = 0;

  // First period
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) {
      gains += diff;
    } else {
      losses -= diff;
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Wilder's smoothing
  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    let gain = 0;
    let loss = 0;
    if (diff > 0) gain = diff;
    else loss = -diff;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

/**
 * Calculates MACD (12, 26, 9)
 */
export function calculateMACD(prices: number[]): { macdLine: number; signalLine: number; histogram: number } | null {
  if (prices.length < 26) return null;

  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);

  // Align length of EMAs (they start when period is reached)
  // To keep it simple, we use the EMAs for all index matches from the back
  const macdLineArr: number[] = [];
  const offset = Math.min(ema12.length, ema26.length);
  for (let i = 0; i < offset; i++) {
    const val12 = ema12[ema12.length - offset + i];
    const val26 = ema26[ema26.length - offset + i];
    macdLineArr.push(val12 - val26);
  }

  if (macdLineArr.length < 9) return null;
  const signalLineArr = calculateEMA(macdLineArr, 9);

  const finalMacd = macdLineArr[macdLineArr.length - 1];
  const finalSignal = signalLineArr[signalLineArr.length - 1];

  return {
    macdLine: finalMacd,
    signalLine: finalSignal,
    histogram: finalMacd - finalSignal,
  };
}

/**
 * Calculates Technical Indicators
 */
export function calculateTechnicalAnalysis(historical: HistoricalPrice[]): TechnicalIndicators {
  const closePrices = historical.map(h => h.close);
  const currentPrice = closePrices[closePrices.length - 1] || 0;

  const sma50 = calculateSMA(closePrices, 50);
  const sma200 = calculateSMA(closePrices, 200);
  const rsi = calculateRSI(closePrices, 14);
  const macd = calculateMACD(closePrices);

  // Determine Trend
  let trend: "Bullish" | "Bearish" | "Neutral" = "Neutral";
  if (sma50 && sma200) {
    if (currentPrice > sma50 && sma50 > sma200) {
      trend = "Bullish";
    } else if (currentPrice < sma50 && sma50 < sma200) {
      trend = "Bearish";
    }
  } else if (sma50) {
    if (currentPrice > sma50) trend = "Bullish";
    else trend = "Bearish";
  }

  return {
    sma50,
    sma200,
    rsi,
    macd,
    trend,
  };
}

/**
 * Calculates Financial Ratios from Raw Statements and Yahoo Summary Data
 */
export function calculateFinancialRatios(
  incomeStatements: any[],
  balanceSheets: any[],
  cashFlows: any[],
  summaryDetail: any,
  financialData: any
): FinancialRatios {
  // We expect statements ordered from newest to oldest
  const latestIncome = incomeStatements[0] || {};
  const prevIncome = incomeStatements[1] || {};

  const latestBalance = balanceSheets[0] || {};
  const latestCashFlow = cashFlows[0] || {};

  // 1. Revenue Growth (%)
  let revenueGrowth: number | null = null;
  const currentRevenue = latestIncome.totalRevenue?.raw || latestIncome.revenue?.raw || null;
  const prevRevenue = prevIncome.totalRevenue?.raw || prevIncome.revenue?.raw || null;
  if (currentRevenue && prevRevenue) {
    revenueGrowth = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
  }

  // 2. Net Income Growth (%)
  let netIncomeGrowth: number | null = null;
  const currentNetIncome = latestIncome.netIncome?.raw || null;
  const prevNetIncome = prevIncome.netIncome?.raw || null;
  if (currentNetIncome && prevNetIncome) {
    netIncomeGrowth = ((currentNetIncome - prevNetIncome) / prevNetIncome) * 100;
  }

  // 3. EPS
  const eps = latestIncome.dilutedEPS?.raw || latestIncome.basicEPS?.raw || summaryDetail.trailingEps?.raw || null;

  // 4. PE Ratio
  const peRatio = summaryDetail.trailingPE?.raw || financialData.trailingPE?.raw || null;

  // 5. PEG Ratio
  const pegRatio = summaryDetail.pegRatio?.raw || null;

  // 6. ROE (%)
  let roe: number | null = null;
  const totalEquity = latestBalance.totalStockholderEquity?.raw || latestBalance.totalEquity?.raw || null;
  if (currentNetIncome && totalEquity) {
    roe = (currentNetIncome / totalEquity) * 100;
  } else if (financialData.returnOnEquity?.raw) {
    roe = financialData.returnOnEquity.raw * 100;
  }

  // 7. ROA (%)
  let roa: number | null = null;
  const totalAssets = latestBalance.totalAssets?.raw || null;
  if (currentNetIncome && totalAssets) {
    roa = (currentNetIncome / totalAssets) * 100;
  } else if (financialData.returnOnAssets?.raw) {
    roa = financialData.returnOnAssets.raw * 100;
  }

  // 8. Current Ratio
  const totalCurrentAssets = latestBalance.totalCurrentAssets?.raw || null;
  const totalCurrentLiabilities = latestBalance.totalCurrentLiabilities?.raw || null;
  const currentRatio = (totalCurrentAssets && totalCurrentLiabilities) 
    ? (totalCurrentAssets / totalCurrentLiabilities) 
    : (financialData.currentRatio?.raw || null);

  // 9. Debt to Equity
  const totalDebt = latestBalance.totalDebt?.raw || latestBalance.longTermDebt?.raw || null;
  const debtToEquity = (totalDebt && totalEquity)
    ? (totalDebt / totalEquity)
    : (financialData.debtToEquity?.raw ? (financialData.debtToEquity.raw / 100) : null); // sometimes returned as % (e.g. 150 instead of 1.5)

  // 10. Operating Margin (%)
  let operatingMargin: number | null = null;
  const operatingIncome = latestIncome.operatingIncome?.raw || null;
  if (operatingIncome && currentRevenue) {
    operatingMargin = (operatingIncome / currentRevenue) * 100;
  } else if (financialData.operatingMargins?.raw) {
    operatingMargin = financialData.operatingMargins.raw * 100;
  }

  // 11. Profit Margin (%)
  let profitMargin: number | null = null;
  if (currentNetIncome && currentRevenue) {
    profitMargin = (currentNetIncome / currentRevenue) * 100;
  } else if (financialData.profitMargins?.raw) {
    profitMargin = financialData.profitMargins.raw * 100;
  }

  // 12. Free Cash Flow (OCF - CapEx)
  let freeCashFlow: number | null = latestCashFlow.freeCashFlow?.raw || null;
  if (!freeCashFlow) {
    const ocf = latestCashFlow.totalCashFromOperatingActivities?.raw || null;
    const capex = latestCashFlow.capitalExpenditures?.raw || null;
    if (ocf && capex) {
      freeCashFlow = ocf + capex; // CapEx is usually negative in statement, so addition acts as subtraction. If positive, handle:
      if (capex > 0) {
        freeCashFlow = ocf - capex;
      }
    } else {
      freeCashFlow = financialData.freeCashflow?.raw || null;
    }
  }

  return {
    revenueGrowth,
    netIncomeGrowth,
    eps,
    peRatio,
    pegRatio,
    roe,
    roa,
    currentRatio,
    debtToEquity,
    operatingMargin,
    profitMargin,
    freeCashFlow,
  };
}

/**
 * Calculates scores deterministically.
 * Financial Health (40%), Growth (20%), Valuation (15%), Technical (10%), News (10%), Risk (5%)
 * Total out of 100
 */
export function calculateScores(
  ratios: FinancialRatios,
  technical: TechnicalIndicators,
  newsSentiment: { score: number } // 0 to 100
): {
  financialHealthScore: number;
  growthScore: number;
  valuationScore: number;
  technicalScore: number;
  newsScore: number;
  riskScore: number;
  overallScore: number;
} {
  // 1. Financial Health (Max 100)
  // Current Ratio > 1.5 (+30), Debt to Equity < 1.0 (+35), ROE > 15% (+35)
  let healthPoints = 0;
  if (ratios.currentRatio) {
    if (ratios.currentRatio > 1.5) healthPoints += 30;
    else if (ratios.currentRatio >= 1.0) healthPoints += 15;
  } else {
    healthPoints += 20; // default if missing
  }

  if (ratios.debtToEquity !== null) {
    if (ratios.debtToEquity < 1.0) healthPoints += 35;
    else if (ratios.debtToEquity < 2.0) healthPoints += 15;
  } else {
    healthPoints += 20;
  }

  if (ratios.roe !== null) {
    if (ratios.roe > 15) healthPoints += 35;
    else if (ratios.roe > 8) healthPoints += 15;
  } else {
    healthPoints += 20;
  }
  const financialHealthScore = Math.min(100, Math.max(0, healthPoints));

  // 2. Growth (Max 100)
  // Revenue Growth > 10% (+50), Net Income Growth > 10% (+50)
  let growthPoints = 0;
  if (ratios.revenueGrowth !== null) {
    if (ratios.revenueGrowth > 15) growthPoints += 50;
    else if (ratios.revenueGrowth > 5) growthPoints += 35;
    else if (ratios.revenueGrowth > 0) growthPoints += 20;
  } else {
    growthPoints += 25;
  }

  if (ratios.netIncomeGrowth !== null) {
    if (ratios.netIncomeGrowth > 15) growthPoints += 50;
    else if (ratios.netIncomeGrowth > 5) growthPoints += 35;
    else if (ratios.netIncomeGrowth > 0) growthPoints += 20;
  } else {
    growthPoints += 25;
  }
  const growthScore = Math.min(100, Math.max(0, growthPoints));

  // 3. Valuation (Max 100)
  // PE ratio <= 20 (+60), PEG <= 1.5 (+40)
  let valPoints = 0;
  if (ratios.peRatio !== null) {
    if (ratios.peRatio > 0 && ratios.peRatio <= 15) valPoints += 60;
    else if (ratios.peRatio > 15 && ratios.peRatio <= 25) valPoints += 45;
    else if (ratios.peRatio > 25 && ratios.peRatio <= 40) valPoints += 25;
    else if (ratios.peRatio > 40) valPoints += 10;
  } else {
    valPoints += 30;
  }

  if (ratios.pegRatio !== null) {
    if (ratios.pegRatio > 0 && ratios.pegRatio <= 1.0) valPoints += 40;
    else if (ratios.pegRatio > 1.0 && ratios.pegRatio <= 1.8) valPoints += 25;
    else if (ratios.pegRatio > 1.8) valPoints += 10;
  } else {
    valPoints += 20;
  }
  const valuationScore = Math.min(100, Math.max(0, valPoints));

  // 4. Technical Analysis (Max 100)
  // Bullish Trend (+40), RSI between 40-70 (+30), MACD histogram positive (+30)
  let techPoints = 0;
  if (technical.trend === "Bullish") techPoints += 40;
  else if (technical.trend === "Neutral") techPoints += 20;
  
  if (technical.rsi !== null) {
    if (technical.rsi >= 40 && technical.rsi <= 70) techPoints += 30; // Healthy range
    else if (technical.rsi < 40) techPoints += 15; // Oversold (can be bullish buy)
    else if (technical.rsi > 70) techPoints += 10; // Overbought
  } else {
    techPoints += 15;
  }

  if (technical.macd && technical.macd.histogram !== null) {
    if (technical.macd.histogram > 0) techPoints += 30;
    else techPoints += 10;
  } else {
    techPoints += 15;
  }
  const technicalScore = Math.min(100, Math.max(0, techPoints));

  // 5. News Score (Max 100)
  const newsScore = newsSentiment.score;

  // 6. Risk (Max 100 - where 100 is LOW risk, 0 is HIGH risk)
  // Debt to Equity > 2.0 (-40), Current Ratio < 1.0 (-30), Profit Margin < 0 (-30)
  let riskPoints = 100;
  if (ratios.debtToEquity !== null && ratios.debtToEquity > 2.0) riskPoints -= 40;
  if (ratios.currentRatio !== null && ratios.currentRatio < 1.0) riskPoints -= 30;
  if (ratios.profitMargin !== null && ratios.profitMargin < 0) riskPoints -= 30;
  const riskScore = Math.min(100, Math.max(0, riskPoints));

  // Overall Score Calculation (Weighted)
  // Financial Health: 40%
  // Growth: 20%
  // Valuation: 15%
  // Technical Analysis: 10%
  // News Sentiment: 10%
  // Risk Score (Low Risk = High Points): 5%
  const overallScore = 
    (financialHealthScore * 0.40) +
    (growthScore * 0.20) +
    (valuationScore * 0.15) +
    (technicalScore * 0.10) +
    (newsScore * 0.10) +
    (riskScore * 0.05);

  return {
    financialHealthScore: Math.round(financialHealthScore),
    growthScore: Math.round(growthScore),
    valuationScore: Math.round(valuationScore),
    technicalScore: Math.round(technicalScore),
    newsScore: Math.round(newsScore),
    riskScore: Math.round(riskScore),
    overallScore: Math.round(overallScore),
  };
}

/**
 * Gets final recommendation text based on overall score
 */
export function getRecommendation(overallScore: number): "Strong Buy" | "Buy" | "Hold" | "Avoid" | "Strong Avoid" {
  if (overallScore >= 80) return "Strong Buy";
  if (overallScore >= 60) return "Buy";
  if (overallScore >= 40) return "Hold";
  if (overallScore >= 20) return "Avoid";
  return "Strong Avoid";
}
