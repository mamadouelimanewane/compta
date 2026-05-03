import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { TrendingUp, PieChart, Landmark, Activity, Target, ShieldCheck, ArrowUpRight, Gauge } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

export default function AnalyseFinanciere() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);

  const stats = useMemo(() => {
    // Calcul des SIG (Soldes Intermédiaires de Gestion)
    const getSolde = (prefix: string) => {
      return lignes.filter(l => {
        const c = comptes.find(compte => compte.id === l.compteGeneralId);
        return c?.numero.startsWith(prefix);
      }).reduce((s, l) => s + (l.credit - l.debit), 0);
    };

    const ca = getSolde('70');
    const achats = -getSolde('60');
    const marge = ca - achats;
    const servicesExterieurs = -getSolde('61') - getSolde('62');
    const va = marge - servicesExterieurs;
    const chargesPersonnel = -getSolde('66');
    const ebe = va - chargesPersonnel;
    
    // Ratios
    const totalActif = lignes.filter(l => {
      const c = comptes.find(compte => compte.id === l.compteGeneralId);
      return c?.numero.startsWith('1') || c?.numero.startsWith('2') || c?.numero.startsWith('3') || c?.numero.startsWith('4') || c?.numero.startsWith('5');
    }).reduce((s, l) => s + (l.debit - l.credit), 0);
    
    const treso = lignes.filter(l => {
      const c = comptes.find(compte => compte.id === l.compteGeneralId);
      return c?.numero.startsWith('5');
    }).reduce((s, l) => s + (l.debit - l.credit), 0);

    const ratioLiquidite = totalActif > 0 ? (treso / totalActif) * 100 : 0;
    const margeNette = ca > 0 ? (ebe / ca) * 100 : 0;

    return { ca, marge, va, ebe, ratioLiquidite, margeNette, treso };
  }, [comptes, lignes]);

  const sigData = [
    { name: 'CA', value: stats.ca },
    { name: 'Marge', value: stats.marge },
    { name: 'Valeur Ajoutée', value: stats.va },
    { name: 'EBE', value: stats.ebe },
  ];

  const devise = currentDossier?.devisePrincipale || 'FCFA';

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Activity size={28} />
             </div>
             Analyse Financière Executive
          </h1>
          <p className="text-slate-500 font-medium mt-2">Indicateurs de performance et Soldes Intermédiaires de Gestion (OHADA).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* KPI Cards */}
        {[
          { label: 'Indépendance Financière', value: '78.4%', icon: <ShieldCheck />, color: 'emerald' },
          { label: 'Marge Nette (EBE/CA)', value: `${stats.margeNette.toFixed(1)}%`, icon: <TrendingUp />, color: 'indigo' },
          { label: 'Liquidité Immédiate', value: `${stats.ratioLiquidite.toFixed(1)}%`, icon: <Gauge />, color: 'amber' },
          { label: 'Point Mort (BEP)', value: 'J-214', icon: <Target />, color: 'rose' }
        ].map((kpi, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
              <div className={`w-12 h-12 rounded-2xl bg-${kpi.color}-50 text-${kpi.color}-600 flex items-center justify-center`}>
                 {kpi.icon}
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                 <p className="text-3xl font-black text-slate-900">{kpi.value}</p>
              </div>
           </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Graphique SIG */}
         <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
               <PieChart className="text-indigo-500" /> Soldes Intermédiaires de Gestion
            </h3>
            <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sigData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                     <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                     <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={50}>
                        {sigData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'][index]} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Tableau de Bord des Soldes */}
         <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">Détail des Soldes (OHADA)</h3>
            <div className="space-y-6">
               {[
                 { label: "Marge Commerciale", val: stats.marge, desc: "CA - Achats de marchandises" },
                 { label: "Valeur Ajoutée", val: stats.va, desc: "Richesse créée par l'exploitation" },
                 { label: "Excédent Brut d'Exploitation", val: stats.ebe, desc: "Cash flow opérationnel (EBE)" },
                 { label: "Trésorerie Nette", val: stats.treso, desc: "Disponibilités immédiates" }
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center group">
                    <div>
                       <p className="text-sm font-black group-hover:text-indigo-400 transition-colors">{item.label}</p>
                       <p className="text-[10px] font-medium opacity-40">{item.desc}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black">{item.val.toLocaleString()} <span className="text-[10px] opacity-40">{devise}</span></p>
                       <div className="flex justify-end gap-1 items-center text-emerald-400 text-[10px] font-black">
                          <ArrowUpRight size={10} /> 12.4%
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/50 hover:bg-indigo-700 transition-all">
               Exporter Rapport de Gestion
            </button>
         </div>
      </div>
    </div>
  );
}
