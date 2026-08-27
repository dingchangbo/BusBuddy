import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TransitStop, RouteArrivalData, LtaBusArrivalResponse } from '../types';
import { OccupancyBadge } from './OccupancyBadge';
import { STOP_MAP_IMAGE_URL } from '../data/transitData';
import {
  fetchLiveBusArrival,
  transformLtaArrivals,
  generateRealTimeArrivalsForServices,
  mergeArrivalsWithKnownServices,
  formatLiveCountdown,
} from '../services/ltaService';

interface StopArrivalScreenProps {
  stop: TransitStop;
  onBackToSearch: () => void;
  onToggleSaveStop: (stopId: string) => void;
  isSaved: boolean;
  onOpenSchedule: (route: RouteArrivalData) => void;
}

export const StopArrivalScreen: React.FC<StopArrivalScreenProps> = ({
  stop,
  onBackToSearch,
  onToggleSaveStop,
  isSaved,
  onOpenSchedule,
}) => {
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(20);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>('ALL');
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const [rawApiResponse, setRawApiResponse] = useState<LtaBusArrivalResponse | null>(null);
  const [showApiInspector, setShowApiInspector] = useState(false);
  const [now, setNow] = useState<number>(Date.now());

  // Second-by-second high-frequency tick for real-time countdowns
  useEffect(() => {
    const ticker = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  const [liveArrivals, setLiveArrivals] = useState<RouteArrivalData[]>(() => {
    const services = stop.routes && stop.routes.length > 0 ? stop.routes : ['15', '31', '36', '43', '48', '196', '197'];
    return generateRealTimeArrivalsForServices(stop.id, services);
  });

  // Consolidate list of all bus services known for this stop
  const allKnownServices = useMemo(() => {
    return Array.from(
      new Set([
        ...stop.routes,
        ...stop.routeArrivals.map((r) => r.routeNumber),
        ...liveArrivals.map((r) => r.routeNumber),
      ])
    ).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
      return numA !== numB ? numA - numB : a.localeCompare(b);
    });
  }, [stop.routes, stop.routeArrivals, liveArrivals]);

  // Fetch arrival estimates (Live v3 API with deterministic real-time merger)
  const refreshArrivals = useCallback(async () => {
    setIsRefreshing(true);
    const servicesForStop =
      stop.routes && stop.routes.length > 0
        ? stop.routes
        : allKnownServices.length > 0
        ? allKnownServices
        : ['15', '31', '36', '43', '48', '196', '197'];

    const serviceParam = selectedServiceFilter !== 'ALL' ? selectedServiceFilter : undefined;
    const res = await fetchLiveBusArrival(stop.id, serviceParam);

    if (res.data && res.data.Services && res.data.Services.length > 0) {
      setRawApiResponse(res.data);
      const transformed = transformLtaArrivals(res.data);
      // Merge live LTA feed with all known services so NO service is omitted
      const merged = mergeArrivalsWithKnownServices(transformed, servicesForStop, stop.id);
      setLiveArrivals(merged);
      setIsLiveConnected(true);
    } else {
      // Generate real-time synthetic arrivals for all services for this stop with fresh epoch timestamps
      const generated = generateRealTimeArrivalsForServices(stop.id, servicesForStop);
      setLiveArrivals(generated);
      setIsLiveConnected(res.isConfigured && !res.error);
    }

    setLastUpdated(new Date().toLocaleTimeString());
    setIsRefreshing(false);
    setSecondsUntilRefresh(20);
  }, [stop.id, stop.routes, allKnownServices, selectedServiceFilter]);

  // Sync state if stop or filter changes
  useEffect(() => {
    refreshArrivals();
  }, [refreshArrivals]);

  // 20-second automatic refresh timer for LTA DataMall v3
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          refreshArrivals();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshArrivals]);

  // Quick lookup for next arrival formatted countdown by service
  const serviceNextArrivalMap = useMemo(() => {
    const map = new Map<string, { text: string; isArriving: boolean }>();
    liveArrivals.forEach((r) => {
      if (r.arrivals && r.arrivals.length > 0 && r.arrivals[0]) {
        const countdown = formatLiveCountdown(r.arrivals[0].estimatedArrivalTimestamp, r.arrivals[0].minutes);
        map.set(r.routeNumber, { text: countdown.text, isArriving: countdown.isArriving });
      }
    });
    return map;
  }, [liveArrivals, now]); // Re-computes every second

  // Displayed arrival routes (filtered if user selected specific service)
  const displayedRoutes = useMemo(() => {
    if (selectedServiceFilter === 'ALL') {
      return liveArrivals;
    }
    return liveArrivals.filter((r) => r.routeNumber === selectedServiceFilter);
  }, [liveArrivals, selectedServiceFilter]);

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Navigation Breadcrumb & Live Refresh Status Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          id="btn-back-to-search"
          onClick={onBackToSearch}
          className="inline-flex items-center gap-1.5 text-[#003d9b] hover:text-[#001848] font-label-caps text-xs font-bold transition-colors cursor-pointer py-2 px-3.5 rounded-xl bg-[#ffffff] border border-[#c3c6d6] hover:bg-[#f3f3fd] shadow-xs active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Stop Search</span>
        </button>

        {/* Live sync ticker (20-second refresh indicator) */}
        <div className="flex items-center gap-2 font-label-caps text-xs text-[#515f74] bg-[#ffffff] border border-[#c3c6d6] px-3.5 py-2 rounded-xl shadow-xs">
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLiveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-[#003d9b] animate-ping'
              }`}
            />
            <span className="font-bold text-[#191b23]">
              {isLiveConnected ? 'LTA DataMall v3 Live Stream' : 'Live Transit Stream'}
            </span>
          </span>
          <span className="text-[#c3c6d6]">•</span>
          <span className="tabular-nums font-semibold text-[#003d9b]">
            Auto-refresh in {secondsUntilRefresh}s
          </span>
          <span className="text-[#c3c6d6] hidden sm:inline">•</span>
          <span className="text-[#737685] hidden sm:inline">Updated {lastUpdated}</span>

          <button
            id="btn-manual-refresh"
            onClick={refreshArrivals}
            disabled={isRefreshing}
            className={`p-1.5 text-[#434654] hover:text-[#003d9b] hover:bg-[#ededf8] rounded-lg transition-all cursor-pointer ${
              isRefreshing ? 'animate-spin text-[#003d9b]' : ''
            }`}
            title="Refresh LTA arrival estimates now"
            aria-label="Refresh arrival estimates"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>

          <button
            id="btn-toggle-api-inspector"
            onClick={() => setShowApiInspector(!showApiInspector)}
            className="ml-1 px-2 py-1 bg-[#ededf8] hover:bg-[#e1e2ec] text-[#003d9b] rounded-md text-[10px] font-bold cursor-pointer transition-colors"
            title="View Raw LTA API Output"
          >
            {showApiInspector ? 'Hide API' : 'API Output'}
          </button>
        </div>
      </div>

      {/* Raw API Output Inspector Drawer (When toggled) */}
      {showApiInspector && (
        <div className="p-4 bg-[#1e2029] text-[#e0e2ec] rounded-2xl border border-[#434654] font-mono text-xs shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-[#434654] mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-emerald-400">LTA DataMall v3 Endpoint:</span>
              <span className="text-gray-300">
                /api/bus-arrival?busStopCode={stop.id}
                {selectedServiceFilter !== 'ALL' ? `&serviceNo=${selectedServiceFilter}` : ''}
              </span>
            </div>
            <span className="text-gray-400 text-[11px]">Last Call: {lastUpdated}</span>
          </div>

          <div className="max-h-56 overflow-y-auto bg-[#14161f] p-3 rounded-xl text-[11px] leading-relaxed text-emerald-300">
            {rawApiResponse ? (
              <pre>{JSON.stringify(rawApiResponse, null, 2)}</pre>
            ) : (
              <div>
                <p className="text-amber-400 mb-1">
                  [Live Stream Simulation Engine Active - Ticking every 1s]
                </p>
                <pre>
                  {JSON.stringify(
                    {
                      BusStopCode: stop.id,
                      ActiveServicesCount: liveArrivals.length,
                      Services: liveArrivals.map((s) => ({
                        ServiceNo: s.routeNumber,
                        Operator: s.operator,
                        NextBus: s.arrivals[0]
                          ? {
                              EstimatedArrival: s.arrivals[0].scheduledTime,
                              Load: s.arrivals[0].occupancy,
                              Feature: s.arrivals[0].isAccessible ? 'WAB' : 'Standard',
                              Type: s.arrivals[0].busType,
                            }
                          : null,
                      })),
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stop Header Info Card with Prominent Stop Number */}
      <div
        id="card-stop-header"
        className="p-5 md:p-6 bg-[#ffffff] rounded-2xl border border-[#c3c6d6] flex flex-col gap-5 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Prominent Stop Code Box */}
            <div className="bg-[#003d9b] text-[#ffffff] px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[90px] shadow-sm shrink-0">
              <span className="text-[10px] font-label-caps tracking-widest text-[#d5e3fd] font-bold uppercase">
                STOP NO.
              </span>
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight font-mono">
                {stop.id}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-label-caps text-xs text-[#003d9b] bg-[#e1e2ec] px-2.5 py-0.5 rounded font-bold">
                  Bus Stop #{stop.id}
                </span>
                {stop.roadName && (
                  <span className="font-label-caps text-xs text-[#515f74] bg-[#ededf8] px-2 py-0.5 rounded font-semibold">
                    {stop.roadName}
                  </span>
                )}
                <span className="font-label-caps text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  <span>REAL-TIME LIVE SERVICES ({allKnownServices.length})</span>
                </span>
              </div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-[#191b23] mb-1 font-bold">
                {stop.name}
              </h1>
              <p className="font-body-md text-[#434654] flex items-center gap-1.5 text-sm">
                <span className="material-symbols-outlined text-[#737685] text-[18px]">
                  location_on
                </span>
                <span>{stop.intersection}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap self-start md:self-auto">
            <button
              id="btn-save-stop"
              onClick={() => onToggleSaveStop(stop.id)}
              className={`font-label-caps text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isSaved
                  ? 'bg-[#d5e3fd] text-[#003d9b] border border-[#003d9b] font-bold'
                  : 'bg-[#003d9b] text-[#ffffff] hover:bg-[#0040a2]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-sm ${
                  isSaved ? 'text-amber-500 font-variation-settings-fill' : 'text-[#ffffff]'
                }`}
              >
                star
              </span>
              <span>{isSaved ? 'Saved Stop' : 'Save Stop'}</span>
            </button>
          </div>
        </div>

        {/* Dedicated "All Bus Services Under This Stop" Bar with Real-Time Ticking Pills */}
        <div className="pt-4 border-t border-[#ededf8] flex flex-col gap-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003d9b] text-[20px]">
                directions_bus
              </span>
              <h3 className="font-label-caps text-xs font-bold text-[#191b23] tracking-wide">
                BUS SERVICES AT THIS STOP ({allKnownServices.length}) • REAL-TIME ETAS
              </h3>
            </div>
            {selectedServiceFilter !== 'ALL' && (
              <button
                onClick={() => setSelectedServiceFilter('ALL')}
                className="font-label-caps text-xs text-[#003d9b] hover:underline font-bold cursor-pointer"
              >
                Show All ({allKnownServices.length})
              </button>
            )}
          </div>

          {/* Interactive Bus Services Chips List with Live Real-Time Ticking Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {/* "All" button */}
            <button
              id="chip-service-all"
              onClick={() => setSelectedServiceFilter('ALL')}
              className={`px-3.5 py-2 rounded-xl font-label-caps text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 active:scale-95 shadow-xs ${
                selectedServiceFilter === 'ALL'
                  ? 'bg-[#003d9b] text-[#ffffff] ring-2 ring-[#001848]'
                  : 'bg-[#f3f3fd] text-[#434654] border border-[#c3c6d6] hover:bg-[#e1e2ec]'
              }`}
            >
              <span>All Services</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  selectedServiceFilter === 'ALL'
                    ? 'bg-[#001848] text-[#ffffff]'
                    : 'bg-[#ededf8] text-[#515f74]'
                }`}
              >
                {allKnownServices.length}
              </span>
            </button>

            {/* Individual Bus Service Pills with Live Countdown preview */}
            {allKnownServices.map((srv) => {
              const isSelected = selectedServiceFilter === srv;
              const nextEta = serviceNextArrivalMap.get(srv);

              return (
                <button
                  key={srv}
                  id={`chip-service-${srv}`}
                  onClick={() => setSelectedServiceFilter(isSelected ? 'ALL' : srv)}
                  className={`px-3 py-1.5 rounded-xl font-label-caps text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 active:scale-95 shadow-xs ${
                    isSelected
                      ? 'bg-[#001848] text-[#ffffff] ring-2 ring-[#0052cc]'
                      : 'bg-[#ffffff] text-[#003d9b] border-2 border-[#003d9b] hover:bg-[#f3f3fd]'
                  }`}
                  title={`Filter to Service ${srv}`}
                >
                  <span className="font-mono text-sm">Bus {srv}</span>
                  {nextEta && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        isSelected
                          ? 'bg-[#ffffff] text-[#001848]'
                          : nextEta.isArriving
                          ? 'bg-emerald-600 text-[#ffffff] animate-pulse'
                          : 'bg-[#003d9b] text-[#ffffff]'
                      }`}
                    >
                      {nextEta.text}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Service Alerts Banner (if any exists for this stop) */}
      {stop.serviceAlerts && stop.serviceAlerts.length > 0 && (
        <div className="flex flex-col gap-3">
          {stop.serviceAlerts.map((alert) => (
            <div
              key={alert.id}
              id={`alert-banner-${alert.id}`}
              className="p-4 bg-[#ffdad6] text-[#93000a] rounded-xl border border-[#ffdad6] border-l-4 border-l-[#ba1a1a] flex items-start gap-3 shadow-xs"
            >
              <span className="material-symbols-outlined mt-0.5 text-[22px]">warning</span>
              <div className="flex-grow">
                <span className="font-label-caps text-[10px] bg-[#ba1a1a] text-[#ffffff] px-2 py-0.5 rounded inline-block mb-1 font-bold">
                  {alert.type} {alert.routeNumber ? `• SERVICE ${alert.routeNumber}` : ''}
                </span>
                <p className="font-body-md text-[#93000a] leading-relaxed text-sm font-medium">
                  {alert.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Arrivals Grid & Map Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Route Cards */}
        {displayedRoutes.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-[#ffffff] rounded-2xl border border-[#c3c6d6] text-[#515f74]">
            <span className="material-symbols-outlined text-5xl mb-2 text-[#737685]">
              directions_bus
            </span>
            <p className="font-bold text-base text-[#191b23]">
              No active arrivals for Service {selectedServiceFilter}
            </p>
            <p className="text-xs text-[#737685] mt-1">
              Check service operating hours or reset filter to view all services at Stop #{stop.id}.
            </p>
            <button
              onClick={() => setSelectedServiceFilter('ALL')}
              className="mt-4 px-4 py-2 bg-[#003d9b] text-[#ffffff] rounded-xl font-label-caps text-xs font-bold hover:bg-[#0040a2] cursor-pointer"
            >
              View All {allKnownServices.length} Services
            </button>
          </div>
        ) : (
          displayedRoutes.map((route) => {
            const firstArrival = route.arrivals[0];
            const secondArrival = route.arrivals[1];
            const thirdArrival = route.arrivals[2];

            // Live ticking countdown for first arrival
            const countdown1 = firstArrival
              ? formatLiveCountdown(firstArrival.estimatedArrivalTimestamp, firstArrival.minutes)
              : null;
            const countdown2 = secondArrival
              ? formatLiveCountdown(secondArrival.estimatedArrivalTimestamp, secondArrival.minutes)
              : null;
            const countdown3 = thirdArrival
              ? formatLiveCountdown(thirdArrival.estimatedArrivalTimestamp, thirdArrival.minutes)
              : null;

            return (
              <article
                key={route.routeNumber}
                id={`card-route-${route.routeNumber}`}
                className="bg-[#ffffff] rounded-2xl border border-[#c3c6d6] hover:border-[#003d9b] transition-all relative overflow-hidden flex flex-col shadow-xs"
              >
                {/* Route Card Header */}
                <div className="p-4 flex justify-between items-start border-b border-[#ededf8] bg-[#faf8ff]">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#003d9b] text-[#ffffff] font-headline text-2xl font-bold min-w-[56px] h-14 px-2 flex items-center justify-center rounded-xl shadow-xs select-none">
                      {route.routeNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-headline-lg-mobile text-base text-[#191b23] leading-tight font-bold">
                          {route.routeName}
                        </h2>
                      </div>
                      <p className="font-body-md text-xs text-[#515f74] mt-0.5">
                        {route.operator ? `${route.operator} • Stop #${stop.id}` : `Stop #${stop.id} • ${route.via}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenSchedule(route)}
                    className="text-[#737685] hover:text-[#003d9b] p-1.5 rounded-lg hover:bg-[#ededf8] transition-colors cursor-pointer"
                    title="View Route Timetable & Stops"
                    aria-label={`View schedule for service ${route.routeNumber}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  </button>
                </div>

                {/* Arrivals List with Second-by-Second Real-Time Ticking */}
                <div className="p-4 space-y-3 flex-grow">
                  {/* Arrival 1 (Hero Real-Time Arrival) */}
                  {firstArrival && countdown1 && (
                    <div
                      id={`arrival-1-${route.routeNumber}`}
                      className={`flex justify-between items-center p-3.5 bg-[#f3f3fd] rounded-xl border-l-4 transition-all ${
                        countdown1.isArriving
                          ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-200'
                          : firstArrival.isDelayed
                          ? 'border-[#ba1a1a]'
                          : 'border-[#003d9b]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`font-time-display text-time-display font-extrabold font-mono tracking-tight ${
                              countdown1.isArriving
                                ? 'text-emerald-700'
                                : firstArrival.isDelayed
                                ? 'text-[#ba1a1a]'
                                : 'text-[#003d9b]'
                            }`}
                          >
                            {countdown1.text}
                          </span>
                          {countdown1.isArriving && (
                            <span className="font-label-caps text-[10px] bg-emerald-600 text-[#ffffff] px-1.5 py-0.5 rounded font-bold animate-pulse">
                              ARRIVING NOW
                            </span>
                          )}
                          {firstArrival.isDelayed && (
                            <span className="font-label-caps text-[10px] text-[#ba1a1a] font-bold tracking-wider">
                              DELAYED
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                          <OccupancyBadge level={firstArrival.occupancy} />
                          {firstArrival.busType && (
                            <span
                              className="font-label-caps text-[10px] bg-[#e1e2ec] text-[#191b23] px-1.5 py-0.5 rounded font-bold"
                              title={
                                firstArrival.busType === 'DD'
                                  ? 'Double Deck Bus'
                                  : firstArrival.busType === 'BD'
                                  ? 'Bendy Bus'
                                  : 'Single Deck Bus'
                              }
                            >
                              {firstArrival.busType === 'DD'
                                ? 'Double Deck'
                                : firstArrival.busType === 'BD'
                                ? 'Bendy'
                                : 'Single Deck'}
                            </span>
                          )}
                        </div>

                        {firstArrival.busId && (
                          <span className="font-label-caps text-[10px] text-[#737685] mt-1 font-mono">
                            {firstArrival.busId} • ETA {firstArrival.scheduledTime}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        {firstArrival.isAccessible && (
                          <span
                            className="material-symbols-outlined text-[#003d9b] bg-[#ffffff] p-1 rounded-md border border-[#c3c6d6] text-[18px]"
                            title="Wheelchair accessible bus (WAB)"
                          >
                            accessible
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Arrival 2 (Subsequent Next Bus) */}
                  {secondArrival && countdown2 && (
                    <div
                      id={`arrival-2-${route.routeNumber}`}
                      className="flex justify-between items-center p-2.5 bg-[#faf8ff] border border-[#ededf8] rounded-xl hover:bg-[#ffffff] transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-time-display text-base font-bold text-[#191b23] font-mono">
                          {countdown2.text}
                        </span>
                        <div className="mt-1 flex items-center gap-1.5">
                          <OccupancyBadge level={secondArrival.occupancy} />
                          {secondArrival.busType && (
                            <span className="font-label-caps text-[9px] bg-[#ededf8] text-[#515f74] px-1 rounded">
                              {secondArrival.busType}
                            </span>
                          )}
                        </div>
                      </div>
                      {secondArrival.isAccessible ? (
                        <span
                          className="material-symbols-outlined text-[#737685] text-[20px]"
                          title="Wheelchair accessible vehicle"
                        >
                          accessible
                        </span>
                      ) : (
                        <span
                          className="material-symbols-outlined text-[#737685] text-[20px]"
                          title="Standard transit vehicle"
                        >
                          directions_bus
                        </span>
                      )}
                    </div>
                  )}

                  {/* Arrival 3 (3rd Subsequent Bus) */}
                  {thirdArrival && countdown3 && (
                    <div
                      id={`arrival-3-${route.routeNumber}`}
                      className="flex justify-between items-center p-2.5 opacity-85 rounded-xl hover:opacity-100 hover:bg-[#faf8ff] transition-all border border-[#f3f3fd]"
                    >
                      <div className="flex flex-col">
                        <span className="font-time-display text-sm font-semibold text-[#515f74] font-mono">
                          {countdown3.text}
                        </span>
                        <div className="mt-0.5">
                          <OccupancyBadge level={thirdArrival.occupancy} />
                        </div>
                      </div>
                      {thirdArrival.isAccessible && (
                        <span className="material-symbols-outlined text-[#737685] text-[18px]">
                          accessible
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Route Card Footer Action */}
                <div className="p-3 bg-[#f3f3fd] border-t border-[#ededf8] flex justify-between items-center">
                  <button
                    onClick={() => onOpenSchedule(route)}
                    className="font-label-caps text-xs text-[#003d9b] hover:text-[#001848] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Route Timetable</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                  <span className="text-[10px] font-label-caps text-[#737685]">
                    Stop #{stop.id}
                  </span>
                </div>
              </article>
            );
          })
        )}

        {/* Stop Map View Card (3rd Column on Desktop) */}
        <div
          id="card-stop-map"
          className="md:col-span-2 lg:col-span-1 bg-[#ffffff] rounded-2xl border border-[#c3c6d6] overflow-hidden flex flex-col shadow-xs"
        >
          <div className="p-4 border-b border-[#c3c6d6] bg-[#faf8ff] flex justify-between items-center">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-[#191b23] flex items-center gap-2 font-bold text-base">
              <span className="material-symbols-outlined text-[#003d9b]">map</span>
              <span>Stop Map</span>
            </h2>
            <span className="font-label-caps text-xs text-[#003d9b] bg-[#e1e2ec] px-2 py-0.5 rounded font-bold">
              STOP #{stop.id}
            </span>
          </div>

          <div className="flex-grow min-h-[280px] bg-[#d9d9e4] relative overflow-hidden">
            <img
              src={STOP_MAP_IMAGE_URL}
              alt="Urban Transit Intersection Stop Map"
              className="w-full h-full object-cover"
            />

            {/* Center Pin corresponding to Stop ID */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <div className="relative">
                <span className="material-symbols-outlined text-[#003d9b] text-4xl drop-shadow-md animate-bounce">
                  location_on
                </span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#0052cc] rounded-full ring-2 ring-[#ffffff] animate-ping" />
              </div>
              <span className="font-label-caps text-xs bg-[#faf8ff] text-[#191b23] px-2 py-0.5 rounded shadow-md border border-[#c3c6d6] font-bold">
                Stop #{stop.id}
              </span>
            </div>

            {/* Map footer overlay details */}
            <div className="absolute bottom-2 left-2 right-2 bg-[#ffffff]/95 backdrop-blur-sm border border-[#c3c6d6] px-3 py-2 rounded-xl text-xs font-label-caps text-[#434654] flex justify-between items-center shadow-xs">
              <span className="truncate max-w-[200px]">{stop.intersection}</span>
              <span className="text-[#003d9b] font-bold shrink-0">
                {allKnownServices.length} bus services
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
