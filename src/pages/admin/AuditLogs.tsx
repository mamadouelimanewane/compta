import { useStore } from '../../store/useStore';
import { ShieldCheck, History, User, Info, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditLogs() {
  const logs = useStore(state => state.logs);

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
                <ShieldCheck size={32} />
             </div>
             Piste d'Audit Fiable
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Journalisation inaltérable des opérations et modifications système.</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex-1 flex flex-col overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex items-center gap-6">
            <div className="flex-1 relative group">
               <Search className="absolute left-4 top-4 text-slate-400" size={20} />
               <input 
                 type="text" 
                 placeholder="Filtrer les logs par utilisateur ou action..."
                 className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-slate-500 shadow-inner"
               />
            </div>
         </div>

         <div className="flex-1 overflow-auto p-4">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="px-8 py-6">Horodatage</th>
                     <th className="px-8 py-6">Utilisateur</th>
                     <th className="px-8 py-6">Action</th>
                     <th className="px-8 py-6">Détails de l'Opération</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {logs.length === 0 ? (
                    <tr>
                       <td colSpan={4} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-4 text-slate-300">
                             <History size={48} />
                             <p className="font-black uppercase tracking-widest text-xs">Aucun log enregistré</p>
                          </div>
                       </td>
                    </tr>
                  ) : (
                    logs.map(log => (
                      <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-5 text-[10px] font-mono text-slate-400">
                            {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss')}
                         </td>
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                  <User size={12} />
                               </div>
                               <span className="text-xs font-black text-slate-900">{log.user}</span>
                            </div>
                         </td>
                         <td className="px-8 py-5">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                               {log.action}
                            </span>
                         </td>
                         <td className="px-8 py-5 text-xs font-bold text-slate-600 italic">
                            {log.details}
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>

         <div className="p-8 bg-slate-50 flex items-center gap-4 text-slate-400 border-t border-slate-100">
            <Info size={18} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Conformité LCB-FT et RGPD active</p>
         </div>
      </div>
    </div>
  );
}
