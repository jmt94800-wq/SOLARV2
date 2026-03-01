import Dexie, { type EntityTable } from 'dexie';

export interface Client {
  id: string;
  name: string;
  main_address: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  comment: string;
  sync_status?: 'pending' | 'synced';
  created_at: number;
}

export interface CatalogDevice {
  id: string;
  name: string;
  pmax_w: number;
  hourly_power_kwh: number;
  usage_duration_h: number;
  cost_usd: number;
  is_peak_power: boolean;
  comment: string;
  is_active: boolean;
  sync_status?: 'pending' | 'synced';
}

export interface Visit {
  id: string;
  client_id: string;
  agent_id: string;
  visit_address: string;
  visit_date: number;
  report: string;
  comment?: string;
  autonomy_days: number;
  is_completed?: boolean;
  sync_status?: 'pending' | 'synced';
  created_at: number;
}

export interface VisitNeed {
  id: string;
  visit_id: string;
  catalog_device_id: string | null;
  name: string;
  pmax_w: number;
  hourly_power_kwh: number;
  usage_duration_h: number;
  quantity: number;
  include_in_peak: boolean;
  sync_status?: 'pending' | 'synced';
}

export interface Photo {
  id: string;
  visit_id: string;
  data_uri: string;
  sync_status?: 'pending' | 'synced';
  created_at: number;
}

const db = new Dexie('SolarProDB') as Dexie & {
  clients: EntityTable<Client, 'id'>;
  catalog: EntityTable<CatalogDevice, 'id'>;
  visits: EntityTable<Visit, 'id'>;
  visitNeeds: EntityTable<VisitNeed, 'id'>;
  photos: EntityTable<Photo, 'id'>;
};

db.version(1).stores({
  clients: 'id, name',
  catalog: 'id, name',
  visits: 'id, client_id, agent_id',
  visitNeeds: 'id, visit_id',
  photos: 'id, visit_id'
});

db.version(2).stores({
  clients: 'id, name, created_at',
  catalog: 'id, name, is_active',
  visits: 'id, client_id, agent_id, created_at',
  visitNeeds: 'id, visit_id',
  photos: 'id, visit_id'
});

db.version(3).stores({
  clients: 'id, name, created_at, sync_status',
  catalog: 'id, name, is_active, sync_status',
  visits: 'id, client_id, agent_id, created_at, sync_status',
  visitNeeds: 'id, visit_id, sync_status',
  photos: 'id, visit_id, sync_status'
});

// Seed initial data for the prototype
db.on('populate', async () => {
  await db.catalog.bulkAdd([
    { id: 'dev-1', name: 'Panneau Solaire 400W', pmax_w: 400, hourly_power_kwh: 0.4, usage_duration_h: 6, cost_usd: 150, is_peak_power: true, comment: 'Standard', is_active: true },
    { id: 'dev-2', name: 'Onduleur 3kW', pmax_w: 3000, hourly_power_kwh: 0, usage_duration_h: 24, cost_usd: 800, is_peak_power: false, comment: '', is_active: true },
    { id: 'dev-3', name: 'Pompe à eau', pmax_w: 1200, hourly_power_kwh: 1.2, usage_duration_h: 4, cost_usd: 300, is_peak_power: false, comment: '', is_active: true },
  ]);
  await db.clients.add({
    id: 'cli-1', name: 'Ferme Agricole Dupont', main_address: 'Route de la vallée, 75000', comment: 'Intéressé par le pompage solaire', created_at: Date.now()
  });
});

export { db };
