import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Zap, BrainCircuit, CheckCircle, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function SaisieIA() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const addLigneEcriture = useStore(state => state.addLigneEcriture);

  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      let result = {
        journal: journaux.find(j => j.code === 'ACH' || j.type === 'Achat'),
        date: format(new Date(), 'yyyy-MM-dd'),
        piece: 'IA-' + Date.now().toString().slice(-4),
        libelle: input,
        lignes: [] as any[]
      };

      if (input.toLowerCase().includes('loyer')) {
        const cpteCharge = comptes.find(c => c.numero.startsWith('613'));
        const cpteTVA = comptes.find(c => c.numero.startsWith('4456'));
        const cpteFourn = comptes.find(c => c.numero.startsWith('401'));
        if (cpteCharge && cpteFourn) {
          result.lignes = [
            { compteId: cpteCharge.id, numero: cpteCharge.numero, debit: 1000, credit: 0 },
            { compteId: cpteTVA?.id, numero: cpteTVA?.numero, debit: 180, credit: 0 },
            { compteId: cpteFourn.id, numero: cpteFourn.numero, debit: 0, credit: 1180 }
          ];
        }
      } else {
        const cpteCharge = comptes.find(c => c.nature === 'Charge');
        const cpteFourn = comptes.find(c => c.numero.startsWith('401'));
        if (cpteCharge && cpteFourn) {
          result.lignes = [
            { compteId: cpteCharge.id, numero: cpteCharge.numero, debit: 100, credit: 0 },
            { compteId: cpteFourn.id, numero: cpteFourn.numero, debit: 0, credit: 100 }
          ];
        }
      }
      
      setPrediction(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleConfirm = () => {
    if (!prediction || !currentDossierId || !prediction.journal) return;

    prediction.lignes.forEach((l: any) => {
      addLigneEcriture({
        dossierId: currentDossierId,
        journalId: prediction.journal.id,
        date: prediction.date,
        numeroPiece: prediction.piece,
        reference: 'IA_PREDICT',
        compteGeneralId: l.compteId,
        libelle: prediction.libelle,
        debit: l.debit,
        credit: l.credit,
        validee: false
      });
    });

    setPrediction(null);
    setInput('');
    alert("Écriture prédite injectée avec succès !");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-4 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-indigo-600 rounded-[2rem] text-white shadow-2xl shadow-indigo-200 animate-pulse">
           <BrainCircuit size={48} />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Saisie IA Joule</h1>
        <p className="text-slate-500 font-medium max-w-lg mx-auto">Décrivez votre opération en langage naturel, notre IA s'occupe de la traduction comptable OHADA.</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10 space-y-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 text-indigo-50 opacity-20">
            <Sparkles size={120} />
         </div>
         
         <div className="relative z-10 space-y-6">
            <textarea 
              className="w-full bg-slate-50 border-none rounded-[2rem] p-8 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 min-h-[150px] shadow-inner"
              placeholder="Ex: Facture de loyer de 200.000 FCFA reçue ce matin de la part de SCI Elite..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !input}
              className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ANALYSE NEURONALE EN COURS...
                </>
              ) : (
                <>
                  <Zap size={20} /> ANALYSER L'OPÉRATION
                </>
              )}
            </button>
         </div>
      </div>

      {prediction && (
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 duration-500 space-y-8">
           <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Prédiction Joule</p>
                    <h3 className="text-xl font-bold">Mapping Comptable Détecté</h3>
                 </div>
              </div>
              <button onClick={() => setPrediction(null)} className="p-3 hover:bg-white/10 rounded-full transition-colors"><Trash2 size={20} /></button>
           </div>

           <div className="space-y-4">
              {prediction.lignes.map((l: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center font-black text-indigo-400 border border-white/5">
                         {l.numero}
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compte</p>
                         <p className="font-bold">{comptes.find(c => c.id === l.compteId)?.intitule}</p>
                      </div>
                   </div>
                   <div className="flex gap-10">
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-500 uppercase">Débit</p>
                         <p className={`text-xl font-black ${l.debit > 0 ? 'text-emerald-400' : 'text-slate-700'}`}>{l.debit.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-500 uppercase">Crédit</p>
                         <p className={`text-xl font-black ${l.credit > 0 ? 'text-emerald-400' : 'text-slate-700'}`}>{l.credit.toLocaleString()}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <button 
             onClick={handleConfirm}
             className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3"
           >
              <CheckCircle size={20} /> CONFIRMER & INJECTER L'ÉCRITURE
           </button>
        </div>
      )}
    </div>
  );
}
