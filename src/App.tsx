/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AppContext } from './store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Visits from './pages/Visits';
import VisitDetails from './pages/VisitDetails';
import Catalog from './pages/Catalog';
import Analysis from './pages/Analysis';

export default function App() {
  const [role, setRole] = useState<'AGENT' | 'MANAGER'>('AGENT');

  return (
    <AppContext.Provider value={{ role, setRole, agentId: 'agent-1' }}>
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
