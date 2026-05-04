import { useState } from 'react';
import { Search, Plus, FileDown, Filter, Zap, Command } from 'lucide-react';
import { format } from 'date-fns';

export default function RechercheEcritures() {
  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
                <Search size={32} />
             </div>
             Recherche Universelle
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Moteur multicritères haute performance pour l'audit des flux.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-all">
              <Filter size={18} /> FILTRES AVANCÉS
           </button>
           <button className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-700 shadow-xl transition-all">
              <FileDown size={18} /> EXPORTER
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 space-y-8">
         <div className="relative group">
            <Search className="absolute left-6 top-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="Rechercher par libellé, montant, pièce ou référence..."
              className="w-full pl-20 pr-10 py-6 bg-slate-50 border-none rounded-[2rem] font-black text-xl text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 shadow-inner transition-all"
            />
            <div className="absolute right-6 top-6 flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400">
               <Command size={12} /> K
            </div>
         </div>

         <div className="flex flex-wrap gap-4">
            {['Journal', 'Période', 'Compte', 'Montant', 'Utilisateur'].map((filter, i) => (
              <button key={i} className="px-6 py-2 bg-slate-50 hover:bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all">
                 {filter}: TOUS
              </button>
            ))}
         </div>
      </div>

      <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-20 space-y-8">
         <div className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 relative overflow-hidden group">
            <Zap size={80} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         </div>
         <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Prêt pour l'indexation</h2>
            <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
               Le moteur de recherche est configuré pour indexer vos <span className="text-indigo-600 font-black">milliers d'écritures</span> en temps réel. Saisissez un critère pour commencer l'analyse.
            </p>
         </div>
      </div>
    </div>
  );
}
