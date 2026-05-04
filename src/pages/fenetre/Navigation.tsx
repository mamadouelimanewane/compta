import { Compass, Layers, MonitorSmartphone } from 'lucide-react';

export default function Navigation() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Compass size={32} />
             </div>
             Options de Navigation
          </h1>
          <p className="text-slate-500 font-medium mt-2">Gérez le comportement des fenêtres et de l'espace de travail.</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
         <div className="flex items-start gap-6 p-6 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
            <Layers className="text-indigo-600" size={24} />
            <div>
               <h3 className="text-lg font-bold text-slate-900">Multi-fenêtrage</h3>
               <p className="text-sm text-slate-500 mt-1">Autorise l'ouverture de plusieurs vues simultanément (Bilan, Grand Livre, Saisie).</p>
               <div className="mt-4 flex items-center gap-2">
                  <span className="w-10 h-6 bg-indigo-600 rounded-full flex items-center px-1 shadow-inner cursor-pointer">
                     <span className="w-4 h-4 bg-white rounded-full translate-x-4"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-700">Activé</span>
               </div>
            </div>
         </div>
         
         <div className="flex items-start gap-6 p-6 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
            <MonitorSmartphone className="text-indigo-600" size={24} />
            <div>
               <h3 className="text-lg font-bold text-slate-900">Responsive UI</h3>
               <p className="text-sm text-slate-500 mt-1">L'interface s'adapte automatiquement à la taille de votre écran.</p>
               <div className="mt-4 flex items-center gap-2">
                  <span className="w-10 h-6 bg-indigo-600 rounded-full flex items-center px-1 shadow-inner cursor-pointer">
                     <span className="w-4 h-4 bg-white rounded-full translate-x-4"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-700">Activé (Par défaut)</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
