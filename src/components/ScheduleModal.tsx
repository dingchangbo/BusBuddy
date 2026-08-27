import React from 'react';
import { RouteArrivalData } from '../types';

interface ScheduleModalProps {
  route: RouteArrivalData | null;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ route, onClose }) => {
  if (!route) return null;

  const defaultStops = route.schedule || [
    { stopName: 'Terminal Concourse', time: '10:00 AM' },
    { stopName: 'Market & 4th Street', time: '10:08 AM' },
    { stopName: 'Main Street Central (Current)', time: '10:16 AM', isCurrent: true },
    { stopName: 'Transit Plaza Hub', time: '10:25 AM' },
    { stopName: 'Harbor Gateway', time: '10:35 AM' },
  ];

  return (
    <div className="fixed inset-0 bg-[#191b23]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-[#ffffff] rounded-xl border border-[#c3c6d6] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-modal-title"
      >
        {/* Header */}
        <div className="p-4 bg-[#faf8ff] border-b border-[#c3c6d6] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="bg-[#003d9b] text-[#ffffff] font-display-route text-2xl w-10 h-10 flex items-center justify-center rounded">
              {route.routeNumber}
            </span>
            <div>
              <h3 id="schedule-modal-title" className="font-headline-lg-mobile text-lg font-bold text-[#191b23]">
                {route.routeName}
              </h3>
              <p className="font-body-md text-xs text-[#434654]">{route.via}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#737685] hover:text-[#191b23] p-1.5 rounded-lg hover:bg-[#ededf8] cursor-pointer"
            aria-label="Close timetable"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Upcoming Live Departures */}
        <div className="p-4 border-b border-[#ededf8] bg-[#f3f3fd]">
          <h4 className="font-label-caps text-xs text-[#515f74] font-bold mb-2">
            LIVE UPCOMING DEPARTURES
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {route.arrivals.map((arr, idx) => (
              <div
                key={arr.id || idx}
                className="bg-[#ffffff] p-2 rounded border border-[#c3c6d6] text-center"
              >
                <span className="font-time-display text-sm font-bold text-[#003d9b] block">
                  {arr.minutes} min
                </span>
                <span className="font-label-caps text-[10px] text-[#737685] block">
                  {arr.scheduledTime || `${10 + idx * 10}:${15 + idx * 2} AM`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Route Stops Sequence */}
        <div className="p-4 overflow-y-auto flex-grow">
          <h4 className="font-label-caps text-xs text-[#515f74] font-bold mb-3">
            ROUTE STOPS TIMELINE
          </h4>
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#c3c6d6]">
            {defaultStops.map((stop, idx) => (
              <div key={idx} className="relative flex items-center justify-between group">
                <div
                  className={`absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#ffffff] ${
                    stop.isCurrent ? 'bg-[#003d9b] ring-4 ring-[#dae2ff]' : 'bg-[#737685]'
                  }`}
                />
                <div className="min-w-0 pr-2">
                  <p
                    className={`font-body-md text-sm ${
                      stop.isCurrent ? 'font-bold text-[#003d9b]' : 'text-[#191b23]'
                    }`}
                  >
                    {stop.stopName}
                  </p>
                  {stop.isCurrent && (
                    <span className="font-label-caps text-[10px] bg-[#dae2ff] text-[#001848] px-1.5 py-0.5 rounded">
                      You are here
                    </span>
                  )}
                </div>
                <span className="font-label-caps text-xs text-[#737685] shrink-0">
                  {stop.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#faf8ff] border-t border-[#c3c6d6] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#003d9b] text-[#ffffff] font-label-caps text-xs rounded hover:bg-[#0040a2] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
