import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, FileText, Eye, Send, CheckCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface LigneFacture {
  id: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  tauxTVA: number;
}

interface Facture {
  id: string;
  dossierId: string;
  numero: string;
  date: string;
  dateEcheance: string;
  clientNom: string;
  clientAdresse: string;
  lignes: LigneFacture[];
  statut: 'Brouillon' | 'Envoyée' | 'Payée' | 'Annulée';
}

export default function Facturation() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const addLigneEcriture = useStore(state => state.addLigneEcriture);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);

  const [factures, setFactures] = useState<Facture[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [previewFacture, setPreviewFacture] = useState<Facture | null>(null);

  const [form, setForm] = useState<Partial<Facture>>(() => ({
    date: format(new Date(), 'yyyy-MM-dd'),
    dateEcheance: format(new Date(Date.now() + 30 * 86400000), 'yyyy-MM-dd'),
    clientNom: '',
    clientAdresse: '',
    statut: 'Brouillon',
    lignes: [{ id: uuidv4(), description: '', quantite: 1, prixUnitaire: 0, tauxTVA: 18 }]
  }));

  const totaux = useMemo(() => {
    const lignes = form.lignes || [];
    const totalHT = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0);
    const totalTVA = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire * l.tauxTVA / 100, 0);
    return { totalHT, totalTVA, totalTTC: totalHT + totalTVA };
  }, [form.lignes]);

  const addLigne = () => {
    setForm(f => ({ ...f, lignes: [...(f.lignes || []), { id: uuidv4(), description: '', quantite: 1, prixUnitaire: 0, tauxTVA: 18 }] }));
  };

  const updateLigne = (id: string, field: keyof LigneFacture, value: string | number) => {
    setForm(f => ({ ...f, lignes: (f.lignes || []).map(l => l.id === id ? { ...l, [field]: value } : l) }));
  };

  const removeLigne = (id: string) => {
    setForm(f => ({ ...f, lignes: (f.lignes || []).filter(l => l.id !== id) }));
  };

  const saveFacture = () => {
    const newFacture: Facture = {
      ...form as Facture,
      id: uuidv4(),
      dossierId: currentDossierId || '',
      numero: `FAC-${String(factures.length + 1).padStart(5, '0')}`,
    };
    setFactures(f => [...f, newFacture]);
    setShowForm(false);
    setForm({ date: format(new Date(), 'yyyy-MM-dd'), dateEcheance: format(new Date(Date.now() + 30 * 86400000), 'yyyy-MM-dd'), clientNom: '', clientAdresse: '', statut: 'Brouillon', lignes: [{ id: uuidv4(), description: '', quantite: 1, prixUnitaire: 0, tauxTVA: 18 }] });
  };

  const validerFacture = (facture: Facture) => {
    // Auto-generate accounting entries
    const journalVente = journaux.find(j => j.type === 'Vente');
    if (!journalVente || !currentDossierId) return;

    const totalHT = facture.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0);
    const totalTVA = facture.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire * l.tauxTVA / 100, 0);
    const totalTTC = totalHT + totalTVA;
    const libelle = `Facture ${facture.numero} - ${facture.clientNom}`;

    // Écriture Client (Débit 411)
    addLigneEcriture({ dossierId: currentDossierId, journalId: journalVente.id, date: facture.date, numeroPiece: facture.numero, reference: facture.numero, compteGeneralId: 'AUTO_411', libelle, debit: totalTTC, credit: 0 });
    // Écriture Vente (Crédit 701)
    addLigneEcriture({ dossierId: currentDossierId, journalId: journalVente.id, date: facture.date, numeroPiece: facture.numero, reference: facture.numero, compteGeneralId: 'AUTO_701', libelle, debit: 0, credit: totalHT });
    // Écriture TVA (Crédit 4457)
    addLigneEcriture({ dossierId: currentDossierId, journalId: journalVente.id, date: facture.date, numeroPiece: facture.numero, reference: facture.numero, compteGeneralId: 'AUTO_4457', libelle, debit: 0, credit: totalTVA });

    setFactures(prev => prev.map(f => f.id === facture.id ? { ...f, statut: 'Envoyée' } : f));
    alert(`✅ Écriture comptable automatique générée dans le journal ${journalVente.code} !`);
  };

  const statutColors: Record<string, string> = {
    'Brouillon': 'bg-slate-100 text-slate-700',
    'Envoyée': 'bg-blue-100 text-blue-700',
    'Payée': 'bg-emerald-100 text-emerald-700',
    'Annulée': 'bg-rose-100 text-rose-700',
  };

  if (previewFacture) {
    const totPreview = {
      ht: previewFacture.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0),
      tva: previewFacture.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire * l.tauxTVA / 100, 0),
    };
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={() => setPreviewFacture(null)} className="text-slate-600 hover:text-slate-900 flex items-center print:hidden">&larr; Retour à la liste</button>
        <div className="bg-white rounded-xl shadow border p-10 print:shadow-none print:border-none">
          <div className="flex justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{currentDossier?.raisonSociale}</h2>
              <p className="text-slate-500 text-sm mt-1">SIRET : {currentDossier?.siret}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{previewFacture.numero}</p>
              <p className="text-sm text-slate-500 mt-1">Date : {format(new Date(previewFacture.date), 'dd/MM/yyyy')}</p>
              <p className="text-sm text-slate-500">Échéance : {format(new Date(previewFacture.dateEcheance), 'dd/MM/yyyy')}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 mb-8">
            <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Facturé à :</p>
            <p className="font-bold text-slate-900">{previewFacture.clientNom}</p>
            <p className="text-slate-600 text-sm whitespace-pre-wrap">{previewFacture.clientAdresse}</p>
          </div>
          <table className="w-full text-sm mb-8">
            <thead><tr className="bg-primary text-white"><th className="p-3 text-left rounded-tl-md">Description</th><th className="p-3 text-center w-16">Qté</th><th className="p-3 text-right w-28">P.U. HT</th><th className="p-3 text-right w-16">TVA</th><th className="p-3 text-right w-28 rounded-tr-md">Total HT</th></tr></thead>
            <tbody>{previewFacture.lignes.map(l => (<tr key={l.id} className="border-b border-slate-100"><td className="p-3 text-slate-800">{l.description}</td><td className="p-3 text-center">{l.quantite}</td><td className="p-3 text-right">{l.prixUnitaire.toFixed(2)}</td><td className="p-3 text-right">{l.tauxTVA}%</td><td className="p-3 text-right font-medium">{(l.quantite * l.prixUnitaire).toFixed(2)}</td></tr>))}</tbody>
          </table>
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">Total HT</span><span className="font-medium">{totPreview.ht.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">TVA</span><span className="font-medium">{totPreview.tva.toFixed(2)}</span></div>
              <div className="flex justify-between border-t pt-2 mt-2 text-base font-bold"><span>Total TTC</span><span className="text-primary">{(totPreview.ht + totPreview.tva).toFixed(2)} {currentDossier?.devisePrincipale}</span></div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 print:hidden">
          <button onClick={() => window.print()} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50">Imprimer</button>
          {previewFacture.statut === 'Brouillon' && <button onClick={() => { validerFacture(previewFacture); setPreviewFacture(null); }} className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center"><CheckCircle size={16} className="mr-2" /> Valider & Comptabiliser</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center"><FileText className="mr-2 text-primary" /> Gestion des Factures</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center shadow-sm"><Plus size={16} className="mr-2" /> Nouvelle Facture</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-3">Nouvelle Facture</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Client</label><input className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="Nom du client" value={form.clientNom || ''} onChange={e => setForm(f => ({ ...f, clientNom: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label><input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={form.date || ''} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Échéance</label><input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={form.dateEcheance || ''} onChange={e => setForm(f => ({ ...f, dateEcheance: e.target.value }))} /></div>
            <div className="col-span-3"><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Adresse Client</label><textarea className="w-full px-3 py-2 border border-slate-300 rounded-md h-16 text-sm" placeholder="Adresse complète..." value={form.clientAdresse || ''} onChange={e => setForm(f => ({ ...f, clientAdresse: e.target.value }))} /></div>
          </div>
          <div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-200 text-slate-500 text-xs uppercase"><th className="pb-2 text-left">Description</th><th className="pb-2 text-center w-16">Qté</th><th className="pb-2 text-right w-28">P.U. HT</th><th className="pb-2 text-right w-20">TVA %</th><th className="pb-2 text-right w-28">Total HT</th><th className="pb-2 w-8"></th></tr></thead>
              <tbody className="divide-y divide-slate-50">{(form.lignes || []).map(l => (
                <tr key={l.id}>
                  <td className="py-2 pr-2"><input className="w-full px-2 py-1.5 border border-slate-200 rounded" value={l.description} onChange={e => updateLigne(l.id, 'description', e.target.value)} placeholder="Description..." /></td>
                  <td className="py-2 px-1"><input type="number" className="w-full px-2 py-1.5 border border-slate-200 rounded text-center" value={l.quantite} onChange={e => updateLigne(l.id, 'quantite', +e.target.value)} /></td>
                  <td className="py-2 px-1"><input type="number" className="w-full px-2 py-1.5 border border-slate-200 rounded text-right" value={l.prixUnitaire} onChange={e => updateLigne(l.id, 'prixUnitaire', +e.target.value)} /></td>
                  <td className="py-2 px-1"><input type="number" className="w-full px-2 py-1.5 border border-slate-200 rounded text-right" value={l.tauxTVA} onChange={e => updateLigne(l.id, 'tauxTVA', +e.target.value)} /></td>
                  <td className="py-2 pl-2 text-right font-medium">{(l.quantite * l.prixUnitaire).toFixed(2)}</td>
                  <td className="py-2 pl-2"><button onClick={() => removeLigne(l.id)} className="text-rose-400 hover:text-rose-600"><Trash2 size={14} /></button></td>
                </tr>
              ))}</tbody>
            </table>
            <button onClick={addLigne} className="mt-3 text-sm text-primary hover:underline flex items-center"><Plus size={14} className="mr-1" /> Ajouter une ligne</button>
          </div>
          <div className="flex justify-between items-end border-t pt-4">
            <div className="text-right ml-auto space-y-1 text-sm mr-6">
              <div className="flex justify-between gap-8"><span className="text-slate-500">HT :</span><span className="font-medium">{totaux.totalHT.toFixed(2)}</span></div>
              <div className="flex justify-between gap-8"><span className="text-slate-500">TVA :</span><span className="font-medium">{totaux.totalTVA.toFixed(2)}</span></div>
              <div className="flex justify-between gap-8 text-lg font-bold text-primary"><span>TTC :</span><span>{totaux.totalTTC.toFixed(2)}</span></div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 border-t pt-4">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50">Annuler</button>
            <button onClick={saveFacture} className="px-6 py-2 bg-primary text-white rounded-md hover:bg-indigo-700">Enregistrer</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200"><tr>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">N° Facture</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Échéance</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Total TTC</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Statut</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {factures.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400">Aucune facture. Créez votre première facture en cliquant sur "Nouvelle Facture".</td></tr>
            ) : factures.map(f => {
              const ttc = f.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire * (1 + l.tauxTVA / 100), 0);
              return (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-indigo-700">{f.numero}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{f.clientNom}</td>
                  <td className="px-4 py-3 text-slate-600">{format(new Date(f.date), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3 text-slate-600">{format(new Date(f.dateEcheance), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">{ttc.toFixed(2)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statutColors[f.statut]}`}>{f.statut}</span></td>
                  <td className="px-4 py-3 flex items-center space-x-2">
                    <button onClick={() => setPreviewFacture(f)} title="Aperçu" className="p-1.5 rounded hover:bg-slate-200 text-slate-500"><Eye size={15} /></button>
                    {f.statut === 'Brouillon' && <button onClick={() => validerFacture(f)} title="Valider & Comptabiliser" className="p-1.5 rounded hover:bg-emerald-100 text-emerald-600"><Send size={15} /></button>}
                    {f.statut === 'Envoyée' && <button onClick={() => setFactures(prev => prev.map(x => x.id === f.id ? { ...x, statut: 'Payée' } : x))} title="Marquer Payée" className="p-1.5 rounded hover:bg-emerald-100 text-emerald-600"><CheckCircle size={15} /></button>}
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
