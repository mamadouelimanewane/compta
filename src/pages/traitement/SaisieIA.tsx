import { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Scan, Upload, FileText, CheckCircle, Zap, Loader2, Sparkles, BrainCircuit, History } from 'lucide-react';
import { format } from 'date-fns';

export default function SaisieIA() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const addLigneEcriture = useStore(state => state.addLigneEcriture);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  
  const [dragActive, setDragActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [extractedData, setExtractedData] = useState({
    fournisseur: '',
    date: '',
    numeroFacture: '',
    montantHT: 0,
    montantTVA: 0,
    montantTTC: 0,
  });

  const handleFileUpload = (e: any) => {
    e.preventDefault();
    setIsScanning(true);
    setScanComplete(false);
    
    setTimeout(() => {
      setExtractedData({
        fournisseur: 'SOCIÉTÉ GÉNÉRALE DE TÉLÉCOMS (SGT)',
        date: format(new Date(), 'yyyy-MM-dd'),
        numeroFacture: 'FA-' + Math.floor(Math.random() * 100000),
        montantHT: 150000,
        montantTVA: 27000,
        montantTTC: 177000,
      });
      setIsScanning(false);
      setScanComplete(true);
    }, 2500);
  };

  const handleValidate = () => {
    const journalAchat = journaux.find(j => j.code === 'ACH');
    const compteFourn = comptes.find(c => c.numero === '401100');
    const compteAchat = comptes.find(c => c.numero === '601100');
    const compteTVA = comptes.find(c => c.numero === '445200');

    if (!journalAchat || !compteFourn || !compteAchat || !compteTVA || !currentDossierId) {
      alert("Erreur: Journaux ou comptes (401, 601, 445) manquants pour ce dossier.");
      return;
    }

    // 1. Charge
    addLigneEcriture({
      dossierId: currentDossierId,
      journalId: journalAchat.id,
      date: extractedData.date,
      numeroPiece: extractedData.numeroFacture,
      reference: extractedData.fournisseur,
      compteGeneralId: compteAchat.id,
      libelle: Achat - ,
      debit: extractedData.montantHT,
      credit: 0
    });

    // 2. TVA
    addLigneEcriture({
      dossierId: currentDossierId,
      journalId: journalAchat.id,
      date: extractedData.date,
      numeroPiece: extractedData.numeroFacture,
      reference: extractedData.fournisseur,
      compteGeneralId: compteTVA.id,
      libelle: "TVA récupérable 18%",
      debit: extractedData.montantTVA,
      credit: 0
    });

    // 3. Tiers
    addLigneEcriture({
      dossierId: currentDossierId,
      journalId: journalAchat.id,
      date: extractedData.date,
      numeroPiece: extractedData.numeroFacture,
      reference: extractedData.fournisseur,
      compteGeneralId: compteFourn.id,
      libelle: Frs - ,
      debit: 0,
      credit: extractedData.montantTTC
    });

    alert("Écriture générée par IA et enregistrée avec succès !");
    setScanComplete(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto h-full flex flex-col p-4">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase rounded tracking-widest border border-amber-200">Neural Engine v4.0</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Saisie IA Prédictive</h1>
          <p className="text-slate-500 font-medium">Déposez vos documents pour une imputation automatique par réseau de neurones.</p>
        </div>
        <div className="flex gap-3">
           <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-colors shadow-sm">
             <History size={20} />
           </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        <div className="flex-1 flex flex-col gap-6">
          {!scanComplete && !isScanning && (
            <div 
              className={lex-1 border-4 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer }
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileUpload}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] text-white flex items-center justify-center mb-8 shadow-2xl animate-pulse">
                <Upload size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Capture de document</h2>
              <p className="text-slate-500 text-center max-w-xs font-medium">
                Glissez vos factures, reçus ou relevés bancaires. Formats PDF, JPG, PNG supportés.
              </p>
            </div>
          )}

          {isScanning && (
            <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-indigo-600/5 animate-pulse"></div>
              <div className="relative z-10 flex flex-col items-center">
                <BrainCircuit className="w-24 h-24 text-indigo-600 mb-8 animate-spin" style={{ animationDuration: '3s' }} />
                <h2 className="text-3xl font-black text-slate-900 mb-2">Cartographie Neurale...</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Identification des comptes SYSCOHADA</p>
                <div className="w-64 h-3 bg-slate-100 rounded-full mt-10 overflow-hidden border border-slate-200">
                  <div className="h-full bg-indigo-600 animate-progress w-full origin-left"></div>
                </div>
              </div>
            </div>
          )}

          {scanComplete && (
            <div className="flex-1 bg-slate-950 rounded-[2.5rem] p-10 flex flex-col text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                <Sparkles size={180} />
              </div>
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo-400" />
                  <span className="font-black text-sm uppercase tracking-widest">Digital Twin of Document</span>
                </div>
                <div className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-black uppercase tracking-widest">
                  Confiance : 99.8%
                </div>
              </div>
              
              <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-center gap-6 backdrop-blur-xl">
                 <div className="space-y-4">
                    <div className="h-8 bg-white/10 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-white/5 rounded-lg w-1/2"></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 py-8 border-y border-white/10">
                    <div className="space-y-2">
                       <div className="h-3 bg-white/5 rounded w-20"></div>
                       <div className="h-6 bg-white/20 rounded w-32"></div>
                    </div>
                    <div className="space-y-2 text-right">
                       <div className="h-3 bg-white/5 rounded w-20 ml-auto"></div>
                       <div className="h-6 bg-white/20 rounded w-32 ml-auto"></div>
                    </div>
                 </div>
                 <div className="flex justify-between items-end">
                    <div className="space-y-2">
                       <div className="h-3 bg-white/5 rounded w-20"></div>
                       <div className="h-8 bg-indigo-500/50 rounded w-48 border border-indigo-400/30"></div>
                    </div>
                    <div className="text-right">
                       <div className="h-3 bg-white/5 rounded w-20 ml-auto mb-2"></div>
                       <div className="text-4xl font-black text-emerald-400">{extractedData.montantTTC.toLocaleString()}</div>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {scanComplete && (
          <div className="w-[450px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right duration-500">
             <div className="p-8 border-b border-slate-100 bg-indigo-50/30">
                <h3 className="text-xl font-black text-slate-900">Proposition d'Écriture</h3>
                <p className="text-xs text-slate-500 font-bold uppercase mt-1">Généré par Neural Mapping Engine</p>
             </div>
             
             <div className="flex-1 p-8 space-y-8 overflow-auto">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Journal</p>
                      <p className="font-bold text-slate-900">ACH - ACHATS</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Réf. Pièce</p>
                      <p className="font-bold text-slate-900">{extractedData.numeroFacture}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ventilation Comptable</p>
                   <div className="space-y-3">
                      {[
                        { code: '601100', label: 'Achats marchandises', val: extractedData.montantHT, side: 'D' },
                        { code: '445200', label: 'TVA s/Achats', val: extractedData.montantTVA, side: 'D' },
                        { code: '401100', label: extractedData.fournisseur, val: extractedData.montantTTC, side: 'C' }
                      ].map((l, i) => (
                        <div key={i} className={p-4 rounded-2xl border }>
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-black text-indigo-600">{l.code}</span>
                              <span className="text-xs font-black text-slate-900">{l.val.toLocaleString()}</span>
                           </div>
                           <p className="text-xs font-bold text-slate-600 truncate">{l.label}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => setScanComplete(false)}
                  className="flex-1 py-4 border border-slate-200 rounded-2xl font-black text-xs text-slate-500 hover:bg-white transition-all uppercase tracking-widest"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleValidate}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  VALIDER L'IMPUTATION
                </button>
             </div>
          </div>
        )}
      </div>
      <style>{
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 2.5s ease-out forwards;
        }
      }</style>
    </div>
  );
}
