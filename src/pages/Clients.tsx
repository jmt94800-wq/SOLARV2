import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { Plus, MapPin, Edit2, Save, X, User, Phone, Mail, MessageSquare } from 'lucide-react';

export default function Clients() {
  const clients = useLiveQuery(() => db.clients.orderBy('created_at').reverse().toArray());
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editContactName, setEditContactName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editComment, setEditComment] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await db.clients.add({
      id: uuidv4(),
      name,
      main_address: address,
      contact_name: contactName,
      phone,
      email,
      comment,
      sync_status: 'pending',
      created_at: Date.now()
    });
    setName('');
    setAddress('');
    setContactName('');
    setPhone('');
    setEmail('');
    setComment('');
    setIsAdding(false);
  };

  const startEditing = (client: any) => {
    setEditingId(client.id);
    setEditName(client.name);
    setEditAddress(client.main_address || '');
    setEditContactName(client.contact_name || '');
    setEditPhone(client.phone || '');
    setEditEmail(client.email || '');
    setEditComment(client.comment || '');
  };

  const handleSaveEdit = async (id: string) => {
    await db.clients.update(id, {
      name: editName,
      main_address: editAddress,
      contact_name: editContactName,
      phone: editPhone,
      email: editEmail,
      comment: editComment,
      sync_status: 'pending'
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
          <Plus className="w-4 h-4" /> Nouveau Client
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom du client</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adresse principale</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom du contact</label>
              <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Commentaire</label>
              <input type="text" value={comment} onChange={e => setComment(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Enregistrer</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients?.map(client => (
          <div key={client.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative group">
            {editingId === client.id ? (
              <div className="space-y-3">
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full border border-slate-300 rounded px-2 py-1 font-bold text-slate-900" placeholder="Nom du client" />
                <input type="text" value={editAddress} onChange={e => setEditAddress(e.target.value)} className="w-full border border-slate-300 rounded px-2 py-1 text-sm text-slate-600" placeholder="Adresse" />
                <input type="text" value={editContactName} onChange={e => setEditContactName(e.target.value)} className="w-full border border-slate-300 rounded px-2 py-1 text-sm text-slate-600" placeholder="Nom du contact" />
                <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full border border-slate-300 rounded px-2 py-1 text-sm text-slate-600" placeholder="Téléphone" />
                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full border border-slate-300 rounded px-2 py-1 text-sm text-slate-600" placeholder="Email" />
                <textarea value={editComment} onChange={e => setEditComment(e.target.value)} className="w-full border border-slate-300 rounded px-2 py-1 text-sm text-slate-600" placeholder="Commentaire" rows={2} />
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setEditingId(null)} className="p-1 text-slate-500 hover:bg-slate-100 rounded">
                    <X className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleSaveEdit(client.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => startEditing(client)} 
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-lg text-slate-900 pr-8">{client.name}</h3>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2 text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{client.main_address || 'Aucune adresse'}</p>
                  </div>
                  
                  {client.contact_name && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <User className="w-4 h-4 shrink-0" />
                      <p>{client.contact_name}</p>
                    </div>
                  )}
                  
                  {client.phone && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Phone className="w-4 h-4 shrink-0" />
                      <p>{client.phone}</p>
                    </div>
                  )}
                  
                  {client.email && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Mail className="w-4 h-4 shrink-0" />
                      <p>{client.email}</p>
                    </div>
                  )}
                  
                  {client.comment && (
                    <div className="flex items-start gap-2 text-slate-500 text-sm mt-3 pt-3 border-t border-slate-100">
                      <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" />
                      <p className="italic">{client.comment}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        {clients?.length === 0 && <p className="text-slate-500 col-span-full">Aucun client trouvé.</p>}
      </div>
    </div>
  );
}
