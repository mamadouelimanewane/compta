import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  BookOpen, Download, Search, ChevronRight, 
  Filter, Calendar, ArrowRight, ShieldCheck, StickyNote
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ExportActions from '../../components/ExportActions';

export default function GrandLivre() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  
  const [dateDebut, setDateDebut] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
  const [dateFin, setDateFin] = useState(format(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd'));
  const [search, setSearch] = useState('');

  const grandLivre = useMemo(() => {
    const filteredLignes = lignes.filter(l => l.date >= dateDebut && l.date <= dateFin);
    
    return comptes
      .filter(c => c.numero.includes(search) || c.intitule.toLowerCase().includes(search.toLowerCase()))
      .map(compte => {
        const lignesCompte = filteredLignes.filter(l => l.compteGeneralId === compte.id || l.compteGeneralId.includes(compte.numero))
          .sort((a, b) => a.date.localeCompare(b.date));
        
        const totalDebit = lignesCompte.reduce((s, l) => s + l.debit, 0);
        const totalCredit = lignesCompte.reduce((s, l) => s + l.credit, 0);
        
        return {
          compte,
          lignes: lignesCompte.map(l => ({ ...l, journal: journaux.find(j => j.code === l.journalId)?.code || l.journalId })),
          totalDebit,
          totalCredit,
          hasMovements: lignesCompte.length > 0
        };
      })
      .filter(r => r.hasMovements)
      .sort((a, b) => a.compte.numero.localeCompare(b.compte.numero));
  }, [comptes, journaux, lignes, dateDebut, dateFin, search]);

  const exportData = useMemo(() => {
    return grandLivre.flatMap(compteData => 
      compteData.lignes.map(l => ({
        compte: compteData.compte.numero,
        intitule: compteData.compte.intitule,
        date: l.date,
        journal: l.journal,
        numeroPiece: l.numeroPiece,
        libelle: l.libelle,
        debit: l.debit,
        credit: l.credit
      }))
    );
  }, [grandLivre]);

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <BookOpen size={32} />
             </div>
             Grand Livre Détaillé
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Vision exhaustive des mouvements comptables certifiés.</p>
        </div>
        <ExportActions 
          data={exportData} 
          filename={`grand_livre_${format(new Date(), 'yyyy-MM-dd')}`} 
          title="Grand Livre Détaillé" 
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 flex flex-wrap items-center gap-8 print:hidden">
         <div className="flex-1 min-w-[300px] relative group">
            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un compte (Numéro ou Intitulé)..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-inner"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-4">
            <div className="px-6 py-3 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
               <Calendar size={18} className="text-indigo-600" />
               <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} className="bg-transparent border-none text-xs font-black text-slate-700 focus:ring-0" />
               <ArrowRight size={14} className="text-slate-300" />
               <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} className="bg-transparent border-none text-xs font-black text-slate-700 focus:ring-0" />
            </div>
         </div>
      </div>

      <div className="flex-1 space-y-12">
         {grandLivre.length === 0 ? (
           <div className="h-64 flex flex-col items-center justify-center text-slate-300 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
              <ShieldCheck size={48} className="mb-4 opacity-20" />
              <p className="font-black uppercase tracking-widest text-xs">Aucun mouvement détecté sur cette période</p>
           </div>
         ) : (
           grandLivre.map((data) => (
             <div key={data.compte.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
                <div className="bg-slate-900 px-10 py-6 flex justify-between items-center text-white">
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                         {data.compte.numero.substring(0, 1)}
                      </div>
                      <div>
                         <h3 className="text-lg font-black tracking-tight">{data.compte.numero} — {data.compte.intitule}</h3>
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Nature : {data.compte.nature}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Solde de Clôture</p>
                      <p className="text-2xl font-black text-emerald-400">
                         {Math.abs(data.totalDebit - data.totalCredit).toLocaleString()} <span className="text-xs">FCFA</span>
                         <span className="ml-2 text-[10px] text-white/40">{data.totalDebit > data.totalCredit ? 'DB' : 'CR'}</span>
                      </p>
                   </div>
                </div>

                <div className="p-2">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                            <th className="px-10 py-6">Date</th>
                            <th className="px-6 py-6">Jnl</th>
                            <th className="px-6 py-6">Pièce</th>
                            <th className="px-6 py-6">Libellé</th>
                            <th className="px-6 py-6 text-right">Débit</th>
                            <th className="px-10 py-6 text-right">Crédit</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {data.lignes.map(ligne => (
                           <tr key={ligne.id} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="px-10 py-5 text-xs font-black text-slate-500">{format(new Date(ligne.date), 'dd MMM yyyy', { locale: fr })}</td>
                              <td className="px-6 py-5 text-xs font-black text-indigo-600 uppercase">{ligne.journal}</td>
                              <td className="px-6 py-5 text-xs font-bold text-slate-400">{ligne.numeroPiece}</td>
                              <td className="px-6 py-5 text-xs font-bold text-slate-700 max-w-sm truncate">
                                 {ligne.libelle}
                                 {ligne.sectionAnalytique && (
                                   <span className="ml-3 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[8px] font-black uppercase">
                                      {ligne.sectionAnalytique}
                                   </span>
                                 )}
                              </td>
                              <td className="px-6 py-5 text-xs font-black text-right text-slate-900">{ligne.debit > 0 ? ligne.debit.toLocaleString() : '-'}</td>
                              <td className="px-10 py-5 text-xs font-black text-right text-slate-900">{ligne.credit > 0 ? ligne.credit.toLocaleString() : '-'}</td>
                           </tr>
                         ))}
                      </tbody>
                      <tfoot className="bg-slate-50/50">
                         <tr className="text-[10px] font-black uppercase tracking-widest">
                            <td colSpan={4} className="px-10 py-6 text-right text-slate-400 italic">Total Mouvements</td>
                            <td className="px-6 py-6 text-right text-slate-900 font-black">{data.totalDebit.toLocaleString()}</td>
                            <td className="px-10 py-6 text-right text-slate-900 font-black">{data.totalCredit.toLocaleString()}</td>
                         </tr>
                      </tfoot>
                   </table>
                </div>
             </div>
           ))
         )}
      </div>
    </div>
  );
}
