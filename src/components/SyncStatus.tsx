import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

export default function SyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  // Count pending items across all stores
  const pendingClients = useLiveQuery(() => db.clients.filter(c => c.sync_status === 'pending').count()) || 0;
  const pendingVisits = useLiveQuery(() => db.visits.filter(v => v.sync_status === 'pending').count()) || 0;
  const pendingNeeds = useLiveQuery(() => db.visitNeeds.filter(n => n.sync_status === 'pending').count()) || 0;
  const pendingCatalog = useLiveQuery(() => db.catalog.filter(c => c.sync_status === 'pending').count()) || 0;
  
  const totalPending = pendingClients + pendingVisits + pendingNeeds + pendingCatalog;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && totalPending > 0 && !isSyncing) {
      syncData();
    }
  }, [isOnline, totalPending]);

  const syncData = async () => {
    setIsSyncing(true);
    try {
      const clients = await db.clients.filter(c => c.sync_status === 'pending').toArray();
      const visits = await db.visits.filter(v => v.sync_status === 'pending').toArray();
      const visitNeeds = await db.visitNeeds.filter(n => n.sync_status === 'pending').toArray();
      const catalog = await db.catalog.filter(c => c.sync_status === 'pending').toArray();
      const photos = await db.photos.filter(p => p.sync_status === 'pending').toArray();

      const payload = { clients, visits, visitNeeds, catalog, photos };

      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Sync failed on server');
      }

      await db.transaction('rw', [db.clients, db.visits, db.visitNeeds, db.catalog, db.photos], async () => {
        for (const c of clients) await db.clients.update(c.id, { sync_status: 'synced' });
        for (const v of visits) await db.visits.update(v.id, { sync_status: 'synced' });
        for (const n of visitNeeds) await db.visitNeeds.update(n.id, { sync_status: 'synced' });
        for (const c of catalog) await db.catalog.update(c.id, { sync_status: 'synced' });
        for (const p of photos) await db.photos.update(p.id, { sync_status: 'synced' });
      });
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Erreur lors de la synchronisation. Vérifiez votre connexion.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-50 px-3 py-1.5 rounded-full" title={`${totalPending} modifications en attente`}>
        <CloudOff className="w-4 h-4" />
        <span className="hidden sm:inline">Hors ligne</span>
        {totalPending > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{totalPending}</span>}
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="flex items-center gap-2 text-blue-500 text-sm font-medium bg-blue-50 px-3 py-1.5 rounded-full">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="hidden sm:inline">Synchronisation...</span>
      </div>
    );
  }

  if (totalPending > 0) {
    return (
      <div className="flex items-center gap-2 text-amber-500 text-sm font-medium bg-amber-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-amber-100" onClick={syncData}>
        <Cloud className="w-4 h-4" />
        <span className="hidden sm:inline">En attente</span>
        <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{totalPending}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium bg-emerald-50 px-3 py-1.5 rounded-full">
      <Cloud className="w-4 h-4" />
      <span className="hidden sm:inline">Synchronisé</span>
    </div>
  );
}
