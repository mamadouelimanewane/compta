import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Search, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function InterrogationTiers() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const tiers = useStore(state => state.comptesTiers).filter(t => t.dossierId === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  
  const [selectedTiersId, setSelectedTiersId] = useState<string>('');
  const [dateDebut, setDateDebut] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
  const [dateFin, setDateFin] = useState(format(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd'));

  const tiersLignes = useMemo(() => {
    if (!selectedTiersId) return [];
    
    return lignesEcriture
      .filter(l => l.compteTiersId === selectedTiersId && l.date >= dateDebut && l.date <= dateFin)
      .map(l => ({
        ...l,
        journal: journaux.find(j => j.id === l.journalId)
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedTiersId, lignesEcriture, journaux, dateDebut, dateFin]);

  const totalDebit = tiersLignes.reduce((sum, l) => sum + l.debit, 0);
  const totalCredit = tiersLignes.reduce((sum, l) => sum + l.credit, 0);
  const solde = totalDebit - totalCredit;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Search className="mr-2 text-primary" />
          Interrogation Tiers
        </h1>
        <button 
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 flex items-center shadow-sm"
          disabled={!selectedTiersId}
        >
          <FileText size={16} className="mr-2" /> Générer Relevé
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-sm font-medium text-slate-700 mb-1">Compte Tiers</label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
            value={selectedTiersId}
            onChange={(e) => setSelectedTiersId(e.target.value)}
          >
            <option value="">Sélectionner un tiers...</option>
            {tiers.map(t => (
              <option key={t.id} value={t.id}>{t.numero} - {t.intitule}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date de début</label>
          <input 
            type="date" 
            className="px-3 py-2 border border-slate-300 rounded-md focus:ring-primary"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date de fin</label>
          <input 
            type="date" 
            className="px-3 py-2 border border-slate-300 rounded-md focus:ring-primary"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 shadow-sm border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Journal</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">N° Pièce</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Libellé</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Lettrage</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Débit</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Crédit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!selectedTiersId ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Sélectionnez un tiers pour visualiser ses mouvements.
                  </td>
                </tr>
              ) : tiersLignes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Aucun mouvement pour ce tiers sur la période sélectionnée.
                  </td>
                </tr>
              ) : (
                tiersLignes.map(ligne => (
                  <tr key={ligne.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-sm">{format(new Date(ligne.date), 'dd/MM/yyyy')}</td>
                    <td className="px-4 py-2 text-sm font-medium text-slate-700">{ligne.journal?.code}</td>
                    <td className="px-4 py-2 text-sm">{ligne.numeroPiece}</td>
                    <td className="px-4 py-2 text-sm text-slate-700">{ligne.libelle}</td>
                    <td className="px-4 py-2 text-sm font-bold text-emerald-600">{ligne.lettrage || ''}</td>
                    <td className="px-4 py-2 text-sm text-right text-slate-700">{ligne.debit > 0 ? ligne.debit.toFixed(2) : ''}</td>
                    <td className="px-4 py-2 text-sm text-right text-slate-700">{ligne.credit > 0 ? ligne.credit.toFixed(2) : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
            {selectedTiersId && tiersLignes.length > 0 && (
              <tfoot className="sticky bottom-0 bg-indigo-50 border-t border-indigo-100">
                <tr>
                  <td colSpan={5} className="px-4 py-3 font-bold text-slate-900 text-right uppercase text-sm">Totaux</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">{totalDebit.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">{totalCredit.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={5} className="px-4 py-3 font-bold text-indigo-700 text-right uppercase text-sm border-t border-slate-100">Solde {solde >= 0 ? 'Débiteur' : 'Créditeur'}</td>
                  <td colSpan={2} className="px-4 py-3 text-right font-bold text-indigo-700 text-lg border-t border-slate-100">
                    {Math.abs(solde).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
