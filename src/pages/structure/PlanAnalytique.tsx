import { PieChart, Plus, Search, Target, Zap } from 'lucide-react';

export default function PlanAnalytique() {
  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-xl">
                <PieChart size={32} />
             </div>
             Plan Analytique
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Axe de gestion par centres de profit et destinations de coûts.</p>
        </div>
        <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-700 shadow-xl transition-all">
           <Plus size={18} /> NOUVELLE SECTION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
         <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center gap-6">
               <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Filtrer les sections analytiques..."
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-inner"
                  />
               </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-6">
               <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-200">
                  <Target size={48} />
               </div>
               <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Aucune section analytique active</p>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                  <Zap size={180} />
               </div>
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-6">Moteur de Répartition</h3>
               <p className="text-sm font-bold text-slate-300 leading-relaxed mb-8">
                  Définissez vos axes analytiques pour un suivi précis de la rentabilité par projet, département ou ligne de produit.
               </p>
               <div className="space-y-4">
                  {['Marketing', 'R&D', 'Production Alpha', 'Siège'].map((tag, i) => (
                    <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40">
                       {tag} (Simulation)
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
