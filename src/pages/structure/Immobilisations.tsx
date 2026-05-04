import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Landmark, Plus, Calculator, Calendar, History, ShieldCheck, ArrowUpRight, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface Immobilisation {
  id: string;
  code: string;
  intitule: string;
  dateAcquisition: string;
  valeurOrigine: number;
  dureeAmortissement: number; // en années
  mode: 'Linéaire' | 'Dégressif';
  compteImmoId: string;
  compteAmortId: string;
  compteDotationId: string;
}

export default function Immobilisations() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const addLigneEcriture = useStore(state => state.addLigneEcriture);

  const [immoblisations, setImmobilisations] = useState<Immobilisation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Immobilisation>>({
    dateAcquisition: format(new Date(), 'yyyy-MM-dd'),
    valeurOrigine: 0,
    dureeAmortissement: 5,
    mode: 'Linéaire'
  });

  const generateDotations = (immo: Immobilisation) => {
    const dotationAnnuelle = immo.valeurOrigine / immo.dureeAmortissement;
    const journalOD = useStore.getState().journaux.find(j => j.type === 'Général' && j.dossierId === currentDossierId);
    
    if (!journalOD) {
      alert("Journal d'opérations diverses (OD) manquant.");
      return;
    }

    addLigneEcriture({
      dossierId: currentDossierId!,
      journalId: journalOD.id,
      date: format(new Date(), 'yyyy-12-31'),
      numeroPiece: "DOT-"+immo.code,
      reference: immo.code,
      compteGeneralId: immo.compteDotationId,
      libelle: `Dotation aux amort. ${immo.intitule}`,
      debit: dotationAnnuelle,
      credit: 0,
      validee: true
    });

    addLigneEcriture({
      dossierId: currentDossierId!,
      journalId: journalOD.id,
      date: format(new Date(), 'yyyy-12-31'),
      numeroPiece: "DOT-"+immo.code,
      reference: immo.code,
      compteGeneralId: immo.compteAmortId,
      libelle: `Amortissement ${immo.intitule}`,
      debit: 0,
      credit: dotationAnnuelle,
      validee: true
    });

    alert(`Écriture de dotation générée pour ${immo.intitule}`);
  };

  const devise = currentDossier?.devisePrincipale || 'FCFA';

  return (
    <div className="space-y-8 p-4 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Landmark size={28} />
             </div>
             Registre des Immobilisations
          </h1>
          <p className="text-slate-500 font-medium mt-2">Gestion du patrimoine, calcul des amortissements et écritures de dotation.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs flex items-center gap-3 hover:bg-indigo-700 shadow-xl transition-all uppercase tracking-widest"
        >
          <Plus size={18} /> NOUVEL ACTIF
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8">
           <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900">Nouvelle Immobilisation</h2>
           </div>
           <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                 <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Désignation</label><input className="w-full px-5 py-3 bg-slate-100 border-none rounded-xl font-bold" value={form.intitule} onChange={e => setForm({...form, intitule: e.target.value})} /></div>
                 <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Code Actif</label><input className="w-full px-5 py-3 bg-slate-100 border-none rounded-xl font-bold" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} /></div>
                 <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Valeur Origine</label><input type="number" className="w-full px-5 py-3 bg-slate-100 border-none rounded-xl font-black" value={form.valeurOrigine} onChange={e => setForm({...form, valeurOrigine: +e.target.value})} /></div>
                 <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Durée (Années)</label><input type="number" className="w-full px-5 py-3 bg-slate-100 border-none rounded-xl font-black" value={form.dureeAmortissement} onChange={e => setForm({...form, dureeAmortissement: +e.target.value})} /></div>
                 
                 <div className="col-span-2 grid grid-cols-3 gap-4">
                    <div><label className="text-[10px] font-black text-slate-400 uppercase">Compte Immo</label><select className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold" value={form.compteImmoId} onChange={e => setForm({...form, compteImmoId: e.target.value})}><option>Choisir...</option>{comptes.filter(c => c.numero.startsWith('2')).map(c => <option key={c.id} value={c.id}>{c.numero}</option>)}</select></div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase">Compte Amort</label><select className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold" value={form.compteAmortId} onChange={e => setForm({...form, compteAmortId: e.target.value})}><option>Choisir...</option>{comptes.filter(c => c.numero.startsWith('28')).map(c => <option key={c.id} value={c.id}>{c.numero}</option>)}</select></div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase">Compte Dotation</label><select className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold" value={form.compteDotationId} onChange={e => setForm({...form, compteDotationId: e.target.value})}><option>Choisir...</option>{comptes.filter(c => c.numero.startsWith('68')).map(c => <option key={c.id} value={c.id}>{c.numero}</option>)}</select></div>
                 </div>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-between">
                 <div className="space-y-4">
                    <h3 className="font-black text-xs text-slate-400 uppercase">Planification</h3>
                    <p className="text-sm font-medium text-slate-600">Calcul automatique des dotations selon la norme OHADA en vigueur.</p>
                 </div>
                 <div className="space-y-4">
                    <button onClick={() => { setImmobilisations([...immoblisations, {...form as Immobilisation, id: uuidv4()}]); setShowForm(false); }} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:scale-[1.02] transition-all">VALIDER L'ACTIF</button>
                    <button onClick={() => setShowForm(false)} className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase hover:bg-slate-50 transition-all">ANNULER</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-slate-100">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actif</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">V. Origine</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Durée</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Acq.</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Dotation Ann.</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {immoblisations.length === 0 ? (
               <tr><td colSpan={6} className="px-8 py-24 text-center text-slate-300 italic font-medium">Aucun actif immobilisé enregistré.</td></tr>
            ) : immoblisations.map(immo => (
              <tr key={immo.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-5">
                   <p className="font-black text-slate-900">{immo.intitule}</p>
                   <p className="text-[10px] font-bold text-indigo-600">{immo.code}</p>
                </td>
                <td className="px-8 py-5 text-right font-black text-slate-900">{immo.valeurOrigine.toLocaleString()}</td>
                <td className="px-8 py-5 text-center font-bold text-slate-500">{immo.dureeAmortissement} Ans</td>
                <td className="px-8 py-5 text-sm font-medium text-slate-500">{immo.dateAcquisition}</td>
                <td className="px-8 py-5 text-right font-black text-indigo-600">{(immo.valeurOrigine / immo.dureeAmortissement).toLocaleString()}</td>
                <td className="px-8 py-5 text-right">
                   <div className="flex justify-end gap-2">
                      <button onClick={() => generateDotations(immo)} title="Générer Dotation" className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                         <Calculator size={16} />
                      </button>
                      <button className="p-2 text-slate-300 hover:text-rose-600 transition-all">
                         <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
