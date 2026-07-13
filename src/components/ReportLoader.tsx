import { useEffect, useState } from "react";
import { Loader2, Search, FileSpreadsheet, Percent, TrendingUp, Newspaper, Brain } from "lucide-react";
import { motion } from "motion/react";

interface ReportLoaderProps {
  ticker: string;
}

export function ReportLoader({ ticker }: ReportLoaderProps) {
  const [step, setStep] = useState(0);

  const steps = [
    { label: "Resolving securities ticker & verifying exchange routing", icon: Search },
    { label: "Ingesting live SEC filings (Income, Balance Sheet, Cash Flow)", icon: FileSpreadsheet },
    { label: "Calculating deterministic financial metrics & safety ratios", icon: Percent },
    { label: "Company Research Agent: Evaluating strategic moats & products", icon: Brain },
    { label: "Financial Audit Agent: Running operating margin & debt health logs", icon: FileSpreadsheet },
    { label: "Technical Analytics Agent: Processing SMA 50/200 & RSI momentum indicators", icon: TrendingUp },
    { label: "News Sentiment Agent: Analyzing live bulletins & Grounded streams", icon: Newspaper },
    { label: "Dossier Synthesis Agent: Compiling weighted ratings & confidence dossier", icon: Brain },
  ];

  useEffect(() => {
    const intervals = [1000, 1600, 1500, 1800, 1800, 1600, 1900, 3000];
    let currentStep = 0;

    const runNext = () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setStep(currentStep);
        setTimeout(runNext, intervals[currentStep]);
      }
    };

    const firstTimer = setTimeout(runNext, intervals[0]);
    return () => {
      clearTimeout(firstTimer);
    };
  }, []);

  const agentLogMessages = [
    "Connecting SEC Proxy Pipeline to EDGAR/Yahoo indices...",
    "Querying live financial statement modules & parsing JSON nodes...",
    "Executing Javascript financial ratio calculators internally...",
    "Instantiating Gemini, auditing enterprise summary & product vectors...",
    "Reading balance sheets, calculating Return on Equity (ROE) & Current Ratio...",
    "Computing historical 90-day pricing array & calculating RSI indicators...",
    "Analyzing headlines with Google Search grounding model...",
    "Weighting rating vectors and constructing unified investment thesis dossier...",
  ];

  return (
    <div className="py-8 px-4 max-w-xl mx-auto flex flex-col space-y-5">
      {/* Editorial Title Block */}
      <div className="space-y-2 text-left border-b border-zinc-200/80 pb-5">
        <div className="flex items-center space-x-2">
          <Loader2 size={14} className="animate-spin text-zinc-900" />
          <span className="text-[10px] font-bold tracking-wider font-mono text-zinc-400 uppercase">
            AUDIT INITIATION SEQUENCE
          </span>
        </div>
        <h3 className="text-lg font-semibold text-zinc-950 tracking-tight leading-none">
          Parsing Securities: <span className="font-mono bg-zinc-100 text-zinc-900 border border-zinc-200 px-2 py-0.5 rounded-md">{ticker.toUpperCase()}</span>
        </h3>
        <p className="text-zinc-500 text-[11px] leading-relaxed">
          Retrieving public data registries and mounting secondary specialized agents. Active audit complies with institutional standards and uses 100% verified evidence nodes.
        </p>
      </div>

      {/* Execution Monitor */}
      <div className="w-full bg-white border border-zinc-200 rounded-lg p-5 space-y-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-2.5">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
            Pipeline Event Log
          </span>
          <span className="text-[9px] font-mono font-medium text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200">
            SEQUENCE ACTIVE
          </span>
        </div>
        
        <div className="space-y-2.5">
          {steps.map((s, idx) => {
            const isDone = idx < step;
            const isActive = idx === step;
            
            return (
              <div key={idx} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-3 truncate">
                  <div className="flex-shrink-0">
                    {isDone ? (
                      <span className="text-emerald-600 font-bold">●</span>
                    ) : isActive ? (
                      <span className="text-zinc-900 animate-pulse font-bold">⎔</span>
                    ) : (
                      <span className="text-zinc-300">○</span>
                    )}
                  </div>
                  <p className={`truncate text-[11px] transition-colors duration-300 ${
                    isDone ? "text-zinc-400 line-through" : 
                    isActive ? "text-zinc-900 font-medium" : "text-zinc-300"
                  }`}>
                    {s.label}
                  </p>
                </div>
                
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                  isDone ? "text-zinc-400 bg-zinc-50" :
                  isActive ? "text-zinc-900 bg-zinc-100 font-bold border border-zinc-200/80 animate-pulse" : "text-transparent"
                }`}>
                  {isDone ? "COMPLETED" : isActive ? "COMPUTING" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* High-tech system console log */}
      <div className="w-full bg-zinc-950 text-zinc-100 font-mono text-[11px] p-4 rounded-lg shadow-sm overflow-hidden border border-zinc-800">
        <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-zinc-800 text-zinc-500 text-[9px] uppercase tracking-wider font-bold">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span>
            <span className="ml-1 font-mono text-zinc-400">system@insiderx.sh</span>
          </div>
          <span className="text-zinc-600">SEC-GROUNDED</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <span className="text-zinc-600 select-none">&gt;</span>
            <p className="text-zinc-300 leading-relaxed">$ {agentLogMessages[step]}</p>
          </div>
          <div className="flex justify-between items-center text-[8px] text-zinc-600 mt-2 pt-2 border-t border-zinc-900/60 font-mono">
            <span>UTC_STAMP: {new Date().toISOString()}</span>
            <span>SYSTEM_SECURE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
