import { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { CheckSquare, AlertTriangle, CheckCircle, Circle, Lock, Unlock, Zap, ShieldCheck, Calculator, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type Step = 'Audit' | 'Génération' | 'Fiscalité' | 'Verrouillage';

export default function ClotureMensuelle() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  
  const [activeStep, setActiveStep] = useState<Step>('Audit');
  const [periode, setPeriode] = useState(format(new Date(), 'yyyy-MM'));
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);

  const stats = useMemo(() => {
    const lignesMois = lignes.filter(l => l.date.startsWith(periode));
    const totalDebit = lignesMois.reduce((s, l) => s + l.debit, 0);
    const totalCredit = lignesMois.reduce((s, l) => s + l.credit, 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;
    return { count: lignesMois.length, isBalanced, total: totalDebit };
  }, [lignes, periode]);

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCompletedSteps([...completedSteps, activeStep]);
      if (activeStep === 'Audit') setActiveStep('Génération');
      else if (activeStep === 'Génération') setActiveStep('Fiscalité');
      else if (activeStep === 'Fiscalité') setActiveStep('Verrouillage');
    }, 2000);
  };

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Lock size={28} />
             </div>
             Elite Closing Engine
          </h1>
          <p className="text-slate-500 font-medium mt-2">Workflow automatisé de clôture mensuelle et certification des écritures.</p>
        </div>
        <div className="px-6 py-4 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Période Active</p>
           <input type="month" className="bg-transparent border-none font-black text-slate-900 text-lg focus:ring-0" value={periode} onChange={e => setPeriode(e.target.value)} />
        </div>
      </div>

      {/* Stepper Visuel */}
      <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
         {['Audit', 'Génération', 'Fiscalité', 'Verrouillage'].map((step, i) => (
           <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-3 ${activeStep === step ? 'scale-110' : 'opacity-40'} transition-all`}>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                   completedSteps.includes(step as Step) ? 'bg-emerald-500 text-white' : activeStep === step ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                 }`}>
                    {completedSteps.includes(step as Step) ? <CheckCircle size={20} /> : i+1}
                 </div>
                 <span className="text-xs font-black uppercase tracking-widest text-slate-900">{step}</span>
              </div>
              {i < 3 && <div className="flex-1 mx-6 h-0.5 bg-slate-100"></div>}
           </div>
         ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-12 flex flex-col">
            {activeStep === 'Audit' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-8">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl"><ShieldCheck size={40} /></div>
                    <div>
                       <h2 className="text-3xl font-black text-slate-900">Audit de Cohérence</h2>
                       <p className="text-slate-500 font-medium">Vérification de l'équilibre et de l'intégrité des flux.</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase">État d'Équilibre</p>
                       <p className={`text-2xl font-black ${stats.isBalanced ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {stats.isBalanced ? 'CONFORME' : 'DÉSÉQUILIBRÉ'}
                       </p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Volume Écritures</p>
                       <p className="text-2xl font-black text-slate-900">{stats.count} Lignes</p>
                    </div>
                 </div>
              </div>
            )}

            {activeStep === 'Génération' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-8">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl"><Calculator size={40} /></div>
                    <div>
                       <h2 className="text-3xl font-black text-slate-900">Écritures Automatiques</h2>
                       <p className="text-slate-500 font-medium">Injection des dotations, provisions et régularisations.</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    {[
                      "Calcul des dotations aux amortissements (Classe 68)",
                      "Régularisation des charges constatées d'avance (CCA)",
                      "Écritures de variation de stocks (Unités Industrielles)",
                      "Ajustement des écarts de change"
                    ].map((task, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                         <p className="text-sm font-bold text-slate-700">{task}</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeStep === 'Fiscalité' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-8">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-3xl"><FileText size={40} /></div>
                    <div>
                       <h2 className="text-3xl font-black text-slate-900">Déclaration Fiscale</h2>
                       <p className="text-slate-500 font-medium">Calcul de la TVA et préparation des liasses.</p>
                    </div>
                 </div>
                 <div className="p-10 bg-indigo-900 rounded-[2.5rem] text-white space-y-6">
                    <h3 className="text-xl font-black">Résumé de TVA Mensuel</h3>
                    <div className="grid grid-cols-2 gap-10">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-indigo-300 uppercase">TVA Collectée</p>
                          <p className="text-2xl font-black">2 450 000 FCFA</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-indigo-300 uppercase">TVA Déductible</p>
                          <p className="text-2xl font-black">1 120 000 FCFA</p>
                       </div>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                       <p className="text-sm font-black uppercase">Crédit de TVA / À Payer</p>
                       <p className="text-3xl font-black text-emerald-400">1 330 000 FCFA</p>
                    </div>
                 </div>
              </div>
            )}

            {activeStep === 'Verrouillage' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-8">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-slate-900 text-white rounded-3xl"><Lock size={40} /></div>
                    <div>
                       <h2 className="text-3xl font-black text-slate-900">Scellage Définitif</h2>
                       <p className="text-slate-500 font-medium">Verrouillage des journaux et signature DIAWDI Seal.</p>
                    </div>
                 </div>
                 <div className="p-10 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] space-y-4 text-center">
                    <div className="w-16 h-16 bg-emerald-600 text-white rounded-full mx-auto flex items-center justify-center shadow-lg"><Zap size={32} /></div>
                    <h3 className="text-2xl font-black text-emerald-900">Prêt pour Clôture Définitive</h3>
                    <p className="text-emerald-700 font-medium">La période sera scellée cryptographiquement. Aucune modification ne sera possible sans réouverture officielle.</p>
                 </div>
              </div>
            )}

            <div className="mt-auto pt-10 border-t border-slate-100 flex justify-end gap-4">
               <button className="px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest">Abandonner</button>
               <button 
                 onClick={handleProcess}
                 disabled={isProcessing}
                 className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3"
               >
                  {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <ChevronRight size={18} />}
                  {isProcessing ? 'TRAITEMENT IA...' : activeStep === 'Verrouillage' ? 'SCELLER LE MOIS' : 'ÉTAPE SUIVANTE'}
               </button>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
               <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6">Résumé de Clôture</h3>
               <div className="space-y-6">
                  {[
                    { label: "Mois Fiscal", val: format(new Date(periode + '-01'), 'MMMM yyyy', { locale: fr }) },
                    { label: "Opérateur", val: "ADMIN_DIAWDI" },
                    { label: "Intégrité Blockchain", val: "CERTIFIED", color: "text-emerald-400" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase">{row.label}</span>
                       <span className={`text-xs font-black ${row.color || 'text-white'} uppercase`}>{row.val}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-indigo-50 rounded-[2.5rem] p-8 border border-indigo-100">
               <h3 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-4">Neural Insights</h3>
               <div className="p-4 bg-white rounded-2xl shadow-sm space-y-2">
                  <p className="text-[10px] font-black text-indigo-600 uppercase">Anomalie Détectée</p>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                    "Attention: Un écart de 2.4% est détecté par rapport au budget de la section MARKETING. Souhaitez-vous une analyse détaillée avant clôture ?"
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

