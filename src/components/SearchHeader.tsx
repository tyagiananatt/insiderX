import React, { useState, useEffect, useRef } from "react";
import { Search, Compass, Landmark, Loader2, Sparkles } from "lucide-react";

interface SearchHeaderProps {
  onSearch: (ticker: string) => void;
  isLoading: boolean;
}

interface SearchResult {
  symbol: string;
  shortname: string;
  exchange: string;
}

export function SearchHeader({ onSearch, isLoading }: SearchHeaderProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const presets = [
    { name: "Apple", ticker: "AAPL" },
    { name: "Microsoft", ticker: "MSFT" },
    { name: "NVIDIA", ticker: "NVDA" },
    { name: "Tesla", ticker: "TSLA" }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.quotes || []);
          setIsDropdownOpen(true);
        }
      } catch (e) {
        console.error("Failed to fetch search suggestions:", e);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.toUpperCase());
      setIsDropdownOpen(false);
    }
  };

  const handleSelectSuggestion = (ticker: string) => {
    setQuery(ticker);
    onSearch(ticker);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative no-print transition-all hover:border-zinc-300">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="max-w-2xl space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight leading-snug">
              Securities Analytical Audit Desk
            </h2>
            <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed max-w-xl">
              Conduct high-fidelity corporate forensic diagnostics. This environment parses active SEC filings, calculates volatility spreads, and generates multi-agent consensus dossiers grounded in verified real-time metrics.
            </p>
          </div>
        </div>

        {/* Right column: Search input field and button */}
        <div className="w-full lg:max-w-md">
          <form onSubmit={handleSubmit} className="relative" ref={dropdownRef}>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  placeholder="Enter SEC ticker or corporate entity... (e.g., AAPL)"
                  disabled={isLoading}
                  className="w-full pl-10 pr-16 py-2.5 border border-zinc-200/80 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 bg-zinc-50/50 hover:bg-zinc-50 font-medium transition-all placeholder-zinc-400 disabled:opacity-60 text-zinc-900 shadow-inner"
                />
                <Search className="absolute left-3.5 top-3 text-zinc-400" size={14} />
                <div className="absolute right-3.5 top-2.5 flex items-center space-x-1">
                  {isSearching ? (
                    <Loader2 size={13} className="text-zinc-500 animate-spin" />
                  ) : (
                    <span className="text-[9px] font-mono font-medium text-zinc-400 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded shadow-sm select-none">
                      ⌥K
                    </span>
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="w-full bg-zinc-950 hover:bg-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-400 text-white font-medium text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-sm disabled:shadow-none hover:shadow active:scale-[0.99] flex items-center justify-center space-x-2 border border-zinc-950 disabled:border-zinc-100"
              >
                <span>Initialize Audit Dossier</span>
              </button>
            </div>

            {/* Dynamic suggestions dropdown */}
            {isDropdownOpen && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 overflow-hidden divide-y divide-zinc-100 max-h-60 overflow-y-auto">
                {suggestions.map((item) => (
                  <button
                    key={item.symbol}
                    type="button"
                    onClick={() => handleSelectSuggestion(item.symbol)}
                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center justify-between text-xs transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-zinc-900 bg-zinc-100 group-hover:bg-zinc-200 text-[10px] px-1.5 py-0.5 rounded transition-colors">
                        {item.symbol}
                      </span>
                      <span className="text-zinc-700 font-medium truncate max-w-xs">{item.shortname}</span>
                    </div>
                    <span className="text-[9px] text-zinc-400 uppercase font-mono tracking-wider">
                      {item.exchange}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Quick preset chips */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider font-mono mr-1">
              Presets:
            </span>
            {presets.map((preset) => (
              <button
                key={preset.ticker}
                type="button"
                onClick={() => {
                  setQuery(preset.ticker);
                  onSearch(preset.ticker);
                }}
                disabled={isLoading}
                className="text-[10px] text-zinc-600 hover:text-zinc-900 px-2 py-1 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-md transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="font-medium">{preset.name}</span> <span className="font-mono text-[9px] text-zinc-400">({preset.ticker})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
