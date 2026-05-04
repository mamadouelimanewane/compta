import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { ShoppingCart, Plus, ChevronRight, CheckCircle, FileText, Truck, CreditCard, Trash2, Search, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

type StatutBC = 'Brouillon' | 'Approuvé' | 'Reçu' | 'Facturé' | 'Payé';

interface LigneBC { id: string; description: string; quantite: number; prixUnitaire: number; tauxTVA: number; }
interface BonCommande {
  id: string; dossierId: string; numero: string; fournisseurId: string; fournisseurNom: string; date: string;
  datelivraison: string; lignes: LigneBC[]; statut: StatutBC;
}

const STATUT_STEPS: StatutBC[] = ['Brouillon', 'Approuvé', 'Reçu', 'Facturé', 'Payé'];

export default function ProcureToPay() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const addLigneEcriture = useStore(state => state.addLigneEcriture);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const tiers = useStore(state => state.comptesTiers).filter(t => t.dossierId === currentDossierId && t.type === 'Fournisseur');
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);

  const [bons, setBons] = useState<BonCommande[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<BonCommande>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    datelivraison: format(new Date(Date.now() + 7 * 86400000), 'yyyy-MM-dd'),
    fournisseurId: '', fournisseurNom: '', statut: 'Brouillon',
    lignes: [{ id: uuidv4(), description: '', quantite: 1, prixUnitaire: 0, tauxTVA: 18 }]
  });

  const totaux = (lignes: LigneBC[]) => {
    const ht = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0);
    const tva = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire * l.tauxTVA / 100, 0);
    return { ht, tva, ttc: ht + tva };
  };

  const saveBon = () => {
    const bc: BonCommande = { ...form as BonCommande, id: uuidv4(), dossierId: currentDossierId || '', numero: `BC-${String(bons.length + 1).padStart(5, '0')}`, statut: 'Brouillon' };
    setBons(b => [...b, bc]);
    setShowForm(false);
  };

  const advanceStatut = (id: string) => {
    setBons(prev => prev.map(b => {
      if (b.id !== id) return b;
      const idx = STATUT_STEPS.indexOf(b.statut);
      if (idx >= STATUT_STEPS.length - 1) return b;
      const nextStatut = STATUT_STEPS[idx + 1];

      if (nextStatut === 'Facturé' && currentDossierId) {
        const journalAchat = journaux.find(j => j.code === 'ACH' || j.type === 'Achat');
        const compteAchat = comptes.find(c => c.numero.startsWith('601'));
        const compteFournisseur = comptes.find(c => c.numero.startsWith('401'));
        const compteTVA = comptes.find(c => c.numero.startsWith('4456'));

        if (journalAchat && compteAchat && compteFournisseur && compteTVA) {
          const tot = totaux(b.lignes);
          const libelle = `Facture Fournisseur BC ${b.numero} — ${b.fournisseurNom}`;
          addLigneEcriture({ dossierId: currentDossierId, journalId: journalAchat.id, date: b.date, numeroPiece: b.numero, reference: b.numero, compteGeneralId: compteAchat.id, libelle, debit: tot.ht, credit: 0, validee: false });
          addLigneEcriture({ dossierId: currentDossierId, journalId: journalAchat.id, date: b.date, numeroPiece: b.numero, reference: b.numero, compteGeneralId: compteTVA.id, libelle: "TVA déductible", debit: tot.tva, credit: 0, validee: false });
          addLigneEcriture({ dossierId: currentDossierId, journalId: journalAchat.id, date: b.date, numeroPiece: b.numero, reference: b.numero, compteGeneralId: compteFournisseur.id, libelle, debit: 0, credit: tot.ttc, validee: false });
          alert(`✅ Écriture d'achat injectée automatiquement dans le journal ${journalAchat.code} !`);
        }
      }
      return { ...b, statut: nextStatut };
    }));
  };

  return (
    <div className="space-y-8 p-4 animate-in fade-in duration-700 h-full flex flex-col">
       <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <ShoppingCart size={28} />
             </div>
             Procure-to-Pay Elite
          </h1>
          <p className="text-slate-500 font-medium mt-2">Cycle d'achat complet : du bon de commande au paiement fournisseur.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs flex items-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={18} />
            NOUVEL ACHAT
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8">
           <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900">Nouveau Bon de Commande</h2>
              <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs uppercase">Workflow Actif</div>
           </div>
           <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fournisseur</label>
                       <select 
                         className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900"
                         onChange={e => {
                           const t = tiers.find(x => x.id === e.target.value);
                           if (t) setForm({ ...form, fournisseurId: t.id, fournisseurNom: t.intitule });
                         }}
                         value={form.fournisseurId}
                       >
                         <option value="">Sélectionner fournisseur...</option>
                         {tiers.map(t => <option key={t.id} value={t.id}>{t.numero} - {t.intitule}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Commande</label>
                       <input type="date" className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-4">
                    {(form.lignes || []).map(l => (
                      <div key={l.id} className="grid grid-cols-12 gap-4 items-center">
                         <input className="col-span-6 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm" placeholder="Article / Service..." value={l.description} onChange={e => setForm(f => ({ ...f, lignes: f.lignes?.map(x => x.id === l.id ? {...x, description: e.target.value} : x) }))} />
                         <input type="number" className="col-span-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-center font-black text-sm" value={l.quantite} onChange={e => setForm(f => ({ ...f, lignes: f.lignes?.map(x => x.id === l.id ? {...x, quantite: +e.target.value} : x) }))} />
                         <input type="number" className="col-span-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-right font-black text-sm" value={l.prixUnitaire} onChange={e => setForm(f => ({ ...f, lignes: f.lignes?.map(x => x.id === l.id ? {...x, prixUnitaire: +e.target.value} : x) }))} />
                         <button onClick={() => setForm(f => ({ ...f, lignes: f.lignes?.filter(x => x.id !== l.id) }))} className="col-span-1 p-2 text-rose-300 hover:text-rose-600"><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button onClick={() => setForm(f => ({ ...f, lignes: [...(f.lignes || []), { id: uuidv4(), description: '', quantite: 1, prixUnitaire: 0, tauxTVA: 18 }] }))} className="text-xs font-black text-indigo-600 uppercase flex items-center gap-1 hover:underline">+ AJOUTER LIGNE</button>
                 </div>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-8">
                 <div className="space-y-4">
                    <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest">Résumé Achat</h3>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-3xl font-black text-slate-900">
                          <span>TOTAL</span>
                          <span>{totaux(form.lignes || []).ttc.toLocaleString()} <span className="text-xs font-medium uppercase">{currentDossier?.devisePrincipale}</span></span>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <button onClick={saveBon} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:scale-[1.02] transition-all">GÉNÉRER LE BC</button>
                    <button onClick={() => setShowForm(false)} className="w-full py-5 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase hover:bg-slate-50 transition-all">ANNULER</button>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-8 overflow-hidden">
           {STATUT_STEPS.map(step => (
             <div key={step} className="flex-1 flex flex-col gap-4 min-w-[280px]">
                <div className="flex justify-between items-center px-4">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step}</h3>
                   <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-black">{bons.filter(b => b.statut === step).length}</span>
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto pb-8 custom-scrollbar">
                   {bons.filter(b => b.statut === step).map(b => (
                     <div key={b.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                           <span className="text-[10px] font-black text-indigo-600">{b.numero}</span>
                           <div className="p-2 bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowUpRight size={14} className="text-indigo-600" />
                           </div>
                        </div>
                        <p className="font-bold text-slate-900 mb-1">{b.fournisseurNom}</p>
                        <p className="text-lg font-black text-slate-900 mb-6">{totaux(b.lignes).ttc.toLocaleString()} <span className="text-[10px] text-slate-400">{currentDossier?.devisePrincipale}</span></p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                           <p className="text-[10px] font-bold text-slate-400 uppercase">{format(new Date(b.date), 'dd MMM')}</p>
                           {step !== 'Payé' && (
                             <button onClick={() => advanceStatut(b.id)} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                <ChevronRight size={16} />
                             </button>
                           )}
                           {step === 'Payé' && <ShieldCheck size={18} className="text-emerald-500" />}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
