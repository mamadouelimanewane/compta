import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Sparkles, Zap, AlertTriangle, CheckCircle, 
  TrendingUp, TrendingDown, Users, Wallet,
  ArrowRight, ShieldCheck, BrainCircuit
} from 'lucide-react';

export default function DiamondMentor() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const comptesTiers = useStore(state => state.comptesTiers).filter(t => t.dossierId === currentDossierId);

  const insights = useMemo(() => {
    const list = [
      {
        id: 1,
        type: 'warning',
        title: 'Optimisation de Trésorerie',
        message: 'Votre DSO (Délai de paiement client) moyen est de 45 jours, soit 12 jours au-dessus de la moyenne de votre secteur.',
        action: 'Lancer une campagne de relance',
        icon: <Wallet className="text-amber-500" />
      },
      {
        id: 2,
        type: 'success',
        title: 'Performance Achats',
        message: 'Vos coûts de fonctionnement ont baissé de 8% sur le dernier trimestre grâce à une meilleure gestion des fournisseurs.',
        action: 'Voir le détail des économies',
        icon: <TrendingDown className="text-emerald-500" />
      },
      {
        id: 3,
        type: 'critical',
        title: 'Alerte Conformité',
        message: '3 factures fournisseurs n\'ont pas de pièce justificative attachée (GED). Risque de rejet de TVA en cas de contrôle.',
        action: 'Régulariser maintenant',
        icon: <AlertTriangle className="text-rose-500" />
      }
    ];
    return list;
  }, [lignes, comptesTiers]);

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <BrainCircuit size={12} /> IA ACTIVE
             </div>
             <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                Mode Prédictif
             </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
                <Sparkles size={32} />
             </div>
             Diamond Mentor
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Votre copilote stratégique : analyse, prédiction et conseils proactifs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Analyses en Temps Réel</h2>
            {insights.map(insight => (
              <div key={insight.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-8 flex gap-8 items-center group hover:shadow-2xl transition-all border-l-8 border-l-slate-900">
                 <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {insight.icon}
                 </div>
                 <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-black text-slate-900">{insight.title}</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{insight.message}</p>
                    <button className="pt-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                       {insight.action} <ArrowRight size={14} />
                    </button>
                 </div>
              </div>
            ))}
         </div>

         <div className="space-y-8">
            <div className="bg-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                  <Zap size={200} />
               </div>
               <div className="relative z-10 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-indigo-300">Score de Santé</h3>
                  <div className="flex items-end gap-2">
                     <p className="text-6xl font-black">84</p>
                     <p className="text-sm font-bold text-indigo-400 mb-2">/ 100</p>
                  </div>
                  <p className="text-xs font-bold text-indigo-100 leading-relaxed">
                     Votre structure financière est solide. Améliorez le lettrage de vos comptes tiers pour atteindre 90+.
                  </p>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]" style={{ width: '84%' }}></div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-8">
               <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Users size={18} className="text-slate-400" /> Analyse des Tiers
               </h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <p className="text-xs font-bold text-slate-500">Clients à risque</p>
                     <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black">2 ALERTE</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <p className="text-xs font-bold text-slate-500">Fournisseurs stratégiques</p>
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black">12 ACTIFS</span>
                  </div>
               </div>
               <div className="pt-6 border-t border-slate-50 flex items-center gap-4 text-emerald-500">
                  <ShieldCheck size={20} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Surveillance Active</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
