import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  FileText, Download, Search, ArrowRight, Calendar, 
  ShieldCheck, TrendingUp, TrendingDown, LayoutDashboard
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Balance() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  
  const [dateDebut, setDateDebut] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
  const [dateFin, setDateFin] = useState(format(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd'));
  const [search, setSearch] = useState('');

  const balance = useMemo(() => {
    const filteredLignes = lignes.filter(l => l.date >= dateDebut && l.date <= dateFin);
    
    const data = comptes.map(compte => {
      const lignesCompte = filteredLignes.filter(l => l.compteGeneralId === compte.id);
      const totalDebit = lignesCompte.reduce((s, l) => s + l.debit, 0);
      const totalCredit = lignesCompte.reduce((s, l) => s + l.credit, 0);
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

    return data
      .filter(r => r.hasMovements && (r.compte.numero.includes(search) || r.compte.intitule.toLowerCase().includes(search.toLowerCase())))
      .sort((a, b) => a.compte.numero.localeCompare(b.compte.numero));
  }, [comptes, lignes, dateDebut, dateFin, search]);

  const aggregates = useMemo(() => {
    return {
      debit: balance.reduce((s, r) => s + r.totalDebit, 0),
      credit: balance.reduce((s, r) => s + r.totalCredit, 0),
      soldeDb: balance.reduce((s, r) => s + r.soldeDebiteur, 0),
      soldeCr: balance.reduce((s, r) => s + r.soldeCrediteur, 0),
    };
  }, [balance]);

  const isBalanced = Math.abs(aggregates.debit - aggregates.credit) < 0.01;

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-xl">
                <LayoutDashboard size={32} />
             </div>
             Balance Générale
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Synthèse des mouvements et arrêtés de comptes consolidés.</p>
        </div>
        <button onClick={() => window.print()} className="btn-elite flex items-center gap-3">
           <Download size={18} /> EXPORTER LA BALANCE
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 flex flex-wrap items-center gap-8 print:hidden">
         <div className="flex-1 min-w-[300px] relative group">
            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Filtrer par numéro ou intitulé..."
              className="input-elite pl-14"
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

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex-1 flex flex-col overflow-hidden">
         <div className="flex-1 overflow-auto p-2">
            <table className="w-full text-left border-collapse">
               <thead className="sticky top-0 bg-white/90 backdrop-blur-md z-10">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th rowSpan={2} className="px-10 py-6">Compte</th>
                     <th rowSpan={2} className="px-6 py-6">Intitulé</th>
                     <th colSpan={2} className="px-6 py-4 text-center border-l border-slate-50 text-indigo-600">Mouvements</th>
                     <th colSpan={2} className="px-6 py-4 text-center border-l border-slate-50 text-emerald-600">Soldes</th>
                  </tr>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="px-6 py-3 text-right border-l border-slate-50">Débit</th>
                     <th className="px-6 py-3 text-right">Crédit</th>
                     <th className="px-6 py-3 text-right border-l border-slate-50">Débiteur</th>
                     <th className="px-10 py-3 text-right">Créditeur</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {balance.map((row) => (
                    <tr key={row.compte.id} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="px-10 py-5 text-sm font-black text-indigo-600">{row.compte.numero}</td>
                       <td className="px-6 py-5 text-xs font-bold text-slate-700">{row.compte.intitule}</td>
                       <td className="px-6 py-5 text-xs font-black text-right text-slate-500 border-l border-slate-50/50">
                          {row.totalDebit > 0 ? row.totalDebit.toLocaleString() : '-'}
                       </td>
                       <td className="px-6 py-5 text-xs font-black text-right text-slate-500">
                          {row.totalCredit > 0 ? row.totalCredit.toLocaleString() : '-'}
                       </td>
                       <td className="px-6 py-5 text-xs font-black text-right text-slate-900 border-l border-slate-50/50 bg-emerald-50/10">
                          {row.soldeDebiteur > 0 ? row.soldeDebiteur.toLocaleString() : '-'}
                       </td>
                       <td className="px-10 py-5 text-xs font-black text-right text-slate-900 bg-emerald-50/10">
                          {row.soldeCrediteur > 0 ? row.soldeCrediteur.toLocaleString() : '-'}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
            <div className="flex gap-20">
               <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Total Mouvements</p>
                  <p className="text-3xl font-black">{aggregates.debit.toLocaleString()} <span className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">{currentDossier?.devisePrincipale}</span></p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Total Soldes</p>
                  <p className="text-3xl font-black">{aggregates.soldeDb.toLocaleString()} <span className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">{currentDossier?.devisePrincipale}</span></p>
               </div>
            </div>
            <div className="flex items-center gap-6">
               <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg ${isBalanced ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                  {isBalanced ? <ShieldCheck size={32} /> : <AlertTriangle size={32} />}
               </div>
               <div>
                  <p className="text-lg font-black tracking-tight">{isBalanced ? 'BALANCE ÉQUILIBRÉE' : 'ÉCART DE BALANCE'}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Signature Diamond Seal Certifiée</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

const AlertTriangle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
