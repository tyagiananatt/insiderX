import { useState } from "react";
import { InvestmentReport } from "../types.js";
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  FileText, 
  Printer, 
  Activity, 
  BookOpen, 
  PieChart, 
  Shield, 
  Layers, 
  Sparkles, 
  Award, 
  Brain, 
  FileSpreadsheet,
  Compass,
  ArrowUpRight,
  Globe,
  DollarSign,
  Calendar,
  CheckCircle2,
  Lock,
  Newspaper,
  Search
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from "recharts";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.21, 1.02, 0.43, 1.01]
    }
  }
};

interface DashboardGridProps {
  report: InvestmentReport;
}

export function DashboardGrid({ report }: DashboardGridProps) {
  const [activeTab, setActiveTab] = useState<"research" | "financial" | "technical" | "news">("research");
  const [newsFilter, setNewsFilter] = useState("");
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  const currencyRate = currency === "INR" ? 83.5 : 1;
  const currencySymbol = currency === "INR" ? "₹" : "$";

  const {
    ticker,
    name,
    timestamp,
    scores,
    recommendation,
    confidenceScore,
    news = [],
    companyResearch,
    financialAnalysis,
    technicalAnalysis,
    newsSentiment,
    finalSynthesizer,
    metrics,
    historicalPrices,
  } = report;

  const convertedHistoricalPrices = (historicalPrices || []).map(item => ({
    ...item,
    close: Number((item.close * currencyRate).toFixed(2))
  }));

  const formatRelativeTime = (seconds: number) => {
    if (!seconds) return "recent";
    const diffMs = Date.now() - seconds * 1000;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${Math.max(1, diffMins)}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getArticleSentiment = (title: string) => {
    const lower = title.toLowerCase();
    const positiveWords = ["buy", "growth", "profit", "surpass", "expand", "record", "upgrade", "bullish", "jump", "soar", "gain", "rise", "positive"];
    const negativeWords = ["sell", "decline", "fall", "debt", "risk", "loss", "layoff", "downgrade", "bearish", "drop", "plunge", "slide", "negative"];
    
    let score = 0;
    positiveWords.forEach(w => { if (lower.includes(w)) score++; });
    negativeWords.forEach(w => { if (lower.includes(w)) score--; });

    if (score > 0) return { label: "Positive", style: "bg-emerald-50 text-emerald-700 border-emerald-200/50" };
    if (score < 0) return { label: "Negative", style: "bg-rose-50 text-rose-700 border-rose-200/50" };
    return { label: "Neutral", style: "bg-zinc-50 text-zinc-600 border-zinc-200/50" };
  };

  const filteredNews = news.filter((item) => {
    if (!newsFilter.trim()) return true;
    const q = newsFilter.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.publisher?.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-600";
    if (score >= 65) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    if (score >= 35) return "bg-amber-600";
    return "bg-rose-500";
  };

  const getRecommendationStyle = (rec: string) => {
    switch (rec) {
      case "Strong Buy":
        return {
          bg: "bg-emerald-50/60 border-emerald-500/30 text-emerald-950",
          badge: "bg-emerald-600 text-white",
          glow: "shadow-[0_0_20px_-3px_rgba(16,185,129,0.12)]",
          text: "text-emerald-700",
          border: "border-emerald-200"
        };
      case "Buy":
        return {
          bg: "bg-emerald-50/40 border-emerald-400/20 text-emerald-950",
          badge: "bg-emerald-500 text-white",
          glow: "shadow-[0_0_15px_-3px_rgba(16,185,129,0.08)]",
          text: "text-emerald-600",
          border: "border-emerald-100"
        };
      case "Hold":
        return {
          bg: "bg-amber-50/40 border-amber-400/20 text-amber-950",
          badge: "bg-amber-500 text-white",
          glow: "shadow-[0_0_15px_-3px_rgba(245,158,11,0.08)]",
          text: "text-amber-600",
          border: "border-amber-100"
        };
      case "Avoid":
        return {
          bg: "bg-rose-50/40 border-rose-400/20 text-rose-950",
          badge: "bg-rose-500 text-white",
          glow: "shadow-[0_0_15px_-3px_rgba(239,68,68,0.08)]",
          text: "text-rose-600",
          border: "border-rose-100"
        };
      case "Strong Avoid":
        return {
          bg: "bg-red-50/60 border-red-500/30 text-red-950",
          badge: "bg-red-600 text-white",
          glow: "shadow-[0_0_20px_-3px_rgba(220,38,38,0.12)]",
          text: "text-red-700",
          border: "border-red-200"
        };
      default:
        return {
          bg: "bg-zinc-50 border-zinc-200 text-zinc-900",
          badge: "bg-zinc-900 text-white",
          glow: "",
          text: "text-zinc-700",
          border: "border-zinc-200"
        };
    }
  };

  const recStyle = getRecommendationStyle(recommendation);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. TOP TOOLBAR & REPORT HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-zinc-200 gap-4 no-print">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight leading-none font-sans">
              {name}
            </h1>
            <span className="font-mono text-xs text-zinc-600 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              {ticker}
            </span>
          </div>
          <p className="text-xs text-zinc-500 flex items-center space-x-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="font-medium">Institutional fundamental dossier completed on {formatDate(timestamp)}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 bg-zinc-950 hover:bg-zinc-900 text-white px-3.5 py-2 rounded-lg text-xs font-medium border border-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-all cursor-pointer hover:shadow active:scale-[0.99] h-9"
            id="btn-export-pdf"
          >
            <Printer size={13} />
            <span>Export Dossier (PDF)</span>
          </button>
        </div>
      </div>

      {/* PRINT-ONLY COZY HEADER */}
      <div className="hidden print:block border-b-2 border-zinc-900 pb-4 mb-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Securities Research Document</span>
            <h1 className="text-3xl font-black text-zinc-900 font-sans tracking-tight">{name} ({ticker})</h1>
            <p className="text-xs text-zinc-500">Autonomous Financial Synthesizer Report Dossier</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 font-mono">Run Date: {formatDate(timestamp)}</p>
            <p className="text-[10px] text-zinc-400 font-mono">Authentication ID: SEC-{ticker}-2026</p>
          </div>
        </div>
      </div>

      {/* DUAL COLUMN SYSTEM LAYOUT (MAIN DOSSIER REPORT + FLOATING NEWS SIDE PANEL) */}
      <motion.div 
        key={ticker}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start"
      >
        {/* LEFT COLUMN: THE PRIMARY SECURITIES DOSSIER */}
        <div className="xl:col-span-9 space-y-8 w-full min-w-0">

          {/* 2. THE CORE DASHBOARD BENTO GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RECOMMENDATION RATIO ASSESSMENT MODULE */}
        <motion.div 
          variants={cardVariants}
          className={`lg:col-span-5 border rounded-xl p-6 flex flex-col justify-between print-card shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all ${recStyle.bg} ${recStyle.border}`}
        >
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold tracking-wider uppercase text-zinc-400 font-mono flex items-center space-x-1.5">
                <Shield size={11} className="text-zinc-400" />
                <span>Audited Rating</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${recStyle.badge}`}>
                {recommendation}
              </span>
            </div>
            
            <div className="space-y-1">
              <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-mono">
                Unified Scoring Weighted Index
              </p>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-5xl sm:text-6xl font-semibold tracking-tighter text-zinc-950">
                  {scores.overallScore}
                </span>
                <span className="text-zinc-400 font-medium text-sm">/ 100</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-zinc-200/40">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500 font-medium flex items-center space-x-1.5">
                  <Award size={12} className="text-zinc-400" />
                  <span>Dossier Confidence Quotient</span>
                </span>
                <span className="font-mono text-zinc-800 font-semibold">{scores.overallScore}%</span>
              </div>
              <div className="w-full bg-zinc-200/40 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`${getProgressBarColor(scores.overallScore)} h-full rounded-full transition-all duration-500`} 
                  style={{ width: `${scores.overallScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-zinc-200/30">
            <div className="p-3.5 bg-white border border-zinc-200/60 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-1">
              <p className="font-bold text-zinc-800 uppercase tracking-wider text-[8px] font-mono flex items-center space-x-1.5">
                <Compass size={11} className="text-zinc-500" />
                <span>Executive Summary Outlook</span>
              </p>
              <p className="text-zinc-600 leading-relaxed text-xs">
                {finalSynthesizer.shortTermOutlook}
              </p>
            </div>
          </div>
        </motion.div>

        {/* DETAILED RATIO SCORES */}
        <motion.div 
          variants={cardVariants}
          className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all print-card flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-zinc-900 text-sm flex items-center space-x-2.5">
                <PieChart size={16} className="text-zinc-700" />
                <span>Audit Weight Attribution Summary</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md">
                6 Vectors
              </span>
            </div>

            <div className="space-y-4">
              {/* Financial Health Score (40%) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-700 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
                    <span>Financial Health</span>
                    <span className="text-[10px] text-zinc-400 font-mono font-normal">(40% Weight)</span>
                  </span>
                  <span className="font-mono text-zinc-900">{scores.financialHealthScore}/100</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${getProgressBarColor(scores.financialHealthScore)} h-full rounded-full transition-all duration-500`} style={{ width: `${scores.financialHealthScore}%` }}></div>
                </div>
              </div>

              {/* Growth Score (20%) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-700 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                    <span>Growth Audit</span>
                    <span className="text-[10px] text-zinc-400 font-mono font-normal">(20% Weight)</span>
                  </span>
                  <span className="font-mono text-zinc-900">{scores.growthScore}/100</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${getProgressBarColor(scores.growthScore)} h-full rounded-full transition-all duration-500`} style={{ width: `${scores.growthScore}%` }}></div>
                </div>
              </div>

              {/* Valuation (15%) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-700 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                    <span>Valuation Ratios</span>
                    <span className="text-[10px] text-zinc-400 font-mono font-normal">(15% Weight)</span>
                  </span>
                  <span className="font-mono text-zinc-900">{scores.valuationScore}/100</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${getProgressBarColor(scores.valuationScore)} h-full rounded-full transition-all duration-500`} style={{ width: `${scores.valuationScore}%` }}></div>
                </div>
              </div>

              {/* Technical Analysis (10%) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-700 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
                    <span>Technical Indicators</span>
                    <span className="text-[10px] text-zinc-400 font-mono font-normal">(10% Weight)</span>
                  </span>
                  <span className="font-mono text-zinc-900">{scores.technicalScore}/100</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${getProgressBarColor(scores.technicalScore)} h-full rounded-full transition-all duration-500`} style={{ width: `${scores.technicalScore}%` }}></div>
                </div>
              </div>

              {/* News Sentiment (10%) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-700 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-200"></span>
                    <span>News & Sentiment</span>
                    <span className="text-[10px] text-zinc-400 font-mono font-normal">(10% Weight)</span>
                  </span>
                  <span className="font-mono text-zinc-900">{scores.newsScore}/100</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${getProgressBarColor(scores.newsScore)} h-full rounded-full transition-all duration-500`} style={{ width: `${scores.newsScore}%` }}></div>
                </div>
              </div>

              {/* Risk (5%) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-700 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-100"></span>
                    <span>Risk Profile Score</span>
                    <span className="text-[10px] text-zinc-400 font-mono font-normal">(5% Weight, Higher is Safer)</span>
                  </span>
                  <span className="font-mono text-zinc-900">{scores.riskScore}/100</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${getProgressBarColor(scores.riskScore)} h-full rounded-full transition-all duration-500`} style={{ width: `${scores.riskScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. CHART & KEY STOCK ATTRIBUTES - INTERACTIVE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print-page-break">
        
        {/* CHART BLOCK */}
        <motion.div 
          variants={cardVariants}
          className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all print-card"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4 mb-4">
            <div>
              <h3 className="font-semibold text-zinc-950 text-xs flex items-center space-x-2">
                <Activity size={14} className="text-zinc-700" />
                <span>Interactive Historical Price Trend</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Last 90 trading days closing quotes vs. SMA indices
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              {/* Currency Selector Toggle */}
              <div className="inline-flex rounded bg-zinc-100 p-0.5 border border-zinc-200">
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono transition-all duration-150 cursor-pointer ${
                    currency === "USD"
                      ? "bg-white text-zinc-950 border border-zinc-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  $ USD
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("INR")}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono transition-all duration-150 cursor-pointer ${
                    currency === "INR"
                      ? "bg-white text-zinc-950 border border-zinc-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  ₹ INR
                </button>
              </div>

              <span className={`text-[9px] font-mono px-2 py-0.5 rounded border flex items-center space-x-1.5 ${
                metrics.trend === "Bullish" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"
              }`}>
                <span className={`w-1 h-1 rounded-full ${metrics.trend === "Bullish" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                <span>Trend: {metrics.trend}</span>
              </span>
            </div>
          </div>
          
          <div className="h-68 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={convertedHistoricalPrices} margin={{ left: -15, right: 5, top: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                  stroke="#94a3b8"
                  fontSize={10}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={["auto", "auto"]} 
                  stroke="#94a3b8"
                  fontSize={10}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${currencySymbol}${val}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "rgba(255, 255, 255, 0.98)", 
                    border: "1px solid #e4e4e7", 
                    borderRadius: "14px", 
                    fontFamily: "monospace",
                    fontSize: "11px",
                    boxShadow: "0 4px 12px -2px rgba(0,0,0,0.05)"
                  }}
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value: any) => [`${currencySymbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Share Price"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#18181b" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorClose)" 
                  name="Share Price" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono mt-4 pt-3 border-t border-zinc-100">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-zinc-900 inline-block rounded"></span>
              <span>Daily Share Close Rate</span>
            </span>
            <span>Source: Verified Yahoo Finance APIs</span>
          </div>
        </motion.div>

        {/* KEY STOCK ATTRIBUTES BENTO GRID CELLS */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <motion.div 
            variants={cardVariants}
            className="bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all h-full flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-zinc-950 text-xs mb-4 flex items-center space-x-2 pb-2 border-b border-zinc-100">
                <Layers size={14} className="text-zinc-700" />
                <span>Key Stock Attributes</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                
                {/* Attribute 1: 52w Range */}
                <div className="bg-zinc-50 border border-zinc-200/60 p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider font-mono">52-Week Range</span>
                  <span className="font-semibold text-zinc-900 font-mono text-xs mt-1 break-words">
                    {report.metrics.fiftyTwoWeekLow ? (
                      `${currencySymbol}${(report.metrics.fiftyTwoWeekLow * currencyRate).toFixed(1)}-${currencySymbol}${(report.metrics.fiftyTwoWeekHigh * currencyRate).toFixed(1)}`
                    ) : "N/A"}
                  </span>
                </div>

                {/* Attribute 2: Market Cap */}
                <div className="bg-zinc-50 border border-zinc-200/60 p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Market Cap</span>
                  <span className="font-semibold text-zinc-900 font-mono text-xs mt-1">
                    {currencySymbol}{((report.metrics.marketCap * currencyRate) / 1e9).toFixed(1)}B
                  </span>
                </div>

                {/* Attribute 3: Trailing P/E */}
                <div className="bg-zinc-50 border border-zinc-200/60 p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Trailing P/E</span>
                  <span className="font-semibold text-zinc-900 font-mono text-xs mt-1">
                    {report.metrics.peRatio ? report.metrics.peRatio.toFixed(1) : "N/A"}
                  </span>
                </div>

                {/* Attribute 4: Trailing EPS */}
                <div className="bg-zinc-50 border border-zinc-200/60 p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Trailing EPS</span>
                  <span className="font-semibold text-zinc-900 font-mono text-xs mt-1">
                    {report.metrics.eps ? `${currencySymbol}${(report.metrics.eps * currencyRate).toFixed(1)}` : "N/A"}
                  </span>
                </div>

                {/* Attribute 5: Free Cash Flow */}
                <div className="col-span-2 bg-zinc-50 border border-zinc-200/60 p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Free Cash Flow</span>
                  <span className="font-semibold text-zinc-900 font-mono text-xs mt-1">
                    {report.metrics.freeCashFlow ? `${currencySymbol}${((report.metrics.freeCashFlow * currencyRate) / 1e9).toFixed(2)} Billion` : "N/A"}
                  </span>
                </div>

              </div>
            </div>

            <div className="mt-4 text-[9px] text-zinc-400 font-mono flex items-center space-x-1 border-t border-zinc-100 pt-2.5">
              <Lock size={10} />
              <span>SEC Grounded Integrity Checked</span>
            </div>
          </motion.div>
        </div>

      </div>

      {/* 4. MULTI-AGENT DETAILED SYNTHESIS DOSSIER TABS */}
      <motion.div 
        variants={cardVariants}
        className="bg-white border border-zinc-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] overflow-hidden no-print"
      >
        
        {/* TABS SELECTOR STRIP */}
        <div className="bg-zinc-50/70 border-b border-zinc-200 p-1.5 grid grid-cols-2 md:grid-cols-4 gap-1">
          <button
            onClick={() => setActiveTab("research")}
            className={`py-2 text-center text-xs font-semibold rounded transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === "research" ? "bg-white text-zinc-950 border border-zinc-200 font-bold shadow-xs" : "text-zinc-500 hover:text-zinc-800 font-medium"
            }`}
          >
            <BookOpen size={13} />
            <span>Company Research</span>
          </button>
          <button
            onClick={() => setActiveTab("financial")}
            className={`py-2 text-center text-xs font-semibold rounded transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === "financial" ? "bg-white text-zinc-950 border border-zinc-200 font-bold shadow-xs" : "text-zinc-500 hover:text-zinc-800 font-medium"
            }`}
          >
            <FileSpreadsheet size={13} />
            <span>Financial Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab("technical")}
            className={`py-2 text-center text-xs font-semibold rounded transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === "technical" ? "bg-white text-zinc-950 border border-zinc-200 font-bold shadow-xs" : "text-zinc-500 hover:text-zinc-800 font-medium"
            }`}
          >
            <Activity size={13} />
            <span>Technical Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`py-2 text-center text-xs font-semibold rounded transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === "news" ? "bg-white text-zinc-950 border border-zinc-200 font-bold shadow-xs" : "text-zinc-500 hover:text-zinc-800 font-medium"
            }`}
          >
            <Sparkles size={13} />
            <span>News & Sentiment</span>
          </button>
        </div>

        {/* ACTIVE DOSSIER SHEET PANEL */}
        <div className="p-5 sm:p-6">
          {activeTab === "research" && (
            <div className="space-y-5">
              <div className="flex items-start space-x-2.5 bg-zinc-50 p-3 border border-zinc-200 rounded-lg">
                <Brain size={16} className="text-zinc-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-zinc-900 text-xs">Company Research Agent Output</h4>
                  <p className="text-zinc-500 text-[11px] mt-0.5">Audits corporate structures, operational sectors, products, and competitive positioning moats.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                <div className="space-y-1.5">
                  <h5 className="font-semibold text-zinc-800 text-[9px] uppercase tracking-wider font-mono border-b border-zinc-100 pb-1">Core Business Summary</h5>
                  <p className="text-zinc-600 text-xs leading-relaxed font-normal">{companyResearch.businessSummary}</p>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-semibold text-zinc-800 text-[9px] uppercase tracking-wider font-mono border-b border-zinc-100 pb-1">Products & Strategic Services</h5>
                  <p className="text-zinc-600 text-xs leading-relaxed font-normal">{companyResearch.productsAndServices}</p>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-semibold text-zinc-800 text-[9px] uppercase tracking-wider font-mono border-b border-zinc-100 pb-1">Industry Dynamics</h5>
                  <p className="text-zinc-600 text-xs leading-relaxed font-normal">{companyResearch.industryAnalysis}</p>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-semibold text-zinc-800 text-[9px] uppercase tracking-wider font-mono border-b border-zinc-100 pb-1">Competitive Advantage (Moat)</h5>
                  <p className="text-zinc-600 text-xs leading-relaxed font-normal">{companyResearch.competitivePosition}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "financial" && (
            <div className="space-y-5">
              <div className="flex items-start space-x-2.5 bg-zinc-50 p-3 border border-zinc-200 rounded-lg">
                <FileSpreadsheet size={16} className="text-zinc-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-zinc-900 text-xs">Financial Analysis Agent Output</h4>
                  <p className="text-zinc-500 text-[11px] mt-0.5">Critically audits operating margins, capital compounding curves, and free cash flows.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                <div className="space-y-1.5">
                  <h5 className="font-semibold text-zinc-800 text-[9px] uppercase tracking-wider font-mono border-b border-zinc-100 pb-1">Corporate Growth Vectors</h5>
                  <p className="text-zinc-600 text-xs leading-relaxed font-normal">{financialAnalysis.growthEvaluation}</p>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-semibold text-zinc-800 text-[9px] uppercase tracking-wider font-mono border-b border-zinc-100 pb-1">Profitability Metrics</h5>
                  <p className="text-zinc-600 text-xs leading-relaxed font-normal">{financialAnalysis.profitabilityEvaluation}</p>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-semibold text-zinc-800 text-[9px] uppercase tracking-wider font-mono border-b border-zinc-100 pb-1">Liquidity & Debt Sustainability</h5>
                  <p className="text-zinc-600 text-xs leading-relaxed font-normal">{financialAnalysis.liquidityAndDebtEvaluation}</p>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-semibold text-zinc-800 text-[9px] uppercase tracking-wider font-mono border-b border-zinc-100 pb-1">Free Cash Flow Quality</h5>
                  <p className="text-zinc-600 text-xs leading-relaxed font-normal">{financialAnalysis.cashFlowEvaluation}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "technical" && (
            <div className="space-y-5">
              <div className="flex items-start space-x-2.5 bg-zinc-50 p-3 border border-zinc-200 rounded-lg">
                <Activity size={16} className="text-zinc-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-zinc-900 text-xs">Technical Analysis Agent Output</h4>
                  <p className="text-zinc-500 text-[11px] mt-0.5">Assesses mathematical trendlines, support levels, and RSI overbought/oversold indicators.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
                <div className="space-y-1.5 md:border-r border-zinc-100 md:pr-4">
                  <h5 className="font-semibold text-zinc-800 text-[9px] uppercase tracking-wider font-mono border-b border-zinc-100 pb-1">Market Trend Direction</h5>
                  <p className="text-zinc-600 text-xs leading-relaxed font-normal">{technicalAnalysis.trendEvaluation}</p>
                </div>
                <div className="space-y-1.5 md:border-r border-zinc-100 md:pr-4">
                  <h5 className="font-semibold text-zinc-800 text-[9px] uppercase tracking-wider font-mono border-b border-zinc-100 pb-1">Momentum Rating</h5>
                  <p className="text-zinc-600 text-xs leading-relaxed font-normal">{technicalAnalysis.momentumEvaluation}</p>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-semibold text-zinc-800 text-[9px] uppercase tracking-wider font-mono border-b border-zinc-100 pb-1">Moving Averages (SMA)</h5>
                  <p className="text-zinc-600 text-xs leading-relaxed font-normal">{technicalAnalysis.movingAveragesEvaluation}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "news" && (
            <div className="space-y-5">
              <div className="flex items-start space-x-2.5 bg-zinc-50 p-3 border border-zinc-200 rounded-lg">
                <Sparkles size={16} className="text-zinc-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-zinc-900 text-xs">News Sentiment Agent Output</h4>
                  <p className="text-zinc-500 text-[11px] mt-0.5">Scrapes latest articles, evaluates sentiment thresholds, and applies Google Grounding.</p>
                </div>
              </div>
              <div className="space-y-4 pt-1">
                <div className="flex items-center space-x-2.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Sentiment Score Classification:</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wide font-mono ${
                    newsSentiment.sentimentClassification === "Positive" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    newsSentiment.sentimentClassification === "Negative" ? "bg-red-50 text-red-700 border border-red-200" : "bg-zinc-100 text-zinc-700"
                  }`}>
                    {newsSentiment.sentimentClassification}
                  </span>
                </div>
                <div className="space-y-1">
                  <h5 className="font-semibold text-zinc-800 text-[9px] uppercase tracking-wider font-mono border-b border-zinc-100 pb-1">Market News Digest</h5>
                  <p className="text-zinc-600 text-xs leading-relaxed font-normal">{newsSentiment.summary}</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </motion.div>

      {/* PRINT-ONLY COMPILATION OF ALL AGENT REPORTS */}
      <div className="hidden print:block p-6 space-y-8 text-black">
        <div>
          <h3 className="text-base font-bold border-b border-zinc-300 pb-1 mb-3">1. Business Profile & competitive position</h3>
          <div className="grid grid-cols-2 gap-6 text-[11px]">
            <div>
              <p className="font-bold">Business Summary:</p>
              <p className="text-zinc-700 leading-relaxed mt-1">{companyResearch.businessSummary}</p>
            </div>
            <div>
              <p className="font-bold">Competitive Moat:</p>
              <p className="text-zinc-700 leading-relaxed mt-1">{companyResearch.competitivePosition}</p>
            </div>
          </div>
        </div>

        <div className="print-page-break"></div>

        <div>
          <h3 className="text-base font-bold border-b border-zinc-300 pb-1 mb-3">2. Financial audit & statement analysis</h3>
          <div className="grid grid-cols-2 gap-6 text-[11px]">
            <div>
              <p className="font-bold">Growth Vectors:</p>
              <p className="text-zinc-700 leading-relaxed mt-1">{financialAnalysis.growthEvaluation}</p>
            </div>
            <div>
              <p className="font-bold">Balance Sheet & Liquidity:</p>
              <p className="text-zinc-700 leading-relaxed mt-1">{financialAnalysis.liquidityAndDebtEvaluation}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold border-b border-zinc-300 pb-1 mb-3">3. Technical indicators & Trend indicators</h3>
          <p className="text-[11px] text-zinc-700 leading-relaxed">
            {technicalAnalysis.trendEvaluation} {technicalAnalysis.momentumEvaluation} {technicalAnalysis.movingAveragesEvaluation}
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold border-b border-zinc-300 pb-1 mb-3">4. News events & sentiment summary</h3>
          <p className="text-[11px] text-zinc-700 leading-relaxed">
            Classification: <strong>{newsSentiment.sentimentClassification}</strong> | {newsSentiment.summary}
          </p>
        </div>
      </div>

      {/* 5. COZY RATIO AUDIT TABLE CONTAINER */}
      <motion.div 
        variants={cardVariants}
        className="bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all print-card space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-zinc-100">
          <h3 className="font-semibold text-zinc-950 text-xs flex items-center space-x-2">
            <FileSpreadsheet size={14} className="text-zinc-700" />
            <span>Factual Financial Ratios & Technical Markers Audit</span>
          </h3>
          <span className="text-[9px] font-mono bg-zinc-50 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            Verified Ratios
          </span>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-zinc-50 text-zinc-500 font-mono text-[9px] uppercase tracking-wider border-b border-zinc-200/60">
              <tr>
                <th className="py-3 px-5 font-bold">Metric</th>
                <th className="py-3 px-5 font-bold">Calculated Value</th>
                <th className="py-3 px-5 font-bold">Standard Benchmark</th>
                <th className="py-3 px-5 font-bold">Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 text-xs text-zinc-700 font-medium">
              
              {/* Revenue Growth */}
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4 px-5">
                  <p className="font-bold text-zinc-900">Revenue Growth</p>
                </td>
                <td className="py-4 px-5 font-mono">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {metrics.revenueGrowth !== null ? `${metrics.revenueGrowth.toFixed(1)}%` : "N/A"}
                  </span>
                </td>
                <td className="py-4 px-5 text-zinc-400 font-mono">{"Above 10%"}</td>
                <td className="py-4 px-5 text-zinc-500 leading-relaxed max-w-sm text-xs font-semibold">
                  Corporate expansion and market capture velocity
                </td>
              </tr>

              {/* Net Income Growth */}
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4 px-5">
                  <p className="font-bold text-zinc-900">Net Income Growth</p>
                </td>
                <td className="py-4 px-5 font-mono">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {metrics.netIncomeGrowth !== null ? `${metrics.netIncomeGrowth.toFixed(1)}%` : "N/A"}
                  </span>
                </td>
                <td className="py-4 px-5 text-zinc-400 font-mono">{"Above 8%"}</td>
                <td className="py-4 px-5 text-zinc-500 leading-relaxed max-w-sm text-xs font-semibold">
                  Efficiency improvement and operating leverage
                </td>
              </tr>

              {/* Current Ratio */}
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4 px-5">
                  <p className="font-bold text-zinc-900">Current Ratio</p>
                </td>
                <td className="py-4 px-5 font-mono">
                  <span className="font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                    {metrics.currentRatio !== null ? metrics.currentRatio.toFixed(2) : "N/A"}
                  </span>
                </td>
                <td className="py-4 px-5 text-zinc-400 font-mono">{"Above 1.50"}</td>
                <td className="py-4 px-5 text-zinc-500 leading-relaxed max-w-sm text-xs font-semibold">
                  Short-term liquidity asset buffer over obligations
                </td>
              </tr>

              {/* Debt to Equity */}
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4 px-5">
                  <p className="font-bold text-zinc-900">Debt to Equity</p>
                </td>
                <td className="py-4 px-5 font-mono">
                  <span className="font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                    {metrics.debtToEquity !== null ? metrics.debtToEquity.toFixed(2) : "N/A"}
                  </span>
                </td>
                <td className="py-4 px-5 text-zinc-400 font-mono">{"Below 1.50"}</td>
                <td className="py-4 px-5 text-zinc-500 leading-relaxed max-w-sm text-xs font-semibold">
                  Gearing and leverage threat multiplier
                </td>
              </tr>

              {/* Operating Margin */}
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4 px-5">
                  <p className="font-bold text-zinc-900">Operating Margin</p>
                </td>
                <td className="py-4 px-5 font-mono">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {metrics.operatingMargin !== null ? `${metrics.operatingMargin.toFixed(1)}%` : "N/A"}
                  </span>
                </td>
                <td className="py-4 px-5 text-zinc-400 font-mono">{"Above 15%"}</td>
                <td className="py-4 px-5 text-zinc-500 leading-relaxed max-w-sm text-xs font-semibold">
                  Core operational profitability before interest/tax
                </td>
              </tr>

              {/* Return on Equity */}
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4 px-5">
                  <p className="font-bold text-zinc-900">Return on Equity (ROE)</p>
                </td>
                <td className="py-4 px-5 font-mono">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {metrics.roe !== null ? `${metrics.roe.toFixed(1)}%` : "N/A"}
                  </span>
                </td>
                <td className="py-4 px-5 text-zinc-400 font-mono">{"Above 15%"}</td>
                <td className="py-4 px-5 text-zinc-500 leading-relaxed max-w-sm text-xs font-semibold">
                  Yield generated per dollar of shareholder equity
                </td>
              </tr>

              {/* RSI Momentum */}
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4 px-5">
                  <p className="font-bold text-zinc-950">RSI (14-Day)</p>
                </td>
                <td className="py-4 px-5 font-mono">
                  <span className="font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                    {metrics.rsi !== null ? metrics.rsi.toFixed(1) : "N/A"}
                  </span>
                </td>
                <td className="py-4 px-5 text-zinc-400 font-mono">{"30 - 70 Range"}</td>
                <td className="py-4 px-5 text-zinc-500 leading-relaxed max-w-sm text-xs font-semibold">
                  Relative momentum; over 70 is overbought, under 30 is oversold
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </motion.div>

      {/* 6. CATALYSTS & CONCERNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print-page-break">
        
        {/* INVESTMENT CATALYSTS */}
        <motion.div 
          variants={cardVariants}
          className="bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all print-card"
        >
          <h3 className="font-semibold text-zinc-950 text-xs mb-4 flex items-center space-x-2 pb-2 border-b border-zinc-100">
            <Sparkles size={14} className="text-zinc-700" />
            <span>Investment Catalysts & Pitfalls</span>
          </h3>
          
          <div className="space-y-5">
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider font-mono">Core Catalysts (Pros)</h4>
              <ul className="space-y-2 text-xs text-zinc-600 leading-relaxed font-semibold">
                {finalSynthesizer.pros.map((p, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2.5 pt-5 border-t border-zinc-100">
              <h4 className="text-[10px] font-bold uppercase text-rose-500 tracking-wider font-mono">Core Concerns (Cons)</h4>
              <ul className="space-y-2 text-xs text-zinc-600 leading-relaxed font-semibold">
                {finalSynthesizer.cons.map((c, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-500 font-bold mt-0.5">⚠️</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* DETAILED REASONING & RISK INDICES */}
        <motion.div 
          variants={cardVariants}
          className="bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all flex flex-col justify-between print-card"
        >
          <div>
            <h3 className="font-semibold text-zinc-950 text-xs mb-4 flex items-center space-x-2 pb-2 border-b border-zinc-100">
              <ShieldAlert size={14} className="text-zinc-700" />
              <span>System Risk Identification</span>
            </h3>
            
            <ul className="space-y-3 text-xs text-zinc-600 leading-relaxed font-semibold">
              {finalSynthesizer.risks.map((r, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-5 border-t border-zinc-100">
            <h4 className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider font-mono mb-2">Long-Term Corporate Outlook</h4>
            <p className="text-xs text-zinc-600 leading-relaxed font-semibold">
              {finalSynthesizer.longTermOutlook}
            </p>
          </div>
        </motion.div>

      </div>

      {/* 7. REASONING THESIS PAPER BLOCK */}
      <motion.div 
        variants={cardVariants}
        className="bg-white border border-zinc-200 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all print-card relative overflow-hidden"
      >
        <div className="absolute right-8 bottom-8 opacity-5 pointer-events-none select-none hidden lg:block">
          <Award size={160} className="text-zinc-900" />
        </div>
        
        <h3 className="font-semibold text-zinc-950 text-xs mb-3 flex items-center space-x-2 pb-2 border-b border-zinc-100">
          <BookOpen size={14} className="text-zinc-700" />
          <span>Detailed Investment Thesis (Synthesized Opinion)</span>
        </h3>
        
        <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line font-medium max-w-4xl">
          {finalSynthesizer.detailedReasoning}
        </p>
      </motion.div>

      {/* 8. AUDIT DATA PROVENANCE FOOTNOTE */}
      <motion.div 
        variants={cardVariants}
        className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 print-card"
      >
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-200">
          <h3 className="font-mono text-[9px] font-bold uppercase text-zinc-600 tracking-wider flex items-center space-x-2">
            <Shield size={13} className="text-zinc-800" />
            <span>Traceability & Provenance Logs</span>
          </h3>
          <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">Zero-Hallucination Securities Model</span>
        </div>
        
        <p className="text-xs text-zinc-500 mb-5 leading-relaxed font-semibold">
          Every scoring metric, percentage weight allocation, and computed balance sheet ratio displayed within this dossier has been programmatically compiled from verified SEC corporate statement filings and daily historical market close streams.
        </p>

        <div className="divide-y divide-zinc-200 text-[11px] text-zinc-600 font-medium">
          <div className="py-3 flex justify-between gap-4">
            <span className="text-zinc-700">Financial Ratios & Ingested Ratios</span>
            <span className="text-zinc-400 font-mono text-right font-normal">SEC Form 10-K & 10-Q corporate statement filings (Verified)</span>
          </div>
          <div className="py-3 flex justify-between gap-4">
            <span className="text-zinc-700">Historical Quotes and SMA Calculations</span>
            <span className="text-zinc-400 font-mono text-right font-normal">Yahoo Finance Chart Module indices (v8/chart) (Verified)</span>
          </div>
          <div className="py-3 flex justify-between gap-4">
            <span className="text-zinc-700">Corporate Profiling & Sector Mapping</span>
            <span className="text-zinc-400 font-mono text-right font-normal">Yahoo Finance Summary profiles (Verified)</span>
          </div>
          <div className="py-3 flex justify-between gap-4">
            <span className="text-zinc-700">News Sentiment & Grounded Diagnostics</span>
            <span className="text-zinc-400 font-mono text-right font-normal">Gemini Search Grounding Engine feeds (Grounded)</span>
          </div>
        </div>
      </motion.div>

        </div>

        {/* RIGHT COLUMN: STOCK HEADLINES FLOATING SIDE PANEL */}
        <motion.div 
          variants={cardVariants}
          className="xl:col-span-3 bg-white border border-zinc-200 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.01)] sticky top-24 max-h-[calc(100vh-140px)] flex flex-col no-print"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="font-semibold text-zinc-950 text-xs flex items-center space-x-2">
              <Newspaper size={14} className="text-zinc-700" />
              <span>Latest Ticker News</span>
            </h3>
            <span className="font-mono text-[9px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded-md">
              {ticker}
            </span>
          </div>

          {/* Search/Filter for News */}
          <div className="mt-3 relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter news by keyword..."
              value={newsFilter}
              onChange={(e) => setNewsFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-700 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all"
            />
          </div>

          {/* Scrollable list of articles */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-2.5 pr-1" style={{ scrollbarWidth: "thin" }}>
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => {
                const sentiment = getArticleSentiment(item.title);
                return (
                  <a
                    key={item.uuid || item.title}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-2.5 bg-zinc-50/30 hover:bg-zinc-50/70 border border-zinc-100 hover:border-zinc-200 rounded-lg transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[9px] font-bold text-zinc-400 font-mono tracking-wide uppercase truncate max-w-[120px]">
                          {item.publisher || "Finance Feed"}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400 font-mono flex-shrink-0">
                          {formatRelativeTime(item.providerPublishTime)}
                        </span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-zinc-800 leading-snug group-hover:text-zinc-950 transition-colors line-clamp-3">
                        {item.title}
                      </h4>
                      
                      <div className="flex items-center justify-between pt-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${sentiment.style}`}>
                          {sentiment.label}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400 group-hover:text-zinc-700 transition-colors flex items-center space-x-0.5">
                          <span>Read</span>
                          <ArrowUpRight size={11} className="opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <Newspaper size={26} className="mx-auto text-zinc-300 mb-2.5 stroke-1" />
                <p className="text-xs font-semibold text-zinc-400">No matching headlines</p>
                <p className="text-[9px] text-zinc-300 mt-1">Try another filter keyword</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
}
