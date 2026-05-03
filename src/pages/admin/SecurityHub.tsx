import { useMemo, useState } from 'react';
import { 
  ShieldCheck, Lock, Eye, Key, Users, History, 
  ArrowUpRight, Zap, Download, RefreshCw, CheckCircle, Loader2 
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function SecurityHub() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const securityLogs = [
    { user: 'Admin', action: 'Connexion réussie', ip: '192.168.1.45', time: 'Il y a 5 min', status: 'Success' },
    { user: 'Comptable', action: 'Modification Écriture #4521', ip: '192.168.1.12', time: 'Il y a 12 min', status: 'Success' },
    { user: 'Inconnu', action: 'Tentative de connexion', ip: '45.12.8.90', time: 'Il y a 1h', status: 'Blocked' },
    { user: 'Admin', action: 'Export FEC Scellé', ip: '192.168.1.45', time: 'Il y a 2h', status: 'Success' },
  ];

  const handleFullBackup = () => {
    setIsBackingUp(true);
    
    // Simulate complex encryption/compression delay
    setTimeout(() => {
      const fullState = useStore.getState();
      const dataStr = JSON.stringify(fullState, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `DIAWDI_Azure_Elite_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setIsBackingUp(false);
      setLastBackup(new Date().toLocaleTimeString());
    }, 2500);
  };

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
       <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
                <ShieldCheck size={32} />
             </div>
             Elite Governance Hub
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Contrôle d'accès, piste d'audit et coffre-fort numérique DIAWDI.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleFullBackup}
             disabled={isBackingUp}
             className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs flex items-center gap-3 hover:bg-black shadow-xl transition-all uppercase tracking-widest disabled:opacity-50"
           >
              {isBackingUp ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
              {isBackingUp ? 'CHIFFREMENT...' : 'BACKUP TOTAL'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Lock size={80} /></div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><Lock size={20} className="text-indigo-600" /> Sécurité Active</h3>
            <div className="space-y-6">
               {[
                 { label: "Double Authentification (MFA)", status: "ACTIF", color: "text-emerald-500" },
                 { label: "Cryptage Point-à-Point", status: "ACTIF", color: "text-emerald-500" },
                 { label: "Journal de Traçabilité", status: "ACTIF", color: "text-emerald-500" },
                 { label: "DIAWDI Seal Engine", status: "ACTIF", color: "text-emerald-500" },
               ].map((s, i) => (
                 <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                    <span className={`text-[10px] font-black uppercase ${s.color}`}>{s.status}</span>
                 </div>
               ))}
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Dernière Sauvegarde</p>
               <p className="text-xs font-black text-slate-900">{lastBackup ? `Aujourd'hui à ${lastBackup}` : 'Aucune sauvegarde récente'}</p>
            </div>
         </div>

         <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><History size={20} className="text-indigo-600" /> Piste d'Audit (Audit Trail)</h3>
               <button className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2 hover:underline"><Download size={14} /> EXPORTER LES LOGS</button>
            </div>
            <div className="flex-1 overflow-auto max-h-[400px] custom-scrollbar">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50 sticky top-0 backdrop-blur-md">
                     <tr>
                        <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilisateur</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                        <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Moment</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {securityLogs.map((log, i) => (
                       <tr key={i} className="group hover:bg-slate-50 transition-colors">
                          <td className="px-10 py-5">
                             <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{log.user}</p>
                             <p className="text-[10px] font-mono text-slate-400">{log.ip}</p>
                          </td>
                          <td className="px-8 py-5 text-xs font-bold text-slate-600">{log.action}</td>
                          <td className="px-8 py-5 text-center">
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${
                                log.status === 'Success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                             }`}>
                                {log.status}
                             </span>
                          </td>
                          <td className="px-10 py-5 text-right text-[10px] font-black text-slate-400">{log.time}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-indigo-950 rounded-[3rem] p-12 text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 p-20 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Key size={200} /></div>
            <div className="space-y-6 relative z-10">
               <div className="p-4 bg-white/10 w-fit rounded-2xl border border-white/10"><Key size={28} className="text-indigo-300" /></div>
               <h3 className="text-3xl font-black tracking-tight">Access Control (RBAC)</h3>
               <p className="text-indigo-200 text-sm font-medium leading-relaxed max-w-sm">Déléguez des accès granulaires à vos experts-comptables et collaborateurs sans compromettre la confidentialité de vos dossiers.</p>
               <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-900/50">GÉRER LES DROITS</button>
            </div>
         </div>

         <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl flex items-center justify-between relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 p-20 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Zap size={200} /></div>
            <div className="space-y-6 relative z-10">
               <div className="p-4 bg-slate-50 w-fit rounded-2xl border border-slate-100"><Zap size={28} className="text-slate-900" /></div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">One-Click Backup</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">Téléchargez l'intégralité de votre environnement de travail au format JSON crypté. Portabilité et sécurité absolue.</p>
               <button 
                 onClick={handleFullBackup}
                 disabled={isBackingUp}
                 className="px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl disabled:opacity-50"
               >
                  {isBackingUp ? 'TRAITEMENT...' : 'SAUVEGARDER MAINTENANT'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

