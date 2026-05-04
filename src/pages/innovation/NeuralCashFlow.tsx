import { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { 
  BrainCircuit, TrendingUp, TrendingDown, 
  Sparkles, ShieldCheck, Zap, Info 
} from 'lucide-react';

const data = [
  { name: 'Jan', real: 4000, projected: 4000 },
  { name: 'Feb', real: 3000, projected: 3000 },
  { name: 'Mar', real: 2000, projected: 2000 },
  { name: 'Apr', real: 2780, projected: 2780 },
  { name: 'May', real: 1890, projected: 1890 },
  { name: 'Jun', real: null, projected: 2390 },
  { name: 'Jul', real: null, projected: 3490 },
  { name: 'Aug', real: null, projected: 2000 },
  { name: 'Sep', real: null, projected: 2780 },
  { name: 'Oct', real: null, projected: 1890 },
];

export default function NeuralCashFlow() {
  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <BrainCircuit size={12} /> ENGINE v3.0
             </div>
             <div className="px-3 py-1 bg-white border border-slate-200 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                Deep Learning Model
             </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
                <TrendingUp size={32} />
             </div>
             Neural Cash Flow
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Projection neuronale de trésorerie avec zone de confiance à 95%.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-emerald-100">
           <ShieldCheck size={16} /> Modèle Stabilisé
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-8">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-black text-slate-900">Projection à 6 Mois</h3>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                     <span className="text-[10px] font-black uppercase text-slate-400">Réel</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-indigo-300"></div>
                     <span className="text-[10px] font-black uppercase text-slate-400">Projecté (AI)</span>
                  </div>
               </div>
            </div>

            <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c7d2fe" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#c7d2fe" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
                      itemStyle={{ fontWeight: 900, fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="projected" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#colorProj)" strokeDasharray="10 5" />
                    <Area type="monotone" dataKey="real" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorReal)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                  <Sparkles size={200} />
               </div>
               <div className="relative z-10 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Insight Prédictif</h3>
                  <p className="text-2xl font-bold leading-tight">
                     L'IA anticipe un <span className="text-indigo-400 font-black italic">pic de trésorerie</span> en Juillet de +24%.
                  </p>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed">
                     Basé sur les historiques de facturation des 3 dernières années et les contrats récurrents signés.
                  </p>
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2">
                     EXPLORER LES CAUSES <Zap size={14} />
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-6">
               <div className="flex items-center gap-3">
                  <Info className="text-indigo-600" size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Facteurs de Confiance</h4>
               </div>
               <div className="space-y-4">
                  {[
                    { label: 'Données Historiques', val: '98%' },
                    { label: 'Détails des Engagements', val: '85%' },
                    { label: 'Conditions de Marché', val: '72%' },
                  ].map((f, i) => (
                    <div key={i} className="space-y-1">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span>{f.label}</span>
                          <span className="text-indigo-600">{f.val}</span>
                       </div>
                       <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: f.val }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
