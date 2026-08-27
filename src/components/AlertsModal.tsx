import React, { useState } from 'react';
import { ServiceAlert, LtaTrafficIncident, LtaTrainServiceAlert } from '../types';

interface AlertsModalProps {
  alerts: ServiceAlert[];
  trafficIncidents?: LtaTrafficIncident[];
  trainAlert?: LtaTrainServiceAlert | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  onClose: () => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  alerts,
  trafficIncidents = [],
  trainAlert,
  isLoading,
  onRefresh,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'mrt' | 'traffic' | 'bus'>('all');

  const hasDisruption = trainAlert && trainAlert.Status === 2;

  return (
    <div className="fixed inset-0 bg-[#191b23]/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div
        className="bg-[#ffffff] rounded-2xl border border-[#c3c6d6] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[88vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#faf8ff] border-b border-[#c3c6d6] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] text-[#ffffff] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">notifications_active</span>
            </div>
            <div>
              <h3 className="font-headline-lg-mobile text-lg font-bold text-[#191b23]">
                Singapore Transit &amp; Traffic Alerts
              </h3>
              <p className="text-xs text-[#515f74]">
                LTA Live Traffic Incidents &amp; Train Service Disruption Monitor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className={`p-2 text-[#003d9b] hover:bg-[#ededf8] rounded-lg transition-colors cursor-pointer ${
                  isLoading ? 'animate-spin opacity-60' : ''
                }`}
                title="Refresh alerts"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[#737685] hover:text-[#191b23] p-2 rounded-lg hover:bg-[#ededf8] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Train Service Status Highlight */}
        <div
          className={`p-4 border-b flex items-center justify-between gap-3 ${
            hasDisruption
              ? 'bg-[#ffdad6] border-[#ba1a1a] text-[#93000a]'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`material-symbols-outlined text-[22px] ${
                hasDisruption ? 'text-[#ba1a1a]' : 'text-emerald-700'
              }`}
            >
              {hasDisruption ? 'error' : 'check_circle'}
            </span>
            <div>
              <p className="font-label-caps text-xs font-bold uppercase">
                {hasDisruption
                  ? `MRT/LRT Service Alert • Line: ${trainAlert?.Line || 'Multiple'}`
                  : 'All MRT & LRT Lines Operating Normally'}
              </p>
              {hasDisruption && trainAlert?.FreePublicBus && (
                <p className="text-xs mt-0.5">
                  Free Public Bus: {trainAlert.FreePublicBus} • MRT Shuttle: {trainAlert.FreeMRTShuttle || 'Available'}
                </p>
              )}
            </div>
          </div>
          <span
            className={`font-label-caps text-[10px] px-2.5 py-1 rounded font-bold ${
              hasDisruption
                ? 'bg-[#ba1a1a] text-[#ffffff]'
                : 'bg-emerald-200 text-emerald-900'
            }`}
          >
            {hasDisruption ? 'DISRUPTED' : 'NORMAL SERVICE'}
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="bg-[#f3f3fd] border-b border-[#c3c6d6] px-4 py-2 flex gap-2">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'traffic', label: `Traffic (${trafficIncidents.length})` },
            { id: 'bus', label: 'Bus & Detours' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 text-xs font-label-caps rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#003d9b] text-[#ffffff] font-bold shadow-xs'
                  : 'text-[#515f74] hover:text-[#191b23] hover:bg-[#ededf8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-grow space-y-3 divide-y divide-[#ededf8]">
          {/* Traffic Incidents from LTA */}
          {(activeTab === 'all' || activeTab === 'traffic') && trafficIncidents.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-label-caps text-xs text-[#515f74] font-bold">
                LTA LIVE TRAFFIC INCIDENTS
              </h4>
              {trafficIncidents.map((incident, idx) => (
                <div
                  key={`inc-${idx}`}
                  className="p-3.5 rounded-xl border-l-4 bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-caps text-[10px] bg-[#ba1a1a] text-[#ffffff] px-2 py-0.5 rounded font-bold">
                      {incident.Type || 'INCIDENT'}
                    </span>
                    <span className="font-label-caps text-[10px] text-[#93000a]">Active Incident</span>
                  </div>
                  <p className="font-body-md text-sm leading-relaxed font-medium">{incident.Message}</p>
                </div>
              ))}
            </div>
          )}

          {/* System & Bus Alerts */}
          {(activeTab === 'all' || activeTab === 'bus') && (
            <div className="space-y-3 pt-2">
              <h4 className="font-label-caps text-xs text-[#515f74] font-bold">
                BUS &amp; NETWORK ADVISORIES
              </h4>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border-l-4 ${
                    alert.type === 'DETOUR' || alert.type === 'ACCIDENT'
                      ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]'
                      : alert.type === 'MAINTENANCE'
                      ? 'bg-[#d5e3fd] text-[#001848] border-[#003d9b]'
                      : 'bg-[#ededf8] text-[#191b23] border-[#515f74]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-label-caps text-[10px] px-2 py-0.5 rounded font-bold ${
                        alert.type === 'DETOUR' || alert.type === 'ACCIDENT'
                          ? 'bg-[#ba1a1a] text-[#ffffff]'
                          : 'bg-[#003d9b] text-[#ffffff]'
                      }`}
                    >
                      {alert.type} {alert.routeNumber ? `• SERVICE ${alert.routeNumber}` : ''}
                    </span>
                    <span className="font-label-caps text-[10px] opacity-75">
                      {alert.timestamp || 'Active Now'}
                    </span>
                  </div>
                  <p className="font-body-md text-sm leading-relaxed">{alert.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#faf8ff] border-t border-[#c3c6d6] flex justify-between items-center text-xs text-[#737685]">
          <span>Source: LTA DataMall Singapore</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#003d9b] text-[#ffffff] font-label-caps text-xs rounded-xl hover:bg-[#0040a2] transition-colors cursor-pointer font-bold"
          >
            Acknowledge All
          </button>
        </div>
      </div>
    </div>
  );
};
