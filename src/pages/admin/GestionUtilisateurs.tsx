import { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, Eye, EyeOff, Check, X } from 'lucide-react';

export type Role = 'Administrateur' | 'Comptable' | 'Dirigeant' | 'Expert-Comptable';

interface UserProfile {
  id: string;
  nom: string;
  email: string;
  role: Role;
  actif: boolean;
  derniereConnexion?: string;
}

const ROLE_COLORS: Record<Role, string> = {
  'Administrateur': 'bg-rose-100 text-rose-700',
  'Comptable': 'bg-indigo-100 text-indigo-700',
  'Dirigeant': 'bg-emerald-100 text-emerald-700',
  'Expert-Comptable': 'bg-amber-100 text-amber-700',
};

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  'Administrateur': ['Tous les modules', 'Gestion des utilisateurs', 'Paramètres société', 'Clôture exercice'],
  'Comptable': ['Saisie', 'Lettrage', 'Balance', 'Grand-Livre', 'Bilan', 'TVA'],
  'Dirigeant': ['Tableau de bord (lecture)', 'Bilan (lecture)', 'Compte de résultat (lecture)', 'Budget'],
  'Expert-Comptable': ['Tous les états', 'Balance', 'Grand-Livre', 'Bilan', 'Compte de résultat', 'FEC Export'],
};

const defaultUsers: UserProfile[] = [
  { id: '1', nom: 'Administrateur Système', email: 'admin@societe.com', role: 'Administrateur', actif: true, derniereConnexion: new Date().toISOString() },
  { id: '2', nom: 'Marie Dupont', email: 'comptable@societe.com', role: 'Comptable', actif: true, derniereConnexion: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', nom: 'Jean Martin', email: 'dg@societe.com', role: 'Dirigeant', actif: true },
];

export default function GestionUtilisateurs() {
  const [users, setUsers] = useState<UserProfile[]>(defaultUsers);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState<Partial<UserProfile & { password: string }>>({
    nom: '', email: '', role: 'Comptable', actif: true
  });

  const saveUser = () => {
    if (selectedUser) {
      setUsers(u => u.map(x => x.id === selectedUser.id ? { ...x, ...form } as UserProfile : x));
    } else {
      setUsers(u => [...u, { ...form, id: Date.now().toString(), actif: true } as UserProfile]);
    }
    setShowForm(false);
    setSelectedUser(null);
    setForm({ nom: '', email: '', role: 'Comptable', actif: true });
  };

  const editUser = (user: UserProfile) => {
    setSelectedUser(user);
    setForm(user);
    setShowForm(true);
  };

  const deleteUser = (id: string) => {
    if (id === '1') { alert('Impossible de supprimer l\'administrateur système.'); return; }
    setUsers(u => u.filter(x => x.id !== id));
  };

  const toggleActif = (id: string) => {
    setUsers(u => u.map(x => x.id === id ? { ...x, actif: !x.actif } : x));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Shield className="mr-2 text-primary" />
          Gestion des Utilisateurs & Droits
        </h1>
        <button onClick={() => { setShowForm(true); setSelectedUser(null); setForm({ nom: '', email: '', role: 'Comptable', actif: true }); }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center shadow-sm">
          <Plus size={16} className="mr-2" /> Nouvel utilisateur
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-3">{selectedUser ? 'Modifier utilisateur' : 'Créer un utilisateur'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label><input className="w-full px-3 py-2 border border-slate-300 rounded-md" value={form.nom || ''} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Adresse e-mail</label><input type="email" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-md" value={form.role || 'Comptable'} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}>
                {(Object.keys(ROLE_COLORS) as Role[]).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe {selectedUser && '(laisser vide pour conserver)'}</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="w-full px-3 py-2 border border-slate-300 rounded-md pr-10" placeholder="••••••••" onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <button type="button" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowPass(p => !p)}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
          </div>

          {form.role && (
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm font-semibold text-indigo-800 mb-2">Permissions du rôle "{form.role}" :</p>
              <div className="flex flex-wrap gap-2">
                {ROLE_PERMISSIONS[form.role as Role].map(p => <span key={p} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs flex items-center"><Check size={11} className="mr-1" />{p}</span>)}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 border-t pt-4">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50">Annuler</button>
            <button onClick={saveUser} className="px-6 py-2 bg-primary text-white rounded-md hover:bg-indigo-700">Enregistrer</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Utilisateur</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Rôle</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Statut</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Dernière connexion</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className={`hover:bg-slate-50 ${!u.actif ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {u.nom.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-800">{u.nom}</span>
                </td>
                <td className="px-4 py-3 text-slate-600 text-sm">{u.email}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role]}`}>{u.role}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActif(u.id)} className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full transition-colors ${u.actif ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    {u.actif ? <><Check size={12} className="mr-1" />Actif</> : <><X size={12} className="mr-1" />Inactif</>}
                  </button>
                </td>
                <td className="px-4 py-3 text-slate-500 text-sm">{u.derniereConnexion ? new Date(u.derniereConnexion).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'Jamais'}</td>
                <td className="px-4 py-3 flex items-center space-x-2">
                  <button onClick={() => editUser(u)} className="p-1.5 rounded hover:bg-slate-200 text-slate-500"><Edit2 size={14} /></button>
                  <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded hover:bg-rose-100 text-rose-500"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center"><Shield size={16} className="mr-2 text-primary" />Matrice des permissions par rôle</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.entries(ROLE_PERMISSIONS) as [Role, string[]][]).map(([role, perms]) => (
            <div key={role} className="border border-slate-200 rounded-lg p-4">
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${ROLE_COLORS[role]} mb-3 inline-block`}>{role}</span>
              <ul className="space-y-1">
                {perms.map(p => <li key={p} className="text-xs text-slate-600 flex items-center"><Check size={11} className="mr-1.5 text-emerald-500 flex-shrink-0" />{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
