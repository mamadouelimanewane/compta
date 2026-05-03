import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Target, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Save, Filter } from 'lucide-react';

export default function Budget() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId && c.type === 'Détail');
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);

  const [budgets, setBudgets] = useState<Record<string, number>>({});

  const budgetAnalysis = useMemo(() => {
    return comptes.filter(c => c.numero.startsWith('6') || c.numero.startsWith('7')).map(compte => {
      const isRevenue = compte.numero.startsWith('7');
      const linesCompte = lignes.filter(l => l.compteGeneralId === compte.id);
      const actual = linesCompte.reduce((s, l) => s + (isRevenue ? (l.credit - l.debit) : (l.debit - l.credit)), 0);
      const budget = budgets[compte.id] || 0;
      const variance = budget !== 0 ? ((actual - budget) / budget) * 100 : 0;
      const amountVariance = actual - budget;
      const isFavorable = isRevenue ? amountVariance > 0 : amountVariance < 0;

      return { compte, budget, actual, variance, amountVariance, isFavorable, isRevenue };
    }).sort((a, b) => a.compte.numero.localeCompare(b.compte.numero));
  }, [comptes, lignes, budgets]);

  const totalActual = budgetAnalysis.reduce((s, b) => s + b.actual, 0);
  const totalBudget = budgetAnalysis.reduce((s, b) => s + b.budget, 0);

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Target size={28} />
             </div>
             Contrôle Budgétaire
          </h1>
          <p className="text-slate-500 font-medium mt-2">Pilotez vos écarts et ajustez votre stratégie en temps réel.</p>
        </div>
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs flex items-center gap-3 hover:bg-indigo-700 shadow-xl transition-all uppercase tracking-widest">
          <Save size={18} /> ENREGISTRER LE PLAN
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center font-black">
               {Math.round((totalActual / (totalBudget || 1)) * 100)}%
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Réalisation Globale</p>
               <p className="text-2xl font-black text-slate-900">{totalActual.toLocaleString()} <span className="text-xs opacity-40">/ {totalBudget.toLocaleString()}</span></p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Tableau des Écarts</h2>
           <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600"><CheckCircle size={14} /> Favorable</div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600"><AlertCircle size={14} /> Défavorable</div>
           </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Poste Budgétaire</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Budget Prévu</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Réalisé (Compta)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Écart Absolu</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Écart %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {budgetAnalysis.map((b) => (
                <tr key={b.compte.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4">
                    <p className="text-sm font-black text-slate-900">{b.compte.numero}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{b.compte.intitule}</p>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <input 
                      type="number" 
                      className="w-32 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-right font-black text-sm focus:ring-2 focus:ring-indigo-500"
                      value={budgets[b.compte.id] || ''}
                      placeholder="0"
                      onChange={e => setBudgets({...budgets, [b.compte.id]: +e.target.value})}
                    />
                  </td>
                  <td className="px-8 py-4 text-right font-black text-slate-900">
                    {b.actual.toLocaleString()}
                  </td>
                  <td className={`px-8 py-4 text-right font-black ${b.isFavorable ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {b.amountVariance > 0 ? '+' : ''}{b.amountVariance.toLocaleString()}
                  </td>
                  <td className="px-8 py-4 text-right">
                     <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${b.isFavorable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {b.variance > 0 ? '+' : ''}{Math.round(b.variance)}%
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
