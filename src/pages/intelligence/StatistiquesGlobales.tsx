import { useStore } from '../../store/useStore';
import { BarChart, LineChart, PieChart, TrendingUp, TrendingDown, DollarSign, Activity, Calendar } from 'lucide-react';
import { useMemo } from 'react';

export default function StatistiquesGlobales() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);

  const { chiffreAffaires, charges, tresorerie, evolutionCA } = useMemo(() => {
    let ca = 0;
    let ch = 0;
    let treso = 0;

    lignesEcriture.forEach(ligne => {
      const compte = comptes.find(c => c.id === ligne.compteGeneralId);
      if (!compte) return;

      if (compte.numero.startsWith('7')) ca += ligne.credit - ligne.debit;
      if (compte.numero.startsWith('6')) ch += ligne.debit - ligne.credit;
      if (compte.numero.startsWith('5')) treso += ligne.debit - ligne.credit;
    });

    return {
      chiffreAffaires: ca,
      charges: ch,
      tresorerie: treso,
      evolutionCA: ca > 0 ? '+15.4%' : '0%' // Simulation
    };
  }, [lignesEcriture, comptes]);

  const margeNet = chiffreAffaires - charges;
  const margePercentage = chiffreAffaires > 0 ? ((margeNet / chiffreAffaires) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <BarChart size={32} />
             </div>
             Intelligence & Statistiques
          </h1>
          <p className="text-slate-500 font-medium mt-2">Analyse financière avancée en temps réel.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Chiffre d'Affaires</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{chiffreAffaires.toLocaleString()} <span className="text-sm text-slate-400">FCFA</span></h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Charges</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{charges.toLocaleString()} <span className="text-sm text-slate-400">FCFA</span></h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Marge Nette</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{margeNet.toLocaleString()} <span className="text-sm text-slate-400">FCFA</span></h2>
            <p className={`text-xs font-bold mt-2 ${Number(margePercentage) > 10 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {margePercentage}% de rentabilité
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Trésorerie Actuelle</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{tresorerie.toLocaleString()} <span className="text-sm text-slate-400">FCFA</span></h2>
          </div>
        </div>
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl h-96 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
               <LineChart size={40} />
            </div>
            <h3 className="text-lg font-black text-slate-900">Évolution de la Trésorerie</h3>
            <p className="text-slate-500 text-sm max-w-sm">Les graphiques D3.js seront affichés ici montrant les flux de trésorerie sur 12 mois glissants.</p>
         </div>
         
         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl h-96 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
               <PieChart size={40} />
            </div>
            <h3 className="text-lg font-black text-slate-900">Répartition des Charges</h3>
            <p className="text-slate-500 text-sm max-w-sm">Graphique en anneau montrant les principaux postes de dépenses (Achats, Électricité, Salaires).</p>
         </div>
      </div>
    </div>
  );
}
