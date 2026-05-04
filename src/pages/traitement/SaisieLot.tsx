import { Layers, Plus, Search, Calendar, ShieldCheck } from 'lucide-react';

export default function SaisieLot() {
  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Layers size={32} />
             </div>
             Saisie par Lot
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Traitement groupé d'écritures pour une productivité décuplée.</p>
        </div>
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-700 shadow-xl transition-all">
           <Plus size={18} /> CRÉER UN NOUVEAU LOT
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 flex flex-wrap items-center gap-8">
         <div className="flex-1 min-w-[300px] relative group">
            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un lot par libellé ou date..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-inner"
            />
         </div>
         <div className="flex items-center gap-4">
            <div className="px-6 py-3 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100 text-xs font-black text-slate-600">
               <Calendar size={18} className="text-indigo-600" /> TOUS LES LOTS EN COURS
            </div>
         </div>
      </div>

      <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-20 space-y-8">
         <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
            <Layers size={64} />
         </div>
         <div>
            <h2 className="text-2xl font-black text-slate-900">Aucun Lot Actif</h2>
            <p className="text-slate-500 font-medium mt-2 max-w-md">Utilisez la saisie par lot pour importer ou générer massivement des écritures répétitives ou provenant de fichiers externes.</p>
         </div>
         <div className="px-8 py-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-4 border border-emerald-100">
            <ShieldCheck size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Vérification d'intégrité batch activée</p>
         </div>
      </div>
    </div>
  );
}
