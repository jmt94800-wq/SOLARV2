import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { format } from 'date-fns';
import { Download } from 'lucide-react';

export default function Analysis() {
  const visits = useLiveQuery(() => db.visits.toArray());
  const clients = useLiveQuery(() => db.clients.toArray());
  const needs = useLiveQuery(() => db.visitNeeds.toArray());

  // Generate rows
  const rows = [];
  
  if (visits && clients && needs) {
    for (const visit of visits) {
       const client = clients.find(c => c.id === visit.client_id);
       const visitNeeds = needs.filter(n => n.visit_id === visit.id);

       let totalHourly = 0;
       let totalPmax = 0;

       for (const need of visitNeeds) {
           rows.push({
               id: `${visit.id}-${need.id}`,
               client: client?.name || 'Inconnu',
               location: visit.visit_address,
               date: format(visit.visit_date, 'dd/MM/yyyy'),
               agent: visit.agent_id,
               device: need.name,
               hourly: need.hourly_power_kwh,
               pmax: need.pmax_w,
               duration: need.usage_duration_h,
               qty: need.quantity,
               isBattery: false
           });
           totalHourly += (need.hourly_power_kwh * need.quantity);
           totalPmax += (need.pmax_w * need.quantity);
       }

       // Génération dynamique de la ligne Batterie
       if (visit.autonomy_days > 0) {
           rows.push({
               id: `${visit.id}-battery-generated`,
               client: client?.name || 'Inconnu',
               location: visit.visit_address,
               date: format(visit.visit_date, 'dd/MM/yyyy'),
               agent: visit.agent_id,
               device: 'Batterie (Généré)',
               hourly: totalHourly,
               pmax: totalPmax,
               duration: 0,
               qty: 1,
               isBattery: true
           });
       }
    }
  }

  const handleExportCSV = () => {
    if (rows.length === 0) return;
    const headers = ['Client', 'Lieu', 'Date', 'Agent', 'Appareil', 'Puiss. horaire (kWh)', 'Pmax (W)', 'Durée (h)', 'Quantité'];
    const csvContent = [
      headers.join(','),
      ...rows.map(r => `"${r.client}","${r.location}","${r.date}","${r.agent}","${r.device}",${r.hourly},${r.pmax},${r.duration},${r.qty}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `export_solarpro_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Grand Récapitulatif (Export)</h1>
        <button onClick={handleExportCSV} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
          <Download className="w-4 h-4" /> Exporter CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Lieu</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Agent</th>
                <th className="px-4 py-3 font-medium">Appareil</th>
                <th className="px-4 py-3 font-medium">Puiss. horaire (kWh)</th>
                <th className="px-4 py-3 font-medium">Pmax (W)</th>
                <th className="px-4 py-3 font-medium">Durée (h)</th>
                <th className="px-4 py-3 font-medium">Quantité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(row => (
                <tr key={row.id} className={`hover:bg-slate-50 ${row.isBattery ? 'bg-amber-50/50 text-amber-900' : ''}`}>
                  <td className="px-4 py-3 font-medium">{row.client}</td>
                  <td className="px-4 py-3">{row.location}</td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3">{row.agent}</td>
                  <td className={`px-4 py-3 ${row.isBattery ? 'font-bold' : ''}`}>{row.device}</td>
                  <td className="px-4 py-3">{row.hourly.toFixed(2)}</td>
                  <td className="px-4 py-3">{row.pmax}</td>
                  <td className="px-4 py-3">{row.duration}</td>
                  <td className="px-4 py-3">{row.qty}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-500">Aucune donnée à analyser.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
