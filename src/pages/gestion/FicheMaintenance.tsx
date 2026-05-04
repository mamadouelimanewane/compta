import { 
  ArrowLeft, Wrench, Calendar, User, 
  ShieldCheck, AlertTriangle, Clock, Save, 
  FilePlus, ClipboardCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FicheMaintenance() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <button 
            onClick={() => navigate('/gestion/gmao')}
            className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 hover:text-indigo-600 transition-colors"
          >
             <ArrowLeft size={14} /> Retour GMAO
          </button>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-xl">
                <Wrench size={32} />
             </div>
             Fiche d'Intervention #INT-442
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Détails techniques et rapport d'intervention sur actif critique.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-black shadow-xl transition-all">
              <Save size={18} /> ENREGISTRER LA FICHE
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-10">
               <section className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Équipement Concerné</label>
                     <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                           <ShieldCheck size={24} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900">Groupe Électrogène 250kVA</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">Code: MAT-001</p>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type d'Intervention</label>
                     <div className="grid grid-cols-2 gap-4">
                        <button className="py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Préventive</button>
                        <button className="py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100">Curative</button>
                     </div>
                  </div>
               </section>

               <section className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                     <ClipboardCheck size={18} className="text-emerald-500" /> Travaux Effectués
                  </h3>
                  <textarea 
                    className="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 min-h-[150px] shadow-inner"
                    placeholder="Décrivez les opérations de maintenance réalisées..."
                    defaultValue="Vidange moteur, remplacement des filtres (huile/air), vérification du circuit de refroidissement et test de charge OK."
                  />
               </section>

               <section className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                     <FilePlus size={18} className="text-indigo-600" /> Pièces Remplacées
                  </h3>
                  <div className="space-y-4">
                     {[
                       { name: 'Filtre à Huile Industriel', qte: 1, code: 'PIECE-45' },
                       { name: 'Huile Synthétique 15W40', qte: '20L', code: 'CONS-88' }
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-4">
                             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400">
                                <Package size={14} />
                             </div>
                             <p className="text-xs font-black text-slate-700">{item.name} <span className="text-[10px] text-slate-400 ml-2">({item.code})</span></p>
                          </div>
                          <p className="text-xs font-black text-slate-900">x{item.qte}</p>
                       </div>
                     ))}
                  </div>
               </section>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Clock size={80} />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-400">Détails Logistiques</h3>
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <Calendar className="text-indigo-400" size={20} />
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase">Date d'Intervention</p>
                        <p className="text-sm font-black">15 Mars 2024</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <User className="text-indigo-400" size={20} />
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase">Technicien</p>
                        <p className="text-sm font-black">Samba Diallo</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <Clock className="text-indigo-400" size={20} />
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase">Durée Estimée</p>
                        <p className="text-sm font-black">02h 45min</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-rose-50 rounded-[3rem] p-10 border border-rose-100 space-y-6">
               <div className="flex items-center gap-3 text-rose-600">
                  <AlertTriangle size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Alerte Sécurité</h4>
               </div>
               <p className="text-[10px] font-bold text-rose-900/60 leading-relaxed italic">
                  Veuillez vérifier l'étanchéité du carter après redémarrage. Risque de fuite résiduelle détecté sur ce modèle.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
