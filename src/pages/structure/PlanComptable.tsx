import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Search, Edit2, Trash2, BookOpen, Download } from 'lucide-react';

export default function PlanComptable() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const addCompte = useStore(state => state.addCompte);
  const updateCompte = useStore(state => state.updateCompte);
  const deleteCompte = useStore(state => state.deleteCompte);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    numero: '',
    intitule: '',
    type: 'Détail' as 'Détail' | 'Total',
    nature: 'Charge' as any,
    saisieAnalytique: false,
    saisieEcheance: false,
    lettrageAutomatique: false
  });

  const filteredComptes = comptes.filter(c => 
    c.numero.includes(searchTerm) || c.intitule.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.numero.localeCompare(b.numero));

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      numero: '', intitule: '', type: 'Détail', nature: 'Charge',
      saisieAnalytique: false, saisieEcheance: false, lettrageAutomatique: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (compte: any) => {
    setEditingId(compte.id);
    setFormData({ ...compte });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDossierId) return;

    if (editingId) {
      updateCompte(editingId, formData);
    } else {
      addCompte({ ...formData, dossierId: currentDossierId });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce compte ?")) deleteCompte(id);
  };

  return (
    <div className="space-y-8 h-full flex flex-col p-4 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-[1.2rem] text-white shadow-xl shadow-indigo-100">
              <BookOpen size={28} />
            </div>
            Plan Comptable
          </h1>
          <p className="text-slate-500 font-medium mt-2">Architecture structurelle du dossier — Référentiel SYSCOHADA.</p>
        </div>
        <div className="flex gap-3">
          <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={20} />
          </button>
          <button 
            onClick={handleOpenAdd}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs flex items-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={18} />
            AJOUTER UN COMPTE
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-96">
            <input 
              type="text" 
              placeholder="Rechercher un compte (n° ou libellé)..."
              className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-2xl font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} className="absolute left-4 top-4 text-slate-400" />
          </div>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest">
                {filteredComptes.length} COMPTES ACTIFS
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Intitulé</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nature</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredComptes.map(compte => (
                <tr key={compte.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4 font-black text-indigo-600 text-lg">{compte.numero}</td>
                  <td className="px-8 py-4 font-bold text-slate-900">{compte.intitule}</td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase">
                      {compte.nature}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${compte.type === 'Total' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {compte.type}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEdit(compte)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(compte.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-900">{editingId ? 'Modifier le compte' : 'Nouveau compte général'}</h3>
              <p className="text-slate-500 font-medium">Configurez les attributs du compte selon le plan OHADA.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro de compte</label>
                  <input 
                    type="text" required
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    value={formData.numero}
                    onChange={e => setFormData({...formData, numero: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intitulé</label>
                  <input 
                    type="text" required
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    value={formData.intitule}
                    onChange={e => setFormData({...formData, intitule: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nature</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    value={formData.nature}
                    onChange={e => setFormData({...formData, nature: e.target.value as any})}
                  >
                    {['Charge', 'Produit', 'Trésorerie', 'Immobilisation', 'Capitaux', 'Tiers', 'Autre'].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                  >
                    <option value="Détail">Détail</option>
                    <option value="Total">Total</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-indigo-300 text-indigo-600 focus:ring-indigo-500" checked={formData.saisieAnalytique} onChange={e => setFormData({...formData, saisieAnalytique: e.target.checked})} />
                  <span className="text-xs font-black text-indigo-900 uppercase">Analytique</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-indigo-300 text-indigo-600 focus:ring-indigo-500" checked={formData.saisieEcheance} onChange={e => setFormData({...formData, saisieEcheance: e.target.checked})} />
                  <span className="text-xs font-black text-indigo-900 uppercase">Échéancier</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-indigo-300 text-indigo-600 focus:ring-indigo-500" checked={formData.lettrageAutomatique} onChange={e => setFormData({...formData, lettrageAutomatique: e.target.checked})} />
                  <span className="text-xs font-black text-indigo-900 uppercase">Lettrage Auto</span>
                </label>
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
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all uppercase tracking-widest"
                >
                  {editingId ? 'Mettre à jour' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
