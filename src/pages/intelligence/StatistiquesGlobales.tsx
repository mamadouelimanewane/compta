import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, 
  Activity, ArrowUpRight, ArrowDownRight, Zap 
} from 'lucide-react';

export default function StatistiquesGlobales() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);

  const stats = useMemo(() => {
    // Group by month
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthlyData = months.map(m => ({ name: m, revenus: 0, charges: 0 }));

    let totalRevenus = 0;
    let totalCharges = 0;

    lignes.forEach(l => {
      const monthIdx = new Date(l.date).getMonth();
      if (l.compteGeneralId.startsWith('7')) {
        const val = l.credit - l.debit;
        monthlyData[monthIdx].revenus += val;
        totalRevenus += val;
      } else if (l.compteGeneralId.startsWith('6')) {
        const val = l.debit - l.credit;
        monthlyData[monthIdx].charges += val;
        totalCharges += val;
      }
    });

    const pieData = [
      { name: 'Revenus', value: totalRevenus, color: '#10b981' },
      { name: 'Charges', value: totalCharges, color: '#f43f5e' },
    ];

    return { monthlyData, totalRevenus, totalCharges, pieData };
  }, [lignes]);

  const COLORS = ['#10b981', '#f43f5e', '#6366f1', '#f59e0b'];

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Zap size={32} />
             </div>
             Intelligence Décisionnelle
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Analyse prédictive et performance financière en temps réel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
            <div className="flex justify-between items-center text-emerald-600">
               <p className="text-[10px] font-black uppercase tracking-widest">Total Revenus</p>
               <ArrowUpRight size={20} />
            </div>
            <h2 className="text-3xl font-black">{stats.totalRevenus.toLocaleString()} <span className="text-xs opacity-30 font-medium">FCFA</span></h2>
            <div className="w-full h-1 bg-emerald-50 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500" style={{ width: '70%' }}></div>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
            <div className="flex justify-between items-center text-rose-600">
               <p className="text-[10px] font-black uppercase tracking-widest">Total Charges</p>
               <ArrowDownRight size={20} />
            </div>
            <h2 className="text-3xl font-black">{stats.totalCharges.toLocaleString()} <span className="text-xs opacity-30 font-medium">FCFA</span></h2>
            <div className="w-full h-1 bg-rose-50 rounded-full overflow-hidden">
               <div className="h-full bg-rose-500" style={{ width: '40%' }}></div>
            </div>
         </div>
         <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl space-y-4 lg:col-span-2 relative overflow-hidden group">
            <Activity className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 group-hover:scale-125 transition-transform duration-1000" />
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Résultat Net Actuel</p>
            <h2 className="text-4xl font-black">{(stats.totalRevenus - stats.totalCharges).toLocaleString()} <span className="text-sm opacity-30 font-medium">{currentDossier?.devisePrincipale}</span></h2>
            <p className="text-xs font-bold text-white/40 italic">Marge nette de {((stats.totalRevenus - stats.totalCharges) / (stats.totalRevenus || 1) * 100).toFixed(1)}% certifiée Joule.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
               <Activity size={18} className="text-indigo-600" /> Flux Revenus vs Charges
            </h3>
            <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthlyData}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCha" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 900 }}
                     />
                     <Area type="monotone" dataKey="revenus" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                     <Area type="monotone" dataKey="charges" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorCha)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
               <PieIcon size={18} className="text-emerald-600" /> Répartition du Patrimoine
            </h3>
            <div className="h-[400px] w-full flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={stats.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={140}
                        paddingAngle={10}
                        dataKey="value"
                     >
                        {stats.pieData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute flex flex-col items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Ratio</p>
                  <p className="text-2xl font-black text-slate-900">{(stats.totalRevenus / (stats.totalCharges || 1)).toFixed(2)}</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
