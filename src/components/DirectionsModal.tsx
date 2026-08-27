import React, { useState } from 'react';

interface DirectionsModalProps {
  destinationStopName: string;
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({
  destinationStopName,
  onClose,
}) => {
  const [origin, setOrigin] = useState('Current Location (GPS)');

  return (
    <div className="fixed inset-0 bg-[#191b23]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-[#ffffff] rounded-xl border border-[#c3c6d6] shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 bg-[#faf8ff] border-b border-[#c3c6d6] flex justify-between items-center">
          <h3 className="font-headline-lg-mobile text-lg font-bold text-[#191b23] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003d9b]">navigation</span>
            <span>Transit Directions</span>
          </h3>
          <button
            onClick={onClose}
            className="text-[#737685] hover:text-[#191b23] p-1.5 rounded-lg hover:bg-[#ededf8] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div>
              <label className="font-label-caps text-xs text-[#515f74] font-bold block mb-1">
                STARTING POINT
              </label>
              <div className="flex items-center gap-2 bg-[#ededf8] px-3 py-2 rounded border border-[#c3c6d6]">
                <span className="material-symbols-outlined text-[#003d9b] text-[18px]">my_location</span>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="bg-transparent font-body-md text-sm text-[#191b23] w-full outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-label-caps text-xs text-[#515f74] font-bold block mb-1">
                DESTINATION STOP
              </label>
              <div className="flex items-center gap-2 bg-[#ededf8] px-3 py-2 rounded border border-[#c3c6d6]">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">location_on</span>
                <span className="font-body-md text-sm text-[#191b23] font-medium truncate">
                  {destinationStopName}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#ededf8] pt-3">
            <h4 className="font-label-caps text-xs text-[#515f74] font-bold mb-2">
              RECOMMENDED ROUTE (7 MIN TOTAL)
            </h4>
            <div className="space-y-2 text-sm text-[#434654]">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#737685] text-[18px] mt-0.5">directions_walk</span>
                <div>
                  <p className="font-medium text-[#191b23]">Walk 2 min (0.1 mi)</p>
                  <p className="text-xs text-[#737685]">Head North on 4th Ave toward Market</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#003d9b] text-[18px] mt-0.5">directions_bus</span>
                <div>
                  <p className="font-medium text-[#191b23]">Board Route 14 (Downtown Loop)</p>
                  <p className="text-xs text-[#737685]">Arrives in 3 min • 2 stops (4 min)</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px] mt-0.5">flag</span>
                <div>
                  <p className="font-medium text-[#191b23]">Arrive at {destinationStopName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#faf8ff] border-t border-[#c3c6d6] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#003d9b] text-[#ffffff] font-label-caps text-xs rounded hover:bg-[#0040a2] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
