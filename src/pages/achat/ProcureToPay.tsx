import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ShoppingCart, Plus, ChevronRight, CheckCircle, FileText, Truck, CreditCard, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

type StatutBC = 'Brouillon' | 'Approuvé' | 'Reçu' | 'Facturé' | 'Payé';

interface LigneBC { id: string; description: string; quantite: number; prixUnitaire: number; tauxTVA: number; }
interface BonCommande {
  id: string; dossierId: string; numero: string; fournisseur: string; date: string;
  datelivraison: string; lignes: LigneBC[]; statut: StatutBC; notes: string;
}

const STATUT_STEPS: StatutBC[] = ['Brouillon', 'Approuvé', 'Reçu', 'Facturé', 'Payé'];
const STATUT_COLORS: Record<StatutBC, string> = {
  Brouillon: 'bg-slate-100 text-slate-700',
  Approuvé: 'bg-blue-100 text-blue-700',
  Reçu: 'bg-amber-100 text-amber-700',
  Facturé: 'bg-purple-100 text-purple-700',
  Payé: 'bg-emerald-100 text-emerald-700',
};
const STATUT_ICONS: Record<StatutBC, React.ReactNode> = {
  Brouillon: <FileText size={14} />,
  Approuvé: <CheckCircle size={14} />,
  Reçu: <Truck size={14} />,
  Facturé: <FileText size={14} />,
  Payé: <CreditCard size={14} />,
};

export default function ProcureToPay() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const addLigneEcriture = useStore(state => state.addLigneEcriture);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);

  const [bons, setBons] = useState<BonCommande[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<BonCommande>>(() => ({
    date: format(new Date(), 'yyyy-MM-dd'),
    datelivraison: format(new Date(Date.now() + 7 * 86400000), 'yyyy-MM-dd'),
    fournisseur: '', notes: '', statut: 'Brouillon',
    lignes: [{ id: uuidv4(), description: '', quantite: 1, prixUnitaire: 0, tauxTVA: 18 }]
  }));

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

      // Auto-generate accounting entry when status becomes "Facturé"
      if (nextStatut === 'Facturé' && currentDossierId) {
        const journalAchat = journaux.find(j => j.type === 'Achat');
        if (journalAchat) {
          const tot = totaux(b.lignes);
          const libelle = `BC ${b.numero} — ${b.fournisseur}`;
          addLigneEcriture({ dossierId: currentDossierId, journalId: journalAchat.id, date: b.date, numeroPiece: b.numero, reference: b.numero, compteGeneralId: 'AUTO_601', libelle, debit: tot.ht, credit: 0 });
          addLigneEcriture({ dossierId: currentDossierId, journalId: journalAchat.id, date: b.date, numeroPiece: b.numero, reference: b.numero, compteGeneralId: 'AUTO_4456', libelle, debit: tot.tva, credit: 0 });
          addLigneEcriture({ dossierId: currentDossierId, journalId: journalAchat.id, date: b.date, numeroPiece: b.numero, reference: b.numero, compteGeneralId: 'AUTO_401', libelle, debit: 0, credit: tot.ttc });
          alert(`✅ Écriture comptable auto générée dans le journal Achats !`);
        }
      }
      return { ...b, statut: nextStatut };
    }));
  };

  const updateLigne = (id: string, field: keyof LigneBC, value: string | number) =>
    setForm(f => ({ ...f, lignes: (f.lignes || []).map(l => l.id === id ? { ...l, [field]: value } : l) }));

  const devise = currentDossier?.devisePrincipale || 'FCFA';
  const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2 });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <ShoppingCart className="mr-2 text-primary" />
          Procure-to-Pay (Gestion des Achats)
        </h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center shadow-sm">
          <Plus size={16} className="mr-2" /> Nouveau Bon de Commande
        </button>
      </div>

      {/* Pipeline visuel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">Workflow Procure-to-Pay</h2>
        <div className="flex items-center space-x-2">
          {STATUT_STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex-1 text-center">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${STATUT_COLORS[s]}`}>
                  <span className="mr-1">{STATUT_ICONS[s]}</span>{s}
                </div>
                <p className="text-xs text-slate-400 mt-1">{bons.filter(b => b.statut === s).length} BC</p>
              </div>
              {i < STATUT_STEPS.length - 1 && <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-3">Nouveau Bon de Commande</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2"><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Fournisseur</label><input className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="Nom du fournisseur" value={form.fournisseur || ''} onChange={e => setForm(f => ({ ...f, fournisseur: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date commande</label><input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" value={form.date || ''} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 text-xs text-slate-500 uppercase"><th className="pb-2 text-left">Description</th><th className="pb-2 text-center w-16">Qté</th><th className="pb-2 text-right w-28">P.U. HT</th><th className="pb-2 text-right w-16">TVA</th><th className="pb-2 text-right w-28">Total HT</th><th className="pb-2 w-8"></th></tr></thead>
            <tbody>{(form.lignes || []).map(l => (
              <tr key={l.id}>
                <td className="py-1 pr-2"><input className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm" value={l.description} onChange={e => updateLigne(l.id, 'description', e.target.value)} placeholder="Article ou prestation..." /></td>
                <td className="py-1 px-1"><input type="number" className="w-full px-2 py-1.5 border border-slate-200 rounded text-center text-sm" value={l.quantite} onChange={e => updateLigne(l.id, 'quantite', +e.target.value)} /></td>
                <td className="py-1 px-1"><input type="number" className="w-full px-2 py-1.5 border border-slate-200 rounded text-right text-sm" value={l.prixUnitaire} onChange={e => updateLigne(l.id, 'prixUnitaire', +e.target.value)} /></td>
                <td className="py-1 px-1"><input type="number" className="w-full px-2 py-1.5 border border-slate-200 rounded text-right text-sm" value={l.tauxTVA} onChange={e => updateLigne(l.id, 'tauxTVA', +e.target.value)} /></td>
                <td className="py-1 pl-2 text-right font-medium text-sm">{(l.quantite * l.prixUnitaire).toFixed(2)}</td>
                <td className="py-1 pl-1"><button onClick={() => setForm(f => ({ ...f, lignes: (f.lignes || []).filter(x => x.id !== l.id) }))} className="text-rose-400 hover:text-rose-600"><Trash2 size={13} /></button></td>
              </tr>
            ))}</tbody>
          </table>
          <button onClick={() => setForm(f => ({ ...f, lignes: [...(f.lignes || []), { id: uuidv4(), description: '', quantite: 1, prixUnitaire: 0, tauxTVA: 18 }] }))} className="text-sm text-primary hover:underline flex items-center"><Plus size={13} className="mr-1" /> Ajouter une ligne</button>
          <div className="flex justify-between items-center border-t pt-4">
            <div className="text-sm text-slate-500">
              {form.lignes && (() => { const t = totaux(form.lignes); return `HT : ${t.ht.toFixed(2)} | TVA : ${t.tva.toFixed(2)} | TTC : ${t.ttc.toFixed(2)} ${devise}`; })()}
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm hover:bg-slate-50">Annuler</button>
              <button onClick={saveBon} className="px-6 py-2 bg-primary text-white rounded-md text-sm hover:bg-indigo-700">Enregistrer BC</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">N° BC</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Fournisseur</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Total TTC</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Statut</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bons.length === 0 ? (
              <tr><td colSpan={6} className="py-16 text-center text-slate-400">Aucun bon de commande. Cliquez sur "Nouveau Bon de Commande" pour démarrer.</td></tr>
            ) : bons.map(b => {
              const tot = totaux(b.lignes);
              const idx = STATUT_STEPS.indexOf(b.statut);
              const nextStatut = idx < STATUT_STEPS.length - 1 ? STATUT_STEPS[idx + 1] : null;
              return (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-indigo-700">{b.numero}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{b.fournisseur}</td>
                  <td className="px-4 py-3 text-slate-600">{format(new Date(b.date), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">{fmt(tot.ttc)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${STATUT_COLORS[b.statut]}`}>
                      <span className="mr-1">{STATUT_ICONS[b.statut]}</span>{b.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {nextStatut && (
                      <button onClick={() => advanceStatut(b.id)} className="text-xs bg-primary text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 flex items-center">
                        <ChevronRight size={12} className="mr-1" /> → {nextStatut}
                      </button>
                    )}
                    {!nextStatut && <span className="text-xs text-emerald-600 font-semibold flex items-center"><CheckCircle size={13} className="mr-1" /> Terminé</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
