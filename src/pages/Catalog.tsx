import { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Upload } from 'lucide-react';

export default function Catalog() {
  const catalog = useLiveQuery(() => db.catalog.filter(c => c.is_active).toArray());
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [pmax, setPmax] = useState(0);
  const [hourly, setHourly] = useState(0);
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [isPeak, setIsPeak] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await db.catalog.add({
      id: uuidv4(),
      name,
      pmax_w: pmax,
      hourly_power_kwh: hourly,
      usage_duration_h: duration,
      cost_usd: cost,
      is_peak_power: isPeak,
      comment: '',
      is_active: true,
      sync_status: 'pending'
    });
    setName(''); setPmax(0); setHourly(0); setDuration(0); setCost(0); setIsPeak(false);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    // Soft delete
    await db.catalog.update(id, { is_active: false, sync_status: 'pending' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          await db.transaction('rw', db.catalog, async () => {
            // Soft delete existing active items
            const activeItems = await db.catalog.filter(c => c.is_active).toArray();
            for (const item of activeItems) {
              await db.catalog.update(item.id, { is_active: false, sync_status: 'pending' });
            }
            
            // Add new items
            const newItems = json.map(item => ({
              id: uuidv4(),
              name: item.name || 'Appareil inconnu',
              pmax_w: Number(item.pmax_w) || 0,
              hourly_power_kwh: Number(item.hourly_power_kwh) || 0,
              usage_duration_h: Number(item.usage_duration_h) || 0,
              cost_usd: Number(item.cost_usd) || 0,
              is_peak_power: Boolean(item.is_peak_power),
              comment: item.comment || '',
              is_active: true,
              sync_status: 'pending'
            }));
            await db.catalog.bulkAdd(newItems);
          });
          alert('Catalogue importé avec succès !');
        } else {
          alert('Le fichier JSON doit contenir un tableau d\'appareils.');
        }
      } catch (err) {
        console.error(err);
        alert('Erreur lors de la lecture du fichier JSON. Vérifiez le format.');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Catalogue Appareils</h1>
        <div className="flex gap-2">
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <button onClick={() => fileInputRef.current?.click()} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-200">
            <Upload className="w-4 h-4" /> Importer JSON
          </button>
          <button onClick={() => setIsAdding(!isAdding)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
            <Plus className="w-4 h-4" /> Nouvel Appareil
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Coût (USD)</label>
              <input type="number" value={cost} onChange={e => setCost(parseFloat(e.target.value) || 0)} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pmax (W)</label>
              <input type="number" value={pmax} onChange={e => setPmax(parseFloat(e.target.value) || 0)} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Conso Horaire (kWh)</label>
              <input type="number" step="0.1" value={hourly} onChange={e => setHourly(parseFloat(e.target.value) || 0)} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Durée standard (h/j)</label>
              <input type="number" step="0.5" value={duration} onChange={e => setDuration(parseFloat(e.target.value) || 0)} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="peak" checked={isPeak} onChange={e => setIsPeak(e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
              <label htmlFor="peak" className="text-sm font-medium text-slate-700 cursor-pointer">Puissance Crête (OUI/NON)</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Enregistrer</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Pmax (W)</th>
                <th className="px-4 py-3 font-medium">Conso (kWh)</th>
                <th className="px-4 py-3 font-medium">Durée (h)</th>
                <th className="px-4 py-3 font-medium">Crête</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {catalog?.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.pmax_w}</td>
                  <td className="px-4 py-3 text-slate-600">{item.hourly_power_kwh}</td>
                  <td className="px-4 py-3 text-slate-600">{item.usage_duration_h}</td>
                  <td className="px-4 py-3 text-slate-600">{item.is_peak_power ? 'OUI' : 'NON'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {catalog?.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Catalogue vide.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
