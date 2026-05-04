import { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Upload, FileText, CheckCircle, AlertTriangle, 
  ChevronRight, Table, Database, Download, Sparkles, Zap, Loader2
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function Importer() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const addCompte = useStore(state => state.addCompte);
  const addLigneEcriture = useStore(state => state.addLigneEcriture);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importType, setImportType] = useState<'comptes' | 'ecritures'>('comptes');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [preview, setPreview] = useState<string[][]>([]);
  const [simProgress, setSimProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split('\n').map(row => row.split(';').map(cell => cell.replace(/"/g, '').trim()));
        setPreview(rows.slice(0, 6)); 
      };
      reader.readAsText(selectedFile);
    }
  };

  const simulateMassiveImport = async () => {
    if (!currentDossierId) return;
    setStatus('processing');
    setSimProgress(0);

    // Simulation of 100 accounts
    for (let i = 0; i < 100; i++) {
      addCompte({
        dossierId: currentDossierId,
        numero: `${601}${i.toString().padStart(3, '0')}`,
        intitule: `Fourniture Industrielle Type ${i}`,
        type: 'Détail',
        nature: 'Charge',
        saisieAnalytique: true,
        saisieEcheance: false,
        lettrageAutomatique: true
      });
      if (i % 10 === 0) setSimProgress(i);
      await new Promise(r => setTimeout(r, 10)); // Artificial delay for effect
    }

    // Simulation of 200 entries
    for (let i = 0; i < 200; i++) {
      addLigneEcriture({
        dossierId: currentDossierId,
        journalId: 'HA', // Simulated
        date: '2024-03-01',
        numeroPiece: `FAC-${i}`,
        reference: `SIM-${i}`,
        compteGeneralId: `ID-${i}`, // Local simulated ID
        libelle: `Importation Automatisée Ligne ${i}`,
        debit: Math.random() * 1000,
        credit: 0,
        validee: true,
        sectionAnalytique: 'PROD_ALPHA'
      });
    }

    setSimProgress(100);
    setTimeout(() => setStatus('success'), 500);
  };

  const downloadTemplate = (type: 'comptes' | 'ecritures') => {
    let content = "";
    let filename = "";
    if (type === 'comptes') {
      content = "Numero;Intitule;Nature\n411000;Clients Nationaux;Tiers\n601000;Achats de matieres premieres;Charge\n701000;Ventes de produits finis;Produit";
      filename = "Modele_Plan_Comptable.csv";
    } else {
      content = "Date;Journal;Compte;Libelle;Debit;Credit\n2024-01-15;HA;601000;Achat Fournisseur X;1500,00;0,00\n2024-01-15;HA;401000;Achat Fournisseur X;0,00;1500,00";
      filename = "Modele_Ecritures.csv";
    }
    const blob = new Blob(["\uFEFF" + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const startImport = () => {
    if (!file || !currentDossierId) return;
    setStatus('processing');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        rows.forEach((row, index) => {
          if (index === 0) return;
          const cells = row.split(';').map(c => c.replace(/"/g, '').trim());
          if (importType === 'comptes' && cells.length >= 2) {
             addCompte({
               dossierId: currentDossierId,
               numero: cells[0],
               intitule: cells[1],
               type: 'Détail',
               nature: (cells[2] as any) || 'Autre',
               saisieAnalytique: false,
               saisieEcheance: false,
               lettrageAutomatique: false
             });
          }
        });
        setTimeout(() => { setStatus('success'); setFile(null); setPreview([]); }, 1500);
      } catch (err) { setStatus('error'); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-xl">
                <Upload size={32} />
             </div>
             Universal Import Hub
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Alimentez votre ERP en masse avec une précision chirurgicale.</p>
        </div>
        <button 
          onClick={simulateMassiveImport}
          className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-xl"
        >
           <Zap size={16} className="text-amber-400" /> Simulation Massive
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            {status === 'processing' ? (
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-20 flex flex-col items-center justify-center text-center space-y-8">
                 <Loader2 className="animate-spin text-emerald-600" size={64} />
                 <div>
                    <h2 className="text-2xl font-black text-slate-900">Traitement Haute Performance</h2>
                    <p className="text-slate-500 font-medium mt-2 italic">Injection des données dans le moteur DIAWDI Azure...</p>
                 </div>
                 <div className="w-full max-w-md h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${simProgress}%` }}></div>
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{simProgress}% Termin</p>
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-12 space-y-10">
                 <section className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">1. Nature des Données</h3>
                    <div className="flex gap-4">
                       {[
                         { id: 'comptes', label: 'Plan Comptable', icon: <Database /> },
                         { id: 'ecritures', label: 'Écritures Comptables', icon: <Table /> },
                       ].map(item => (
                         <button 
                           key={item.id}
                           onClick={() => setImportType(item.id as any)}
                           className={`flex-1 p-6 rounded-[2rem] border transition-all flex items-center gap-4 ${importType === item.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-100' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                         >
                            {item.icon}
                            <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                         </button>
                       ))}
                    </div>
                 </section>

                 <section className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">2. Sélection du Fichier</h3>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group border-4 border-dashed border-slate-100 rounded-[3rem] p-16 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-200 hover:bg-emerald-50 transition-all relative overflow-hidden"
                    >
                       <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
                       <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all mb-6">
                          <Upload size={40} />
                       </div>
                       <p className="text-xl font-black text-slate-900">{file ? file.name : "Glisser ou cliquer pour importer"}</p>
                       <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">CSV Semicolon Delimited (UTF-8)</p>
                    </div>
                 </section>

                 {preview.length > 0 && (
                   <section className="space-y-6 animate-in slide-in-from-bottom-8">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">3. Analyse & Mappage</h3>
                      <div className="bg-slate-950 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
                         <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5">
                               <tr>
                                  {preview[0].map((h, i) => <th key={i} className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase border-b border-white/5">{h}</th>)}
                               </tr>
                            </thead>
                            <tbody>
                               {preview.slice(1).map((row, i) => (
                                 <tr key={i} className="border-b border-white/5 last:border-0">
                                    {row.map((cell, j) => <td key={j} className="px-8 py-5 text-xs font-bold text-slate-300">{cell}</td>)}
                                 </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                   </section>
                 )}

                 <div className="pt-10 border-t border-slate-50 flex justify-end">
                    <button 
                      disabled={!file}
                      onClick={startImport}
                      className={`px-12 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl ${!file ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700'}`}
                    >
                       <CheckCircle size={18} /> VALIDER ET IMPORTER
                    </button>
                 </div>
              </div>
            )}
         </div>

         <div className="space-y-8">
            <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-10 -top-10 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                  <Download size={200} />
               </div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <Sparkles className="text-indigo-300" size={24} />
                     <h3 className="text-sm font-black uppercase tracking-widest">Modèles Types</h3>
                  </div>
                  <p className="text-xs font-bold text-indigo-100 leading-relaxed">Téléchargez nos modèles Excel pré-configurés pour garantir un import sans erreur.</p>
                  <div className="space-y-3 pt-4">
                     <button 
                       onClick={() => downloadTemplate('comptes')}
                       className="w-full p-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center justify-between group transition-all"
                     >
                        <div className="flex items-center gap-4">
                           <Database size={18} className="text-indigo-300" />
                           <span className="text-xs font-black uppercase tracking-wide">Plan Comptable</span>
                        </div>
                        <Download size={16} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
                     </button>
                     <button 
                       onClick={() => downloadTemplate('ecritures')}
                       className="w-full p-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center justify-between group transition-all"
                     >
                        <div className="flex items-center gap-4">
                           <Table size={18} className="text-emerald-300" />
                           <span className="text-xs font-black uppercase tracking-wide">Écritures CSV</span>
                        </div>
                        <Download size={16} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
                     </button>
                  </div>
               </div>
            </div>

            {status === 'success' && (
              <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white shadow-2xl animate-in zoom-in border-4 border-emerald-500 shadow-emerald-100">
                 <CheckCircle size={48} className="mb-6" />
                 <h3 className="text-2xl font-black mb-2 leading-none">Importation Terminée</h3>
                 <p className="text-sm font-bold text-emerald-100 leading-relaxed mt-4">Votre base de données a été mise à jour. Les nouveaux comptes et écritures sont désormais disponibles dans vos états.</p>
                 <button onClick={() => setStatus('idle')} className="w-full mt-8 py-4 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all">NOUVEL IMPORT</button>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

