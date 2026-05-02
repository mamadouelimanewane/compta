import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Search, Edit2, Trash2, Users } from 'lucide-react';

export default function PlanTiers() {
  const comptesTiers = useStore(state => state.comptesTiers);
  const comptesGeneraux = useStore(state => state.comptes);
  const currentDossierId = useStore(state => state.currentDossierId);
  const addCompteTiers = useStore(state => state.addCompteTiers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    numero: '',
    intitule: '',
    type: 'Client' as 'Client' | 'Fournisseur' | 'Salarié' | 'Autre',
    compteGeneralId: '',
    adresse: ''
  });

  const dossierTiers = comptesTiers.filter(c => c.dossierId === currentDossierId);
  const dossierComptesCollectifs = comptesGeneraux.filter(c => c.dossierId === currentDossierId && c.type === 'Détail');
  
  const filteredTiers = dossierTiers.filter(c => 
    c.numero.includes(searchTerm) || c.intitule.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.numero.localeCompare(b.numero));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentDossierId) {
      addCompteTiers({
        ...formData,
        dossierId: currentDossierId
      });
      setIsModalOpen(false);
      setFormData({
        numero: '',
        intitule: '',
        type: 'Client',
        compteGeneralId: '',
        adresse: ''
      });
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Plan Tiers</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2 shadow-sm"
        >
          <Plus size={16} />
          <span>Ajouter un tiers</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
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
            {filteredTiers.length} tiers
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-white shadow-sm z-10 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Numéro</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Intitulé</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">Compte rattaché</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTiers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <Users size={32} className="text-slate-300 mb-2" />
                      <p>Aucun tiers trouvé.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTiers.map(tiers => {
                  const compteCollectif = comptesGeneraux.find(c => c.id === tiers.compteGeneralId);
                  return (
                    <tr key={tiers.id} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-6 py-3 font-semibold text-slate-900">{tiers.numero}</td>
                      <td className="px-6 py-3 text-slate-700">{tiers.intitule}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tiers.type === 'Client' ? 'bg-blue-100 text-blue-800' :
                          tiers.type === 'Fournisseur' ? 'bg-emerald-100 text-emerald-800' :
                          tiers.type === 'Salarié' ? 'bg-purple-100 text-purple-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {tiers.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-600">
                        {compteCollectif ? `${compteCollectif.numero} - ${compteCollectif.intitule}` : '-'}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900">Nouveau compte tiers</h3>
            </div>
            
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Numéro du tiers *</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                  value={formData.numero}
                  onChange={e => setFormData({...formData, numero: e.target.value.toUpperCase()})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Intitulé / Raison sociale *</label>
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
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                  >
                    <option value="Client">Client</option>
                    <option value="Fournisseur">Fournisseur</option>
                    <option value="Salarié">Salarié</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Compte rattaché</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.compteGeneralId}
                    onChange={e => setFormData({...formData, compteGeneralId: e.target.value})}
                  >
                    <option value="">Sélectionner</option>
                    {dossierComptesCollectifs.map(c => (
                      <option key={c.id} value={c.id}>{c.numero}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                <textarea 
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  value={formData.adresse}
                  onChange={e => setFormData({...formData, adresse: e.target.value})}
                ></textarea>
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
