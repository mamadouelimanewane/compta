import { useState } from 'react';
import { 
  Trophy, ShieldCheck, Target, Users, 
  Briefcase, TrendingUp, AlertCircle, 
  CheckCircle2, Search, ArrowRight,
  Zap, BarChart2, DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TenderAccelerator() {
  const [tenderAmount, setTenderAmount] = useState(500000000);
  
  const compliance = [
    { label: 'Quitus Fiscal (DGI)', status: 'Valide', date: '31/12/2024' },
    { label: 'Attestation IPRES', status: 'Valide', date: '15/06/2024' },
    { label: 'Attestation CSS', status: 'Valide', date: '15/06/2024' },
    { label: 'Casier Judiciaire (Dirigeant)', status: 'Valide', date: '01/01/2025' },
  ];

  const eligibility = tenderAmount <= 850000000;

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-3 py-1 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                <Trophy size={12} /> TENDER ACCELERATOR v1.0
             </div>
             <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                Growth Engine
             </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
                <Target size={32} />
             </div>
             Tender & Growth
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic text-lg">Optimisez votre éligibilité aux marchés publics et accélérez votre croissance contractuelle.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Simulateur d'Éligibilité */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-10">
               <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                     <Search size={24} className="text-indigo-600" /> Simulateur de Soumission
                  </h3>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacité Max Estimée</p>
                     <p className="text-xl font-black text-indigo-600">850M CFA</p>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="space-y-4">
                     <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Montant du Marché Visé (CFA)</label>
                     <input 
                        type="range" 
                        min="10000000" 
                        max="2000000000" 
                        step="10000000"
                        value={tenderAmount}
                        onChange={(e) => setTenderAmount(Number(e.target.value))}
                        className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                     />
                     <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-3xl font-black text-slate-900">{tenderAmount.toLocaleString()} <span className="text-sm text-slate-400">CFA</span></p>
                        <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${eligibility ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                           {eligibility ? 'ÉLIGIBLE' : 'CAPACITÉ INSUFFISANTE'}
                        </div>
                     </div>
                  </div>

                  {!eligibility && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-indigo-600 rounded-[2rem] text-white flex items-center justify-between shadow-xl"
                    >
                       <div className="flex items-center gap-4">
                          <Users size={32} />
                          <div>
                             <p className="text-sm font-black italic">Solution de Groupement</p>
                             <p className="text-[10px] font-bold opacity-80">Besoin d'un partenaire avec un CA > 450M CFA.</p>
                          </div>
                       </div>
                       <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                          TROUVER UN PARTENAIRE
                       </button>
                    </motion.div>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck size={18} className="text-emerald-500" /> État de Conformité
                  </h4>
                  <div className="space-y-4">
                     {compliance.map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100/50">
                          <div>
                             <p className="text-[10px] font-black text-slate-900">{item.label}</p>
                             <p className="text-[8px] font-bold text-slate-400 italic">Expire le {item.date}</p>
                          </div>
                          <CheckCircle2 size={16} className="text-emerald-500" />
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-xl space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     <TrendingUp size={120} />
                  </div>
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Analyse de Rentabilité</h4>
                  <div className="space-y-6 relative z-10">
                     <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black uppercase text-slate-400">Levier Financier</p>
                        <p className="text-xl font-black text-white">1.85</p>
                     </div>
                     <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black uppercase text-slate-400">Score de Solvabilité</p>
                        <p className="text-xl font-black text-emerald-400">Elite</p>
                     </div>
                     <div className="pt-4 border-t border-white/5">
                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
                           Votre structure financière permet un cautionnement bancaire facilité pour ce montant.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Opportunités de Croissance */}
         <div className="space-y-8">
            <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl space-y-8">
               <h3 className="text-xs font-black uppercase tracking-widest text-indigo-200 flex items-center gap-2">
                  <Zap size={18} /> Opportunités IA
               </h3>
               <div className="space-y-6">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-2 group cursor-pointer hover:bg-white/10 transition-colors">
                     <p className="text-xs font-black">Marché Public #8842</p>
                     <p className="text-[10px] font-bold opacity-60">Réhabilitation infrastructures...</p>
                     <p className="text-[10px] font-black text-emerald-300 mt-2 flex items-center gap-1">
                        Compatibilité 94% <ArrowRight size={10} />
                     </p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-2 group cursor-pointer hover:bg-white/10 transition-colors">
                     <p className="text-xs font-black">Appel d'Offre Privé - Total</p>
                     <p className="text-[10px] font-bold opacity-60">Services de maintenance...</p>
                     <p className="text-[10px] font-black text-emerald-300 mt-2 flex items-center gap-1">
                        Compatibilité 82% <ArrowRight size={10} />
                     </p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-6">
               <div className="flex items-center gap-3">
                  <DollarSign className="text-amber-500" size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cash Optimization</h4>
               </div>
               <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                     L'IA suggère un placement de **120.000.000 CFA** en Titres Publics. 
                     Rendement estimé : **5.2% / an**.
                  </p>
                  <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">
                     DÉTAILS DU PLACEMENT
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
