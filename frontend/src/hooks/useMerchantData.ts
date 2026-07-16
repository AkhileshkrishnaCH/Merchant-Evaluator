import { useState, useEffect, useCallback } from 'react';
import type { MerchantData, MerchantWithHealth, SimulationResponse } from '../types/merchant';
import type { MerchantMetrics } from '../types/merchant';
import { fetchMerchants, fetchMerchant, simulateMerchant } from '../services/api';

export function useMerchantData() {
  const [merchants, setMerchants] = useState<MerchantData[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantWithHealth | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch merchant list on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMerchants();
        setMerchants(data);
      } catch (err) {
        console.error('Failed to load merchants:', err);
        setError('Failed to load merchant data');
      }
    };
    load();
  }, []);

  // Select a merchant by ID
  const selectMerchant = useCallback(async (merchantId: string) => {
    if (!merchantId) {
      setSelectedMerchant(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setSimulationResult(null);
    try {
      const data = await fetchMerchant(merchantId);
      setSelectedMerchant(data);
    } catch (err) {
      console.error('Failed to fetch merchant:', err);
      setError('Failed to load merchant data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run a simulation
  const runSimulation = useCallback(async (metrics: MerchantMetrics, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await simulateMerchant(metrics, name);
      setSimulationResult(result);
      setSelectedMerchant(null);
      return result;
    } catch (err) {
      console.error('Simulation failed:', err);
      setError('Simulation failed. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    merchants,
    selectedMerchant,
    simulationResult,
    isLoading,
    error,
    selectMerchant,
    runSimulation,
    setSimulationResult,
  };
}
