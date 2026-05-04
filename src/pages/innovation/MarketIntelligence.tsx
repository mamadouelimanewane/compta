import { 
  Globe, TrendingUp, Search, Compass, 
  Target, BarChart3, ShieldCheck, Zap,
  ArrowRight, Users, ExternalLink
} from 'lucide-react';

export default function MarketIntelligence() {
  const sectors = [
    { name: 'Commerce de Détail', perf: '+4.2%', color: 'text-emerald-500', trend: 'up' },
    { name: 'Services aux Entreprises', perf: '+8.5%', color: 'text-indigo-500', trend: 'up' },
    { name: 'Industrie / Manufacturier', perf: '-1.2%', color: 'text-rose-500', trend: 'down' },
  ];

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Globe size={12} className="text-indigo-400" /> DEEPMIND ENGINE v1.0
             </div>
             <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                Market Intelligence
             </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Compass size={32} />
             </div>
             Deepmind Market Analyzer
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Analyse comparative sectorielle et veille réglementaire OHADA en temps réel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-10">
               <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                     <Target size={24} className="text-indigo-600" /> Benchmark Sectoriel
                  </h3>
                  <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:text-indigo-600 transition-colors">
                     Personnaliser mon secteur <ArrowRight size={14} />
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Votre Position (CA)</p>
                     <p className="text-3xl font-black text-slate-900">Top 15% <span className="text-xs text-emerald-500 ml-2">Secteur Services</span></p>
                     <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: '85%' }}></div>
                     </div>
                  </div>
                  <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 space-y-4">
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Opportunité de Croissance</p>
                     <p className="text-3xl font-black text-indigo-900">+22.5M <span className="text-xs opacity-40 italic">estimé</span></p>
                     <p className="text-[10px] font-bold text-indigo-600/60 leading-relaxed italic">
                        L'IA identifie un gisement de rentabilité sur vos frais de structure par rapport aux cabinets de même taille.
                     </p>
                  </div>
               </div>

               <div className="space-y-6 pt-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Performances par Secteur (Sénégal/UEMOA)</h4>
                  <div className="space-y-4">
                     {sectors.map((s, i) => (
                       <div key={i} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <BarChart3 size={18} />
                             </div>
                             <p className="text-sm font-black text-slate-700">{s.name}</p>
                          </div>
                          <span className={`text-sm font-black ${s.color}`}>{s.perf}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck size={120} />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Veille Réglementaire IA</h3>
               <div className="space-y-6">
                  {[
                    "Réforme OHADA : Nouvelles dispositions sur le capital social.",
                    "Fiscalité 2024 : Rappel sur la taxe de solidarité (Sénégal).",
                    "Nouveaux formulaires DSF disponibles (Format XML/EDI)."
                  ].map((news, i) => (
                    <div key={i} className="flex gap-4 items-start group cursor-pointer">
                       <div className="mt-1">
                          <Zap size={14} className="text-amber-500" />
                       </div>
                       <p className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{news}</p>
                    </div>
                  ))}
               </div>
               <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  ACCÉDER À LA BASE DOCUMENTAIRE <ExternalLink size={14} />
               </button>
            </div>

            <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-xl space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Prospection Intelligente</h3>
               <div className="flex items-center gap-4">
                  <Users size={24} className="text-white" />
                  <div>
                     <p className="text-sm font-black italic">5 Prospect "Lookalike"</p>
                     <p className="text-[10px] font-bold text-indigo-200">Identifiés dans votre zone géographique.</p>
                  </div>
               </div>
               <button className="text-[10px] font-black uppercase tracking-widest text-white underline underline-offset-4 flex items-center gap-2">
                  Générer les fiches de contact <ArrowRight size={14} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
