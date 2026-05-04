import { Building, Plus, Search, Globe, ShieldCheck } from 'lucide-react';

export default function Banques() {
  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Building size={32} />
             </div>
             Répertoire Bancaire
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Gestion des établissements financiers et comptes de trésorerie.</p>
        </div>
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-700 shadow-xl transition-all">
           <Plus size={18} /> NOUVEL ÉTABLISSEMENT
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 flex flex-wrap items-center gap-8">
         <div className="flex-1 min-w-[300px] relative group">
            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher une banque ou un RIB..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-inner"
            />
         </div>
      </div>

      <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-20 space-y-8">
         <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
            <Building size={64} />
         </div>
         <div>
            <h2 className="text-2xl font-black text-slate-900">Aucun Compte Paramétré</h2>
            <p className="text-slate-500 font-medium mt-2 max-w-md">Connectez vos comptes bancaires pour activer le rapprochement automatique et la gestion de trésorerie en temps réel.</p>
         </div>
         <div className="flex gap-4">
            <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
               <ShieldCheck size={14} /> Sécurisé par Diamond Vault
            </div>
            <div className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
               <Globe size={14} /> Standard SWIFT / SEPA
            </div>
         </div>
      </div>
    </div>
  );
}
