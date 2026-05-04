import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Smartphone, ArrowRightLeft, CheckCircle, AlertTriangle, 
  Search, Calendar, Download, RefreshCcw, Zap, Globe
} from 'lucide-react';

export default function ReconciliationMobile() {
  const [selectedProvider, setSelectedProvider] = useState<'wave' | 'orange' | 'free'>('wave');
  const [isSyncing, setIsSyncing] = useState(false);

  const mockTransactions = [
    { id: 1, date: '2024-03-01', client: 'Moussa Diop', montant: 50000, statut: 'Match', source: 'Wave' },
    { id: 2, date: '2024-03-01', client: 'Awa Ndiaye', montant: 12500, statut: 'Ecart', source: 'Wave' },
    { id: 3, date: '2024-03-02', client: 'Fatou Sow', montant: 75000, statut: 'Match', source: 'Wave' },
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-xl">
                <Smartphone size={32} />
             </div>
             Réconciliation Mobile Money
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Synchronisation en temps réel des flux Wave, Orange Money et Free Money.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-black shadow-xl transition-all disabled:opacity-50"
        >
           {isSyncing ? <RefreshCcw size={18} className="animate-spin" /> : <RefreshCcw size={18} />} 
           SYNCHRONISER LES FLUX
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {[
           { id: 'wave', label: 'Wave', color: 'bg-[#1e90ff]', logo: 'W' },
           { id: 'orange', label: 'Orange Money', color: 'bg-[#ff7900]', logo: 'O' },
           { id: 'free', label: 'Free Money', color: 'bg-[#e1000f]', logo: 'F' },
         ].map(provider => (
           <button 
             key={provider.id}
             onClick={() => setSelectedProvider(provider.id as any)}
             className={`p-6 rounded-[2rem] border transition-all flex items-center gap-4 ${selectedProvider === provider.id ? 'bg-white shadow-xl border-slate-200' : 'bg-slate-50 border-transparent opacity-60 hover:opacity-100'}`}
           >
              <div className={`w-12 h-12 ${provider.color} rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                 {provider.logo}
              </div>
              <div className="text-left">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opérateur</p>
                 <p className="text-sm font-black text-slate-900">{provider.label}</p>
              </div>
           </button>
         ))}
         <div className="p-6 bg-emerald-600 rounded-[2rem] text-white shadow-xl flex items-center gap-4">
            <Zap size={24} className="text-amber-300" />
            <div>
               <p className="text-[10px] font-black uppercase text-emerald-200 tracking-widest">Connectivité</p>
               <p className="text-sm font-black">API Diamond Live</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex-1 flex flex-col overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Transactions du Jour</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                  <Globe size={14} /> Région: Sénégal / UEMOA
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-auto p-4">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="px-8 py-6">Date & Heure</th>
                     <th className="px-8 py-6">Client / Origine</th>
                     <th className="px-8 py-6 text-right">Montant</th>
                     <th className="px-8 py-6 text-center">Statut Rapprochement</th>
                     <th className="px-8 py-6"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {mockTransactions.map(tx => (
                    <tr key={tx.id} className="group hover:bg-slate-50 transition-colors">
                       <td className="px-8 py-5 text-xs font-bold text-slate-500">{tx.date} 14:32</td>
                       <td className="px-8 py-5 text-sm font-black text-slate-900">{tx.client}</td>
                       <td className="px-8 py-5 text-lg font-black text-right text-slate-900">{tx.montant.toLocaleString()} <span className="text-[10px] opacity-30">CFA</span></td>
                       <td className="px-8 py-5">
                          <div className={`mx-auto w-fit px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${tx.statut === 'Match' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                             {tx.statut === 'Match' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                             {tx.statut === 'Match' ? 'Rapproché' : 'Écart Détecté'}
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                             Lettrer
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex gap-20">
               <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Encaissé (Wave)</p>
                  <p className="text-2xl font-black">137,500 <span className="text-xs font-medium opacity-40 uppercase tracking-widest ml-1">CFA</span></p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Rapprochés</p>
                  <p className="text-2xl font-black">125,000 <span className="text-xs font-medium opacity-40 uppercase tracking-widest ml-1">CFA</span></p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Frais Opérateur (Est.)</p>
               <p className="text-xl font-black">-1,375 <span className="text-xs font-medium opacity-40">CFA</span></p>
            </div>
         </div>
      </div>
    </div>
  );
}
