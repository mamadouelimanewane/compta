import { 
  ShieldCheck, Star, TrendingUp, AlertCircle, 
  Users, CheckCircle, Search, Filter, 
  Award, Zap, BrainCircuit
} from 'lucide-react';

export default function TrustScoring() {
  const tiers = [
    { name: 'Sénégal Digital Corp', score: 98, status: 'Elite', trend: '+2', color: 'text-amber-500', category: 'Client' },
    { name: 'Logistique Express SA', score: 85, status: 'Gold', trend: '-1', color: 'text-slate-400', category: 'Fournisseur' },
    { name: 'Total Energy Sénégal', score: 92, status: 'Elite', trend: '0', color: 'text-amber-500', category: 'Fournisseur' },
    { name: 'BTP Moderne SARL', score: 45, status: 'Risque', trend: '-12', color: 'text-rose-500', category: 'Client' },
  ];

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-3 py-1 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Award size={12} /> TRUST SCORE v1.2
             </div>
             <div className="px-3 py-1 bg-white border border-slate-200 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                Compliance Analytics
             </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
                <Star size={32} />
             </div>
             Diamond Trust Scoring
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Évaluation multidimensionnelle de la fiabilité de vos partenaires commerciaux.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {[
           { label: 'Score Moyen Groupe', value: '82/100', icon: <Star />, color: 'text-indigo-600' },
           { label: 'Tiers sous surveillance', value: '3', icon: <AlertCircle />, color: 'text-rose-600' },
           { label: 'Taux de conformité GED', value: '94%', icon: <CheckCircle />, color: 'text-emerald-600' },
           { label: 'Partenaires Elite', value: '12', icon: <Award />, color: 'text-amber-500' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                 <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-slate-400">{stat.icon}</div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col">
         <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <BrainCircuit size={20} className="text-indigo-600" />
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Classement de Fiabilité IA</h3>
            </div>
            <div className="relative group">
               <Search className="absolute left-4 top-3 text-slate-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Rechercher un tiers..."
                 className="pl-12 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold w-64 focus:ring-2 focus:ring-amber-500 shadow-sm"
               />
            </div>
         </div>

         <div className="p-4">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="px-8 py-6">Partenaire / Type</th>
                     <th className="px-8 py-6">Diamond Score</th>
                     <th className="px-8 py-6">Statut Trust</th>
                     <th className="px-8 py-6">Tendance</th>
                     <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {tiers.map((t, i) => (
                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="px-8 py-5">
                          <p className="text-sm font-black text-slate-900">{t.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.category}</p>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                             <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                                <div className={`h-full ${t.score > 90 ? 'bg-amber-500' : t.score > 70 ? 'bg-indigo-500' : 'bg-rose-500'}`} style={{ width: `${t.score}%` }}></div>
                             </div>
                             <span className="text-sm font-black text-slate-900">{t.score}</span>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <div className={`w-fit px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${t.status === 'Elite' ? 'bg-amber-50 text-amber-600' : t.status === 'Risque' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                             {t.status === 'Elite' ? <Award size={14} /> : t.status === 'Risque' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                             {t.status}
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <div className={`flex items-center gap-1 font-black text-xs ${t.trend.startsWith('+') ? 'text-emerald-500' : t.trend.startsWith('-') ? 'text-rose-500' : 'text-slate-400'}`}>
                             {t.trend.startsWith('+') ? <TrendingUp size={14} /> : t.trend.startsWith('-') ? <TrendingDown size={14} /> : <Zap size={14} />}
                             {t.trend}
                          </div>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-900 flex items-center gap-2 ml-auto">
                             Analyse Deep-Dive <ShieldCheck size={14} />
                          </button>
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
