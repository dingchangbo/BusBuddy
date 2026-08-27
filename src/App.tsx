import { useState, useEffect, useCallback } from 'react';
import {
  TransitStop,
  RouteArrivalData,
} from './types';
import { TRANSIT_STOPS } from './data/transitData';
import { TopAppBar } from './components/TopAppBar';
import { SearchScreen } from './components/SearchScreen';
import { StopArrivalScreen } from './components/StopArrivalScreen';
import { ScheduleModal } from './components/ScheduleModal';
import { DirectionsModal } from './components/DirectionsModal';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';
import { checkLtaStatus } from './services/ltaService';

export default function App() {
  const [currentView, setCurrentView] = useState<'search' | 'arrival'>('search');
  const [selectedStop, setSelectedStop] = useState<TransitStop>(TRANSIT_STOPS[0]); // Opp Parkway Parade (83139)
  const [savedStopIds, setSavedStopIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('transitflow_saved_stops');
      return saved ? JSON.parse(saved) : ['83139', '01012'];
    } catch {
      return ['83139', '01012'];
    }
  });

  const [activeScheduleRoute, setActiveScheduleRoute] = useState<RouteArrivalData | null>(null);
  const [directionsStopName, setDirectionsStopName] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Live LTA data state
  const [isApiConfigured, setIsApiConfigured] = useState(false);

  // Initial load of LTA metadata and status
  const loadLtaData = useCallback(async () => {
    const status = await checkLtaStatus();
    setIsApiConfigured(status.configured);
  }, []);

  useEffect(() => {
    loadLtaData();
  }, [loadLtaData]);

  // Sync saved stops to local storage
  useEffect(() => {
    try {
      localStorage.setItem('transitflow_saved_stops', JSON.stringify(savedStopIds));
    } catch (e) {
      console.error('Failed to persist saved stops', e);
    }
  }, [savedStopIds]);

  const handleSelectStop = (stop: TransitStop) => {
    setSelectedStop(stop);
    setCurrentView('arrival');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaveStop = (stopId: string) => {
    setSavedStopIds((prev) =>
      prev.includes(stopId) ? prev.filter((id) => id !== stopId) : [...prev, stopId]
    );
  };

  const handleOpenScheduleByRouteNumber = (routeNumber: string) => {
    for (const stop of TRANSIT_STOPS) {
      const match = stop.routeArrivals.find((r) => r.routeNumber === routeNumber);
      if (match) {
        setActiveScheduleRoute(match);
        return;
      }
    }
  };

  return (
    <div className="bg-[#faf8ff] text-[#191b23] min-h-screen flex flex-col font-sans selection:bg-[#c4d2ff] selection:text-[#001848]">
      {/* Top Header */}
      <TopAppBar
        onHomeClick={() => setCurrentView('search')}
        onSearchClick={() => setCurrentView('search')}
        showSearchButton={currentView === 'arrival'}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
      />

      {/* Screen View Toggle Switcher */}
      <div className="bg-[#ededf8] border-b border-[#c3c6d6] px-4 md:px-8 py-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-label-caps text-xs text-[#515f74] hidden sm:inline">Screen View:</span>
          <div className="inline-flex rounded-lg bg-[#ffffff] p-0.5 border border-[#c3c6d6] shadow-xs">
            <button
              id="tab-view-search"
              onClick={() => setCurrentView('search')}
              className={`px-3 py-1 text-xs font-label-caps rounded-md transition-all cursor-pointer ${
                currentView === 'search'
                  ? 'bg-[#003d9b] text-[#ffffff] font-bold shadow-xs'
                  : 'text-[#434654] hover:text-[#003d9b]'
              }`}
            >
              Stop Search
            </button>
            <button
              id="tab-view-arrival"
              onClick={() => {
                if (!selectedStop) setSelectedStop(TRANSIT_STOPS[0]);
                setCurrentView('arrival');
              }}
              className={`px-3 py-1 text-xs font-label-caps rounded-md transition-all cursor-pointer ${
                currentView === 'arrival'
                  ? 'bg-[#003d9b] text-[#ffffff] font-bold shadow-xs'
                  : 'text-[#434654] hover:text-[#003d9b]'
              }`}
            >
              Live Arrivals ({selectedStop ? selectedStop.id : '83139'})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-label-caps text-[#515f74]">
            <span
              className={`w-2 h-2 rounded-full ${
                isApiConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-[#003d9b] animate-ping'
              }`}
            />
            <span className="hidden md:inline">
              Singapore LTA Transit Grid {isApiConfigured ? '(DataMall Synced)' : '(Live v3 Ready)'}
            </span>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-grow flex flex-col">
        {currentView === 'search' ? (
          <SearchScreen
            onSelectStop={handleSelectStop}
            onOpenSchedule={handleOpenScheduleByRouteNumber}
            onOpenDirections={(stopName) => setDirectionsStopName(stopName)}
            savedStopIds={savedStopIds}
          />
        ) : (
          <StopArrivalScreen
            stop={selectedStop}
            onBackToSearch={() => setCurrentView('search')}
            onToggleSaveStop={handleToggleSaveStop}
            isSaved={savedStopIds.includes(selectedStop.id)}
            onOpenSchedule={(route) => setActiveScheduleRoute(route)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {activeScheduleRoute && (
        <ScheduleModal
          route={activeScheduleRoute}
          onClose={() => setActiveScheduleRoute(null)}
        />
      )}

      {directionsStopName && (
        <DirectionsModal
          destinationStopName={directionsStopName}
          onClose={() => setDirectionsStopName(null)}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />
      )}
    </div>
  );
}
