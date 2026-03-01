import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Plus, Trash2, Save, CheckCircle2, Clock } from 'lucide-react';

export default function VisitDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const visit = useLiveQuery(() => db.visits.get(id!));
  const client = useLiveQuery(() => visit ? db.clients.get(visit.client_id) : undefined, [visit]);
  const needs = useLiveQuery(() => db.visitNeeds.where('visit_id').equals(id!).toArray(), [id]);
  const catalog = useLiveQuery(() => db.catalog.filter(c => c.is_active).toArray());

  const [report, setReport] = useState('');
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  if (!visit) return <div className="p-8">Chargement...</div>;

  const handleSaveReport = async () => {
    await db.visits.update(id!, { report, sync_status: 'pending' });
    setIsEditingReport(false);
  };

  const handleToggleCompletion = async () => {
    await db.visits.update(id!, { is_completed: !visit.is_completed, sync_status: 'pending' });
  };

  const handleAddNeed = async () => {
    if (!selectedDeviceId) return;
    const device = catalog?.find(d => d.id === selectedDeviceId);
    if (!device) return;

    await db.visitNeeds.add({
      id: uuidv4(),
      visit_id: visit.id,
      catalog_device_id: device.id,
      name: device.name,
      pmax_w: device.pmax_w,
      hourly_power_kwh: device.hourly_power_kwh,
      usage_duration_h: device.usage_duration_h,
      quantity: 1,
      include_in_peak: device.is_peak_power,
      sync_status: 'pending'
    });
    setSelectedDeviceId('');
  };

  const updateNeed = async (needId: string, changes: any) => {
    await db.visitNeeds.update(needId, { ...changes, sync_status: 'pending' });
  };

  const deleteNeed = async (needId: string) => {
    await db.visitNeeds.delete(needId);
  };

  // Calculations
  const totalPmax = needs?.reduce((sum, n) => sum + (n.include_in_peak ? (n.pmax_w * n.quantity) : 0), 0) || 0;
  const totalHourly = needs?.reduce((sum, n) => sum + (n.hourly_power_kwh * n.quantity), 0) || 0;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/visits')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Retour aux visites
      </button>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{client?.name}</h1>
          <p className="text-slate-500 mt-1">{visit.visit_address}</p>
          {visit.comment && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
              <strong>Note de préparation :</strong> {visit.comment}
            </div>
          )}
          <div className="mt-4 flex gap-4">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Autonomie : {visit.autonomy_days} jours</span>
            {visit.is_completed ? (
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Validée
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" /> Planifiée
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={handleToggleCompletion}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors whitespace-nowrap ${visit.is_completed ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
        >
          <CheckCircle2 className="w-5 h-5" />
          {visit.is_completed ? 'Rouvrir la visite' : 'Valider la visite'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Besoins en appareils</h2>
            
            <div className="flex gap-2 mb-6">
              <select value={selectedDeviceId} onChange={e => setSelectedDeviceId(e.target.value)} className="flex-1 border border-slate-300 rounded-lg px-3 py-2">
                <option value="">Ajouter depuis le catalogue...</option>
                {catalog?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button onClick={handleAddNeed} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                <Plus className="w-5 h-5" />
              </button>
              <button 
                onClick={async () => {
                  await db.visitNeeds.add({
                    id: uuidv4(),
                    visit_id: visit.id,
                    catalog_device_id: null,
                    name: 'Nouvel appareil',
                    pmax_w: 0,
                    hourly_power_kwh: 0,
                    usage_duration_h: 0,
                    quantity: 1,
                    include_in_peak: true,
                    sync_status: 'pending'
                  });
                }} 
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 whitespace-nowrap"
              >
                Appareil libre
              </button>
            </div>

            <div className="space-y-4">
              {needs?.map(need => (
                <div key={need.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="flex justify-between items-start mb-3">
                    <input 
                      type="text" 
                      value={need.name} 
                      onChange={e => updateNeed(need.id, { name: e.target.value })}
                      className="font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none"
                    />
                    <button onClick={() => deleteNeed(need.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <label className="block text-slate-500 text-xs mb-1">Quantité</label>
                      <input type="number" min="1" value={need.quantity} onChange={e => updateNeed(need.id, { quantity: parseInt(e.target.value) || 1 })} className="w-full border border-slate-300 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-xs mb-1">Pmax (W)</label>
                      <input type="number" value={need.pmax_w} onChange={e => updateNeed(need.id, { pmax_w: parseFloat(e.target.value) || 0 })} className="w-full border border-slate-300 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-xs mb-1">Conso (kWh)</label>
                      <input type="number" step="0.1" value={need.hourly_power_kwh} onChange={e => updateNeed(need.id, { hourly_power_kwh: parseFloat(e.target.value) || 0 })} className="w-full border border-slate-300 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-xs mb-1">Durée (h/j)</label>
                      <input type="number" step="0.5" value={need.usage_duration_h} onChange={e => updateNeed(need.id, { usage_duration_h: parseFloat(e.target.value) || 0 })} className="w-full border border-slate-300 rounded px-2 py-1" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input type="checkbox" id={`peak-${need.id}`} checked={need.include_in_peak} onChange={e => updateNeed(need.id, { include_in_peak: e.target.checked })} className="rounded text-emerald-600 focus:ring-emerald-500" />
                    <label htmlFor={`peak-${need.id}`} className="text-sm text-slate-600 cursor-pointer">Inclure dans la puissance crête</label>
                  </div>
                </div>
              ))}
              {needs?.length === 0 && <p className="text-slate-500 text-center py-4">Aucun appareil ajouté.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold mb-4">Synthèse Énergétique</h2>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Puissance Crête Totale</p>
                <p className="text-3xl font-light">{totalPmax.toLocaleString()} <span className="text-lg text-slate-500">W</span></p>
              </div>
              <div className="h-px bg-slate-800"></div>
              <div>
                <p className="text-slate-400 text-sm">Consommation Horaire</p>
                <p className="text-3xl font-light">{totalHourly.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 2})} <span className="text-lg text-slate-500">kWh</span></p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Rapport de visite</h2>
              {!isEditingReport && (
                <button onClick={() => { setReport(visit.report); setIsEditingReport(true); }} className="text-emerald-600 text-sm font-medium hover:underline">Modifier</button>
              )}
            </div>
            
            {isEditingReport ? (
              <div className="space-y-3">
                <textarea value={report} onChange={e => setReport(e.target.value)} rows={5} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Rédigez votre rapport ici..."></textarea>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsEditingReport(false)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-md">Annuler</button>
                  <button onClick={handleSaveReport} className="bg-emerald-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-emerald-700 flex items-center gap-1"><Save className="w-4 h-4"/> Enregistrer</button>
                </div>
              </div>
            ) : (
              <p className="text-slate-600 text-sm whitespace-pre-wrap">{visit.report || <span className="italic text-slate-400">Aucun rapport rédigé.</span>}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
