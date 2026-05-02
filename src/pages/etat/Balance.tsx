import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { FileText, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function Balance() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  
  const [dateDebut, setDateDebut] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
  const [dateFin, setDateFin] = useState(format(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd'));

  const balanceData = useMemo(() => {
    const lignesFiltrees = lignesEcriture.filter(l => l.date >= dateDebut && l.date <= dateFin);
    
    const result = comptes.map(compte => {
      const lignesCompte = lignesFiltrees.filter(l => l.compteGeneralId === compte.id);
      const totalDebit = lignesCompte.reduce((sum, l) => sum + l.debit, 0);
      const totalCredit = lignesCompte.reduce((sum, l) => sum + l.credit, 0);
      const soldeDebiteur = totalDebit > totalCredit ? totalDebit - totalCredit : 0;
      const soldeCrediteur = totalCredit > totalDebit ? totalCredit - totalDebit : 0;
      
      return {
        compte,
        totalDebit,
        totalCredit,
        soldeDebiteur,
        soldeCrediteur,
        hasMovements: totalDebit > 0 || totalCredit > 0
      };
    });

    return result.filter(r => r.hasMovements).sort((a, b) => a.compte.numero.localeCompare(b.compte.numero));
  }, [comptes, lignesEcriture, dateDebut, dateFin]);

  const totalGeneralDebit = balanceData.reduce((sum, r) => sum + r.totalDebit, 0);
  const totalGeneralCredit = balanceData.reduce((sum, r) => sum + r.totalCredit, 0);
  const totalGeneralSoldeDebiteur = balanceData.reduce((sum, r) => sum + r.soldeDebiteur, 0);
  const totalGeneralSoldeCrediteur = balanceData.reduce((sum, r) => sum + r.soldeCrediteur, 0);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <FileText className="mr-2 text-primary" />
          Balance des comptes
        </h1>
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 flex items-center space-x-2 shadow-sm print:hidden"
        >
          <Download size={16} />
          <span>Exporter (PDF) / Imprimer</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap gap-4 items-end print:hidden">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date de début</label>
          <input 
            type="date" 
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date de fin</label>
          <input 
            type="date" 
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden print:overflow-visible print:border-none print:shadow-none">
        <div className="flex-1 overflow-auto print:overflow-visible">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-slate-50 shadow-sm z-10 border-b border-slate-200">
              <tr>
                <th rowSpan={2} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-200">Compte</th>
                <th rowSpan={2} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-200">Intitulé</th>
                <th colSpan={2} className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center border-b border-r border-slate-200">Mouvements</th>
                <th colSpan={2} className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Soldes</th>
              </tr>
              <tr>
                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right border-r border-slate-200">Débit</th>
                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right border-r border-slate-200">Crédit</th>
                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right border-r border-slate-200">Débiteur</th>
                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Créditeur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {balanceData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Aucun mouvement sur la période sélectionnée.
                  </td>
                </tr>
              ) : (
                balanceData.map((row) => (
                  <tr key={row.compte.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-900 border-r border-slate-100">{row.compte.numero}</td>
                    <td className="px-4 py-2 text-slate-700 border-r border-slate-100">{row.compte.intitule}</td>
                    <td className="px-4 py-2 text-right text-slate-700 border-r border-slate-100">
                      {row.totalDebit > 0 ? row.totalDebit.toFixed(2) : '-'}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-700 border-r border-slate-100">
                      {row.totalCredit > 0 ? row.totalCredit.toFixed(2) : '-'}
                    </td>
                    <td className="px-4 py-2 text-right text-indigo-700 font-medium border-r border-slate-100">
                      {row.soldeDebiteur > 0 ? row.soldeDebiteur.toFixed(2) : '-'}
                    </td>
                    <td className="px-4 py-2 text-right text-indigo-700 font-medium">
                      {row.soldeCrediteur > 0 ? row.soldeCrediteur.toFixed(2) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {balanceData.length > 0 && (
              <tfoot className="sticky bottom-0 bg-indigo-50 border-t border-indigo-100">
                <tr>
                  <td colSpan={2} className="px-4 py-3 font-bold text-slate-900 text-right border-r border-indigo-100 uppercase text-sm">Totaux Généraux</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 border-r border-indigo-100">
                    {totalGeneralDebit.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 border-r border-indigo-100">
                    {totalGeneralCredit.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-indigo-700 border-r border-indigo-100">
                    {totalGeneralSoldeDebiteur.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-indigo-700">
                    {totalGeneralSoldeCrediteur.toFixed(2)}
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
