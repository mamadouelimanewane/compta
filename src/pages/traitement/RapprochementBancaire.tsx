import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CheckSquare, ArrowRightLeft } from 'lucide-react';

export default function RapprochementBancaire() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId && j.type === 'Trésorerie');
  
  const [selectedJournal, setSelectedJournal] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <ArrowRightLeft className="mr-2 text-primary" />
          Rapprochement Bancaire
        </h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50">
            Incorporer extraits
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center">
            <CheckSquare size={16} className="mr-2" /> Valider rapprochement
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Journal de trésorerie</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedJournal}
              onChange={e => setSelectedJournal(e.target.value)}
            >
              <option value="">Sélectionner une banque...</option>
              {journaux.map(j => (
                <option key={j.id} value={j.id}>{j.code} - {j.intitule}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Solde initial de l'extrait</label>
            <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Solde final de l'extrait</label>
            <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary" placeholder="0.00" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 h-[500px]">
        {/* Lignes d'extrait */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-50 p-3 border-b border-slate-200 font-semibold text-slate-700">
            Lignes d'extrait bancaire
          </div>
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center text-slate-400">
            {selectedJournal ? "Aucun extrait incorporé." : "Sélectionnez un journal."}
          </div>
        </div>

        {/* Lignes comptables */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-50 p-3 border-b border-slate-200 font-semibold text-slate-700">
            Écritures comptables non rapprochées
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-500">Date</th>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-500">Libellé</th>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-500 text-right">Montant</th>
                  <th className="px-3 py-2 text-center text-xs">Rapp.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!selectedJournal && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      Sélectionnez un journal pour voir les écritures.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
