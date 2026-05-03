import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Download, FileText, Table, Printer, ChevronRight, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import { exportToCSV, triggerPrint, generateFEC } from '../../utils/exportUtils';

export default function Exporter() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const state = useStore.getState();

  const [exportType, setExportType] = useState<'balance' | 'grand-livre' | 'journaux' | 'fec'>('balance');
  const [format, setFormat] = useState<'csv' | 'pdf' | 'txt'>('csv');

  const handleExport = () => {
    if (!currentDossierId) return;

    let dataToExport: any[] = [];
    let filename = "";

    if (exportType === 'fec') {
      generateFEC(
        state.lignesEcriture.filter(l => l.dossierId === currentDossierId),
        state.dossiers,
        state.journaux,
        state.comptes
      );
      return;
    }

    if (exportType === 'balance') {
      filename = "Balance";
      dataToExport = state.comptes.filter(c => c.dossierId === currentDossierId).map(c => {
        const lines = state.lignesEcriture.filter(l => l.compteGeneralId === c.id);
        const debit = lines.reduce((s, l) => s + l.debit, 0);
        const credit = lines.reduce((s, l) => s + l.credit, 0);
        return { Numero: c.numero, Intitule: c.intitule, Debit: debit, Credit: credit, Solde: debit - credit };
      });
    } else if (exportType === 'journaux') {
      filename = "Journaux_Ecritures";
      dataToExport = state.lignesEcriture.filter(l => l.dossierId === currentDossierId).map(l => ({
        Date: l.date,
        Journal: state.journaux.find(j => j.id === l.journalId || j.code === l.journalId)?.code,
        Piece: l.numeroPiece,
        Compte: state.comptes.find(c => c.id === l.compteGeneralId || c.numero === l.compteGeneralId)?.numero,
        Libelle: l.libelle,
        Debit: l.debit,
        Credit: l.credit
      }));
    }

    if (format === 'csv') {
      exportToCSV(dataToExport, filename);
    } else {
      triggerPrint();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Download size={32} />
             </div>
             Universal Export Hub
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Extraction haute fidélité pour Excel, PDF et systèmes tiers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
         <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-12 space-y-10">
            <section className="space-y-6">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">1. Sélectionnez l'État</h3>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'balance', label: 'Balance des Comptes', icon: <Table /> },
                    { id: 'grand-livre', label: 'Grand Livre Détaillé', icon: <FileText /> },
                    { id: 'journaux', label: 'Journaux d''Écritures', icon: <Table /> },
                    { id: 'fec', label: 'Fichier des Écritures (FEC)', icon: <ShieldCheck /> },
                  ].map(item => (
                    <button 
                      key={item.id}
                      onClick={() => {
                        setExportType(item.id as any);
                        if (item.id === 'fec') setFormat('txt');
                      }}
                      className={`p-6 rounded-[2rem] border transition-all flex items-center gap-4 ${exportType === item.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-indigo-200'}`}
                    >
                       <div className={`${exportType === item.id ? 'text-indigo-200' : 'text-indigo-600'}`}>{item.icon}</div>
                       <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}
               </div>
            </section>

            <section className="space-y-6">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">2. Format de Sortie</h3>
               <div className="flex gap-4">
                  {exportType === 'fec' ? (
                    <button className="flex-1 p-6 rounded-[2rem] border bg-slate-900 text-white border-slate-900 shadow-xl text-left">
                       <p className="text-sm font-black uppercase tracking-widest mb-1">Archive Fiscale (.txt)</p>
                       <p className="text-[10px] opacity-50 font-bold">Normalisé DGFiP / TAB Delimited</p>
                    </button>
                  ) : (
                    <>
                      {[
                        { id: 'csv', label: 'Excel / CSV (.csv)', sub: 'Semicolon delimited, UTF-8 with BOM' },
                        { id: 'pdf', label: 'Document PDF (.pdf)', sub: 'High resolution, print ready' },
                      ].map(item => (
                        <button 
                          key={item.id}
                          onClick={() => setFormat(item.id as any)}
                          className={`flex-1 p-6 rounded-[2rem] border transition-all text-left ${format === item.id ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                        >
                           <p className="text-sm font-black uppercase tracking-widest mb-1">{item.label}</p>
                           <p className="text-[10px] opacity-50 font-bold">{item.sub}</p>
                        </button>
                      ))}
                    </>
                  )}
               </div>
            </section>

            <div className="pt-10 border-t border-slate-50 flex justify-end">
               <button 
                 onClick={handleExport}
                 className="btn-elite flex items-center gap-3"
               >
                  <Download size={18} /> GÉNÉRER L'EXPORTATION
               </button>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <ShieldCheck size={120} />
               </div>
               <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2"><Zap size={16} /> Elite Vault</h3>
               <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                     <CheckCircle className="text-emerald-400" size={20} />
                     <p className="text-xs font-bold text-slate-300">Signature DIAWDI Seal active</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <CheckCircle className="text-emerald-400" size={20} />
                     <p className="text-xs font-bold text-slate-300">Conformité Fiscale Absolue</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-mono text-indigo-300 break-all leading-relaxed">
                     Le fichier FEC généré inclut le scellage cryptographique de la période close.
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

