import {
  LtaBusArrivalResponse,
  LtaCarParkResponse,
  LtaTrafficIncidentsResponse,
  LtaTrainAlertsResponse,
  RouteArrivalData,
  ArrivalEstimate,
  OccupancyLevel,
} from '../types';

export interface ApiStatus {
  status: string;
  configured: boolean;
  provider: string;
}

export async function checkLtaStatus(): Promise<ApiStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) {
      return { status: 'error', configured: false, provider: 'LTA DataMall' };
    }
    return await res.json();
  } catch {
    return { status: 'offline', configured: false, provider: 'LTA DataMall' };
  }
}

export async function fetchLiveBusArrival(
  busStopCode: string,
  serviceNo?: string
): Promise<{ data: LtaBusArrivalResponse | null; error: string | null; isConfigured: boolean }> {
  try {
    let url = `/api/bus-arrival?busStopCode=${encodeURIComponent(busStopCode.trim())}`;
    if (serviceNo && serviceNo.trim() !== '') {
      url += `&serviceNo=${encodeURIComponent(serviceNo.trim())}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      if (res.status === 500 && errJson.error === 'credential not configured') {
        return { data: null, error: 'credential not configured', isConfigured: false };
      }
      return {
        data: null,
        error: errJson.error || `HTTP ${res.status}: ${res.statusText}`,
        isConfigured: true,
      };
    }

    const data: LtaBusArrivalResponse = await res.json();
    return { data, error: null, isConfigured: true };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to connect to backend', isConfigured: true };
  }
}

export async function fetchLiveCarparks(): Promise<{
  data: LtaCarParkResponse | null;
  error: string | null;
  isConfigured: boolean;
}> {
  try {
    const res = await fetch('/api/carparks');
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      if (res.status === 500 && errJson.error === 'credential not configured') {
        return { data: null, error: 'credential not configured', isConfigured: false };
      }
      return {
        data: null,
        error: errJson.error || `HTTP ${res.status}: ${res.statusText}`,
        isConfigured: true,
      };
    }
    const data: LtaCarParkResponse = await res.json();
    return { data, error: null, isConfigured: true };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to connect to backend', isConfigured: true };
  }
}

export async function fetchLiveTrafficIncidents(): Promise<{
  data: LtaTrafficIncidentsResponse | null;
  error: string | null;
  isConfigured: boolean;
}> {
  try {
    const res = await fetch('/api/traffic-incidents');
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      if (res.status === 500 && errJson.error === 'credential not configured') {
        return { data: null, error: 'credential not configured', isConfigured: false };
      }
      return {
        data: null,
        error: errJson.error || `HTTP ${res.status}: ${res.statusText}`,
        isConfigured: true,
      };
    }
    const data: LtaTrafficIncidentsResponse = await res.json();
    return { data, error: null, isConfigured: true };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to connect to backend', isConfigured: true };
  }
}

export async function fetchLiveTrainAlerts(): Promise<{
  data: LtaTrainAlertsResponse | null;
  error: string | null;
  isConfigured: boolean;
}> {
  try {
    const res = await fetch('/api/train-alerts');
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      if (res.status === 500 && errJson.error === 'credential not configured') {
        return { data: null, error: 'credential not configured', isConfigured: false };
      }
      return {
        data: null,
        error: errJson.error || `HTTP ${res.status}: ${res.statusText}`,
        isConfigured: true,
      };
    }
    const data: LtaTrainAlertsResponse = await res.json();
    return { data, error: null, isConfigured: true };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to connect to backend', isConfigured: true };
  }
}

// Convert LTA Load code to app OccupancyLevel
export function parseLtaLoad(load?: string): OccupancyLevel {
  switch (load) {
    case 'SEA':
      return 'seats_available'; // Seats Available (Green)
    case 'SDA':
      return 'standing_only'; // Standing Available (Amber)
    case 'LSD':
      return 'limited_space'; // Limited Standing (Red)
    default:
      return 'seats_available';
  }
}

// Convert ISO arrival time into minutes remaining
export function calculateMinutesUntil(isoString?: string): number {
  if (!isoString) return 0;
  const arrivalTime = new Date(isoString).getTime();
  const now = Date.now();
  const diffMs = arrivalTime - now;
  const minutes = Math.round(diffMs / 60000);
  return Math.max(0, minutes);
}

// Format ISO string to local 12-hour time (e.g. "8:42 AM")
export function formatScheduledTime(isoString?: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
}

// Transform LTA BusArrival response to RouteArrivalData[]
export function transformLtaArrivals(ltaResponse: LtaBusArrivalResponse): RouteArrivalData[] {
  if (!ltaResponse || !ltaResponse.Services) return [];

  return ltaResponse.Services.map((service) => {
    const arrivals: ArrivalEstimate[] = [];

    const buses = [
      { bus: service.NextBus, key: 'nb1' },
      { bus: service.NextBus2, key: 'nb2' },
      { bus: service.NextBus3, key: 'nb3' },
    ];

    buses.forEach(({ bus, key }) => {
      if (bus && bus.EstimatedArrival) {
        const mins = calculateMinutesUntil(bus.EstimatedArrival);
        arrivals.push({
          id: `${service.ServiceNo}-${key}-${bus.EstimatedArrival}`,
          minutes: mins,
          occupancy: parseLtaLoad(bus.Load),
          isAccessible: bus.Feature === 'WAB',
          busType: bus.Type,
          scheduledTime: formatScheduledTime(bus.EstimatedArrival),
          latitude: bus.Latitude,
          longitude: bus.Longitude,
          isLive: true,
        });
      }
    });

    return {
      routeNumber: service.ServiceNo,
      routeName: `Service ${service.ServiceNo}`,
      via: service.Operator ? `Operated by ${service.Operator}` : 'Live LTA Transit',
      operator: service.Operator,
      arrivals: arrivals.length > 0 ? arrivals : [
        {
          id: `${service.ServiceNo}-no-data`,
          minutes: 0,
          occupancy: 'seats_available',
          statusText: 'No live bus in service currently',
        } as any,
      ],
    };
  });
}
