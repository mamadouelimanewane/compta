import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { FilePlus, Save } from 'lucide-react';
import { format } from 'date-fns';

export default function SaisiePiece() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [journalId, setJournalId] = useState('');
  const [piece, setPiece] = useState('');

  const currentDossierId = useStore(state => state.currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <FilePlus className="mr-2 text-primary" />
          Saisie par pièce
        </h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center">
          <Save size={16} className="mr-2" /> Enregistrer la pièce
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">En-tête de pièce</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Journal *</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={journalId}
              onChange={e => setJournalId(e.target.value)}
            >
              <option value="">Sélectionner un journal</option>
              {journaux.map(j => (
                <option key={j.id} value={j.id}>{j.code} - {j.intitule}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date de pièce *</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">N° de pièce</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={piece}
              onChange={e => setPiece(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">N° Compte</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Intitulé</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Libellé</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Débit</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Crédit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2">
                <input type="text" className="w-full bg-transparent focus:outline-none" placeholder="Compte..." />
              </td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2">
                <input type="text" className="w-full bg-transparent focus:outline-none" placeholder="Libellé de la ligne..." />
              </td>
              <td className="px-4 py-2">
                <input type="number" className="w-full bg-transparent focus:outline-none text-right" placeholder="0.00" />
              </td>
              <td className="px-4 py-2">
                <input type="number" className="w-full bg-transparent focus:outline-none text-right" placeholder="0.00" />
              </td>
            </tr>
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-200">
            <tr>
              <td colSpan={3} className="px-4 py-3 text-right font-semibold text-slate-700">Total Pièce :</td>
              <td className="px-4 py-3 text-right font-bold text-slate-900">0.00</td>
              <td className="px-4 py-3 text-right font-bold text-slate-900">0.00</td>
            </tr>
            <tr>
              <td colSpan={3} className="px-4 py-3 text-right font-semibold text-rose-600">Solde (Écart) :</td>
              <td colSpan={2} className="px-4 py-3 text-center font-bold text-rose-600">0.00</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
