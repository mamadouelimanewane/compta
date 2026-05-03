import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { PieChart, Search, Download, Filter, Target, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import { PieChart as RePie, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function EtatsAnalytiques() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);

  const analyticData = useMemo(() => {
    const sections: Record<string, { name: string, debit: number, credit: number, solde: number }> = {};
    
    lignes.forEach(l => {
      const section = l.sectionAnalytique || 'NON_VENTILE';
      if (!sections[section]) {
        sections[section] = { name: section, debit: 0, credit: 0, solde: 0 };
      }
      sections[section].debit += l.debit;
      sections[section].credit += l.credit;
      
      const c = comptes.find(compte => compte.id === l.compteGeneralId);
      if (c?.numero.startsWith('7')) {
        sections[section].solde += (l.credit - l.debit);
      } else if (c?.numero.startsWith('6')) {
        sections[section].solde -= (l.debit - l.credit);
      }
    });

    return Object.values(sections).sort((a, b) => b.solde - a.solde);
  }, [lignes, comptes]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const devise = currentDossier?.devisePrincipale || 'FCFA';

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <PieChart size={28} />
             </div>
             Performance Analytique
          </h1>
          <p className="text-slate-500 font-medium mt-2">Analyse de la rentabilité par centres de profit et projets.</p>
        </div>
        <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-[1.5rem] font-black text-xs flex items-center gap-3 hover:bg-slate-50 transition-all uppercase tracking-widest">
           <Download size={18} /> EXPORTER ANALYSE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Top Performing Section */}
         <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
            <h3 className="text-xl font-black text-slate-900 mb-4">Répartition des Charges</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <RePie>
                     <Pie
                        data={analyticData.filter(d => d.name !== 'NON_VENTILE')}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="debit"
                     >
                        {analyticData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </RePie>
               </ResponsiveContainer>
            </div>
            <div className="space-y-4">
               {analyticData.slice(0, 4).map((d, i) => (
                 <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                       <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{d.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{d.solde.toLocaleString()} {devise}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Profitability Bar Chart */}
         <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
               <TrendingUp className="text-emerald-500" /> Rentabilité par Axe Analytique
            </h3>
            <div className="h-[450px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticData} layout="vertical" margin={{ left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} width={100} />
                     <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                     <Bar dataKey="solde" radius={[0, 10, 10, 0]} barSize={30}>
                        {analyticData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.solde > 0 ? '#10b981' : '#f43f5e'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black">Grand Livre Analytique</h3>
            <div className="relative">
               <input placeholder="Filtrer section..." className="pl-10 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold w-64" />
               <Search size={16} className="absolute left-3.5 top-3 text-white/20" />
            </div>
         </div>
         <div className="overflow-hidden rounded-2xl border border-white/5">
            <table className="w-full text-left">
               <thead className="bg-white/5">
                  <tr>
                     <th className="px-8 py-4 text-[10px] font-black text-indigo-300 uppercase tracking-widest">Section</th>
                     <th className="px-8 py-4 text-[10px] font-black text-indigo-300 uppercase tracking-widest text-right">Débit</th>
                     <th className="px-8 py-4 text-[10px] font-black text-indigo-300 uppercase tracking-widest text-right">Crédit</th>
                     <th className="px-8 py-4 text-[10px] font-black text-indigo-300 uppercase tracking-widest text-right">Solde Analytique</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {analyticData.map((d, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                       <td className="px-8 py-4">
                          <p className="text-sm font-black text-white">{d.name}</p>
                          <p className="text-[10px] font-bold text-indigo-400 uppercase">Centre de Profit</p>
                       </td>
                       <td className="px-8 py-4 text-right font-bold opacity-60">{d.debit.toLocaleString()}</td>
                       <td className="px-8 py-4 text-right font-bold opacity-60">{d.credit.toLocaleString()}</td>
                       <td className="px-8 py-4 text-right">
                          <span className={`text-lg font-black ${d.solde >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                             {d.solde.toLocaleString()} <span className="text-[10px] opacity-60 uppercase">{devise}</span>
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
