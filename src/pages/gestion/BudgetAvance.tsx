import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Target, Calculator, TrendingUp, AlertTriangle, Save, 
  ChevronRight, ChevronDown, CheckCircle, PieChart, BarChart2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function BudgetAvance() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId && (c.nature === 'Charge' || c.nature === 'Produit'));
  const budgets = useStore(state => state.budgets).filter(b => b.dossierId === currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const setBudget = useStore(state => state.setBudget);

  const [selectedCompteId, setSelectedCompteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'planning' | 'analyse'>('planning');

  // Logic for a single account planning
  const currentBudget = useMemo(() => {
    return budgets.find(b => b.compteGeneralId === selectedCompteId) || {
      montantAnnuel: 0,
      repartitionMensuelle: Array(12).fill(0)
    };
  }, [budgets, selectedCompteId]);

  const handleUpdateBudget = (monthIndex: number, value: number) => {
    if (!selectedCompteId || !currentDossierId) return;
    const newRepartition = [...currentBudget.repartitionMensuelle];
    newRepartition[monthIndex] = value;
    const newTotal = newRepartition.reduce((s, v) => s + v, 0);
    
    setBudget({
      dossierId: currentDossierId,
      compteGeneralId: selectedCompteId,
      exercice: new Date().getFullYear(),
      montantAnnuel: newTotal,
      repartitionMensuelle: newRepartition
    });
  };

  const analysisData = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months.map((m, i) => {
      const budgetMois = budgets.reduce((acc, b) => acc + b.repartitionMensuelle[i], 0);
      const reelMois = lignes
        .filter(l => {
          const d = new Date(l.date);
          return d.getMonth() === i;
        })
        .reduce((acc, l) => acc + (l.debit - l.credit), 0);
      
      return { name: m, Budget: budgetMois, Réel: reelMois, Ecart: budgetMois - reelMois };
    });
  }, [budgets, lignes]);

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-xl shadow-rose-100">
                <Target size={32} />
             </div>
             Contrôle Budgétaire Avancé
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Planification pluriannuelle et analyse des écarts en temps réel.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
           <button onClick={() => setActiveTab('planning')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'planning' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Planning</button>
           <button onClick={() => setActiveTab('analyse')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analyse' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Analyse Écarts</button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar: Liste des Comptes */}
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Comptes d'exploitation</h3>
            <div className="space-y-2">
               {comptes.map(c => {
                 const hasBudget = budgets.some(b => b.compteGeneralId === c.id);
                 return (
                   <button 
                     key={c.id}
                     onClick={() => setSelectedCompteId(c.id)}
                     className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group ${selectedCompteId === c.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'hover:bg-slate-50 text-slate-700'}`}
                   >
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black opacity-50">{c.numero}</span>
                         <span className="text-xs font-bold truncate max-w-[140px]">{c.intitule}</span>
                      </div>
                      {hasBudget && <div className={`w-2 h-2 rounded-full ${selectedCompteId === c.id ? 'bg-white' : 'bg-emerald-500'}`}></div>}
                   </button>
                 );
               })}
            </div>
         </div>

         {/* Zone de Contenu */}
         <div className="lg:col-span-3 space-y-8">
            {activeTab === 'planning' ? (
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 flex flex-col h-full animate-in slide-in-from-right-8">
                 {!selectedCompteId ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                      <Calculator size={64} className="mb-4" />
                      <p className="font-black uppercase tracking-widest text-xs">Sélectionnez un compte pour planifier le budget</p>
                   </div>
                 ) : (
                   <div className="space-y-10">
                      <div className="flex justify-between items-center">
                         <div>
                            <h2 className="text-2xl font-black text-slate-900">Budget Mensuel : {comptes.find(c => c.id === selectedCompteId)?.intitule}</h2>
                            <p className="text-sm font-bold text-indigo-600 uppercase mt-1">Exercice {new Date().getFullYear()}</p>
                         </div>
                         <div className="p-6 bg-slate-900 rounded-[2rem] text-white text-center min-w-[200px]">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Annuel</p>
                            <p className="text-2xl font-black">{(currentBudget.montantAnnuel || 0).toLocaleString()} <span className="text-xs font-medium">FCFA</span></p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                         {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map((month, i) => (
                           <div key={i} className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{month}</label>
                              <div className="relative">
                                 <input 
                                   type="number" 
                                   value={currentBudget.repartitionMensuelle[i] || ''}
                                   onChange={(e) => handleUpdateBudget(i, parseFloat(e.target.value) || 0)}
                                   className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-inner"
                                   placeholder="0"
                                 />
                                 <div className="absolute right-4 top-4 text-slate-300 font-bold text-[10px]">FCFA</div>
                              </div>
                           </div>
                         ))}
                      </div>

                      <div className="pt-10 border-t border-slate-50 flex justify-end">
                         <button className="btn-elite flex items-center gap-3">
                            <Save size={18} /> ENREGISTRER LA PLANIFICATION
                         </button>
                      </div>
                   </div>
                 )}
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card-elite bg-indigo-600 text-white">
                       <p className="text-[10px] font-black uppercase text-indigo-300 mb-2">Budget Consolidé</p>
                       <p className="text-3xl font-black">{budgets.reduce((s,b) => s+b.montantAnnuel, 0).toLocaleString()} FCFA</p>
                    </div>
                    <div className="card-elite bg-emerald-600 text-white">
                       <p className="text-[10px] font-black uppercase text-emerald-300 mb-2">Réalisé Actuel</p>
                       <p className="text-3xl font-black">{lignes.reduce((s,l) => s + (l.debit - l.credit), 0).toLocaleString()} FCFA</p>
                    </div>
                    <div className="card-elite bg-slate-900 text-white">
                       <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Taux d'Atterrissage</p>
                       <p className="text-3xl font-black">{(lignes.length > 0 ? (lignes.reduce((s,l) => s + (l.debit-l.credit), 0) / budgets.reduce((s,b) => s+b.montantAnnuel, 1) * 100).toFixed(1) : 0)}%</p>
                    </div>
                 </div>

                 <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 h-[450px]">
                    <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3"><BarChart2 className="text-indigo-600" /> Analyse Comparative Mensuelle</h3>
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={analysisData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)'}} />
                          <Legend iconType="circle" />
                          <Bar dataKey="Budget" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="Réel" fill="#10b981" radius={[6, 6, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
