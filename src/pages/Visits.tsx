import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Calendar, MapPin, ChevronRight, MessageSquare, CheckCircle2, Clock, CloudUpload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../store';
import { format } from 'date-fns';

export default function Visits() {
  const { agentId } = useAppContext();
  const visits = useLiveQuery(() => db.visits.orderBy('created_at').reverse().toArray());
  const clients = useLiveQuery(() => db.clients.toArray());
  
  const [isAdding, setIsAdding] = useState(false);
  const [clientId, setClientId] = useState('');
  const [address, setAddress] = useState('');
  const [autonomy, setAutonomy] = useState(0);
  const [comment, setComment] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    
    const client = clients?.find(c => c.id === clientId);
    const visitAddress = address || client?.main_address || '';

    await db.visits.add({
      id: uuidv4(),
      client_id: clientId,
      agent_id: agentId,
      visit_address: visitAddress,
      visit_date: Date.now(),
      report: '',
      comment: comment,
      autonomy_days: autonomy,
      is_completed: false,
      sync_status: 'pending',
      created_at: Date.now()
    });
    
    setClientId('');
    setAddress('');
    setAutonomy(0);
    setComment('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Visites</h1>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
          <Plus className="w-4 h-4" /> Nouvelle Visite
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
            <select value={clientId} onChange={e => setClientId(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" required>
              <option value="">Sélectionner un client...</option>
              {clients?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Adresse de la visite (laisser vide si adresse principale)</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jours d'autonomie souhaités</label>
            <input type="number" min="0" value={autonomy} onChange={e => setAutonomy(parseInt(e.target.value) || 0)} className="w-full border border-slate-300 rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Commentaire / Notes de préparation</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" rows={2} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Créer</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visits?.map(visit => {
          const client = clients?.find(c => c.id === visit.client_id);
          return (
            <Link key={visit.id} to={`/visits/${visit.id}`} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-colors group block relative">
              {visit.sync_status === 'pending' && (
                <div className="absolute top-4 right-10 text-amber-500" title="En attente de synchronisation">
                  <CloudUpload className="w-4 h-4" />
                </div>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{client?.name || 'Client inconnu'}</h3>
                  <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <p>{format(visit.visit_date, 'dd/MM/yyyy HH:mm')}</p>
                  </div>
                  <div className="flex items-start gap-2 mt-1 text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{visit.visit_address || 'Aucune adresse'}</p>
                  </div>
                  {visit.comment && (
                    <div className="flex items-start gap-2 mt-2 text-slate-500 text-sm italic">
                      <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" />
                      <p className="line-clamp-2">{visit.comment}</p>
                    </div>
                  )}
                  <div className="mt-3 flex gap-2">
                    {visit.is_completed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Validée
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        <Clock className="w-3 h-3" /> Planifiée
                      </span>
                    )}
                    {visit.autonomy_days > 0 && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                        Autonomie : {visit.autonomy_days} j
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-emerald-500" />
              </div>
            </Link>
          );
        })}
        {visits?.length === 0 && <p className="text-slate-500 col-span-full">Aucune visite trouvée.</p>}
      </div>
    </div>
  );
}
