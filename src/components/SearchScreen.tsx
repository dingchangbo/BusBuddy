import React, { useState, useMemo } from 'react';
import { TransitStop } from '../types';
import { TRANSIT_STOPS, POPULAR_ROUTES, MAP_IMAGE_URL } from '../data/transitData';

interface SearchScreenProps {
  onSelectStop: (stop: TransitStop) => void;
  onOpenSchedule: (routeNumber: string) => void;
  onOpenDirections: (stopName: string) => void;
  savedStopIds: string[];
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onSelectStop,
  onOpenDirections,
  savedStopIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapStopId, setSelectedMapStopId] = useState<string>('83139'); // Marine Parade (83139)
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string | null>(null);

  // Filter stops based on search query or selected route filter
  const filteredStops = useMemo(() => {
    let result = TRANSIT_STOPS;
    if (selectedRouteFilter) {
      result = result.filter((stop) => stop.routes.includes(selectedRouteFilter));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (stop) =>
          stop.name.toLowerCase().includes(q) ||
          stop.intersection.toLowerCase().includes(q) ||
          stop.id.toLowerCase().includes(q) ||
          (stop.roadName && stop.roadName.toLowerCase().includes(q)) ||
          stop.routes.some((r) => r.toLowerCase().includes(q))
      );
    }
    return result;
  }, [searchQuery, selectedRouteFilter]);

  const activeMapStop = useMemo(() => {
    return TRANSIT_STOPS.find((s) => s.id === selectedMapStopId) || TRANSIT_STOPS[0];
  }, [selectedMapStopId]);

  const savedStops = useMemo(() => {
    return TRANSIT_STOPS.filter((s) => savedStopIds.includes(s.id));
  }, [savedStopIds]);

  const handleStopClick = (stop: TransitStop) => {
    onSelectStop(stop);
  };

  const handleMapPinClick = (stopId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMapStopId(stopId);
  };

  // If user entered a 5-digit numeric stop code directly
  const isCustomStopCode = /^\d{5}$/.test(searchQuery.trim());
  const existingStopForCode = TRANSIT_STOPS.find((s) => s.id === searchQuery.trim());

  const handleQueryCustomStop = () => {
    const code = searchQuery.trim();
    if (existingStopForCode) {
      onSelectStop(existingStopForCode);
      return;
    }
    // Create dynamically for any Singapore stop code
    const dynamicStop: TransitStop = {
      id: code,
      name: `Bus Stop ${code}`,
      intersection: `Bus Stop Code ${code}, Singapore`,
      roadName: 'Singapore Transit Network',
      distance: 'Live Stop',
      routes: ['15', '36', '196'],
      coordinates: { x: 50, y: 50 },
      routeArrivals: [
        {
          routeNumber: '15',
          routeName: `Service 15 (Stop #${code})`,
          via: 'LTA DataMall Stream',
          operator: 'GAS',
          arrivals: [
            {
              id: `arr-${code}-1`,
              minutes: 3,
              occupancy: 'seats_available',
              isAccessible: true,
              busType: 'DD',
              isLive: true,
            },
          ],
        },
      ],
    };
    onSelectStop(dynamicStop);
  };

  return (
    <div className="flex-grow flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
      {/* Hero Search Section */}
      <section id="hero-search-section" className="flex flex-col gap-2 pt-2 md:pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-[#003d9b] font-bold tracking-tight">
              Singapore Live Bus Arrivals
            </h1>
            <p className="font-body-lg text-body-lg text-[#434654] text-sm md:text-base">
              Enter 5-digit bus stop number (e.g. <strong>83139</strong>, <strong>01012</strong>, <strong>09048</strong>), road name, or bus service.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full mt-3">
          <span
            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#434654] pointer-events-none"
            aria-hidden="true"
          >
            search
          </span>
          <input
            id="input-stop-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stop number (e.g. 83139), Marine Parade, Orchard, Bugis, Service 15..."
            className="w-full h-14 pl-12 pr-12 bg-[#ffffff] border-2 border-[#c3c6d6] focus:border-[#003d9b] rounded-2xl font-body-lg text-body-lg text-[#191b23] placeholder:text-[#737685] outline-none transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              id="btn-clear-search"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#737685] hover:text-[#191b23] rounded-full cursor-pointer"
              aria-label="Clear search query"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}

          {/* Autocomplete suggestions dropdown when typing */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#ffffff] border border-[#c3c6d6] rounded-2xl shadow-xl z-30 max-h-80 overflow-y-auto divide-y divide-[#ededf8]">
              {/* If user typed a 5-digit number not found in local presets */}
              {isCustomStopCode && !existingStopForCode && (
                <div
                  onClick={handleQueryCustomStop}
                  className="p-3.5 bg-[#f3f3fd] hover:bg-[#dae2ff] cursor-pointer flex items-center justify-between text-[#003d9b] font-medium transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#003d9b]">travel_explore</span>
                    <span>Query Live Bus Stop <strong>#{searchQuery.trim()}</strong> on LTA DataMall v3</span>
                  </div>
                  <span className="font-label-caps text-xs bg-[#003d9b] text-[#ffffff] px-2.5 py-1 rounded-lg font-bold">
                    Query Stop #{searchQuery.trim()}
                  </span>
                </div>
              )}

              {filteredStops.length > 0 ? (
                <ul className="py-1">
                  {filteredStops.map((stop) => (
                    <li
                      key={stop.id}
                      onClick={() => handleStopClick(stop)}
                      className="px-4 py-3.5 hover:bg-[#f3f3fd] cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-2.5 transition-colors border-b border-[#f3f3fd] last:border-b-0"
                    >
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-label-caps text-xs bg-[#003d9b] text-[#ffffff] px-2.5 py-0.5 rounded-lg font-bold">
                            STOP #{stop.id}
                          </span>
                          <p className="font-body-md font-bold text-[#191b23] text-sm">{stop.name}</p>
                        </div>
                        <p className="font-label-caps text-[#434654] text-xs mt-1">
                          {stop.roadName ? `${stop.roadName} • ` : ''}{stop.intersection}
                        </p>
                      </div>

                      {/* Display ALL bus services under this stop */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-label-caps text-[#515f74] font-semibold mr-1">
                          Services ({stop.routes.length}):
                        </span>
                        {stop.routes.map((r) => (
                          <span
                            key={r}
                            className="bg-[#ededf8] text-[#003d9b] font-label-caps text-xs font-bold px-2 py-0.5 rounded-md border border-[#c3c6d6]"
                          >
                            {r}
                          </span>
                        ))}
                        <span className="material-symbols-outlined text-[#737685] ml-1">arrow_forward</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                !isCustomStopCode && (
                  <div className="p-5 text-center text-[#737685] font-body-md">
                    No predefined transit stops found matching &quot;{searchQuery}&quot;.
                    <p className="text-xs text-[#515f74] mt-1">
                      Tip: Type any 5-digit bus stop number (e.g. 83139) to fetch live LTA arrivals.
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Main Grid: Left Column (Recent & Popular) + Right Column (Map) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow mt-1">
        {/* Left Column: Recent & Suggestions (5 cols on md/lg for full service badge space) */}
        <div className="md:col-span-5 flex flex-col gap-5">
          {/* Saved Stops Card */}
          {savedStops.length > 0 && (
            <div
              id="card-saved-stops"
              className="bg-[#ffffff] border border-[#c3c6d6] rounded-2xl p-4 shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-label-caps text-xs text-[#003d9b] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-500 font-variation-settings-fill">
                    star
                  </span>
                  SAVED BUS STOPS
                </h2>
                <span className="font-label-caps text-xs text-[#737685]">
                  {savedStops.length} saved
                </span>
              </div>
              <ul className="flex flex-col gap-3">
                {savedStops.map((stop) => (
                  <li
                    key={stop.id}
                    onClick={() => handleStopClick(stop)}
                    className="p-3 bg-[#faf8ff] hover:bg-[#f3f3fd] rounded-xl cursor-pointer group transition-colors border border-[#ededf8] hover:border-[#dae2ff] flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-label-caps text-xs bg-[#003d9b] text-[#ffffff] px-2.5 py-0.5 rounded-lg font-bold">
                          STOP #{stop.id}
                        </span>
                        <p className="font-body-md text-[#191b23] font-bold text-sm truncate">{stop.name}</p>
                      </div>
                      <span className="material-symbols-outlined text-[#737685] group-hover:text-[#003d9b] transition-colors text-[18px]">
                        arrow_forward
                      </span>
                    </div>

                    <p className="font-label-caps text-[#434654] text-[11px] truncate">
                      {stop.roadName || stop.intersection}
                    </p>

                    {/* Display all bus services under this stop */}
                    <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-[#ededf8]">
                      <span className="text-[10px] font-label-caps text-[#737685] font-semibold mr-1">
                        All Bus Services:
                      </span>
                      {stop.routes.map((r) => (
                        <span
                          key={r}
                          className="bg-[#ffffff] text-[#003d9b] font-label-caps text-[11px] font-bold px-1.5 py-0.5 rounded border border-[#c3c6d6]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Singapore Bus Stops with All Services */}
          <div
            id="card-recent-searches"
            className="bg-[#ffffff] border border-[#c3c6d6] rounded-2xl p-4 shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-label-caps text-xs text-[#515f74] font-bold tracking-wider">
                POPULAR SINGAPORE BUS STOPS
              </h2>
              <span className="text-xs text-[#737685] font-label-caps">
                {TRANSIT_STOPS.length} Hubs
              </span>
            </div>

            <ul className="flex flex-col gap-3">
              {TRANSIT_STOPS.slice(0, 5).map((stop) => (
                <li
                  key={stop.id}
                  onClick={() => handleStopClick(stop)}
                  className="p-3 bg-[#faf8ff] hover:bg-[#f3f3fd] rounded-xl cursor-pointer group transition-colors border border-[#ededf8] hover:border-[#dae2ff] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-xs bg-[#003d9b] text-[#ffffff] px-2.5 py-0.5 rounded-lg font-bold">
                        STOP #{stop.id}
                      </span>
                      <p className="font-body-md text-sm text-[#191b23] font-bold group-hover:text-[#003d9b] transition-colors truncate">
                        {stop.name}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#737685] group-hover:text-[#003d9b] transition-colors text-[18px]">
                      arrow_forward
                    </span>
                  </div>

                  <p className="font-label-caps text-xs text-[#737685] truncate">
                    {stop.roadName || stop.intersection}
                  </p>

                  {/* Display all bus services under this stop */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1.5 border-t border-[#ededf8]">
                    <span className="text-[10px] font-label-caps text-[#515f74] font-semibold">
                      Bus Services ({stop.routes.length}):
                    </span>
                    {stop.routes.map((r) => (
                      <span
                        key={r}
                        className="bg-[#ffffff] text-[#003d9b] font-label-caps text-xs font-bold px-1.5 py-0.5 rounded border border-[#c3c6d6] shadow-2xs"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Bus Services Quick Filter */}
          <div
            id="card-popular-routes"
            className="bg-[#ffffff] border border-[#c3c6d6] rounded-2xl p-4 shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-label-caps text-xs text-[#515f74] font-bold tracking-wider">
                FEATURED BUS SERVICES
              </h2>
              {selectedRouteFilter && (
                <button
                  onClick={() => setSelectedRouteFilter(null)}
                  className="font-label-caps text-xs text-[#003d9b] hover:underline cursor-pointer font-bold"
                >
                  Clear Filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_ROUTES.map((route) => {
                const isSelected = selectedRouteFilter === route.routeNumber;
                return (
                  <button
                    key={route.routeNumber}
                    id={`btn-route-${route.routeNumber}`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedRouteFilter(null);
                      } else {
                        setSelectedRouteFilter(route.routeNumber);
                        const stop = TRANSIT_STOPS.find((s) => s.routes.includes(route.routeNumber));
                        if (stop) setSelectedMapStopId(stop.id);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl font-label-caps text-xs font-bold transition-all cursor-pointer select-none active:scale-95 flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#001848] text-[#ffffff] ring-2 ring-[#0052cc] shadow-xs'
                        : 'bg-[#003d9b] text-[#ffffff] hover:bg-[#0052cc]'
                    }`}
                    title={route.label}
                  >
                    <span>Bus</span>
                    <span>{route.routeNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Map / Nearby (7 cols) */}
        <div
          id="container-transit-map"
          className="md:col-span-7 flex flex-col h-full min-h-[480px] border border-[#c3c6d6] rounded-2xl overflow-hidden relative group bg-[#ededf8] shadow-xs select-none"
        >
          {/* Map Base Image */}
          <img
            src={MAP_IMAGE_URL}
            alt="TransitFlow Urban City Digital Map Interface"
            className="w-full h-full object-cover absolute inset-0"
          />

          {/* Interactive Stop Pins Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-auto">
            {TRANSIT_STOPS.map((stop) => {
              const isSelected = stop.id === selectedMapStopId;
              return (
                <div
                  key={stop.id}
                  style={{ left: `${stop.coordinates.x}%`, top: `${stop.coordinates.y}%` }}
                  onClick={(e) => handleMapPinClick(stop.id, e)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-transform duration-200 hover:scale-125"
                  title={`${stop.name} (Stop #${stop.id}) - Services: ${stop.routes.join(', ')}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-[#ffffff] shadow-lg transition-all ${
                      isSelected
                        ? 'bg-[#001848] ring-4 ring-[#0052cc]/50 scale-110'
                        : 'bg-[#003d9b] hover:bg-[#0052cc]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[#ffffff] text-[18px]">
                      directions_bus
                    </span>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[#ffffff]/95 backdrop-blur-sm border border-[#c3c6d6] px-2 py-0.5 rounded shadow-sm whitespace-nowrap text-[11px] font-label-caps text-[#191b23] pointer-events-none hidden md:block font-bold">
                    Stop #{stop.id}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Map Callout Popup with Stop Number and All Bus Services */}
          {activeMapStop && (
            <div
              id="map-callout-popup"
              className="absolute top-4 right-4 md:right-6 z-30 w-72 md:w-84 bg-[#ffffff]/95 backdrop-blur-md border border-[#c3c6d6] rounded-2xl p-4 shadow-xl transition-all animate-fadeIn"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-label-caps text-xs bg-[#003d9b] text-[#ffffff] px-2 py-0.5 rounded-md font-bold">
                      STOP #{activeMapStop.id}
                    </span>
                    {activeMapStop.roadName && (
                      <span className="font-label-caps text-[10px] text-[#515f74] bg-[#ededf8] px-1.5 py-0.5 rounded">
                        {activeMapStop.roadName}
                      </span>
                    )}
                  </div>
                  <h4 className="font-body-md font-bold text-[#191b23] text-base leading-snug">
                    {activeMapStop.name}
                  </h4>
                  <p className="font-label-caps text-[11px] text-[#737685]">
                    {activeMapStop.intersection}
                  </p>
                </div>
                <button
                  onClick={() => handleStopClick(activeMapStop)}
                  className="text-[#003d9b] hover:bg-[#f3f3fd] p-1.5 rounded-lg cursor-pointer"
                  title="View full stop arrivals"
                >
                  <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                </button>
              </div>

              {/* All Bus Services under this Stop */}
              <div className="my-3 pt-2 border-t border-[#ededf8]">
                <p className="font-label-caps text-[10px] text-[#515f74] font-bold mb-1.5">
                  ALL BUS SERVICES AT THIS STOP ({activeMapStop.routes.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeMapStop.routes.map((r) => (
                    <span
                      key={r}
                      className="bg-[#003d9b] text-[#ffffff] font-label-caps text-xs font-bold px-2 py-0.5 rounded-md shadow-2xs"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 my-2 text-xs text-[#434654]">
                {activeMapStop.routeArrivals.slice(0, 3).map((ra) => {
                  const nextArrival = ra.arrivals[0];
                  return (
                    <div key={ra.routeNumber} className="flex items-center justify-between py-1 border-b border-[#ededf8] last:border-0">
                      <div className="flex items-center gap-1.5 font-medium text-[#191b23]">
                        <span className="bg-[#ededf8] text-[#003d9b] font-label-caps px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {ra.routeNumber}
                        </span>
                        <span className="text-xs truncate max-w-[130px]">{ra.routeName}</span>
                      </div>
                      <span className="font-label-caps font-bold text-[#003d9b] text-xs">
                        {nextArrival ? (nextArrival.minutes <= 1 ? 'Arriving' : `${nextArrival.minutes}m`) : 'Active'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#ededf8]">
                <button
                  id="btn-popup-directions"
                  onClick={() => onOpenDirections(activeMapStop.name)}
                  className="px-2 py-2 bg-[#f3f3fd] hover:bg-[#e1e2ec] text-[#003d9b] font-label-caps text-xs rounded-xl border border-[#c3c6d6] transition-colors text-center cursor-pointer font-bold"
                >
                  Directions
                </button>
                <button
                  id="btn-popup-view-schedule"
                  onClick={() => handleStopClick(activeMapStop)}
                  className="px-2 py-2 bg-[#003d9b] hover:bg-[#0052cc] text-[#ffffff] font-label-caps text-xs rounded-xl transition-colors text-center cursor-pointer shadow-xs font-bold"
                >
                  Live Arrivals
                </button>
              </div>
            </div>
          )}

          {/* Quick info banner at bottom */}
          <div className="absolute bottom-4 left-4 right-4 bg-[#ffffff]/95 backdrop-blur-md border border-[#c3c6d6] rounded-xl p-3 shadow-md flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-label-caps text-xs text-[#191b23] font-bold">
                Singapore Transit Grid
              </span>
            </div>
            <span className="text-xs font-label-caps text-[#515f74]">
              {TRANSIT_STOPS.length} monitored hubs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
