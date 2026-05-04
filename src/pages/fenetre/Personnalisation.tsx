import { LayoutDashboard, Maximize, Columns } from 'lucide-react';

export default function Personnalisation() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <LayoutDashboard size={32} />
             </div>
             Personnalisation de l'Interface
          </h1>
          <p className="text-slate-500 font-medium mt-2">Adaptez l'ergonomie de l'ERP à vos habitudes de travail.</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Thème Visuel</h3>
               <div className="flex gap-4">
                  <button className="flex-1 p-6 border-2 border-indigo-600 rounded-2xl bg-slate-50 font-bold text-slate-900">Mode Clair (Actif)</button>
                  <button className="flex-1 p-6 border-2 border-slate-100 rounded-2xl bg-slate-900 font-bold text-white opacity-50 cursor-not-allowed">Mode Sombre (Pro)</button>
               </div>
            </div>
            
            <div className="space-y-6">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Densité d'Affichage</h3>
               <div className="flex gap-4">
                  <button className="flex-1 py-4 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50">Compacte</button>
                  <button className="flex-1 py-4 border-2 border-indigo-600 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold">Confortable</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
