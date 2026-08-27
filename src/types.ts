export type OccupancyLevel = 'seats_available' | 'standing_only' | 'limited_space' | 'full';

export interface ArrivalEstimate {
  id: string;
  minutes: number;
  occupancy: OccupancyLevel;
  isDelayed?: boolean;
  delayMinutes?: number;
  isAccessible?: boolean;
  busType?: 'SD' | 'DD' | 'BD' | string; // Single Deck, Double Deck, Bendy
  busId?: string;
  destination?: string;
  scheduledTime?: string;
  latitude?: string;
  longitude?: string;
  isLive?: boolean;
  estimatedArrivalTimestamp?: number; // Target epoch in ms for second-by-second countdown
  estimatedArrivalIso?: string;
}

export interface RouteArrivalData {
  routeNumber: string;
  routeName: string;
  via: string;
  operator?: string;
  routeColor?: string;
  statusText?: string;
  arrivals: ArrivalEstimate[];
  schedule?: {
    stopName: string;
    time: string;
    isCurrent?: boolean;
  }[];
}

export interface ServiceAlert {
  id: string;
  type: 'DETOUR' | 'DELAY' | 'MAINTENANCE' | 'ALERT' | 'ACCIDENT' | 'ROADWORK' | 'TRAIN_DISRUPTION';
  routeNumber?: string;
  line?: string;
  title?: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp?: string;
}

export interface TransitStop {
  id: string; // Bus stop code e.g. "83139", "01012"
  name: string;
  intersection: string;
  roadName?: string;
  distance?: string;
  routes: string[];
  coordinates: { x: number; y: number }; // percentage on map (0-100) or lat/lng
  serviceAlerts?: ServiceAlert[];
  routeArrivals: RouteArrivalData[];
}

// LTA DataMall v3 Live API Structures
export interface LtaNextBus {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: 'SEA' | 'SDA' | 'LSD' | string; // SEA = Seats Available, SDA = Standing Available, LSD = Limited Standing
  Feature: 'WAB' | string; // WAB = Wheelchair Accessible Bus
  Type: 'SD' | 'DD' | 'BD' | string; // SD = Single Deck, DD = Double Deck, BD = Bendy
}

export interface LtaBusService {
  ServiceNo: string;
  Operator: string;
  NextBus?: LtaNextBus;
  NextBus2?: LtaNextBus;
  NextBus3?: LtaNextBus;
}

export interface LtaBusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: LtaBusService[];
}

// LTA CarParkAvailabilityv2
export interface LtaCarParkItem {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string; // "1.29375 103.85718"
  AvailableLots: number;
  LotType: 'C' | 'H' | 'Y' | string; // C = Cars, H = Heavy vehicles, Y = Motorcycles
  Agency: 'LTA' | 'HDB' | 'URA' | string;
}

export interface LtaCarParkResponse {
  'odata.metadata'?: string;
  value: LtaCarParkItem[];
}

// LTA TrafficIncidents
export interface LtaTrafficIncident {
  Type: string; // Accident, Roadwork, Vehicle breakdown, Weather, etc.
  Latitude: number;
  Longitude: number;
  Message: string;
}

export interface LtaTrafficIncidentsResponse {
  'odata.metadata'?: string;
  value: LtaTrafficIncident[];
}

// LTA TrainServiceAlerts
export interface LtaTrainServiceAlert {
  Status: number; // 1 = Normal, 2 = Disrupted
  Line?: string;
  Direction?: string;
  Stations?: string;
  FreePublicBus?: string;
  FreeMRTShuttle?: string;
  Message?: Array<{
    Content: string;
    CreatedDate: string;
  }>;
}

export interface LtaTrainAlertsResponse {
  'odata.metadata'?: string;
  value?: LtaTrainServiceAlert;
}
