import { useState } from 'react';
import { 
  Send, Mail, Calendar, Clock, 
  CheckCircle, Settings, Bell, 
  FileText, ArrowRight, ShieldCheck,
  Plus, Trash2
} from 'lucide-react';

export default function AutomatismeReporting() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Bilan Mensuel', recipient: 'direction@diawdi.sn', schedule: 'Dernier jour du mois', status: 'Actif', lastSent: '2024-02-29' },
    { id: 2, name: 'Rapport Inventaire Valorisé', recipient: 'logistique@diawdi.sn', schedule: 'Tous les lundis', status: 'Actif', lastSent: '2024-03-04' },
    { id: 3, name: 'Prévisionnel Fiscal (IA)', recipient: 'fiscal@diawdi.sn', schedule: 'Le 15 du mois', status: 'En attente', lastSent: '-' },
  ]);

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Send size={32} />
             </div>
             Automatisme Reporting
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Planification et envoi automatique des états financiers par email.</p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-black shadow-xl transition-all">
           <Plus size={18} /> CRÉER UNE AUTOMATISATION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
               <Mail size={20} />
               <h3 className="text-[10px] font-black uppercase tracking-widest">Emails envoyés (Mois)</h3>
            </div>
            <p className="text-4xl font-black">24</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
               <CheckCircle size={12} /> 100% Délivrés
            </p>
         </div>
         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
               <Calendar size={20} />
               <h3 className="text-[10px] font-black uppercase tracking-widest">Prochaine Exécution</h3>
            </div>
            <p className="text-4xl font-black">31 Mars</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Clôture Mensuelle</p>
         </div>
         <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl flex items-center justify-between group overflow-hidden">
            <div className="relative z-10 space-y-2">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Mode Diamond Send</h3>
               <p className="text-xl font-black italic">IA Dispatcher Actif</p>
               <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Certifié OHADA</span>
               </div>
            </div>
            <div className="opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Settings size={100} className="animate-spin-slow" />
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex-1 overflow-hidden flex flex-col">
         <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Bell size={20} className="text-slate-400" />
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">File d'Attente des Tâches</h3>
            </div>
         </div>

         <div className="flex-1 overflow-auto p-4">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="px-8 py-6">Rapport / État</th>
                     <th className="px-8 py-6">Destinataire</th>
                     <th className="px-8 py-6">Fréquence</th>
                     <th className="px-8 py-6">Dernier Envoi</th>
                     <th className="px-8 py-6">Statut</th>
                     <th className="px-8 py-6">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {tasks.map(task => (
                    <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <FileText size={16} />
                             </div>
                             <p className="text-sm font-black text-slate-900">{task.name}</p>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-xs font-bold text-slate-500">{task.recipient}</td>
                       <td className="px-8 py-5 text-xs font-black text-slate-700">
                          <div className="flex items-center gap-2">
                             <Clock size={14} className="text-slate-300" />
                             {task.schedule}
                          </div>
                       </td>
                       <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase italic">{task.lastSent}</td>
                       <td className="px-8 py-5">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${task.status === 'Actif' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                             {task.status}
                          </span>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex gap-2">
                             <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Settings size={16} /></button>
                             <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="p-8 bg-slate-900 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
               <ShieldCheck className="text-emerald-500" size={20} />
               <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sécurité TLS/SSL Active sur tous les envois</p>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 hover:gap-4 transition-all">
               CONFIGURER LE SERVEUR SMTP <ArrowRight size={14} />
            </button>
         </div>
      </div>
    </div>
  );
}
