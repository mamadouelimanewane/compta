import { useState } from 'react';
import { 
  Swords, ShieldAlert, TrendingUp, TrendingDown, 
  Zap, Users, Target, Rocket, 
  RotateCcw, Save, ShieldCheck, PieChart 
} from 'lucide-react';

export default function WarRoom() {
  const [impact, setImpact] = useState(0);
  const [decisions, setDecisions] = useState<string[]>([]);
  const [status, setStatus] = useState('CRITIQUE');

  const handleDecision = (label: string, value: number) => {
    if (decisions.includes(label)) {
      setDecisions(decisions.filter(d => d !== label));
      setImpact( impact - value);
    } else {
      setDecisions([...decisions, label]);
      setImpact(impact + value);
    }
  };

  const resilience = Math.min(100, 25 + impact);

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000 pb-20 h-full flex flex-col bg-slate-950 min-h-screen -m-4 p-10 overflow-hidden">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-3 py-1 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                <ShieldAlert size={12} /> MODE CRISE ACTIVÉ
             </div>
             <div className="px-3 py-1 bg-white/10 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                Strategic Simulation
             </div>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-white rounded-2xl text-slate-950 shadow-xl">
                <Swords size={40} />
             </div>
             War Room Strategic
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic text-lg">Prenez des décisions radicales pour restaurer la résilience de votre entreprise.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => { setDecisions([]); setImpact(0); }}
             className="px-8 py-4 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all border border-white/10"
           >
              <RotateCcw size={18} /> RÉINITIALISER
           </button>
           <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-2xl">
              <Save size={18} /> ACTER LA STRATÉGIE
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
         {/* Panneau de Décisions */}
         <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Leviers de Décision</h3>
            <div className="grid grid-cols-1 gap-4">
               {[
                 { label: 'Réduction Masse Salariale (-15%)', val: 20, icon: <Users /> },
                 { label: 'Pivot vers Marché Export', val: 15, icon: <Rocket /> },
                 { label: 'Augmentation Prix (+10%)', val: 10, icon: <TrendingUp /> },
                 { label: 'Coupure Budget Marketing', val: 12, icon: <Target /> },
                 { label: 'Renégociation Dettes Bancaires', val: 18, icon: <PieChart /> },
                 { label: 'Optimisation Logistique IA', val: 14, icon: <Zap /> },
               ].map((d, i) => (
                 <button 
                   key={i}
                   onClick={() => handleDecision(d.label, d.val)}
                   className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${decisions.includes(d.label) ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl translate-x-4' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10'}`}
                 >
                    <div className="flex items-center gap-4">
                       <div className={`${decisions.includes(d.label) ? 'text-white' : 'text-slate-600 group-hover:text-indigo-400'} transition-colors`}>
                          {d.icon}
                       </div>
                       <span className="text-xs font-black uppercase tracking-widest">{d.label}</span>
                    </div>
                    {decisions.includes(d.label) && <ShieldCheck size={20} />}
                 </button>
               ))}
            </div>
         </div>

         {/* Visualisation Impact */}
         <div className="lg:col-span-2 flex flex-col gap-10">
            <div className="bg-white/5 rounded-[4rem] border border-white/5 p-16 flex flex-col items-center justify-center relative overflow-hidden flex-1 shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none"></div>
               
               <div className="relative z-10 text-center space-y-10">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Score de Résilience Actuel</p>
                     <h2 className={`text-[12rem] font-black tracking-tighter leading-none transition-colors ${resilience > 70 ? 'text-emerald-500' : resilience > 40 ? 'text-amber-500' : 'text-rose-600'}`}>
                        {resilience}%
                     </h2>
                  </div>

                  <div className="w-[400px] h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 mx-auto">
                     <motion.div 
                        initial={{ width: '25%' }}
                        animate={{ width: `${resilience}%` }}
                        className={`h-full transition-all duration-1000 ${resilience > 70 ? 'bg-emerald-500' : resilience > 40 ? 'bg-amber-500' : 'bg-rose-600'}`}
                     />
                  </div>

                  <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 max-w-lg mx-auto">
                     <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                        <Zap size={16} /> Analyse de l'IA War Room
                     </h4>
                     <p className="text-sm font-bold text-slate-300 leading-relaxed italic">
                        {resilience < 40 
                          ? "Votre entreprise est en danger immédiat. Les décisions actuelles ne couvrent pas l'impact de la stagflation." 
                          : resilience < 70 
                          ? "Bonne réaction. Vous avez restauré une marge de manœuvre, mais le pivot vers l'export reste conseillé." 
                          : "Résilience Restaurée. Votre structure est désormais capable d'absorber le choc économique simulé."}
                     </p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Décisions Actées</p>
                  <p className="text-2xl font-black text-white">{decisions.length}</p>
               </div>
               <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Correctif de Marge</p>
                  <p className="text-2xl font-black text-emerald-500">+{impact.toFixed(1)}%</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

// Helper motion component if needed, but here we can just use transition classes for simplicity if motion is not imported
const motion = {
  div: ({ children, animate, className, initial }: any) => (
    <div className={className} style={{ width: animate?.width, transition: 'width 1s ease-in-out' }}>
       {children}
    </div>
  )
};
