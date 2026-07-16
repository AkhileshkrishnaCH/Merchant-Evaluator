import type { MerchantData, MerchantMetrics, MerchantWithHealth, SimulationResponse, HealthScoreResponse } from '../types/merchant';

// In production, use the Render backend URL; in dev, use the Vite proxy
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API Error ${res.status}: ${detail}`);
  }
  return res.json();
}

export async function fetchMerchants(): Promise<MerchantData[]> {
  return fetchJSON<MerchantData[]>(`${BASE_URL}/merchants`);
}

export async function fetchMerchant(id: string): Promise<MerchantWithHealth> {
  return fetchJSON<MerchantWithHealth>(`${BASE_URL}/merchant/${id}`);
}

export async function simulateMerchant(
  metrics: MerchantMetrics,
  name: string = 'Custom Merchant'
): Promise<SimulationResponse> {
  return fetchJSON<SimulationResponse>(`${BASE_URL}/simulate`, {
    method: 'POST',
    body: JSON.stringify({ metrics, merchant_name: name }),
  });
}

export async function calculateHealth(metrics: MerchantMetrics): Promise<HealthScoreResponse> {
  return fetchJSON<HealthScoreResponse>(`${BASE_URL}/calculate-health`, {
    method: 'POST',
    body: JSON.stringify(metrics),
  });
}
