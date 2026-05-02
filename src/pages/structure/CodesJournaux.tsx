import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Search, Edit2, Trash2, Book } from 'lucide-react';

export default function CodesJournaux() {
  const journaux = useStore(state => state.journaux);
  const currentDossierId = useStore(state => state.currentDossierId);
  const addJournal = useStore(state => state.addJournal);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    intitule: '',
    type: 'Achat' as 'Achat' | 'Vente' | 'Trésorerie' | 'Général' | 'Situation',
  });

  const dossierJournaux = journaux.filter(j => j.dossierId === currentDossierId);
  
  const filteredJournaux = dossierJournaux.filter(j => 
    j.code.toLowerCase().includes(searchTerm.toLowerCase()) || j.intitule.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.code.localeCompare(b.code));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentDossierId) {
      addJournal({
        ...formData,
        dossierId: currentDossierId
      });
      setIsModalOpen(false);
      setFormData({
        code: '',
        intitule: '',
        type: 'Achat'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Codes Journaux</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2 shadow-sm"
        >
          <Plus size={16} />
          <span>Ajouter un journal</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          </div>
          <div className="text-sm text-slate-500">
            {filteredJournaux.length} journal(x)
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr className="border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Code</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Intitulé</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJournaux.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <Book size={32} className="text-slate-300 mb-2" />
                      <p>Aucun journal trouvé.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredJournaux.map(journal => (
                  <tr key={journal.id} className="hover:bg-slate-50 cursor-pointer">
                    <td className="px-6 py-3 font-semibold text-indigo-700">{journal.code}</td>
                    <td className="px-6 py-3 text-slate-700">{journal.intitule}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700`}>
                        {journal.type}
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
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center space-x-2">
              <Book className="text-primary" size={20} />
              <h3 className="text-lg font-semibold text-slate-900">Nouveau code journal</h3>
            </div>
            
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code journal (3-4 car.) *</label>
                <input 
                  type="text" 
                  required
                  maxLength={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="Achat">Achat</option>
                  <option value="Vente">Vente</option>
                  <option value="Trésorerie">Trésorerie</option>
                  <option value="Général">Général (OD)</option>
                  <option value="Situation">Situation</option>
                </select>
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
