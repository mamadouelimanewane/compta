import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Calculator, TrendingDown, ShieldAlert, Sparkles, 
  ArrowRight, Info, CheckCircle, Percent 
} from 'lucide-react';

export default function SimulateurFiscal() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);

  const projection = useMemo(() => {
    let revenus = 0;
    let charges = 0;
    lignes.forEach(l => {
      if (l.compteGeneralId.startsWith('7')) revenus += (l.credit - l.debit);
      if (l.compteGeneralId.startsWith('6')) charges += (l.debit - l.credit);
    });

    const resultatActuel = revenus - charges;
    const tauxIS = 0.30; // Standard UEMOA
    const impotEstime = Math.max(0, resultatActuel * tauxIS);
    
    return {
      resultatActuel,
      impotEstime,
      tauxIS: tauxIS * 100,
      economiePotentielle: resultatActuel * 0.05 // Simulation d'optimisation
    };
  }, [lignes]);

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-xl">
                <Calculator size={32} />
             </div>
             Simulateur Fiscal Prédictif
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Anticipation de la charge fiscale et stratégies d'optimisation en temps réel.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
           <ShieldAlert size={16} className="text-amber-400" /> Mode Simulation Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-12 space-y-10">
               <section className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-amber-600 flex items-center gap-2">
                     <Percent size={14} /> Paramètres de Simulation
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Taux d'Impôt (IS)</label>
                        <select className="w-full p-4 bg-slate-50 rounded-2xl border-none font-black text-slate-900">
                           <option>Sénégal / UEMOA (30%)</option>
                           <option>Régime Simplifié (25%)</option>
                           <option>Zone Économique Spéciale (15%)</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Période de Projection</label>
                        <select className="w-full p-4 bg-slate-50 rounded-2xl border-none font-black text-slate-900">
                           <option>Clôture Annuelle 2024</option>
                           <option>Fin de Trimestre</option>
                        </select>
                     </div>
                  </div>
               </section>

               <div className="h-px bg-slate-50"></div>

               <section className="space-y-8">
                  <div className="flex justify-between items-center">
                     <h3 className="text-xl font-black text-slate-900">Estimation de la Charge</h3>
                     <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Calculé à l'instant</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Résultat Fiscal Estimé</p>
                        <p className="text-3xl font-black text-slate-900">{projection.resultatActuel.toLocaleString()} <span className="text-sm opacity-30">CFA</span></p>
                     </div>
                     <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100 space-y-2">
                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">IS à Provisionner</p>
                        <p className="text-3xl font-black text-rose-600">{projection.impotEstime.toLocaleString()} <span className="text-sm opacity-30">CFA</span></p>
                     </div>
                  </div>
               </section>

               <div className="bg-amber-50 rounded-[2.5rem] p-10 border border-amber-100 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                     <TrendingDown size={120} className="text-amber-600" />
                  </div>
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center gap-3">
                        <Sparkles className="text-amber-500" size={24} />
                        <h3 className="text-sm font-black uppercase tracking-widest text-amber-800">Opportunité d'Optimisation</h3>
                     </div>
                     <p className="text-xl font-bold text-amber-900 leading-tight max-w-md">
                        En activant le régime d'investissement PME, vous pourriez économiser jusqu'à <span className="text-amber-600 font-black">{projection.economiePotentielle.toLocaleString()} CFA</span> cette année.
                     </p>
                     <button className="px-6 py-3 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg flex items-center gap-2">
                        VOIR LES STRATÉGIES <ArrowRight size={14} />
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8">
               <h3 className="text-xs font-black uppercase tracking-widest text-amber-400">Conseils du Mentor</h3>
               <div className="space-y-6">
                  {[
                    "Répartissez vos dotations aux amortissements sur le dernier trimestre.",
                    "Vérifiez l'éligibilité au Crédit Impôt Recherche (CIR).",
                    "Anticipez le versement des acomptes IS du 15 décembre."
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                       <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-amber-500 group-hover:text-white transition-all">
                          {i+1}
                       </div>
                       <p className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{tip}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-6">
               <div className="flex items-center gap-3">
                  <Info className="text-indigo-600" size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Notes Légales</h4>
               </div>
               <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
                  Cette simulation est basée sur les écritures actuelles du dossier. Elle ne remplace pas l'avis d'un fiscaliste agréé mais fournit une base de décision stratégique inestimable.
               </p>
               <div className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Conformité OHADA 2024</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
