import { LifeBuoy, Book, MessageCircle, PlayCircle } from 'lucide-react';

export default function AideEnLigne() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <LifeBuoy size={32} />
             </div>
             Centre d'Aide & Support
          </h1>
          <p className="text-slate-500 font-medium mt-2">Retrouvez toute la documentation et contactez le support technique.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl space-y-6 hover:-translate-y-2 transition-transform cursor-pointer">
           <Book size={32} className="text-indigo-600" />
           <h3 className="text-xl font-bold text-slate-900">Documentation OHADA</h3>
           <p className="text-sm text-slate-500">Consultez les manuels d'utilisation et le guide de conformité SYSCOHADA.</p>
           <button className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-4">Lire les guides</button>
        </div>
        
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl space-y-6 hover:-translate-y-2 transition-transform cursor-pointer">
           <PlayCircle size={32} className="text-rose-500" />
           <h3 className="text-xl font-bold text-slate-900">Tutoriels Vidéo</h3>
           <p className="text-sm text-slate-500">Apprenez à utiliser les modules avancés comme la saisie IA ou la clôture.</p>
           <button className="text-xs font-black text-rose-500 uppercase tracking-widest mt-4">Voir les vidéos</button>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl space-y-6 hover:-translate-y-2 transition-transform cursor-pointer">
           <MessageCircle size={32} className="text-emerald-500" />
           <h3 className="text-xl font-bold text-slate-900">Support Technique</h3>
           <p className="text-sm text-slate-500">Contactez un expert DIAWDI pour vous assister sur un problème technique.</p>
           <button className="text-xs font-black text-emerald-500 uppercase tracking-widest mt-4">Ouvrir un ticket</button>
        </div>
      </div>
    </div>
  );
}
