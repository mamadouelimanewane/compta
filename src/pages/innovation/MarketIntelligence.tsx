import { useState } from 'react';
import { 
  Globe, TrendingUp, Search, Compass, 
  Target, BarChart3, ShieldCheck, Zap,
  ArrowRight, Users, ExternalLink,
  Database, RefreshCw, AlertTriangle
} from 'lucide-react';

export default function MarketIntelligence() {
  const [marketData, setMarketData] = useState({
    avgTurnover: 500000000,
    avgMargin: 25,
    sectorGrowth: 5.5,
    competitorsCount: 12
  });

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
                <Globe size={12} className="text-indigo-400" /> DEEPMIND ENGINE v1.2
             </div>
             <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                Agnostic Market Intelligence
             </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Compass size={32} />
             </div>
             Deepmind Market Analyzer
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Injectez vos données de marché pour une analyse comparative personnalisée.</p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl">
           <RefreshCw size={18} /> RELANCER L'ANALYSE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
         {/* Formulaire d'injection de données */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
               <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-indigo-600">
                  <Database size={18} /> Données de Marché
               </h3>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CA Moyen Secteur</label>
                     <input 
                        type="number" 
                        value={marketData.avgTurnover}
                        onChange={(e) => setMarketData({...marketData, avgTurnover: Number(e.target.value)})}
                        className="w-full px-6 py-3 bg-slate-50 border-none rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marge Brute (%)</label>
                     <input 
                        type="number" 
                        value={marketData.avgMargin}
                        onChange={(e) => setMarketData({...marketData, avgMargin: Number(e.target.value)})}
                        className="w-full px-6 py-3 bg-slate-50 border-none rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Croissance Annuelle (%)</label>
                     <input 
                        type="number" 
                        value={marketData.sectorGrowth}
                        onChange={(e) => setMarketData({...marketData, sectorGrowth: Number(e.target.value)})}
                        className="w-full px-6 py-3 bg-slate-50 border-none rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500"
                     />
                  </div>
               </div>
               <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
                  L'IA utilisera ces références pour calculer vos écarts de performance.
               </p>
            </div>
         </div>

         {/* Analyse Comparative */}
         <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                     <TrendingUp size={150} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Gap Analysis IA</h3>
                  <div className="space-y-8">
                     <div>
                        <div className="flex justify-between items-end mb-2">
                           <p className="text-xs font-black text-slate-900 uppercase">Parts de Marché Relatives</p>
                           <span className="text-xl font-black text-indigo-600">8.2%</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500" style={{ width: '35%' }}></div>
                        </div>
                     </div>
                     <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
                        <Zap size={24} className="text-emerald-500" />
                        <div>
                           <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Surperformance Marge</p>
                           <p className="text-sm font-black text-emerald-900">Votre marge est { (32 - marketData.avgMargin).toFixed(1) }% supérieure au marché.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl space-y-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Conseil Stratégique Deepmind</h3>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                           <Target size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-300 leading-relaxed">
                           Au vu de votre CA actuel ({ (125000000).toLocaleString() } CFA), vous avez un potentiel d'acquisition sur 2 concurrents directs.
                        </p>
                     </div>
                     <div className="flex gap-4">
                        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                           <AlertTriangle size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-300 leading-relaxed italic">
                           Risque identifié : La croissance du secteur ({ marketData.sectorGrowth }%) est plus rapide que la vôtre (4.2%). Risque de perte de parts de marché.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-8">
               <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <BarChart3 size={24} className="text-indigo-600" /> Matrice de Positionnement
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: 'Efficacité Opérationnelle', val: 'Elite', color: 'text-amber-500' },
                    { label: 'Croissance Organique', val: 'Moyenne', color: 'text-slate-400' },
                    { label: 'Rétention Clients', val: 'Excellente', color: 'text-emerald-500' },
                  ].map((m, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                       <p className={`text-xl font-black ${m.color}`}>{m.val}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
