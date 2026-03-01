/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AppContext } from './store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Visits from './pages/Visits';
import VisitDetails from './pages/VisitDetails';
import Catalog from './pages/Catalog';
import Analysis from './pages/Analysis';
import { Sun } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<'AGENT' | 'MANAGER'>('AGENT');
  const [agentName, setAgentName] = useState<string>(localStorage.getItem('agentName') || '');
  const [tempFirstName, setTempFirstName] = useState('');
  const [tempLastName, setTempLastName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${tempFirstName.trim()} ${tempLastName.trim()}`.trim();
    if (fullName) {
      localStorage.setItem('agentName', fullName);
      setAgentName(fullName);
    }
  };

  if (!agentName) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8 text-emerald-600">
            <Sun className="w-10 h-10" />
            <span className="font-bold text-3xl tracking-tight">SolarPro</span>
          </div>
          <h1 className="text-xl font-bold text-center text-slate-900 mb-2">Bienvenue</h1>
          <p className="text-slate-500 text-center mb-6 text-sm">Veuillez indiquer votre identité pour commencer vos visites.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
              <input 
                type="text" 
                required
                value={tempFirstName}
                onChange={e => setTempFirstName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder="Ex: Jean"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
              <input 
                type="text" 
                required
                value={tempLastName}
                onChange={e => setTempLastName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder="Ex: Dupont"
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition-colors mt-6">
              Commencer
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Generate a stable agentId based on the name
  const agentId = agentName.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <AppContext.Provider value={{ role, setRole, agentId, agentName, setAgentName }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="visits" element={<Visits />} />
            <Route path="visits/:id" element={<VisitDetails />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
