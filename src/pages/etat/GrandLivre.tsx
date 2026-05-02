import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { BookOpen, Download, StickyNote, Save } from 'lucide-react';
import { format } from 'date-fns';

export default function GrandLivre() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  
  const [dateDebut, setDateDebut] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
  const [dateFin, setDateFin] = useState(format(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd'));
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');
  const updateLigneEcriture = useStore(state => state.updateLigneEcriture);

  const grandLivreData = useMemo(() => {
    const lignesFiltrees = lignesEcriture.filter(l => l.date >= dateDebut && l.date <= dateFin);
    
    // Group by account
    const result = comptes.map(compte => {
      const lignesCompte = lignesFiltrees.filter(l => l.compteGeneralId === compte.id)
        .sort((a, b) => a.date.localeCompare(b.date));
      
      const totalDebit = lignesCompte.reduce((sum, l) => sum + l.debit, 0);
      const totalCredit = lignesCompte.reduce((sum, l) => sum + l.credit, 0);
      
      return {
        compte,
        lignes: lignesCompte.map(l => ({
          ...l,
          journal: journaux.find(j => j.id === l.journalId)
        })),
        totalDebit,
        totalCredit,
        hasMovements: lignesCompte.length > 0
      };
    });

    return result.filter(r => r.hasMovements).sort((a, b) => a.compte.numero.localeCompare(b.compte.numero));
  }, [comptes, journaux, lignesEcriture, dateDebut, dateFin]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <BookOpen className="mr-2 text-primary" />
          Grand Livre
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
        <div className="flex-1 overflow-auto p-6 space-y-8 print:overflow-visible print:p-0">
          {grandLivreData.length === 0 ? (
            <div className="text-center text-slate-500 py-12">
              Aucun mouvement sur la période sélectionnée.
            </div>
          ) : (
            grandLivreData.map((data) => (
              <div key={data.compte.id} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-indigo-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">
                    Compte {data.compte.numero} - {data.compte.intitule}
                  </h3>
                </div>
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Date</th>
                      <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Journal</th>
                      <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Pièce</th>
                      <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Libellé</th>
                      <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-32">Débit</th>
                      <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-32">Crédit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.lignes.map(ligne => (
                      <tr key={ligne.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2 text-sm">{format(new Date(ligne.date), 'dd/MM/yyyy')}</td>
                        <td className="px-4 py-2 text-sm font-medium text-slate-700">{ligne.journal?.code}</td>
                        <td className="px-4 py-2 text-sm">{ligne.numeroPiece}</td>
                        <td className="px-4 py-2 text-sm text-slate-700 truncate max-w-sm relative group/note">
                          <div className="flex items-center space-x-2">
                            <span>{ligne.libelle}</span>
                            <button 
                              onClick={() => { setEditingNoteId(ligne.id); setTempNote(ligne.notes || ''); }}
                              className={`p-1 rounded hover:bg-amber-100 transition-colors ${ligne.notes ? 'text-amber-600 bg-amber-50' : 'text-slate-300 opacity-0 group-hover/note:opacity-100'}`}
                              title={ligne.notes || 'Ajouter une note'}
                            >
                              <StickyNote size={12} />
                            </button>
                          </div>
                          {editingNoteId === ligne.id && (
                            <div className="absolute z-50 left-0 mt-1 p-2 bg-amber-50 border border-amber-200 rounded-lg shadow-xl w-64">
                              <textarea 
                                className="w-full h-20 bg-white border border-amber-200 rounded p-2 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                                value={tempNote}
                                onChange={(e) => setTempNote(e.target.value)}
                                autoFocus
                                placeholder="Note collaborative (Post-it)..."
                              />
                              <div className="flex justify-end mt-2 space-x-2">
                                <button onClick={() => setEditingNoteId(null)} className="px-2 py-1 text-[10px] text-slate-500 hover:text-slate-700">Annuler</button>
                                <button onClick={() => { updateLigneEcriture(ligne.id, { notes: tempNote }); setEditingNoteId(null); }} className="px-2 py-1 bg-amber-500 text-white rounded text-[10px] font-bold flex items-center"><Save size={10} className="mr-1" /> Sauver</button>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-right text-indigo-700">{ligne.debit > 0 ? ligne.debit.toFixed(2) : ''}</td>
                        <td className="px-4 py-2 text-sm text-right text-indigo-700">{ligne.credit > 0 ? ligne.credit.toFixed(2) : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td colSpan={4} className="px-4 py-2 font-bold text-slate-700 text-right uppercase text-xs">Total Compte</td>
                      <td className="px-4 py-2 text-right font-bold text-slate-900">{data.totalDebit.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right font-bold text-slate-900">{data.totalCredit.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-4 py-2 font-bold text-indigo-700 text-right uppercase text-xs border-t border-slate-100">Solde {data.totalDebit > data.totalCredit ? 'Débiteur' : data.totalCredit > data.totalDebit ? 'Créditeur' : ''}</td>
                      <td colSpan={2} className="px-4 py-2 text-right font-bold text-indigo-700 text-lg border-t border-slate-100">
                        {Math.abs(data.totalDebit - data.totalCredit).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
