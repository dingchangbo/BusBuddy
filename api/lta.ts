import { Request, Response, Router } from 'express';

// GUARDRAILS FOR CREDENTIALS:
// Any API key, token, or credential is read ONLY inside files in the repo-root api/ directory,
// via process.env.[EXACT_NAME]. Never create a VITE_ variable for a secret. Never hardcode
// a key, token, URL with a key in it, or credential JSON anywhere in the code.
// If a credential is missing at runtime, return HTTP 500 with {"error":"credential not configured"}
// rather than calling the provider without it.

function getAccountKey(): string | null {
  const key = process.env.LTA_DATAMALL_KEY || process.env.LTA_ACCOUNT_KEY || process.env.ACCOUNT_KEY || process.env.DATAMALL_API_KEY;
  if (!key || key.trim() === '') {
    return null;
  }
  return key.trim();
}

export const apiRouter = Router();

// Health / Credential check endpoint
apiRouter.get('/status', (req: Request, res: Response) => {
  const hasKey = Boolean(getAccountKey());
  res.json({
    status: 'ok',
    configured: hasKey,
    provider: 'LTA DataMall Singapore',
    endpoints: {
      busArrival: '/api/bus-arrival?busStopCode={code}&serviceNo={optional}',
      carparks: '/api/carparks',
      trafficIncidents: '/api/traffic-incidents',
      trainAlerts: '/api/train-alerts',
    },
  });
});

// 1. Next buses at a stop (v3 - the current version; 20-second refresh)
// https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139
// ...optionally one service: &ServiceNo=15
apiRouter.get('/bus-arrival', async (req: Request, res: Response) => {
  const accountKey = getAccountKey();
  if (!accountKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  const busStopCode = req.query.busStopCode || req.query.BusStopCode;
  const serviceNo = req.query.serviceNo || req.query.ServiceNo;

  if (!busStopCode || typeof busStopCode !== 'string') {
    return res.status(400).json({ error: 'busStopCode query parameter is required' });
  }

  try {
    let url = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode.trim())}`;
    if (serviceNo && typeof serviceNo === 'string' && serviceNo.trim() !== '') {
      url += `&ServiceNo=${encodeURIComponent(serviceNo.trim())}`;
    }

    const response = await fetch(url, {
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall API error: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    console.error('Error calling LTA BusArrival API:', err);
    return res.status(502).json({
      error: 'Failed to fetch from LTA DataMall',
      message: err?.message || 'Network error',
    });
  }
});

// 2. Live carpark lots (HDB + LTA + URA)
// https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2
apiRouter.get('/carparks', async (req: Request, res: Response) => {
  const accountKey = getAccountKey();
  if (!accountKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const url = 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';
    const response = await fetch(url, {
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall API error: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    console.error('Error calling LTA CarParkAvailabilityv2 API:', err);
    return res.status(502).json({
      error: 'Failed to fetch from LTA DataMall',
      message: err?.message || 'Network error',
    });
  }
});

// 3. Traffic incidents
// https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents
apiRouter.get('/traffic-incidents', async (req: Request, res: Response) => {
  const accountKey = getAccountKey();
  if (!accountKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const url = 'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents';
    const response = await fetch(url, {
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall API error: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    console.error('Error calling LTA TrafficIncidents API:', err);
    return res.status(502).json({
      error: 'Failed to fetch from LTA DataMall',
      message: err?.message || 'Network error',
    });
  }
});

// 4. MRT/LRT status: TrainServiceAlerts
// https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts
apiRouter.get('/train-alerts', async (req: Request, res: Response) => {
  const accountKey = getAccountKey();
  if (!accountKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  try {
    const url = 'https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts';
    const response = await fetch(url, {
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall API error: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    console.error('Error calling LTA TrainServiceAlerts API:', err);
    return res.status(502).json({
      error: 'Failed to fetch from LTA DataMall',
      message: err?.message || 'Network error',
    });
  }
});
