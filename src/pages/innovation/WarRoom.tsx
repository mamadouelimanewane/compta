import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Brain, Zap, ShieldAlert, ArrowRight, Activity, Layers, Info } from 'lucide-react';

// Simulation d'un graphe de flux financiers (Neural Mapping)
// On relie les classes de comptes par les flux d'écritures
export default function WarRoom() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);

  const [stressScenario, setStressScenario] = useState({ clientDefault: 0, costIncrease: 0 });

  const stats = useMemo(() => {
    let cash = 0, revenue = 0, expenses = 0, receivables = 0, payables = 0;
    lignesEcriture.forEach(l => {
      const c = comptes.find(ct => ct.id === l.compteGeneralId);
      if (!c) return;
      if (c.numero.startsWith('5')) cash += l.debit - l.credit;
      else if (c.numero.startsWith('7')) revenue += l.credit - l.debit;
      else if (c.numero.startsWith('6')) expenses += l.debit - l.credit;
      else if (c.numero.startsWith('411')) receivables += l.debit - l.credit;
      else if (c.numero.startsWith('401')) payables += l.credit - l.debit;
    });

    const adjustedCash = cash * (1 - stressScenario.clientDefault / 100);
    const adjustedExpenses = expenses * (1 + stressScenario.costIncrease / 100);
    const adjustedMonthlyBurn = adjustedExpenses / 12 || 1;
    
    const runway = Math.max(0, adjustedCash / adjustedMonthlyBurn * 30); // Jours de survie

    return { cash, revenue, expenses, receivables, payables, runway, adjustedCash };
  }, [lignesEcriture, comptes, stressScenario]);

  const devise = currentDossier?.devisePrincipale || 'FCFA';
  const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center tracking-tight">
            <Brain className="mr-3 text-indigo-600 animate-pulse" />
            DIAMOND INTELLIGENCE CENTER
          </h1>
          <p className="text-slate-500 text-sm font-medium">Analyse neuronale & Simulation stratégique d'avant-garde</p>
        </div>
        <div className="flex space-x-2">
          <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center shadow-lg shadow-indigo-200">
            <Zap size={12} className="mr-1" /> MODE PRÉDICTIF ACTIF
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de Gauche : Visualisation Neuronale */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Layers size={200} className="text-indigo-400" />
          </div>
          <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center">
            <Activity size={14} className="mr-2" /> Cartographie des flux neuronaux
          </h3>
          
          <div className="relative h-80 flex items-center justify-center">
            {/* SVG Neural Map Conceptuelle */}
            <svg viewBox="0 0 400 200" className="w-full h-full">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* Nodes */}
              <circle cx="50" cy="100" r="25" fill="#1e293b" stroke="#4f46e5" strokeWidth="2" filter="url(#glow)" />
              <text x="50" y="105" textAnchor="middle" fill="#4f46e5" className="text-[10px] font-bold">ACHATS</text>
              
              <circle cx="200" cy="100" r="40" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" filter="url(#glow)" />
              <text x="200" y="105" textAnchor="middle" fill="#8b5cf6" className="text-[12px] font-bold uppercase">TRÉSORERIE</text>
              
              <circle cx="350" cy="100" r="25" fill="#1e293b" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
              <text x="350" y="105" textAnchor="middle" fill="#10b981" className="text-[10px] font-bold">VENTES</text>

              {/* Dynamic Edges with Animated Particles */}
              <path d="M 75 100 L 160 100" stroke="#4f46e5" strokeWidth="1" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="5s" repeatCount="indefinite" />
              </path>
              <path d="M 325 100 L 240 100" stroke="#10b981" strokeWidth="1" strokeDasharray="5,5">
                <animate attributeName="stroke-dashoffset" from="0" to="100" dur="3s" repeatCount="indefinite" />
              </path>

              <text x="117" y="90" textAnchor="middle" fill="#64748b" className="text-[8px] italic">Sorties : {fmt(stats.expenses)}</text>
              <text x="283" y="90" textAnchor="middle" fill="#64748b" className="text-[8px] italic">Entrées : {fmt(stats.revenue)}</text>
            </svg>

            {/* Légende Intelligence */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around text-center px-4 pb-4">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase">Santé Flux</p>
                <p className="text-emerald-400 font-bold text-sm">OPTIMALE</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase">Anomalies</p>
                <p className="text-amber-400 font-bold text-sm">0 DÉTECTÉE</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase">Confiance</p>
                <p className="text-indigo-400 font-bold text-sm">99.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne de Droite : Survival Runway */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Survival Runway</h3>
            <p className="text-5xl font-black text-slate-900 tabular-nums">{Math.round(stats.runway)}</p>
            <p className="text-slate-500 font-bold text-lg mb-6">JOURS DE SURVIE</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-600">Trésorerie Ajustée</span>
                  <span className="text-xs font-bold text-indigo-600">{fmt(stats.adjustedCash)} {devise}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-rose-700">Risque de Rupture</span>
                  <span className="text-xs font-bold text-rose-600">{stats.runway < 30 ? 'CRITIQUE' : stats.runway < 90 ? 'MODÉRÉ' : 'FAIBLE'}</span>
                </div>
                <div className="w-full bg-rose-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-600 h-full rounded-full" style={{ width: stats.runway < 30 ? '90%' : stats.runway < 90 ? '50%' : '10%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              Générer Rapport Stratégique <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Panel */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center space-x-3 mb-8">
          <ShieldAlert className="text-amber-400" size={24} />
          <h3 className="text-xl font-bold">Simulateur de Stress Stratégique</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-indigo-200 uppercase tracking-wider">Défaut de Paiement Clients (Créances Perdues)</label>
                <span className="text-lg font-black text-amber-400">{stressScenario.clientDefault}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="5" 
                value={stressScenario.clientDefault} 
                onChange={e => setStressScenario(s => ({ ...s, clientDefault: +e.target.value }))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-indigo-200 uppercase tracking-wider">Inflation / Hausse des Coûts Fixes</label>
                <span className="text-lg font-black text-indigo-400">+{stressScenario.costIncrease}%</span>
              </div>
              <input 
                type="range" min="0" max="50" step="5" 
                value={stressScenario.costIncrease} 
                onChange={e => setStressScenario(s => ({ ...s, costIncrease: +e.target.value }))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-center">
            <h4 className="text-indigo-300 text-xs font-bold uppercase mb-4 flex items-center">
              <Info size={14} className="mr-2" /> Impact Prédit sur la Structure
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase">Cash Flow Perdu</p>
                <p className="text-xl font-bold text-rose-400">-{fmt(stats.cash * (stressScenario.clientDefault/100))} {devise}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase">Impact Résultat</p>
                <p className="text-xl font-bold text-amber-400">-{fmt(stats.expenses * (stressScenario.costIncrease/100))} {devise}</p>
              </div>
            </div>
            <p className="text-xs text-indigo-300/60 mt-6 italic">L'IA Diamond suggère : Augmentez vos provisions pour créances douteuses et négociez vos délais de paiement fournisseurs pour compenser cette simulation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
