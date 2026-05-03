import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Search, Edit2, Trash2, Users, MapPin, Landmark, Filter } from 'lucide-react';

export default function PlanTiers() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const comptesTiers = useStore(state => state.comptesTiers).filter(c => c.dossierId === currentDossierId);
  const comptesGeneraux = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const addCompteTiers = useStore(state => state.addCompteTiers);
  const updateCompteTiers = useStore(state => state.updateCompteTiers);
  const deleteCompteTiers = useStore(state => state.deleteCompteTiers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    numero: '',
    intitule: '',
    type: 'Client' as 'Client' | 'Fournisseur' | 'Salarié' | 'Autre',
    compteGeneralId: '',
    adresse: ''
  });

  const filteredTiers = comptesTiers.filter(c => 
    c.numero.includes(searchTerm) || c.intitule.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.numero.localeCompare(b.numero));

  const dossierComptesCollectifs = comptesGeneraux.filter(c => c.type === 'Détail');

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ numero: '', intitule: '', type: 'Client', compteGeneralId: '', adresse: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tiers: any) => {
    setEditingId(tiers.id);
    setFormData({ ...tiers });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDossierId) return;

    if (editingId) {
      updateCompteTiers(editingId, formData);
    } else {
      addCompteTiers({ ...formData, dossierId: currentDossierId });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce compte tiers ?")) deleteCompteTiers(id);
  };

  return (
    <div className="space-y-8 h-full flex flex-col p-4 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-[1.2rem] text-white shadow-xl shadow-indigo-100">
              <Users size={28} />
            </div>
            Plan Tiers Elite
          </h1>
          <p className="text-slate-500 font-medium mt-2">Gestion centralisée des entités externes — Clients, Fournisseurs et Personnel.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs flex items-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 uppercase tracking-widest"
        >
          <Plus size={18} />
          AJOUTER UN TIERS
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-96">
            <input 
              type="text" 
              placeholder="Rechercher (Identifiant ou Nom)..."
              className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-2xl font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} className="absolute left-4 top-4 text-slate-400" />
          </div>
          <div className="flex gap-2">
            {['Client', 'Fournisseur', 'Salarié'].map(type => (
               <button key={type} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all uppercase tracking-widest shadow-sm">
                 {type}S
               </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identifiant</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Désignation</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Compte Collectif</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTiers.map(tiers => {
                const compteCollectif = comptesGeneraux.find(c => c.id === tiers.compteGeneralId);
                return (
                  <tr key={tiers.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-4 font-black text-slate-900 text-lg uppercase tracking-tight">{tiers.numero}</td>
                    <td className="px-8 py-4 font-bold text-slate-700">{tiers.intitule}</td>
                    <td className="px-8 py-4">
                      <span className={px-3 py-1 rounded-lg text-[10px] font-black uppercase }>
                        {tiers.type}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                        <span className="text-xs font-bold text-slate-500">
                          {compteCollectif ? ${compteCollectif.numero} : 'Non rattaché'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEdit(tiers)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(tiers.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-900">{editingId ? 'Modifier le tiers' : 'Nouveau tiers'}</h3>
              <p className="text-slate-500 font-medium">Définissez les paramètres de rattachament comptable.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identifiant Unique</label>
                  <input 
                    type="text" required
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 uppercase"
                    value={formData.numero}
                    onChange={e => setFormData({...formData, numero: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intitulé / Nom</label>
                  <input 
                    type="text" required
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    value={formData.intitule}
                    onChange={e => setFormData({...formData, intitule: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type de tiers</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                  >
                    <option value="Client">Client</option>
                    <option value="Fournisseur">Fournisseur</option>
                    <option value="Salarié">Salarié</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compte Collectif rattaché</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    value={formData.compteGeneralId}
                    onChange={e => setFormData({...formData, compteGeneralId: e.target.value})}
                  >
                    <option value="">Sélectionner un compte collectif...</option>
                    {dossierComptesCollectifs.map(c => (
                      <option key={c.id} value={c.id}>{c.numero} - {c.intitule}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresse & Localisation</label>
                  <textarea 
                    rows={3}
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 resize-none"
                    value={formData.adresse}
                    onChange={e => setFormData({...formData, adresse: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border border-slate-200 rounded-2xl font-black text-xs text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all uppercase tracking-widest flex items-center justify-center gap-2 flex-[2]"
                >
                  {editingId ? 'Mettre à jour' : 'Enregistrer le tiers'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
