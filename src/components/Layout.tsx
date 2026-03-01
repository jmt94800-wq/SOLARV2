import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../store';
import { Sun, Users, ClipboardList, Database, BarChart3, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import SyncStatus from './SyncStatus';

export default function Layout() {
  const { role, setRole, agentName, setAgentName } = useAppContext();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Sun, roles: ['AGENT', 'MANAGER'] },
    { path: '/clients', label: 'Clients', icon: Users, roles: ['AGENT', 'MANAGER'] },
    { path: '/visits', label: 'Visites', icon: ClipboardList, roles: ['AGENT', 'MANAGER'] },
    { path: '/catalog', label: 'Catalogue', icon: Database, roles: ['MANAGER'] },
    { path: '/analysis', label: 'Analyse', icon: BarChart3, roles: ['MANAGER'] },
  ];

  const handleLogout = () => {
    localStorage.removeItem('agentName');
    setAgentName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Topbar */}
      <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight">SolarProV2</span>
          </div>

          <div className="flex items-center gap-4">
            <SyncStatus />
            
            <div className="hidden sm:flex items-center gap-2 text-sm bg-emerald-700/50 px-3 py-1.5 rounded-full">
              <span className="font-medium">{agentName}</span>
              <button 
                onClick={handleLogout}
                className="text-emerald-200 hover:text-white transition-colors"
                title="Changer d'utilisateur"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'AGENT' | 'MANAGER')}
              className="bg-emerald-700 border-none rounded text-sm py-1 px-2 text-white focus:ring-2 focus:ring-emerald-400 outline-none cursor-pointer"
            >
              <option value="AGENT">Vue Agent</option>
              <option value="MANAGER">Vue Responsable</option>
            </select>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 bg-white border-r border-slate-200 py-6">
          <nav className="space-y-1 px-3">
            {navItems.filter(item => item.roles.includes(role)).map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-20 bg-black/50" onClick={() => setIsMenuOpen(false)}>
            <div className="bg-white w-64 h-full py-6 flex flex-col" onClick={e => e.stopPropagation()}>
              <nav className="space-y-1 px-3 flex-1">
                {navItems.filter(item => item.roles.includes(role)).map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600'}`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
              
              <div className="px-6 py-4 border-t border-slate-200 mt-auto">
                <div className="text-sm text-slate-500 mb-2">Connecté en tant que</div>
                <div className="font-medium text-slate-900 mb-4">{agentName}</div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Changer d'utilisateur
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
