import { useAppContext } from '../store';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { ClipboardList, Users, Database, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, subWeeks, addWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Dashboard() {
  const { role } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const stats = useLiveQuery(async () => {
    return {
      clients: await db.clients.count(),
      visits: await db.visits.count(),
      devices: await db.catalog.count()
    };
  });

  const visits = useLiveQuery(() => db.visits.toArray());
  const clients = useLiveQuery(() => db.clients.toArray());

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500">Bienvenue dans l'espace {role === 'MANAGER' ? 'Responsable' : 'Agent'}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Clients</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.clients || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><ClipboardList className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Visites</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.visits || 0}</p>
          </div>
        </div>
        {role === 'MANAGER' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Database className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Appareils Catalogue</p>
              <p className="text-2xl font-bold text-slate-900">{stats?.devices || 0}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            Calendrier des visites
          </h2>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="p-1 hover:bg-slate-100 rounded">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <span className="font-medium text-slate-700 capitalize">
              {format(startDate, 'MMMM yyyy', { locale: fr })}
            </span>
            <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="p-1 hover:bg-slate-100 rounded">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            const dayVisits = visits?.filter(v => isSameDay(new Date(v.visit_date), day)) || [];
            const isToday = isSameDay(day, new Date());
            
            return (
              <div key={i} className={`min-h-[120px] p-2 rounded-lg border ${isToday ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/50'}`}>
                <div className={`text-sm font-medium mb-2 ${isToday ? 'text-emerald-700' : 'text-slate-500'}`}>
                  <div className="capitalize">{format(day, 'EEE', { locale: fr })}</div>
                  <div className={`text-lg ${isToday ? 'font-bold' : ''}`}>{format(day, 'dd')}</div>
                </div>
                
                <div className="space-y-1.5">
                  {dayVisits.map(visit => {
                    const client = clients?.find(c => c.id === visit.client_id);
                    const isDone = visit.is_completed;
                    
                    return (
                      <div key={visit.id} className={`p-1.5 text-xs rounded border ${isDone ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}>
                        <div className="font-medium truncate">{client?.name || 'Client inconnu'}</div>
                        <div className="text-[10px] opacity-80 truncate">{visit.visit_address}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-800 text-sm">
        <strong>Mode Offline-First actif :</strong> Toutes vos modifications sont enregistrées localement sur cet appareil. La synchronisation se fera automatiquement en arrière-plan (simulé).
      </div>
    </div>
  );
}
