import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { CheckSquare, ArrowRightLeft, Landmark, Search, FileUp, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface BankLine {
  id: string;
  date: string;
  libelle: string;
  montant: number;
  matched: boolean;
}

export default function RapprochementBancaire() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId && j.type === 'Trésorerie');
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const updateLigneEcriture = useStore(state => state.updateLigneEcriture);
  
  const [selectedJournalId, setSelectedJournalId] = useState('');
  const [soldeInitial, setSoldeInitial] = useState(0);
  const [soldeFinal, setSoldeFinal] = useState(0);
  
  // Mock Bank Statement Data
  const [bankLines, setBankLines] = useState<BankLine[]>([
    { id: 'b1', date: '2026-01-20', libelle: 'VIR LOYER JANVIER', montant: -200000, matched: false },
    { id: 'b2', date: '2026-02-05', libelle: 'CHQ 123 PROSUMA', montant: 1180000, matched: false },
    { id: 'b3', date: '2026-02-10', libelle: 'FRAIS TENUE COMPTE', montant: -5000, matched: false },
  ]);

  const selectedJournal = journaux.find(j => j.id === selectedJournalId);
  const bankCompteId = selectedJournal?.compteContrepartieId || '';

  const relevantLignes = useMemo(() => {
    if (!selectedJournalId) return [];
    return lignesEcriture.filter(l => l.journalId === selectedJournalId && !l.rapprochee);
  }, [lignesEcriture, selectedJournalId]);

  const [selectedBankIds, setSelectedBankIds] = useState<Set<string>>(new Set());
  const [selectedComptaIds, setSelectedComptaIds] = useState<Set<string>>(new Set());

  const totalBankSelected = useMemo(() => {
    return bankLines
      .filter(l => selectedBankIds.has(l.id))
      .reduce((sum, l) => sum + l.montant, 0);
  }, [bankLines, selectedBankIds]);

  const totalComptaSelected = useMemo(() => {
    return relevantLignes
      .filter(l => selectedComptaIds.has(l.id))
      .reduce((sum, l) => sum + (l.debit - l.credit), 0);
  }, [relevantLignes, selectedComptaIds]);

  const diff = totalBankSelected - totalComptaSelected;

  const handleMatch = () => {
    if (Math.abs(diff) < 0.01 && (selectedBankIds.size > 0 || selectedComptaIds.size > 0)) {
      // Mark as matched
      selectedComptaIds.forEach(id => updateLigneEcriture(id, { rapprochee: true }));
      setBankLines(prev => prev.map(l => selectedBankIds.has(l.id) ? { ...l, matched: true } : l));
      setSelectedBankIds(new Set());
      setSelectedComptaIds(new Set());
    }
  };

  const autoMatch = () => {
    const newBankIds = new Set<string>();
    const newComptaIds = new Set<string>();
    
    bankLines.filter(bl => !bl.matched).forEach(bl => {
      const match = relevantLignes.find(cl => Math.abs((cl.debit - cl.credit) - bl.montant) < 0.01 && !newComptaIds.has(cl.id));
      if (match) {
        newBankIds.add(bl.id);
        newComptaIds.add(match.id);
      }
    });
    
    setSelectedBankIds(newBankIds);
    setSelectedComptaIds(newComptaIds);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <Landmark size={24} />
            </div>
            Rapprochement Bancaire Elite
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Pointage précis et intelligence de lettrage bancaire.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={autoMatch}
            className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-amber-100 transition-all shadow-sm"
          >
            <Zap size={14} className="fill-amber-500" />
            SMART MATCH (IA)
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <FileUp size={14} />
            IMPORTER RELEVÉ
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
          <div className="col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Banque à rapprocher</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
              value={selectedJournalId}
              onChange={e => setSelectedJournalId(e.target.value)}
            >
              <option value="">Sélectionner un compte bancaire...</option>
              {journaux.map(j => (
                <option key={j.id} value={j.id}>{j.code} - {j.intitule}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Solde Relevé</label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                value={soldeFinal}
                onChange={e => setSoldeFinal(Number(e.target.value))}
              />
              <span className="absolute right-4 top-3.5 text-[10px] font-black text-slate-400">FCFA</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className={lex-1 p-3 rounded-2xl flex flex-col items-center justify-center }>
                <span className="text-[8px] font-black uppercase">Écart</span>
                <span className="text-sm font-black">{diff.toLocaleString()}</span>
             </div>
             <button 
               onClick={handleMatch}
               disabled={Math.abs(diff) > 0.01 || (selectedBankIds.size === 0 && selectedComptaIds.size === 0)}
               className={w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg }
             >
               <CheckCircle2 size={24} />
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col group">
          <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Opérations du Relevé</h3>
            <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500">{bankLines.filter(l => !l.matched).length} lignes</span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Libellé Bancaire</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Montant</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center w-12">Pointé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bankLines.filter(l => !l.matched).map(line => (
                  <tr 
                    key={line.id} 
                    onClick={() => {
                      const next = new Set(selectedBankIds);
                      if (next.has(line.id)) next.delete(line.id); else next.add(line.id);
                      setSelectedBankIds(next);
                    }}
                    className={cursor-pointer transition-colors }
                  >
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{format(new Date(line.date), 'dd/MM/yyyy')}</td>
                    <td className="px-6 py-4 text-xs font-black text-slate-900">{line.libelle}</td>
                    <td className={px-6 py-4 text-xs font-black text-right }>
                      {line.montant.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={mx-auto w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center }>
                        {selectedBankIds.has(line.id) && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col group">
          <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Écritures Comptables</h3>
            <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500">{relevantLignes.length} écritures</span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Libellé Compta</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Montant</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center w-12">Pointé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {relevantLignes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic text-xs">Aucune écriture à rapprocher.</td>
                  </tr>
                ) : (
                  relevantLignes.map(line => (
                    <tr 
                      key={line.id} 
                      onClick={() => {
                        const next = new Set(selectedComptaIds);
                        if (next.has(line.id)) next.delete(line.id); else next.add(line.id);
                        setSelectedComptaIds(next);
                      }}
                      className={cursor-pointer transition-colors }
                    >
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{format(new Date(line.date), 'dd/MM/yyyy')}</td>
                      <td className="px-6 py-4 text-xs font-black text-slate-900">{line.libelle}</td>
                      <td className={px-6 py-4 text-xs font-black text-right }>
                        {(line.debit - line.credit).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={mx-auto w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center }>
                          {selectedComptaIds.has(line.id) && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2rem] p-6 text-white flex justify-between items-center shadow-2xl">
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Relevé Sélectionné</p>
            <p className="text-2xl font-black">{totalBankSelected.toLocaleString()} <span className="text-xs text-slate-500">FCFA</span></p>
          </div>
          <div className="flex items-center text-slate-700">
             <ArrowRightLeft size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Compta Sélectionné</p>
            <p className="text-2xl font-black">{totalComptaSelected.toLocaleString()} <span className="text-xs text-slate-500">FCFA</span></p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-3 }>
            {Math.abs(diff) < 0.01 ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {Math.abs(diff) < 0.01 ? 'ÉQUILIBRE PARFAIT' : ÉCART : }
          </div>
        </div>
      </div>
    </div>
  );
}
