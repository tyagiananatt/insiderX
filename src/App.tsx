import { useState, useEffect } from "react";
import { SearchHeader } from "./components/SearchHeader.js";
import { ReportLoader } from "./components/ReportLoader.js";
import { DashboardGrid } from "./components/DashboardGrid.js";
import { InvestmentReport } from "./types.js";
// @ts-ignore
import logo from "./insiderx_logo.png";
import { 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  Compass, 
  Layers, 
  FileSpreadsheet,
  CheckCircle2,
  Cpu,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [report, setReport] = useState<InvestmentReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [currentTicker, setCurrentTicker] = useState("");
  const [utcTime, setUtcTime] = useState("");

  // Real-time UTC clock for the institutional atmosphere
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRunResearch = async (ticker: string) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    setCurrentTicker(ticker);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker }),
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error("Server returned an HTML or empty response.", {
          cause: text.substring(0, 180).trim() || "The connection timed out or returned a gateway error."
        });
      }
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to complete investment research.", {
          cause: data.details
        });
      }

      setReport(data);
    } catch (e: any) {
      console.error("Research failed:", e);
      setError({
        message: e.message || "An unexpected error occurred during stock analysis.",
        details: e.cause || "Verify that the ticker is correct and that the Gemini API Key is configured in your secrets."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 flex flex-col font-sans selection:bg-zinc-950 selection:text-white">
      
      {/* PROFESSIONAL SYSTEM HEADER */}
      <header className="bg-white border-b border-zinc-200/50 py-4.5 px-6 sticky top-0 z-40 shadow-[0_1px_4px_rgba(0,0,0,0.02)] no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="insiderX Logo" 
              className="h-8 w-auto object-contain rounded-lg"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // simple invisible fallback
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-display font-black tracking-tight text-zinc-900">insiderX</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-zinc-50 border border-zinc-200/60 rounded-xl px-3 py-1.5 text-xs text-zinc-500 font-mono font-bold shadow-2xs">
              <Clock size={13} className="text-zinc-400" />
              <span>{utcTime}</span>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Search Panel */}
        <SearchHeader onSearch={handleRunResearch} isLoading={isLoading} />

        {/* LOADING STATE */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-zinc-200/50 rounded-3xl p-8 shadow-xs"
            >
              <ReportLoader ticker={currentTicker} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ERROR STATE */}
        {error && (
          <div className="bg-rose-50/50 border-2 border-rose-100 rounded-3xl p-6 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 max-w-3xl mx-auto">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl flex-shrink-0">
              <ShieldAlert size={24} />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-extrabold text-rose-950 text-lg tracking-tight">{error.message}</h3>
              <p className="text-rose-800 text-sm leading-relaxed">{error.details}</p>
              
              <div className="pt-3">
                <button
                  onClick={() => handleRunResearch(currentTicker)}
                  className="font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <RefreshCw size={12} />
                  <span>Retry Analysis Pipeline</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COMPLETED REPORT */}
        {report && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <DashboardGrid report={report} />
          </motion.div>
        )}

        {/* WELCOME / ZERO STATE PANEL */}
        {!report && !isLoading && !error && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-[2rem] p-6 sm:p-10 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border border-zinc-800">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,120,120,0.1),transparent_40%)]"></div>
              
              <div className="space-y-4 max-w-2xl relative z-10">
                <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest font-mono">
                  Advanced Securities Engine
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Perform Deep Multi-Agent Securities Audits Instantly
                </h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Generate institutional stock dossiers in seconds. Our autonomous financial pipeline connects to verified live market indexes, audits SEC-compliant statement modules, computes exact liquidity ratios, processes momentum patterns, and filters news sentiment with absolute rigor.
                </p>
                <div className="flex items-center space-x-2 text-xs text-zinc-500 font-mono">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>Zero Hallucination Guarantee</span>
                  <span className="text-zinc-700">•</span>
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>Verified 10-K Ratios</span>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl flex-shrink-0 w-full md:w-80 relative z-10">
                <p className="text-[10px] font-bold text-zinc-500 mb-3.5 uppercase tracking-widest font-mono">
                  Instant Diagnostics
                </p>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => handleRunResearch("AAPL")}
                    className="w-full px-4 py-3 bg-zinc-800 hover:bg-white hover:text-zinc-950 text-zinc-200 rounded-xl text-xs font-bold transition-all cursor-pointer border border-zinc-700/50 flex items-center justify-between"
                  >
                    <span>Apple Inc.</span>
                    <span className="font-mono text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded">AAPL</span>
                  </button>
                  <button
                    onClick={() => handleRunResearch("NVDA")}
                    className="w-full px-4 py-3 bg-zinc-800 hover:bg-white hover:text-zinc-950 text-zinc-200 rounded-xl text-xs font-bold transition-all cursor-pointer border border-zinc-700/50 flex items-center justify-between"
                  >
                    <span>NVIDIA Corporation</span>
                    <span className="font-mono text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded">NVDA</span>
                  </button>
                  <button
                    onClick={() => handleRunResearch("MSFT")}
                    className="w-full px-4 py-3 bg-zinc-800 hover:bg-white hover:text-zinc-950 text-zinc-200 rounded-xl text-xs font-bold transition-all cursor-pointer border border-zinc-700/50 flex items-center justify-between"
                  >
                    <span>Microsoft Corp.</span>
                    <span className="font-mono text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded">MSFT</span>
                  </button>
                </div>
              </div>
            </div>

            {/* THREE BENTO CORE CAPABILITY BLOCKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="bg-white border border-zinc-200/55 p-6 sm:p-7 rounded-3xl shadow-2xs space-y-4 hover:shadow-sm transition-all hover:border-zinc-300">
                <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-xl flex items-center justify-center">
                  <FileSpreadsheet size={18} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-zinc-900 text-sm tracking-tight">Verified SEC Calculations</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Processes income growth indexes, operational margins, liquidity ratios, and balance sheet leverage directly from corporate 10-K and 10-Q filing modules.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white border border-zinc-200/55 p-6 sm:p-7 rounded-3xl shadow-2xs space-y-4 hover:shadow-sm transition-all hover:border-zinc-300">
                <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-xl flex items-center justify-center">
                  <Cpu size={18} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-zinc-900 text-sm tracking-tight">Multi-Agent Diagnostics</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Spawns four dedicated expert agents specializing in industry moats, balance sheet stability, mathematical indicators, and sentiment streams to synthesize a robust dossier.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white border border-zinc-200/55 p-6 sm:p-7 rounded-3xl shadow-2xs space-y-4 md:col-span-2 lg:col-span-1 hover:shadow-sm transition-all hover:border-zinc-300">
                <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 text-zinc-800 rounded-xl flex items-center justify-center">
                  <Compass size={18} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-zinc-900 text-sm tracking-tight">Search-Grounded Sentiment</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Queries live Google search results for current news headlines and developments, cross-referencing feeds to eliminate hallucinations or stale opinions.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* SYSTEM DISCLAIMER FOOTER */}
      <footer className="border-t border-zinc-200/50 bg-white py-6 px-6 text-center text-xs text-zinc-400 font-mono no-print mt-auto">
        <p>© 2026 insiderX Research Systems. SEC Grounded Audit Model.</p>
        <p className="mt-1 text-[10px] text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Disclaimer: This system compiles automated corporate diagnostics using verified public data feeds. It does not constitute certified personal or professional investment advice.
        </p>
      </footer>

    </div>
  );
}
