import { useStore } from '../../store/useStore';
import { Lock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function ClotureJournaux() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  
  const [typeCloture, setTypeCloture] = useState('partielle');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Lock className="mr-2 text-primary" />
          Clôture des journaux
        </h1>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="text-amber-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <h3 className="font-medium text-amber-800">Attention, opération sensible</h3>
          <p className="text-sm text-amber-700 mt-1">
            La clôture des journaux verrouille les écritures validées. Elles ne pourront plus être modifiées ni supprimées.
            Une clôture totale empêchera même la saisie de nouvelles écritures sur les journaux sélectionnés.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-3">Type de clôture</h3>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                className="text-primary focus:ring-primary" 
                checked={typeCloture === 'partielle'} 
                onChange={() => setTypeCloture('partielle')} 
              />
              <span className="text-slate-700">Clôture partielle (Gèle les écritures passées)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                className="text-primary focus:ring-primary" 
                checked={typeCloture === 'totale'} 
                onChange={() => setTypeCloture('totale')} 
              />
              <span className="text-slate-700">Clôture totale (Bloque tout le journal)</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-3">Période à clôturer</h3>
          <div className="flex space-x-4 items-end">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Mois de clôture (inclus)</label>
              <input type="month" className="px-3 py-2 border border-slate-300 rounded-md focus:ring-primary" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-3">Sélection des journaux</h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 w-12 text-center"><input type="checkbox" className="rounded" /></th>
                  <th className="px-4 py-2 text-sm font-medium text-slate-600">Code</th>
                  <th className="px-4 py-2 text-sm font-medium text-slate-600">Intitulé</th>
                  <th className="px-4 py-2 text-sm font-medium text-slate-600">État actuel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {journaux.map(j => (
                  <tr key={j.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-center"><input type="checkbox" className="rounded text-primary" /></td>
                    <td className="px-4 py-2 font-medium text-slate-800">{j.code}</td>
                    <td className="px-4 py-2 text-slate-600">{j.intitule}</td>
                    <td className="px-4 py-2 text-sm text-emerald-600">Ouvert</td>
                  </tr>
                ))}
                {journaux.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-500">Aucun journal trouvé.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button className="px-6 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center font-medium">
            <Lock size={18} className="mr-2" /> Exécuter la clôture
          </button>
        </div>
      </div>
    </div>
  );
}
