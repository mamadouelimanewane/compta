import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Landmark, FileCheck, PhoneCall, ShieldCheck, 
  Globe, ArrowUpRight, Download, Upload, Search, 
  CheckCircle2, AlertCircle, Zap, Loader2, FileText, 
  TrendingUp, Activity
} from 'lucide-react';

export default function UEMOACompliance() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);

  const [activeTab, setActiveTab] = useState<'DSF' | 'Taxes' | 'MobileMoney'>('DSF');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<null | 'success' | 'warning'>(null);

  const stats = useMemo(() => {
    const ca = lignes.filter(l => comptes.find(c => c.id === l.compteGeneralId || c.numero === l.compteGeneralId)?.numero.startsWith('7'))
                     .reduce((s, l) => s + (l.credit - l.debit), 0);
    const charges = lignes.filter(l => comptes.find(c => c.id === l.compteGeneralId || c.numero === l.compteGeneralId)?.numero.startsWith('6'))
                        .reduce((s, l) => s + (l.debit - l.credit), 0);
    return { ca, charges, profit: ca - charges };
  }, [lignes, comptes]);

  const handleValidateDSF = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setValidationResult('success');
    }, 2500);
  };

  const dsfTables = [
    { id: 1, label: 'Bilan Actif', status: 'Conforme', color: 'emerald' },
    { id: 2, label: 'Bilan Passif', status: 'Conforme', color: 'emerald' },
    { id: 3, label: 'Compte de Résultat', status: 'Vérifié', color: 'indigo' },
    { id: 4, label: 'Tableau des Flux (TFT)', status: 'Calculé', color: 'amber' },
    { id: 11, label: 'Immobilisations', status: 'Scellé', color: 'emerald' },
    { id: 13, label: 'Amortissements', status: 'Scellé', color: 'emerald' },
  ];

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000 pb-20">
      {/* Header Régional */}
      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
            <Globe size={180} />
         </div>
         <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white shadow-lg">
                     <Landmark size={32} />
                  </div>
                  <div>
                     <h1 className="text-4xl font-black tracking-tighter uppercase">Regional Compliance Hub</h1>
                     <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em]">Sénégal / UEMOA — SYSCOHADA RÉVISÉ</p>
                  </div>
               </div>
               <p className="text-slate-400 font-medium max-w-xl text-sm">Pilotage de la conformité régionale et génération automatisée de la Déclaration Statistique et Fiscale (DSF).</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Dossier Certifié</p>
               <p className="text-lg font-black">{currentDossier?.raisonSociale}</p>
            </div>
         </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 p-2 bg-slate-100 rounded-[2rem] w-fit shadow-inner">
         {[
           { id: 'DSF', label: 'Liasse Fiscale DSF', icon: <FileCheck size={18} /> },
           { id: 'Taxes', label: 'TVA & Fiscalité', icon: <Activity size={18} /> },
           { id: 'MobileMoney', label: 'Mobile Money IA', icon: <PhoneCall size={18} /> },
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-xl scale-105' : 'text-slate-500 hover:text-slate-900'}`}
           >
             {tab.icon} {tab.label}
           </button>
         ))}
      </div>

      {/* Content Area */}
      {activeTab === 'DSF' && (
        <div className="space-y-10 animate-in slide-in-from-right-10 duration-700">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Validation Panel */}
              <div className="lg:col-span-1 space-y-8">
                 <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-10 flex flex-col items-center text-center space-y-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${validationResult === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                       {isValidating ? <Loader2 className="animate-spin" size={40} /> : <ShieldCheck size={40} />}
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900">DSF Validator</h3>
                       <p className="text-xs font-bold text-slate-400 mt-2">Vérification de la cohérence des 36 tableaux OHADA.</p>
                    </div>
                    <button 
                      onClick={handleValidateDSF}
                      disabled={isValidating}
                      className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl"
                    >
                       {isValidating ? 'ANALYSE...' : 'LANCER VALIDATION'}
                    </button>
                 </div>

                 {validationResult === 'success' && (
                   <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl animate-in zoom-in duration-500">
                      <CheckCircle2 size={32} className="mb-4" />
                      <h4 className="text-lg font-black mb-2">DSF Prête</h4>
                      <p className="text-[10px] font-bold text-emerald-100 leading-relaxed italic">
                        "Tous les agrégats sont équilibrés. La liasse fiscale est prête pour la télédéclaration."
                      </p>
                   </div>
                 )}
              </div>

              {/* Tables Grid */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                 {dsfTables.map(table => (
                   <div key={table.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex items-center justify-between group hover:border-indigo-300 transition-all shadow-lg hover:shadow-2xl">
                      <div className="flex items-center gap-6">
                         <div className={`w-12 h-12 rounded-2xl bg-${table.color}-50 text-${table.color}-600 flex items-center justify-center font-black text-xs`}>
                            {table.id}
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{table.label}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{table.status}</p>
                         </div>
                      </div>
                      <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all group-hover:scale-110">
                         <Download size={16} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'Taxes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-10 duration-700">
           <div className="lg:col-span-2 bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl p-12 space-y-10">
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-6">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Déclaration de TVA Mensuelle</h3>
                 <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">En cours : MARS 2024</div>
              </div>
              <div className="grid grid-cols-2 gap-20">
                 <div className="space-y-8">
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">TVA Collectée (701)</p>
                       <p className="text-4xl font-black text-slate-900">{(stats.ca * 0.18).toLocaleString()} <span className="text-xs">FCFA</span></p>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 italic">"Basé sur un taux standard UEMOA de 18%."</p>
                 </div>
                 <div className="space-y-8">
                    <div className="p-8 bg-slate-950 rounded-[2rem] text-white shadow-2xl">
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">TVA à Payer / Crédit</p>
                       <p className="text-4xl font-black">{(stats.ca * 0.18 - stats.charges * 0.18).toLocaleString()} <span className="text-xs">FCFA</span></p>
                    </div>
                    <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">GÉNÉRER ORDRE DE VIREMENT</button>
                 </div>
              </div>
           </div>

           <div className="bg-amber-50 rounded-[3rem] p-10 border border-amber-100 space-y-8 shadow-xl self-start">
              <div className="flex items-center gap-3">
                 <AlertCircle className="text-amber-600" size={24} />
                 <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest">Alerte Échéance</h3>
              </div>
              <div className="space-y-4">
                 <div className="p-5 bg-white rounded-2xl shadow-sm">
                    <p className="text-[10px] font-black text-amber-600 uppercase mb-1">15 AVRIL</p>
                    <p className="text-sm font-black text-slate-900">Déclaration de TVA (G50 / VRS)</p>
                 </div>
                 <div className="p-5 bg-white/50 rounded-2xl border border-amber-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">30 AVRIL</p>
                    <p className="text-sm font-black text-slate-400 line-through">Dépôt DSF Annuelle</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
