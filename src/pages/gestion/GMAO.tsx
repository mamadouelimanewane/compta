import { useState } from 'react';
import { 
  Settings, Tool, Activity, Calendar, 
  Wrench, ShieldCheck, ClipboardList, AlertTriangle,
  ArrowRight, Plus
} from 'lucide-react';

export default function GMAO() {
  const [activeView, setActiveView] = useState<'equipements' | 'interventions'>('equipements');

  const maintenanceTasks = [
    { id: 1, equipement: 'Presse Hydraulique #4', type: 'Préventive', date: '2024-03-15', statut: 'Planifié', technicien: 'Samba Diallo' },
    { id: 2, equipement: 'Climatisation Centrale', type: 'Curative', date: '2024-03-04', statut: 'En cours', technicien: 'Abdou Sow' },
    { id: 3, equipement: 'Serveur Data Center', type: 'Préventive', date: '2024-02-28', statut: 'Terminé', technicien: 'Youssouf Ndiaye' },
  ];

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
                <Wrench size={32} />
             </div>
             GMAO Expert
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Gestion de la Maintenance Assistée par Ordinateur : actifs, pièces et interventions.</p>
        </div>
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-700 shadow-xl transition-all">
           <Plus size={18} /> NOUVELLE INTERVENTION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
               <Activity size={18} className="text-emerald-500" /> Disponibilité Actifs
            </h3>
            <div className="flex items-end gap-2">
               <p className="text-4xl font-black">94.2%</p>
               <p className="text-[10px] font-bold text-emerald-500 mb-2 uppercase">+1.4% ce mois</p>
            </div>
            <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500" style={{ width: '94.2%' }}></div>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
               <Calendar size={18} className="text-amber-500" /> Tâches à Venir (7j)
            </h3>
            <div className="flex items-center justify-between">
               <p className="text-4xl font-black">12</p>
               <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                       ID
                    </div>
                  ))}
               </div>
            </div>
         </div>
         <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Coûts Maintenance YTD</h3>
            <p className="text-3xl font-black">4,520,000 <span className="text-xs opacity-40">CFA</span></p>
            <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
               VOIR LE DÉTAIL FINANCIER <ArrowRight size={14} />
            </button>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex-1 flex flex-col overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <ClipboardList size={20} className="text-slate-400" />
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Journal des Interventions</h3>
            </div>
         </div>

         <div className="flex-1 overflow-auto p-4">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="px-8 py-6">Équipement / Actif</th>
                     <th className="px-8 py-6">Type</th>
                     <th className="px-8 py-6">Date Planifiée</th>
                     <th className="px-8 py-6">Technicien</th>
                     <th className="px-8 py-6 text-center">Statut</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {maintenanceTasks.map(task => (
                    <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="px-8 py-5 text-sm font-black text-slate-900">{task.equipement}</td>
                       <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${task.type === 'Préventive' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                             {task.type}
                          </span>
                       </td>
                       <td className="px-8 py-5 text-xs font-bold text-slate-500 italic">{task.date}</td>
                       <td className="px-8 py-5 text-xs font-black text-slate-700">{task.technicien}</td>
                       <td className="px-8 py-5">
                          <div className={`mx-auto w-fit px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${task.statut === 'Terminé' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                             {task.statut === 'Terminé' ? <ShieldCheck size={14} /> : <Activity size={14} />}
                             {task.statut}
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center gap-4 text-slate-400">
            <AlertTriangle size={18} className="text-amber-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">2 actifs nécessitent une révision immédiate</p>
         </div>
      </div>
    </div>
  );
}
