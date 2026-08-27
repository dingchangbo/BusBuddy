import { TransitStop } from '../types';
import { generateRealTimeArrivalsForServices } from '../services/ltaService';

export const MAP_IMAGE_URL = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80';
export const STOP_MAP_IMAGE_URL = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';

export const POPULAR_ROUTES = [
  { routeNumber: '15', label: 'Service 15 (Marine Parade / Pasir Ris)' },
  { routeNumber: '36', label: 'Service 36 (Changi Airport Express)' },
  { routeNumber: '196', label: 'Service 196 (Clementi - Bedok)' },
  { routeNumber: '48', label: 'Service 48 (Buona Vista - Bedok Nth)' },
  { routeNumber: '143', label: 'Service 143 (Toa Payoh - Jurong East)' },
  { routeNumber: '65', label: 'Service 65 (Tampines - HarbourFront)' },
  { routeNumber: '190', label: 'Service 190 (Choa Chu Kang - New Bridge Rd)' },
  { routeNumber: '857', label: 'Service 857 (Yishun - Suntec City)' },
  { routeNumber: '10', label: 'Service 10 (Tampines - Kent Ridge)' },
  { routeNumber: '51', label: 'Service 51 (Hougang - Jurong East)' },
  { routeNumber: '61', label: 'Service 61 (Bukit Batok - Eunos)' },
  { routeNumber: '147', label: 'Service 147 (Hougang - Clementi)' },
];

export const RAW_STOPS_CATALOG = [
  {
    id: '83139',
    name: 'Opp Parkway Parade',
    intersection: 'Marine Parade Rd (Opp Parkway Parade Shopping Centre)',
    roadName: 'Marine Parade Road',
    distance: '0.1 km away',
    routes: ['15', '31', '36', '43', '48', '135', '196', '197'],
    coordinates: { x: 74, y: 62 },
    serviceAlerts: [
      {
        id: 'alert-bus-15',
        type: 'DETOUR' as const,
        routeNumber: '15',
        message: 'Service 15 experiencing minor delays along Marine Parade Rd.',
        severity: 'medium' as const,
      },
    ],
  },
  {
    id: '83131',
    name: 'Parkway Parade',
    intersection: 'Marine Parade Rd (Parkway Parade Mall Entrance)',
    roadName: 'Marine Parade Road',
    distance: '0.2 km away',
    routes: ['15', '31', '36', '43', '48', '134', '135', '196', '197', '966'],
    coordinates: { x: 74, y: 61 },
  },
  {
    id: '01012',
    name: 'Hotel Grand Pacific',
    intersection: 'Victoria Street (Opp Bugis Junction / Bras Basah)',
    roadName: 'Victoria Street',
    distance: '0.3 km away',
    routes: ['2', '7', '12', '32', '33', '51', '61', '63', '80', '145', '175', '197'],
    coordinates: { x: 52, y: 48 },
  },
  {
    id: '01112',
    name: 'Bugis Station Exit D',
    intersection: 'Rochor Road (Bugis Junction / Bugis+)',
    roadName: 'Rochor Road',
    distance: '0.4 km away',
    routes: ['48', '57', '170', '851', '960', '980'],
    coordinates: { x: 53, y: 47 },
  },
  {
    id: '09048',
    name: 'Orchard Plaza',
    intersection: 'Orchard Road (Near Somerset MRT / Orchard Central)',
    roadName: 'Orchard Road',
    distance: '0.5 km away',
    routes: ['65', '106', '111', '123', '143', '174', '175', '502'],
    coordinates: { x: 44, y: 52 },
  },
  {
    id: '09022',
    name: 'Orchard Station / ION Orchard',
    intersection: 'Orchard Turn (ION Orchard / Wisma Atria)',
    roadName: 'Orchard Turn',
    distance: '0.6 km away',
    routes: ['7', '14', '16', '65', '106', '111', '123', '175', '502', '77', '143'],
    coordinates: { x: 43, y: 51 },
  },
  {
    id: '08057',
    name: 'Dhoby Ghaut Station',
    intersection: 'Orchard Road (Plaza Singapura)',
    roadName: 'Orchard Road',
    distance: '0.7 km away',
    routes: ['7', '14', '16', '36', '65', '77', '106', '111', '124', '167', '174', '190'],
    coordinates: { x: 48, y: 50 },
  },
  {
    id: '10169',
    name: 'UIC Building',
    intersection: 'Shenton Way (Downtown CBD / Marina Bay Link)',
    roadName: 'Shenton Way',
    distance: '0.8 km away',
    routes: ['10', '57', '70', '97', '100', '106', '130', '131', '167', '186', '196', '970'],
    coordinates: { x: 50, y: 70 },
  },
  {
    id: '03211',
    name: 'Raffles City',
    intersection: 'Bras Basah Road (City Hall Interchange / Raffles City)',
    roadName: 'Bras Basah Road',
    distance: '1.1 km away',
    routes: ['14', '16', '36', '77', '106', '111', '128', '130', '131', '167'],
    coordinates: { x: 51, y: 55 },
  },
  {
    id: '03019',
    name: 'Opp Clarke Quay Station',
    intersection: 'Eu Tong Sen Street (Clarke Quay Central)',
    roadName: 'Eu Tong Sen Street',
    distance: '0.9 km away',
    routes: ['2', '12', '33', '51', '54', '61', '63', '80', '124', '145', '147', '166', '174', '190', '197'],
    coordinates: { x: 47, y: 58 },
  },
  {
    id: '05013',
    name: 'Chinatown Station Exit E',
    intersection: 'Eu Tong Sen Street (People\'s Park Complex)',
    roadName: 'Eu Tong Sen Street',
    distance: '1.2 km away',
    routes: ['2', '12', '33', '54', '61', '63', '80', '124', '143', '147', '190', '961', '970'],
    coordinates: { x: 46, y: 62 },
  },
  {
    id: '03509',
    name: 'Marina Bay Sands Hotel',
    intersection: 'Bayfront Ave (MBS Hotel Tower 3 / Bayfront MRT)',
    roadName: 'Bayfront Avenue',
    distance: '1.5 km away',
    routes: ['97', '106', '133', '502', '518'],
    coordinates: { x: 55, y: 65 },
  },
  {
    id: '02089',
    name: 'Suntec City / Promenade Station',
    intersection: 'Temasek Boulevard (Suntec Tower 2)',
    roadName: 'Temasek Boulevard',
    distance: '1.0 km away',
    routes: ['36', '70M', '97', '106', '111', '133', '502', '518', '857'],
    coordinates: { x: 54, y: 54 },
  },
  {
    id: '14141',
    name: 'HarbourFront Interchange',
    intersection: 'Telok Blangah Rd (VivoCity / HarbourFront MRT)',
    roadName: 'Telok Blangah Road',
    distance: '2.5 km away',
    routes: ['65', '80', '93', '123', '124', '131', '145', '166', '188', '855', '963'],
    coordinates: { x: 42, y: 72 },
  },
  {
    id: '14119',
    name: 'VivoCity',
    intersection: 'Telok Blangah Road (Opp VivoCity Mall)',
    roadName: 'Telok Blangah Road',
    distance: '2.6 km away',
    routes: ['10', '30', '57', '61', '97', '100', '131', '143', '145', '166'],
    coordinates: { x: 43, y: 71 },
  },
  {
    id: '11119',
    name: 'Queenstown Station',
    intersection: 'Commonwealth Ave (Opp Queenstown MRT)',
    roadName: 'Commonwealth Avenue',
    distance: '3.2 km away',
    routes: ['51', '111', '145', '186', '195', '970'],
    coordinates: { x: 38, y: 58 },
  },
  {
    id: '10018',
    name: 'Shenton Way Bus Terminal',
    intersection: 'Shenton Way (Marina South Pier Link)',
    roadName: 'Shenton Way',
    distance: '1.2 km away',
    routes: ['10', '57', '70', '97', '100', '106', '107', '130', '131', '133', '167', '186', '196', '400', '402'],
    coordinates: { x: 52, y: 74 },
  },
  {
    id: '80019',
    name: 'Aljunied Station',
    intersection: 'Aljunied Rd (Aljunied MRT / Geylang)',
    roadName: 'Aljunied Road',
    distance: '2.8 km away',
    routes: ['40', '62', '63', '80', '100', '125', '137', '155', '158'],
    coordinates: { x: 62, y: 52 },
  },
  {
    id: '82061',
    name: 'Eunos Interchange',
    intersection: 'Sims Ave (Eunos MRT)',
    roadName: 'Sims Avenue',
    distance: '3.9 km away',
    routes: ['60', '61', '63', '93', '94', '154', '76'],
    coordinates: { x: 68, y: 50 },
  },
  {
    id: '84009',
    name: 'Bedok Bus Interchange',
    intersection: 'Bedok North Ave 1 (Bedok MRT / Mall)',
    roadName: 'Bedok North Avenue 1',
    distance: '6.4 km away',
    routes: ['7', '9', '14', '16', '17', '18', '26', '30', '32', '33', '35', '38', '40', '60', '66', '69', '87', '168', '196', '197', '222', '225G', '228', '229'],
    coordinates: { x: 78, y: 54 },
  },
  {
    id: '64009',
    name: 'Tampines Bus Interchange',
    intersection: 'Tampines Central 1 (Tampines MRT / Mall)',
    roadName: 'Tampines Central 1',
    distance: '9.5 km away',
    routes: ['3', '4', '8', '10', '19', '20', '23', '28', '29', '31', '37', '38', '65', '67', '68', '69', '72', '81', '291', '292', '293'],
    coordinates: { x: 82, y: 40 },
  },
  {
    id: '77009',
    name: 'Pasir Ris Bus Interchange',
    intersection: 'Pasir Ris Central (Pasir Ris MRT / White Sands)',
    roadName: 'Pasir Ris Central',
    distance: '12.5 km away',
    routes: ['3', '5', '6', '12', '15', '17', '21', '58', '88', '89', '354', '358', '359', '403', '518'],
    coordinates: { x: 88, y: 32 },
  },
  {
    id: '54009',
    name: 'Bishan Bus Interchange',
    intersection: 'Bishan Place (Bishan MRT / Junction 8)',
    roadName: 'Bishan Place',
    distance: '4.8 km away',
    routes: ['50', '52', '53', '54', '55', '56', '57', '58', '59', '410G', '410W'],
    coordinates: { x: 48, y: 38 },
  },
  {
    id: '52009',
    name: 'Ang Mo Kio Bus Interchange',
    intersection: 'AMK Ave 8 (Ang Mo Kio MRT / AMK Hub)',
    roadName: 'Ang Mo Kio Avenue 8',
    distance: '6.5 km away',
    routes: ['22', '24', '25', '73', '86', '130', '133', '135', '136', '138', '166', '169', '261', '262', '265', '268', '269'],
    coordinates: { x: 50, y: 32 },
  },
  {
    id: '52199',
    name: 'Toa Payoh Bus Interchange',
    intersection: 'Lorong 6 Toa Payoh (Toa Payoh MRT / HDB Hub)',
    roadName: 'Lorong 6 Toa Payoh',
    distance: '3.9 km away',
    routes: ['8', '26', '28', '31', '73', '88', '90', '139', '141', '142', '143', '145', '155', '157', '159', '163', '231', '232', '235', '238'],
    coordinates: { x: 49, y: 44 },
  },
  {
    id: '66009',
    name: 'Serangoon Interchange',
    intersection: 'Serangoon Ave 2 (Serangoon MRT / NEX Mall)',
    roadName: 'Serangoon Avenue 2',
    distance: '5.8 km away',
    routes: ['100', '101', '103', '105', '109', '158', '315', '317'],
    coordinates: { x: 58, y: 38 },
  },
  {
    id: '67009',
    name: 'Sengkang Bus Interchange',
    intersection: 'Sengkang Square (Compass One / Sengkang MRT)',
    roadName: 'Sengkang Square',
    distance: '10.2 km away',
    routes: ['80', '83', '85', '86', '87', '119', '156', '159', '161', '163', '371', '372'],
    coordinates: { x: 67, y: 28 },
  },
  {
    id: '65009',
    name: 'Punggol Bus Interchange',
    intersection: 'Punggol Place (Punggol MRT / Waterway Point)',
    roadName: 'Punggol Place',
    distance: '11.8 km away',
    routes: ['3', '34', '43', '62', '82', '83', '84', '85', '117', '118', '119', '136', '381', '382G', '386'],
    coordinates: { x: 70, y: 22 },
  },
  {
    id: '62009',
    name: 'Hougang Central Interchange',
    intersection: 'Hougang Central (Hougang Mall / MRT)',
    roadName: 'Hougang Central',
    distance: '8.4 km away',
    routes: ['74', '89', '102', '107', '112', '113', '116', '132', '147', '151', '161', '165', '324', '325', '329'],
    coordinates: { x: 63, y: 32 },
  },
  {
    id: '28009',
    name: 'Clementi Bus Interchange',
    intersection: 'Clementi Ave 3 (Clementi MRT / Mall)',
    roadName: 'Clementi Avenue 3',
    distance: '8.1 km away',
    routes: ['7', '14', '52', '96', '99', '105', '106', '147', '156', '165', '166', '173', '175', '196', '282', '284', '285'],
    coordinates: { x: 28, y: 52 },
  },
  {
    id: '22009',
    name: 'Jurong East Bus Interchange',
    intersection: 'Jurong Gateway Road (Jurong East MRT / Westgate / Jem)',
    roadName: 'Jurong Gateway Road',
    distance: '12.0 km away',
    routes: ['51', '52', '66', '78', '79', '97', '98', '105', '143', '160', '183', '197', '333', '334', '335', '506'],
    coordinates: { x: 22, y: 48 },
  },
  {
    id: '27009',
    name: 'Boon Lay Interchange',
    intersection: 'Jurong West Central 3 (Jurong Point / Boon Lay MRT)',
    roadName: 'Jurong West Central 3',
    distance: '15.4 km away',
    routes: ['30', '79', '154', '157', '172', '174', '178', '179', '180', '181', '187', '192', '193', '194', '198', '199', '240', '241', '242', '243', '246', '249', '251', '252', '254', '255', '257'],
    coordinates: { x: 15, y: 50 },
  },
  {
    id: '43009',
    name: 'Woodlands Temporary Interchange',
    intersection: 'Woodlands Square (Woodlands MRT / Causeway Point)',
    roadName: 'Woodlands Square',
    distance: '14.2 km away',
    routes: ['161', '168', '178', '187', '856', '900', '901', '903', '911', '912', '913', '925', '960', '961', '963', '966', '969'],
    coordinates: { x: 35, y: 15 },
  },
  {
    id: '59009',
    name: 'Yishun Bus Interchange',
    intersection: 'Yishun Ave 2 (Northpoint City / Yishun MRT)',
    roadName: 'Yishun Avenue 2',
    distance: '12.1 km away',
    routes: ['39', '85', '171', '800', '803', '804', '805', '806', '807', '811', '812', '851', '852', '853', '854', '855', '856', '857', '858', '859', '860'],
    coordinates: { x: 44, y: 20 },
  },
  {
    id: '44009',
    name: 'Choa Chu Kang Bus Interchange',
    intersection: 'Choa Chu Kang Loop (Lot One Mall / CCK MRT)',
    roadName: 'Choa Chu Kang Loop',
    distance: '13.0 km away',
    routes: ['67', '172', '188', '190', '300', '301', '302', '307', '925', '927', '974', '983', '985'],
    coordinates: { x: 24, y: 35 },
  },
  {
    id: '45009',
    name: 'Bukit Panjang Interchange',
    intersection: 'Jelebu Road (Hillion Mall / Bukit Panjang MRT)',
    roadName: 'Jelebu Road',
    distance: '11.5 km away',
    routes: ['176', '180', '184', '920', '922', '970', '972', '973', '975', '976', '979'],
    coordinates: { x: 30, y: 32 },
  },
  {
    id: '42009',
    name: 'Bukit Batok Bus Interchange',
    intersection: 'Bukit Batok Central (West Mall / Bukit Batok MRT)',
    roadName: 'Bukit Batok Central',
    distance: '10.5 km away',
    routes: ['61', '77', '106', '173', '177', '189', '852', '941', '944', '945', '947', '991'],
    coordinates: { x: 26, y: 42 },
  },
  {
    id: '95029',
    name: 'Changi Airport PTB2',
    intersection: 'Airport Boulevard (Terminal 2 Basement)',
    roadName: 'Airport Boulevard',
    distance: '16.8 km away',
    routes: ['24', '27', '34', '36', '53', '110', '858'],
    coordinates: { x: 94, y: 48 },
  },
  {
    id: '15019',
    name: 'National University Hospital (NUH)',
    intersection: 'Lower Kent Ridge Rd (Kent Ridge MRT)',
    roadName: 'Lower Kent Ridge Road',
    distance: '7.2 km away',
    routes: ['95', '96', '151', '198', '200'],
    coordinates: { x: 32, y: 62 },
  },
  {
    id: '16189',
    name: 'Singapore General Hospital (SGH)',
    intersection: 'Outram Road (Outram Park MRT Exit A)',
    roadName: 'Outram Road',
    distance: '2.1 km away',
    routes: ['33', '63', '75', '121', '122', '174', '851', '970'],
    coordinates: { x: 45, y: 66 },
  },
  {
    id: '50038',
    name: 'Novena Station',
    intersection: 'Thomson Rd (Novena Square / Velocity / TTSH)',
    roadName: 'Thomson Road',
    distance: '3.1 km away',
    routes: ['5', '21', '54', '56', '57', '131', '141', '143', '166', '167', '851', '980'],
    coordinates: { x: 47, y: 42 },
  },
  {
    id: '40019',
    name: 'Newton Station Exit A',
    intersection: 'Scotts Road (Near Newton Food Centre)',
    roadName: 'Scotts Road',
    distance: '2.2 km away',
    routes: ['5', '54', '124', '143', '162', '167', '171', '700'],
    coordinates: { x: 45, y: 46 },
  },
];

// Initialize all transit stops with guaranteed real-time arrival structures for EVERY service
export const TRANSIT_STOPS: TransitStop[] = RAW_STOPS_CATALOG.map((stop) => {
  return {
    ...stop,
    routeArrivals: generateRealTimeArrivalsForServices(stop.id, stop.routes),
  };
});

// Search transit stops by Stop Number, Stop Name, Road Name, Landmarks, or Bus Service numbers
export function searchTransitStops(query: string, maxResults: number = 15): TransitStop[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return TRANSIT_STOPS.slice(0, maxResults);
  }

  // Scoring algorithm for intuitive ranking
  const scored = TRANSIT_STOPS.map((stop) => {
    let score = 0;
    const idLower = stop.id.toLowerCase();
    const nameLower = stop.name.toLowerCase();
    const roadLower = (stop.roadName || '').toLowerCase();
    const interLower = stop.intersection.toLowerCase();

    // 1. Exact Stop ID match
    if (idLower === q) {
      score += 1000;
    } else if (idLower.startsWith(q)) {
      score += 500;
    } else if (idLower.includes(q)) {
      score += 250;
    }

    // 2. Stop Name matches
    if (nameLower === q) {
      score += 800;
    } else if (nameLower.startsWith(q)) {
      score += 400;
    } else if (nameLower.includes(q)) {
      score += 200;
    }

    // 3. Road / Intersection matches
    if (roadLower.startsWith(q)) {
      score += 150;
    } else if (roadLower.includes(q) || interLower.includes(q)) {
      score += 100;
    }

    // 4. Word-level match (e.g. searching "Parkway" matches "Opp Parkway Parade")
    const words = q.split(/\s+/).filter(Boolean);
    if (words.length > 1) {
      const allWordsMatch = words.every(
        (w) => nameLower.includes(w) || roadLower.includes(w) || interLower.includes(w)
      );
      if (allWordsMatch) score += 300;
    }

    // 5. Bus Route service number match
    if (stop.routes.some((r) => r.toLowerCase() === q)) {
      score += 180;
    }

    return { stop, score };
  });

  const filtered = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.stop);

  return filtered.slice(0, maxResults);
}

// Helper to look up or construct a TransitStop for ANY search query or 5-digit stop number
export function findOrCreateStopByCode(codeOrQuery: string): TransitStop {
  const q = codeOrQuery.trim().toLowerCase();
  if (!q) return TRANSIT_STOPS[0];

  // 1. Direct match by ID
  const directMatch = TRANSIT_STOPS.find((s) => s.id.toLowerCase() === q);
  if (directMatch) return directMatch;

  // 2. Exact or substring match by name
  const exactNameMatch = TRANSIT_STOPS.find((s) => s.name.toLowerCase() === q);
  if (exactNameMatch) return exactNameMatch;

  const textMatch = TRANSIT_STOPS.find(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.intersection.toLowerCase().includes(q) ||
      (s.roadName && s.roadName.toLowerCase().includes(q))
  );
  if (textMatch) return textMatch;

  // 3. Match by bus service (e.g. "15" -> first stop with service 15)
  const serviceMatch = TRANSIT_STOPS.find((s) => s.routes.some((r) => r.toLowerCase() === q));
  if (serviceMatch) return serviceMatch;

  // 4. Construct a dynamic stop for any 5-digit Singapore bus stop code
  const is5Digit = /^\d{5}$/.test(codeOrQuery.trim());
  const cleanCode = is5Digit
    ? codeOrQuery.trim()
    : codeOrQuery.trim().replace(/\D/g, '').padEnd(5, '0').slice(0, 5) || '83139';

  // Assign Singapore region-aware default routes for arbitrary stop codes
  const prefix = parseInt(cleanCode.slice(0, 2), 10) || 83;
  let defaultRoutes = ['15', '31', '36', '43', '48', '196', '197'];
  let road = 'Singapore Transit Corridor';

  if (prefix >= 1 && prefix <= 10) {
    defaultRoutes = ['2', '7', '12', '32', '51', '61', '63', '80', '145', '174', '175', '190', '197'];
    road = 'Central & Downtown Corridor';
  } else if (prefix >= 11 && prefix <= 20) {
    defaultRoutes = ['10', '51', '97', '100', '111', '143', '145', '166', '186', '195', '970'];
    road = 'Queenstown / Bukit Merah Corridor';
  } else if (prefix >= 21 && prefix <= 35) {
    defaultRoutes = ['7', '14', '51', '52', '66', '78', '97', '98', '105', '143', '147', '183', '196', '282', '285'];
    road = 'Jurong / Clementi West Corridor';
  } else if (prefix >= 36 && prefix <= 50) {
    defaultRoutes = ['168', '178', '187', '856', '900', '901', '903', '911', '912', '960', '963', '969'];
    road = 'Woodlands / Yishun North Corridor';
  } else if (prefix >= 51 && prefix <= 60) {
    defaultRoutes = ['22', '24', '25', '50', '52', '53', '54', '55', '73', '88', '130', '133', '143', '159', '166', '410G'];
    road = 'Ang Mo Kio / Bishan Corridor';
  } else if (prefix >= 61 && prefix <= 75) {
    defaultRoutes = ['3', '8', '19', '28', '29', '34', '43', '65', '67', '68', '69', '72', '80', '83', '85', '118', '291'];
    road = 'Tampines / Punggol East Corridor';
  } else if (prefix >= 76 && prefix <= 99) {
    defaultRoutes = ['12', '14', '15', '16', '17', '31', '36', '43', '48', '135', '196', '197', '222', '518'];
    road = 'Marine Parade / Bedok / Pasir Ris Corridor';
  }

  const generatedArrivals = generateRealTimeArrivalsForServices(cleanCode, defaultRoutes);

  return {
    id: cleanCode,
    name: is5Digit ? `Bus Stop #${cleanCode}` : codeOrQuery.trim(),
    intersection: `${road} (Stop #${cleanCode})`,
    roadName: road,
    distance: 'Selected Stop',
    routes: defaultRoutes,
    coordinates: { x: 50, y: 50 },
    routeArrivals: generatedArrivals,
  };
}
