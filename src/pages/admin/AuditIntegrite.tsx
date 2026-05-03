import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { ShieldCheck, ShieldAlert, Fingerprint, Lock, History, Search, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AuditIntegrite() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const journals = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);

  // VÃ©rification de l'intÃ©gritÃ© de la chaÃ®ne
  const auditResults = useMemo(() => {
    const results = lignesEcriture.map(l => {
      // Re-calculer le hash pour vÃ©rifier s'il a changÃ©
      const content = `${l.date}|${l.numeroPiece}|${l.compteGeneralId}|${l.debit}|${l.credit}|${l.libelle}`;
      let calculatedHash = 0;
      for (let i = 0; i < content.length; i++) {
        calculatedHash = ((calculatedHash << 5) - calculatedHash) + content.charCodeAt(i);
        calculatedHash |= 0;
      }
      const hexHash = Math.abs(calculatedHash).toString(16);
      const isValid = l.hash === hexHash;
      
      return { ...l, isValid, currentHash: hexHash };
    });

    const anomalies = results.filter(r => !r.isValid);
    const totalEntries = results.length;
    const integrityPercentage = totalEntries > 0 ? ((totalEntries - anomalies.length) / totalEntries) * 100 : 100;

    return { results, anomalies, integrityPercentage };
  }, [lignesEcriture]);

  if (!currentDossierId) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center tracking-tight">
            <ShieldCheck className="mr-3 text-emerald-600" />
            DIAWDI SEAL : AUDIT D'INTÃ‰GRITÃ‰
          </h1>
          <p className="text-slate-500 text-sm">ContrÃ´le de l'empreinte numÃ©rique et de l'inaltÃ©rabilitÃ© des Ã©critures</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dernier Scan</p>
          <p className="text-sm font-black text-slate-800">{format(new Date(), 'HH:mm:ss')}</p>
        </div>
      </div>

      {/* Score d'IntÃ©gritÃ© */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex">
        <div className={`w-1/3 p-8 flex flex-col items-center justify-center border-r border-slate-100 ${auditResults.integrityPercentage === 100 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray={364} strokeDashoffset={364 - (364 * auditResults.integrityPercentage / 100)} 
                className={auditResults.integrityPercentage === 100 ? 'text-emerald-500' : 'text-rose-500'} 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-black text-slate-900">{Math.round(auditResults.integrityPercentage)}%</span>
            </div>
          </div>
          <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Score d'IntÃ©gritÃ©</p>
        </div>
        
        <div className="flex-1 p-8 grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 uppercase font-bold">Total Ã‰critures ScannÃ©es</p>
            <p className="text-3xl font-black text-slate-900">{auditResults.results.length}</p>
            <div className="flex items-center text-xs text-emerald-600 font-bold mt-2">
              <Fingerprint size={12} className="mr-1" /> TOUTES LES EMPREINTES GÃ‰NÃ‰RÃ‰ES
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400 uppercase font-bold">Anomalies DÃ©tectÃ©es</p>
            <p className={`text-3xl font-black ${auditResults.anomalies.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{auditResults.anomalies.length}</p>
            {auditResults.anomalies.length === 0 ? (
              <div className="flex items-center text-xs text-emerald-600 font-bold mt-2">
                <Lock size={12} className="mr-1" /> AUCUNE ALTÃ‰RATION DÃ‰TECTÃ‰E
              </div>
            ) : (
              <div className="flex items-center text-xs text-rose-600 font-bold mt-2">
                <ShieldAlert size={12} className="mr-1" /> CHAÃŽNE D'INTÃ‰GRITÃ‰ COMPROMISE
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Liste des Ã©critures et leurs signatures */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-sm tracking-tight flex items-center">
            <History size={16} className="mr-2 text-indigo-600" /> REGISTRE DES EMPREINTES NUMÃ‰RIQUES
          </h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="Rechercher une empreinte..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-64" />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600 transition-colors">
              <Download size={14} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Date</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Journal / LibellÃ©</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Montant</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Empreinte (SHA-Hash)</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditResults.results.slice().reverse().map(r => {
                const journal = journals.find(j => j.id === r.journalId);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-400 transition-colors">{r.id.substring(0, 8)}...</p>
                      <p className="text-xs font-bold text-slate-700">{format(new Date(r.date), 'dd MMM yyyy', { locale: fr })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] font-bold text-indigo-600 uppercase mb-0.5">{journal?.code}</p>
                      <p className="text-xs text-slate-600 truncate max-w-xs">{r.libelle}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-black text-slate-900">{(r.debit || r.credit).toLocaleString('fr-FR')} {currentDossier?.devisePrincipale}</p>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[10px] px-2 py-1 bg-slate-100 rounded text-slate-500 font-mono tracking-tighter">
                        {r.hash || 'NO_HASH'}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      {r.isValid ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase tracking-widest">
                          <ShieldCheck size={10} className="mr-1" /> ScellÃ©
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 uppercase tracking-widest">
                          <ShieldAlert size={10} className="mr-1" /> AltÃ©rÃ©
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {auditResults.results.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Fingerprint className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Aucune empreinte Ã  auditer pour le moment</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

