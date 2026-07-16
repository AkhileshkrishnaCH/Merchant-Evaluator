import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useMerchantData } from './hooks/useMerchantData';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';

export default function App() {
  const {
    merchants, selectedMerchant, simulationResult,
    isLoading, selectMerchant, runSimulation,
  } = useMerchantData();

  const selectedId = selectedMerchant?.merchant.id || '';

  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background 0.3s ease' }}>
        <Header
          merchants={merchants}
          selectedMerchantId={selectedId}
          onSelectMerchant={selectMerchant}
        />
        <main>
          <Routes>
            <Route path="/" element={
              <Dashboard merchantData={selectedMerchant} simulationResult={simulationResult} />
            } />
            <Route path="/simulator" element={
              <Simulator onSimulate={runSimulation} isLoading={isLoading} simulationResult={simulationResult} />
            } />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}
