import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function PlanComptable() {
  const comptes = useStore(state => state.comptes);
  const currentDossierId = useStore(state => state.currentDossierId);
  const addCompte = useStore(state => state.addCompte);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    numero: '',
    intitule: '',
    type: 'Détail' as 'Détail' | 'Total',
    nature: 'Charge' as any,
    saisieAnalytique: false,
    saisieEcheance: false,
    lettrageAutomatique: false
  });

  const dossierComptes = comptes.filter(c => c.dossierId === currentDossierId);
  
  const filteredComptes = dossierComptes.filter(c => 
    c.numero.includes(searchTerm) || c.intitule.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.numero.localeCompare(b.numero));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentDossierId) {
      addCompte({
        ...formData,
        dossierId: currentDossierId
      });
      setIsModalOpen(false);
      setFormData({
        numero: '',
        intitule: '',
        type: 'Détail',
        nature: 'Charge',
        saisieAnalytique: false,
        saisieEcheance: false,
        lettrageAutomatique: false
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Plan Comptable</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2 shadow-sm"
        >
          <Plus size={16} />
          <span>Ajouter un compte</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Rechercher (Numéro ou Intitulé)..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          </div>
          <div className="text-sm text-slate-500">
            {filteredComptes.length} compte(s)
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr className="border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Numéro</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Intitulé</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nature</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComptes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Aucun compte trouvé.
                  </td>
                </tr>
              ) : (
                filteredComptes.map(compte => (
                  <tr key={compte.id} className="hover:bg-slate-50 cursor-pointer">
                    <td className="px-6 py-3 font-medium text-slate-900">{compte.numero}</td>
                    <td className="px-6 py-3 text-slate-700">{compte.intitule}</td>
                    <td className="px-6 py-3 text-sm text-slate-500">{compte.nature}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        compte.type === 'Total' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {compte.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900">Nouveau compte général</h3>
            </div>
            
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Numéro de compte *</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.numero}
                  onChange={e => setFormData({...formData, numero: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Intitulé *</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.intitule}
                  onChange={e => setFormData({...formData, intitule: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as 'Détail' | 'Total'})}
                  >
                    <option value="Détail">Détail</option>
                    <option value="Total">Total</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nature *</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.nature}
                    onChange={e => setFormData({...formData, nature: e.target.value as any})}
                  >
                    <option value="Charge">Charge</option>
                    <option value="Produit">Produit</option>
                    <option value="Trésorerie">Trésorerie</option>
                    <option value="Immobilisation">Immobilisation</option>
                    <option value="Capitaux">Capitaux</option>
                    <option value="Tiers">Tiers</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center space-x-2 text-sm text-slate-700">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    checked={formData.saisieAnalytique}
                    onChange={e => setFormData({...formData, saisieAnalytique: e.target.checked})}
                  />
                  <span>Saisie analytique</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-700">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    checked={formData.saisieEcheance}
                    onChange={e => setFormData({...formData, saisieEcheance: e.target.checked})}
                  />
                  <span>Saisie échéance</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-700">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    checked={formData.lettrageAutomatique}
                    onChange={e => setFormData({...formData, lettrageAutomatique: e.target.checked})}
                  />
                  <span>Lettrage automatique</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
