import React, { useState } from 'react';
import { TransitStop } from '../types';
import { TRANSIT_STOPS, findOrCreateStopByCode } from '../data/transitData';

interface SearchScreenProps {
  onSelectStop: (stop: TransitStop) => void;
  onOpenSchedule?: (routeNumber: string) => void;
  onOpenDirections?: (stopName: string) => void;
  savedStopIds?: string[];
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onSelectStop,
}) => {
  const [stopNumber, setStopNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = stopNumber.trim();
    if (!query) {
      setErrorMessage('Please enter a bus stop number');
      return;
    }

    setErrorMessage('');
    const resolvedStop = findOrCreateStopByCode(query);
    onSelectStop(resolvedStop);
  };

  const handleQuickSelect = (code: string) => {
    setStopNumber(code);
    setErrorMessage('');
    const resolvedStop = findOrCreateStopByCode(code);
    onSelectStop(resolvedStop);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 py-12 md:py-20 max-w-3xl mx-auto w-full">
      <div className="w-full flex flex-col items-center text-center gap-6">
        {/* App Title & Subtitle */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-[#003d9b] text-[#ffffff] flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[36px]">directions_bus</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#003d9b] tracking-tight">
            Bus Stop Arrival Search
          </h1>
          
          <p className="text-sm md:text-base text-[#515f74] max-w-md">
            Enter any 5-digit bus stop number to check real-time arrivals for all bus services.
          </p>
        </div>

        {/* Bus Stop Number Search Box */}
        <form onSubmit={handleSearch} className="w-full max-w-xl flex flex-col gap-3 mt-2">
          <div className="relative flex items-center shadow-md rounded-2xl bg-[#ffffff] border-2 border-[#003d9b] focus-within:ring-4 focus-within:ring-[#003d9b]/15 transition-all">
            <span
              className="material-symbols-outlined absolute left-4 text-[#003d9b] text-[26px] pointer-events-none"
              aria-hidden="true"
            >
              pin
            </span>

            <input
              id="input-stop-number"
              type="text"
              inputMode="numeric"
              maxLength={5}
              autoFocus
              value={stopNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setStopNumber(val);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Enter 5-digit stop number (e.g. 83139)"
              className="w-full h-16 pl-14 pr-28 text-lg md:text-xl font-mono font-bold text-[#191b23] placeholder:text-[#9aa0a6] placeholder:font-sans placeholder:font-normal bg-transparent outline-none rounded-2xl"
            />

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

        {/* Quick Popular Bus Stop Shortcuts */}
        <div className="w-full max-w-xl flex flex-col gap-2.5 pt-4">
          <span className="text-xs font-bold text-[#737685] uppercase tracking-wider">
            Popular Stop Numbers
          </span>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { code: '83139', name: 'Marine Parade' },
              { code: '01012', name: 'Bugis / Victoria St' },
              { code: '09048', name: 'Orchard Rd' },
              { code: '54009', name: 'Bishan Int' },
              { code: '64009', name: 'Tampines Int' },
              { code: '22009', name: 'Jurong East' },
              { code: '43009', name: 'Woodlands' },
              { code: '84009', name: 'Bedok Int' },
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                id={`quick-stop-${item.code}`}
                onClick={() => handleQuickSelect(item.code)}
                className="px-3.5 py-2 bg-[#ffffff] hover:bg-[#ededf8] active:scale-95 border border-[#c3c6d6] hover:border-[#003d9b] rounded-xl text-xs font-semibold text-[#003d9b] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span className="font-mono font-bold bg-[#003d9b] text-[#ffffff] px-1.5 py-0.2 rounded text-[11px]">
                  {item.code}
                </span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
