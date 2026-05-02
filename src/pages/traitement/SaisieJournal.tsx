import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function SaisieJournal() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  
  const addLigneEcriture = useStore(state => state.addLigneEcriture);
  const deleteLigneEcriture = useStore(state => state.deleteLigneEcriture);

  const [selectedJournalId, setSelectedJournalId] = useState<string>(journaux[0]?.id || '');
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));

  // Formulaire nouvelle ligne
  const [newLine, setNewLine] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    numeroPiece: '',
    reference: '',
    compteGeneralId: '',
    libelle: '',
    debit: '',
    credit: ''
  });

  const filteredLignes = lignesEcriture.filter(l => 
    l.journalId === selectedJournalId && 
    l.date.startsWith(selectedMonth)
  ).sort((a, b) => a.date.localeCompare(b.date));

  const totalDebit = filteredLignes.reduce((sum, l) => sum + l.debit, 0);
  const totalCredit = filteredLignes.reduce((sum, l) => sum + l.credit, 0);
  const solde = totalDebit - totalCredit;

  const handleAddLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDossierId || !selectedJournalId || !newLine.compteGeneralId) return;

    addLigneEcriture({
      dossierId: currentDossierId,
      journalId: selectedJournalId,
      date: newLine.date,
      numeroPiece: newLine.numeroPiece,
      reference: newLine.reference,
      compteGeneralId: newLine.compteGeneralId,
      libelle: newLine.libelle,
      debit: parseFloat(newLine.debit) || 0,
      credit: parseFloat(newLine.credit) || 0,
    });

    // Garder la date, numéro de pièce, référence et libellé pour faciliter la saisie multiple
    setNewLine({
      ...newLine,
      compteGeneralId: '',
      debit: '',
      credit: ''
    });
  };

  const selectedJournal = journaux.find(j => j.id === selectedJournalId);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Saisie des écritures</h1>
      </div>

      {/* Header controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
            <FileText size={16} className="mr-1 text-slate-400" />
            Code journal
          </label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
            value={selectedJournalId}
            onChange={(e) => setSelectedJournalId(e.target.value)}
          >
            <option value="" disabled>Sélectionner un journal</option>
            {journaux.map(j => (
              <option key={j.id} value={j.id}>{j.code} - {j.intitule}</option>
            ))}
          </select>
        </div>
        
        <div className="w-48">
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
            <CalendarIcon size={16} className="mr-1 text-slate-400" />
            Période
          </label>
          <input 
            type="month" 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>

        <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 flex space-x-6 min-w-[300px]">
          <div>
            <span className="block text-xs font-medium text-slate-500 uppercase">Total Débit</span>
            <span className="text-lg font-bold text-slate-900">{totalDebit.toFixed(2)}</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500 uppercase">Total Crédit</span>
            <span className="text-lg font-bold text-slate-900">{totalCredit.toFixed(2)}</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500 uppercase">Solde</span>
            <span className={`text-lg font-bold ${Math.abs(solde) > 0.01 ? 'text-red-500' : 'text-emerald-500'}`}>
              {Math.abs(solde) > 0.01 ? solde.toFixed(2) : 'Équilibré'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden min-h-[400px]">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-slate-50 shadow-sm z-10 border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">Date</th>
                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">N° Pièce</th>
                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Référence</th>
                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Compte</th>
                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Libellé</th>
                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32 text-right">Débit</th>
                <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32 text-right">Crédit</th>
                <th className="px-3 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLignes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    Aucune écriture pour ce journal et ce mois.
                  </td>
                </tr>
              ) : (
                filteredLignes.map(ligne => {
                  const compte = comptes.find(c => c.id === ligne.compteGeneralId);
                  return (
                    <tr key={ligne.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-sm">{format(new Date(ligne.date), 'dd/MM/yyyy')}</td>
                      <td className="px-3 py-2 text-sm">{ligne.numeroPiece}</td>
                      <td className="px-3 py-2 text-sm">{ligne.reference}</td>
                      <td className="px-3 py-2 text-sm font-medium" title={compte?.intitule}>{compte?.numero}</td>
                      <td className="px-3 py-2 text-sm truncate max-w-xs">{ligne.libelle}</td>
                      <td className="px-3 py-2 text-sm text-right text-indigo-700 font-medium">{ligne.debit > 0 ? ligne.debit.toFixed(2) : ''}</td>
                      <td className="px-3 py-2 text-sm text-right text-indigo-700 font-medium">{ligne.credit > 0 ? ligne.credit.toFixed(2) : ''}</td>
                      <td className="px-3 py-2 text-right">
                        <button 
                          onClick={() => deleteLigneEcriture(ligne.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Saisie row */}
            {selectedJournal && (
              <tfoot className="sticky bottom-0 bg-indigo-50/50 border-t border-slate-200">
                <tr>
                  <td className="px-2 py-2">
                    <input 
                      type="date" 
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent"
                      value={newLine.date}
                      onChange={e => setNewLine({...newLine, date: e.target.value})}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input 
                      type="text" 
                      placeholder="N° Pièce"
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent"
                      value={newLine.numeroPiece}
                      onChange={e => setNewLine({...newLine, numeroPiece: e.target.value})}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input 
                      type="text" 
                      placeholder="Référence"
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent"
                      value={newLine.reference}
                      onChange={e => setNewLine({...newLine, reference: e.target.value})}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <select 
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent"
                      value={newLine.compteGeneralId}
                      onChange={e => setNewLine({...newLine, compteGeneralId: e.target.value})}
                    >
                      <option value="" disabled>Compte</option>
                      {comptes.map(c => (
                        <option key={c.id} value={c.id}>{c.numero} - {c.intitule}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input 
                      type="text" 
                      placeholder="Libellé"
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent"
                      value={newLine.libelle}
                      onChange={e => setNewLine({...newLine, libelle: e.target.value})}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="Débit"
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent text-right"
                      value={newLine.debit}
                      onChange={e => {
                        setNewLine({...newLine, debit: e.target.value, credit: e.target.value ? '' : newLine.credit});
                      }}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="Crédit"
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent text-right"
                      value={newLine.credit}
                      onChange={e => {
                        setNewLine({...newLine, credit: e.target.value, debit: e.target.value ? '' : newLine.debit});
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAddLine(e);
                      }}
                    />
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button 
                      onClick={handleAddLine}
                      disabled={!newLine.compteGeneralId || (!newLine.debit && !newLine.credit)}
                      className="p-1 text-primary hover:bg-indigo-100 rounded disabled:opacity-50 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
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
