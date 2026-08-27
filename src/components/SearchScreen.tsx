import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TransitStop } from '../types';
import { searchTransitStops, findOrCreateStopByCode, RAW_STOPS_CATALOG } from '../data/transitData';

interface SearchScreenProps {
  onSelectStop: (stop: TransitStop) => void;
  onOpenSchedule?: (routeNumber: string) => void;
  onOpenDirections?: (stopName: string) => void;
  savedStopIds?: string[];
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onSelectStop,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mrt' | 'interchange' | 'popular'>('popular');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Real-time matching suggestions based on stop name, road, or number
  const matchingSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchTransitStops(searchQuery, 8);
  }, [searchQuery]);

  // Categorized quick browse stops
  const browseStops = useMemo(() => {
    if (selectedCategory === 'popular') {
      return [
        { code: '83139', name: 'Opp Parkway Parade', area: 'Marine Parade' },
        { code: '01012', name: 'Hotel Grand Pacific', area: 'Bugis / Victoria St' },
        { code: '09048', name: 'Orchard Plaza', area: 'Orchard / Somerset' },
        { code: '14119', name: 'VivoCity', area: 'HarbourFront' },
        { code: '03211', name: 'Raffles City', area: 'City Hall' },
        { code: '05013', name: 'Chinatown Station', area: 'Chinatown' },
        { code: '54009', name: 'Bishan Bus Interchange', area: 'Bishan' },
        { code: '64009', name: 'Tampines Bus Interchange', area: 'Tampines' },
      ];
    } else if (selectedCategory === 'mrt') {
      return [
        { code: '01112', name: 'Bugis Station Exit D', area: 'Downtown / East-West Line' },
        { code: '09022', name: 'Orchard Station / ION', area: 'North-South / Thomson Line' },
        { code: '08057', name: 'Dhoby Ghaut Station', area: 'Triple MRT Interchange' },
        { code: '11119', name: 'Queenstown Station', area: 'East-West Line' },
        { code: '80019', name: 'Aljunied Station', area: 'East-West Line' },
        { code: '50038', name: 'Novena Station', area: 'North-South Line' },
        { code: '40019', name: 'Newton Station Exit A', area: 'Downtown / North-South Line' },
        { code: '03019', name: 'Opp Clarke Quay Station', area: 'North East Line' },
      ];
    } else if (selectedCategory === 'interchange') {
      return [
        { code: '84009', name: 'Bedok Bus Interchange', area: 'East Coast Hub' },
        { code: '28009', name: 'Clementi Bus Interchange', area: 'West Coast Hub' },
        { code: '22009', name: 'Jurong East Interchange', area: 'West Regional Centre' },
        { code: '52009', name: 'Ang Mo Kio Interchange', area: 'Central Hub' },
        { code: '52199', name: 'Toa Payoh Interchange', area: 'Central Hub' },
        { code: '66009', name: 'Serangoon Interchange', area: 'North-East Hub' },
        { code: '65009', name: 'Punggol Interchange', area: 'North-East Hub' },
        { code: '43009', name: 'Woodlands Interchange', area: 'North Hub' },
      ];
    } else {
      return RAW_STOPS_CATALOG.slice(0, 10).map((s) => ({
        code: s.id,
        name: s.name,
        area: s.roadName || s.intersection,
      }));
    }
  }, [selectedCategory]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setErrorMessage('Please enter a bus stop name, road, or 5-digit stop number');
      return;
    }

    setErrorMessage('');
    setIsFocused(false);

    // If matching suggestions exist, choose top match
    if (matchingSuggestions.length > 0) {
      onSelectStop(matchingSuggestions[0]);
    } else {
      const resolvedStop = findOrCreateStopByCode(query);
      onSelectStop(resolvedStop);
    }
  };

  const handleSelectSuggestion = (stop: TransitStop) => {
    setSearchQuery(stop.name);
    setErrorMessage('');
    setIsFocused(false);
    onSelectStop(stop);
  };

  const handleQuickSelectCode = (code: string) => {
    setErrorMessage('');
    setIsFocused(false);
    const resolvedStop = findOrCreateStopByCode(code);
    setSearchQuery(resolvedStop.name);
    onSelectStop(resolvedStop);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 py-10 md:py-16 max-w-4xl mx-auto w-full">
      <div className="w-full flex flex-col items-center text-center gap-6">
        {/* App Icon & Header Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-[#003d9b] text-[#ffffff] flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[36px]">directions_bus</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#003d9b] tracking-tight">
            Singapore Bus Stop Search
          </h1>

          <p className="text-sm md:text-base text-[#515f74] max-w-lg">
            Search by <strong className="text-[#191b23]">Stop Name</strong> (e.g. <em>Orchard, Parkway Parade, Bugis</em>), <strong className="text-[#191b23]">Road Name</strong>, or <strong className="text-[#191b23]">5-digit Stop Number</strong> to get real-time bus arrivals.
          </p>
        </div>

        {/* Search Box with Autocomplete Dropdown */}
        <div ref={searchContainerRef} className="w-full max-w-2xl relative flex flex-col gap-2 mt-2">
          <form onSubmit={handleSearchSubmit} className="w-full flex flex-col gap-2">
            <div className="relative flex items-center shadow-md rounded-2xl bg-[#ffffff] border-2 border-[#003d9b] focus-within:ring-4 focus-within:ring-[#003d9b]/15 transition-all">
              <span
                className="material-symbols-outlined absolute left-4 text-[#003d9b] text-[26px] pointer-events-none select-none"
                aria-hidden="true"
              >
                search
              </span>

              <input
                id="input-stop-search"
                type="text"
                autoFocus
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (errorMessage) setErrorMessage('');
                  setIsFocused(true);
                }}
                placeholder="Search stop name or 5-digit number (e.g. Orchard, Bugis, 83139)..."
                className="w-full h-16 pl-14 pr-32 text-base md:text-lg font-medium text-[#191b23] placeholder:text-[#9aa0a6] placeholder:font-normal bg-transparent outline-none rounded-2xl"
                autoComplete="off"
              />

              {/* Clear button if text entered */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsFocused(false);
                  }}
                  className="absolute right-24 p-2 text-[#737685] hover:text-[#191b23] cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search query"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}

              <button
                type="submit"
                id="btn-search-stop"
                className="absolute right-2 h-12 px-5 bg-[#003d9b] hover:bg-[#002d72] active:scale-95 text-[#ffffff] font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Search</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {errorMessage && (
              <p className="text-xs font-semibold text-[#ba1a1a] text-left px-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{errorMessage}</span>
              </p>
            )}
          </form>

          {/* Live Autocomplete Suggestions Dropdown */}
          {isFocused && matchingSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#ffffff] rounded-2xl border border-[#c3c6d6] shadow-xl z-50 overflow-hidden text-left max-h-96 overflow-y-auto animate-fadeIn">
              <div className="px-4 py-2 bg-[#faf8ff] border-b border-[#ededf8] flex justify-between items-center text-xs font-bold text-[#515f74]">
                <span>MATCHING BUS STOPS ({matchingSuggestions.length})</span>
                <span className="text-[10px] text-[#737685] font-normal">Click to view arrivals</span>
              </div>

              <div className="divide-y divide-[#ededf8]">
                {matchingSuggestions.map((stop) => (
                  <button
                    key={stop.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(stop)}
                    className="w-full px-4 py-3 hover:bg-[#f3f3fd] transition-colors flex items-center justify-between gap-3 text-left cursor-pointer group"
                  >
                    <div className="flex items-start gap-3 overflow-hidden">
                      <div className="bg-[#003d9b] text-[#ffffff] font-mono text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0 group-hover:bg-[#002d72]">
                        {stop.id}
                      </div>

                      <div className="overflow-hidden">
                        <h4 className="font-bold text-sm text-[#191b23] group-hover:text-[#003d9b] truncate">
                          {stop.name}
                        </h4>
                        <p className="text-xs text-[#515f74] truncate">
                          {stop.intersection || stop.roadName}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <div className="hidden sm:flex items-center gap-1 flex-wrap max-w-[160px] justify-end">
                        {stop.routes.slice(0, 4).map((r) => (
                          <span
                            key={r}
                            className="font-mono text-[10px] bg-[#ededf8] text-[#003d9b] px-1.5 py-0.5 rounded font-bold"
                          >
                            {r}
                          </span>
                        ))}
                        {stop.routes.length > 4 && (
                          <span className="text-[10px] text-[#737685] font-bold">
                            +{stop.routes.length - 4}
                          </span>
                        )}
                      </div>
                      <span className="material-symbols-outlined text-[#737685] group-hover:text-[#003d9b] text-[18px]">
                        arrow_forward
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Browse Category Tabs */}
        <div className="w-full max-w-2xl flex flex-col gap-3 pt-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#003d9b] text-[20px]">explore</span>
              <span className="text-xs font-bold text-[#191b23] uppercase tracking-wider">
                Explore Bus Stops by Name
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="inline-flex rounded-xl bg-[#ededf8] p-1 border border-[#c3c6d6] text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedCategory('popular')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === 'popular'
                    ? 'bg-[#003d9b] text-[#ffffff] shadow-xs'
                    : 'text-[#515f74] hover:text-[#003d9b]'
                }`}
              >
                Popular
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('mrt')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === 'mrt'
                    ? 'bg-[#003d9b] text-[#ffffff] shadow-xs'
                    : 'text-[#515f74] hover:text-[#003d9b]'
                }`}
              >
                MRT Stations
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('interchange')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === 'interchange'
                    ? 'bg-[#003d9b] text-[#ffffff] shadow-xs'
                    : 'text-[#515f74] hover:text-[#003d9b]'
                }`}
              >
                Interchanges
              </button>
            </div>
          </div>

          {/* Grid of Selectable Bus Stops with Name and Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {browseStops.map((item) => (
              <button
                key={item.code}
                type="button"
                id={`browse-stop-${item.code}`}
                onClick={() => handleQuickSelectCode(item.code)}
                className="p-3 bg-[#ffffff] hover:bg-[#f3f3fd] active:scale-[0.99] border border-[#c3c6d6] hover:border-[#003d9b] rounded-xl text-left transition-all flex items-center justify-between gap-3 shadow-2xs cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="font-mono font-bold bg-[#003d9b] text-[#ffffff] px-2 py-1 rounded-lg text-xs shrink-0">
                    {item.code}
                  </span>
                  <div className="overflow-hidden">
                    <span className="font-bold text-xs text-[#191b23] group-hover:text-[#003d9b] block truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#737685] block truncate">
                      {item.area}
                    </span>
                  </div>
                </div>

                <span className="material-symbols-outlined text-[#737685] group-hover:text-[#003d9b] text-[18px] shrink-0">
                  chevron_right
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
