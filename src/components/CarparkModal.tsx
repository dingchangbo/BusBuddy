import React, { useState, useMemo } from 'react';
import { LtaCarParkItem } from '../types';

interface CarparkModalProps {
  carparks: LtaCarParkItem[];
  isLoading: boolean;
  isConfigured: boolean;
  onRefresh: () => void;
  onClose: () => void;
}

export const CarparkModal: React.FC<CarparkModalProps> = ({
  carparks,
  isLoading,
  isConfigured,
  onRefresh,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<string>('ALL');
  const [selectedLotType, setSelectedLotType] = useState<string>('ALL');

  const filteredCarparks = useMemo(() => {
    return carparks.filter((cp) => {
      const matchAgency = selectedAgency === 'ALL' || cp.Agency === selectedAgency;
      const matchType = selectedLotType === 'ALL' || cp.LotType === selectedLotType;
      const matchQuery =
        !searchQuery.trim() ||
        cp.Development.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cp.Area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cp.CarParkID.toLowerCase().includes(searchQuery.toLowerCase());
      return matchAgency && matchType && matchQuery;
    });
  }, [carparks, selectedAgency, selectedLotType, searchQuery]);

  return (
    <div className="fixed inset-0 bg-[#191b23]/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div
        className="bg-[#ffffff] rounded-2xl border border-[#c3c6d6] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#faf8ff] border-b border-[#c3c6d6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003d9b] text-[#ffffff] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">local_parking</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-lg-mobile text-lg font-bold text-[#191b23]">
                  Live Carpark Lots
                </h3>
                <span className="font-label-caps text-[10px] bg-[#d5e3fd] text-[#001848] px-2 py-0.5 rounded font-bold">
                  HDB • LTA • URA
                </span>
              </div>
              <p className="text-xs text-[#515f74]">
                Real-time parking space availability across Singapore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`p-2 rounded-lg text-[#003d9b] hover:bg-[#ededf8] transition-all cursor-pointer ${
                isLoading ? 'animate-spin opacity-60' : ''
              }`}
              title="Refresh carparks"
              aria-label="Refresh carparks"
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#737685] hover:text-[#191b23] hover:bg-[#ededf8] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* API Status Notice if in preview */}
        {!isConfigured && (
          <div className="bg-[#f3f3fd] border-b border-[#c3c6d6] px-4 py-2 flex items-center justify-between text-xs text-[#515f74]">
            <span className="flex items-center gap-1.5 font-label-caps">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Showing Singapore Sample Developments. Set <code>LTA_DATAMALL_KEY</code> in settings to stream 2,000+ live carparks.
            </span>
          </div>
        )}

        {/* Search and Filters */}
        <div className="p-4 bg-[#f3f3fd] border-b border-[#c3c6d6] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737685] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area (e.g. Marina, Orchard, Jurong) or mall..."
              className="w-full h-10 pl-9 pr-3 bg-[#ffffff] border border-[#c3c6d6] rounded-lg text-sm text-[#191b23] placeholder:text-[#737685] outline-none focus:border-[#003d9b]"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="h-10 px-3 bg-[#ffffff] border border-[#c3c6d6] rounded-lg text-xs font-label-caps text-[#191b23] outline-none focus:border-[#003d9b]"
            >
              <option value="ALL">All Agencies</option>
              <option value="LTA">LTA</option>
              <option value="HDB">HDB</option>
              <option value="URA">URA</option>
            </select>

            <select
              value={selectedLotType}
              onChange={(e) => setSelectedLotType(e.target.value)}
              className="h-10 px-3 bg-[#ffffff] border border-[#c3c6d6] rounded-lg text-xs font-label-caps text-[#191b23] outline-none focus:border-[#003d9b]"
            >
              <option value="ALL">All Lots</option>
              <option value="C">Cars (C)</option>
              <option value="Y">Motorcycles (Y)</option>
              <option value="H">Heavy (H)</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto flex-grow divide-y divide-[#ededf8] max-h-[55vh]">
          {filteredCarparks.length === 0 ? (
            <div className="text-center py-12 text-[#737685]">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#737685]">
                no_crash
              </span>
              <p className="font-medium text-sm">No carparks found matching your criteria</p>
            </div>
          ) : (
            filteredCarparks.map((cp, idx) => {
              const lots = cp.AvailableLots ?? 0;
              const isHigh = lots > 50;
              const isLow = lots > 0 && lots <= 15;
              const isFull = lots === 0;

              return (
                <div
                  key={`${cp.CarParkID}-${idx}`}
                  className="py-3.5 px-2 hover:bg-[#f3f3fd] rounded-lg flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-sm text-[#191b23] truncate">
                        {cp.Development || 'Carpark'}
                      </h4>
                      <span className="font-label-caps text-[10px] bg-[#ededf8] text-[#515f74] px-1.5 py-0.5 rounded">
                        {cp.Agency}
                      </span>
                      {cp.Area && (
                        <span className="font-label-caps text-[10px] text-[#003d9b]">
                          • {cp.Area}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#737685] flex items-center gap-2 font-mono">
                      <span>ID: {cp.CarParkID}</span>
                      <span>• Lot Type: {cp.LotType === 'C' ? 'Cars' : cp.LotType === 'Y' ? 'Motorcycles' : cp.LotType}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`inline-flex items-baseline gap-1 font-bold text-lg px-3 py-1 rounded-lg ${
                        isFull
                          ? 'bg-[#ffdad6] text-[#93000a]'
                          : isLow
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-green-100 text-green-900'
                      }`}
                    >
                      <span>{lots}</span>
                      <span className="text-[10px] font-normal uppercase">lots</span>
                    </div>
                    <p className="text-[10px] font-label-caps mt-0.5 text-[#737685]">
                      {isFull ? 'FULL' : isLow ? 'LIMITED' : 'AVAILABLE'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#faf8ff] border-t border-[#c3c6d6] flex items-center justify-between text-xs text-[#737685]">
          <span>Showing {filteredCarparks.length} developments</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#003d9b] text-[#ffffff] font-label-caps text-xs rounded-lg hover:bg-[#0040a2] transition-colors cursor-pointer"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
