import { useStore } from '../../store/useStore';
import { Brain, TrendingUp, Wallet, ShieldCheck, Globe, Zap, ArrowUpRight, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export default function WarRoom() {
  const dossiers = useStore(state => state.dossiers);
  const allLignes = useStore(state => state.lignesEcriture);
  const allComptes = useStore(state => state.comptes);

  // Consolidation des données
  const consolidation = dossiers.map(d => {
    const lignes = allLignes.filter(l => l.dossierId === d.id);
    const comptes = allComptes.filter(c => c.dossierId === d.id);
    
    const ca = lignes.filter(l => {
      const c = comptes.find(compte => compte.id === l.compteGeneralId);
      return c?.numero.startsWith('7');
    }).reduce((s, l) => s + l.credit - l.debit, 0);

    const treso = lignes.filter(l => {
      const c = comptes.find(compte => compte.id === l.compteGeneralId);
      return c?.numero.startsWith('5');
    }).reduce((s, l) => s + l.debit - l.credit, 0);

    return { name: d.raisonSociale, ca, treso };
  });

  const totalCA = consolidation.reduce((s, c) => s + c.ca, 0);
  const totalTreso = consolidation.reduce((s, c) => s + c.treso, 0);

  return (
    <div className="space-y-8 p-4 animate-in fade-in duration-1000">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-6">
            <div className="p-4 bg-slate-900 rounded-[2rem] text-white shadow-2xl shadow-indigo-200">
              <Brain size={40} className="animate-pulse" />
            </div>
            DIAWDI Intelligence Center
          </h1>
          <p className="text-slate-500 font-bold text-lg mt-4 uppercase tracking-[0.3em]">Consolidation Stratégique Multi-Dossiers</p>
        </div>
        <div className="flex gap-4">
           <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-emerald-700">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1">Global Liquidity</p>
              <p className="text-2xl font-black">{totalTreso.toLocaleString()} FCFA</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
           <div className="grid grid-cols-3 gap-8">
              {consolidation.map((c, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:scale-105 transition-all cursor-pointer group">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">{c.name.substring(0,2).toUpperCase()}</div>
                      <ArrowUpRight size={20} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 mb-2">{c.name}</h3>
                   <div className="space-y-4">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance (CA)</p>
                         <p className="text-2xl font-black text-indigo-600">{c.ca.toLocaleString()} <span className="text-xs font-medium">FCFA</span></p>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, (c.ca/totalCA)*100)}%` }}></div>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                 <TrendingUp className="text-indigo-500" /> Flux de Trésorerie Consolidés
              </h3>
              <div className="h-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={consolidation}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                       <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                       <Bar dataKey="treso" radius={[10, 10, 10, 10]} barSize={40}>
                          {consolidation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#10b981'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-8 shadow-2xl">
              <h3 className="text-lg font-black uppercase tracking-widest text-indigo-400">Executive Insights</h3>
              <div className="space-y-6">
                 <div className="flex gap-4 items-start">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400"><Target size={20} /></div>
                    <div>
                       <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Objectif CA Annuel</p>
                       <p className="text-xl font-black">{(totalCA * 1.2).toLocaleString()} FCFA</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400"><ShieldCheck size={20} /></div>
                    <div>
                       <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Compliance Score</p>
                       <p className="text-xl font-black">98.4% <span className="text-[10px] text-emerald-400">Elite</span></p>
                    </div>
                 </div>
              </div>
              <div className="pt-8 border-t border-white/10">
                 <button className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/50">
                    Générer Rapport Holding
                 </button>
              </div>
           </div>

           <div className="bg-indigo-50 rounded-[2.5rem] p-8 border border-indigo-100">
              <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4">Neural Alerts</h3>
              <div className="space-y-4">
                 {[
                   { msg: "BFR en hausse sur Dossier A", type: "warning" },
                   { msg: "Optimisation fiscale possible", type: "info" }
                 ].map((alert, i) => (
                   <div key={i} className="flex gap-3 items-center p-4 bg-white rounded-2xl shadow-sm border border-indigo-100">
                      <div className={`w-2 h-2 rounded-full ${alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                      <p className="text-xs font-bold text-slate-700">{alert.msg}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

