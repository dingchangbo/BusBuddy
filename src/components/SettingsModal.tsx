import React, { useState } from 'react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [refreshInterval, setRefreshInterval] = useState('20');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState('km');

  return (
    <div className="fixed inset-0 bg-[#191b23]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-[#ffffff] rounded-2xl border border-[#c3c6d6] shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 bg-[#faf8ff] border-b border-[#c3c6d6] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003d9b]">settings</span>
            <h3 className="font-headline-lg-mobile text-lg font-bold text-[#191b23]">
              Commuter Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#737685] hover:text-[#191b23] p-1.5 rounded-lg hover:bg-[#ededf8] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-label-caps text-xs text-[#515f74] font-bold block">
                LTA LIVE DATA REFRESH
              </label>
              <span className="text-[10px] font-label-caps text-[#003d9b] font-bold">Standard 20s</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['15', '20', '30'].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setRefreshInterval(sec)}
                  className={`py-2 text-center rounded-xl border font-label-caps text-xs transition-colors cursor-pointer ${
                    refreshInterval === sec
                      ? 'bg-[#003d9b] text-[#ffffff] border-[#003d9b] font-bold shadow-xs'
                      : 'bg-[#faf8ff] text-[#434654] border-[#c3c6d6] hover:bg-[#ededf8]'
                  }`}
                >
                  {sec} seconds
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#ededf8] pt-3 flex items-center justify-between">
            <div>
              <p className="font-body-md text-sm font-medium text-[#191b23]">Arrival Audio Chimes</p>
              <p className="text-xs text-[#737685]">Notify when bus is 2 minutes away</p>
            </div>
            <button
              onClick={() => setSoundAlerts(!soundAlerts)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                soundAlerts ? 'bg-[#003d9b]' : 'bg-[#c3c6d6]'
              }`}
            >
              <div
                className={`bg-[#ffffff] w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  soundAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-[#ededf8] pt-3 flex items-center justify-between">
            <div>
              <p className="font-body-md text-sm font-medium text-[#191b23]">High Contrast Mode</p>
              <p className="text-xs text-[#737685]">Optimized for bright outdoor sunlight</p>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                highContrast ? 'bg-[#003d9b]' : 'bg-[#c3c6d6]'
              }`}
            >
              <div
                className={`bg-[#ffffff] w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-[#ededf8] pt-3">
            <label className="font-label-caps text-xs text-[#515f74] font-bold block mb-1.5">
              DISTANCE UNITS
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['km', 'miles'].map((unit) => (
                <button
                  key={unit}
                  onClick={() => setDistanceUnit(unit)}
                  className={`py-1.5 text-center rounded-xl border font-label-caps text-xs capitalize transition-colors cursor-pointer ${
                    distanceUnit === unit
                      ? 'bg-[#003d9b] text-[#ffffff] border-[#003d9b] font-bold shadow-xs'
                      : 'bg-[#faf8ff] text-[#434654] border-[#c3c6d6] hover:bg-[#ededf8]'
                  }`}
                >
                  {unit === 'km' ? 'Kilometers (km)' : 'Miles (mi)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-[#faf8ff] border-t border-[#c3c6d6] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#003d9b] text-[#ffffff] font-label-caps text-xs rounded-xl hover:bg-[#0040a2] transition-colors cursor-pointer font-bold"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
