import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Filter, CheckCircle } from 'lucide-react';

export default function Lettrage() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);

  const [selectedCompte, setSelectedCompte] = useState('');

  const filteredLignes = lignes.filter(l => l.compteGeneralId === selectedCompte);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <CheckCircle className="mr-2 text-primary" />
          Interrogation et Lettrage
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-slate-700 mb-1">Compte à interroger</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedCompte}
              onChange={(e) => setSelectedCompte(e.target.value)}
            >
              <option value="">Sélectionnez un compte...</option>
              {comptes.map(c => (
                <option key={c.id} value={c.id}>{c.numero} - {c.intitule}</option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 flex items-center">
            <Filter size={16} className="mr-2" /> Filtrer les non-lettrés
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Journal</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Libellé</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Débit</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Crédit</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Lettrage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredLignes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Sélectionnez un compte pour voir ses écritures.
                </td>
              </tr>
            ) : (
              filteredLignes.map(ligne => (
                <tr key={ligne.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 text-sm">{ligne.date}</td>
                  <td className="px-4 py-2 text-sm text-slate-500">{ligne.journalId}</td>
                  <td className="px-4 py-2 text-sm truncate max-w-xs">{ligne.libelle}</td>
                  <td className="px-4 py-2 text-sm text-right">{ligne.debit > 0 ? ligne.debit.toLocaleString('fr-FR') : ''}</td>
                  <td className="px-4 py-2 text-sm text-right">{ligne.credit > 0 ? ligne.credit.toLocaleString('fr-FR') : ''}</td>
                  <td className="px-4 py-2 text-sm text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
