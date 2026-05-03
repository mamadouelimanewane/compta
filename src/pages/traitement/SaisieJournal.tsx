import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, Calendar as CalendarIcon, FileText, Zap, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

export default function SaisieJournal() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  
  const addLigneEcriture = useStore(state => state.addLigneEcriture);
  const deleteLigneEcriture = useStore(state => state.deleteLigneEcriture);

  const [selectedJournalId, setSelectedJournalId] = useState<string>(journaux[0]?.id || '');
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));

  const [newLine, setNewLine] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    numeroPiece: '',
    reference: '',
    compteGeneralId: '',
    libelle: '',
    debit: '',
    credit: '',
    sectionAnalytique: ''
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
      sectionAnalytique: newLine.sectionAnalytique
    });

    setNewLine({
      ...newLine,
      compteGeneralId: '',
      debit: '',
      credit: '',
      sectionAnalytique: ''
    });
  };

  const selectedJournal = journaux.find(j => j.id === selectedJournalId);

  return (
    <div className="space-y-8 p-4 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Zap size={28} />
             </div>
             Saisie Chrono Elite
          </h1>
          <p className="text-slate-500 font-medium mt-2">Saisie comptable et analytique haute performance.</p>
        </div>
        <div className="flex items-center gap-6 px-8 py-4 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Équilibre Période</p>
              <p className={`text-xl font-black ${Math.abs(solde) < 0.01 ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {Math.abs(solde) < 0.01 ? 'ÉQUILIBRÉ' : `${solde.toLocaleString()} ${currentDossier?.devisePrincipale}`}
              </p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck size={24} />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-6 flex flex-wrap gap-8 items-center">
        <div className="flex-1 min-w-[250px]">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Journal de Saisie</label>
           <select 
             className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-black text-slate-900"
             value={selectedJournalId}
             onChange={(e) => setSelectedJournalId(e.target.value)}
           >
             {journaux.map(j => <option key={j.id} value={j.id}>{j.code} - {j.intitule}</option>)}
           </select>
        </div>
        <div className="w-48">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Mois Fiscal</label>
           <input type="month" className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-black text-slate-900" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-slate-100">
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pièce / Réf</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Compte G.</th>
                <th className="px-6 py-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest">Analytique</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Libellé</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Débit</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Crédit</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLignes.map(ligne => (
                <tr key={ligne.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-600 text-xs">{format(new Date(ligne.date), 'dd/MM')}</td>
                  <td className="px-6 py-4 font-black text-indigo-600 text-xs">{ligne.numeroPiece}</td>
                  <td className="px-6 py-4 font-black text-slate-900 text-xs">{comptes.find(c => c.id === ligne.compteGeneralId)?.numero}</td>
                  <td className="px-6 py-4">
                     <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black uppercase">
                        {ligne.sectionAnalytique || 'GÉNÉRAL'}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">{ligne.libelle}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">{ligne.debit > 0 ? ligne.debit.toLocaleString() : ''}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">{ligne.credit > 0 ? ligne.credit.toLocaleString() : ''}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => deleteLigneEcriture(ligne.id)} className="p-2 text-slate-200 hover:text-rose-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {selectedJournal && (
              <tfoot className="sticky bottom-0 bg-white border-t-2 border-indigo-500 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]">
                <tr>
                  <td className="p-4"><input type="date" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-xs" value={newLine.date} onChange={e => setNewLine({...newLine, date: e.target.value})} /></td>
                  <td className="p-4"><input placeholder="N° Pièce" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-xs" value={newLine.numeroPiece} onChange={e => setNewLine({...newLine, numeroPiece: e.target.value})} /></td>
                  <td className="p-4">
                     <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-xs" value={newLine.compteGeneralId} onChange={e => setNewLine({...newLine, compteGeneralId: e.target.value})}>
                        <option value="">Compte...</option>
                        {comptes.map(c => <option key={c.id} value={c.id}>{c.numero}</option>)}
                     </select>
                  </td>
                  <td className="p-4">
                     <input placeholder="Analytique" className="w-full px-4 py-3 bg-indigo-50 border-none rounded-xl font-bold text-[10px] uppercase text-indigo-600" value={newLine.sectionAnalytique} onChange={e => setNewLine({...newLine, sectionAnalytique: e.target.value.toUpperCase()})} />
                  </td>
                  <td className="p-4"><input placeholder="Libellé" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-xs" value={newLine.libelle} onChange={e => setNewLine({...newLine, libelle: e.target.value})} /></td>
                  <td className="p-4"><input type="number" placeholder="Débit" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-black text-xs text-right" value={newLine.debit} onChange={e => setNewLine({...newLine, debit: e.target.value, credit: ''})} /></td>
                  <td className="p-4"><input type="number" placeholder="Crédit" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-black text-xs text-right" value={newLine.credit} onChange={e => setNewLine({...newLine, credit: e.target.value, debit: ''})} onKeyDown={e => e.key === 'Enter' && handleAddLine(e)} /></td>
                  <td className="p-4"><button onClick={handleAddLine} className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all"><Plus size={24} /></button></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
