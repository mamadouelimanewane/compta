import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Eye, Send, CheckCircle, Trash2, Search, Receipt } from 'lucide-react';
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
  clientId: string;
  clientNom: string;
  clientAdresse: string;
  lignes: LigneFacture[];
  statut: 'Brouillon' | 'Validée' | 'Comptabilisée' | 'Payée';
}

export default function Facturation() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const addLigneEcriture = useStore(state => state.addLigneEcriture);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const tiers = useStore(state => state.comptesTiers).filter(t => t.dossierId === currentDossierId && t.type === 'Client');

  const [factures, setFactures] = useState<Facture[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<Partial<Facture>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    dateEcheance: format(new Date(Date.now() + 30 * 86400000), 'yyyy-MM-dd'),
    clientId: '',
    clientNom: '',
    clientAdresse: '',
    statut: 'Brouillon',
    lignes: [{ id: uuidv4(), description: '', quantite: 1, prixUnitaire: 0, tauxTVA: 18 }]
  });

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
      numero: `FAC-${Date.now().toString().slice(-6)}`,
    };
    setFactures(f => [...f, newFacture]);
    setShowForm(false);
  };

  const comptabiliserFacture = (facture: Facture) => {
    const journalVente = journaux.find(j => j.code === 'VTE' || j.type === 'Vente');
    const compteVente = comptes.find(c => c.numero.startsWith('701'));
    const compteClientCollectif = comptes.find(c => c.numero.startsWith('411'));
    const compteTVA = comptes.find(c => c.numero.startsWith('4431')); // Adjusted for typical OHADA TVA Ventes
    
    if (!journalVente || !compteVente || !compteClientCollectif || !compteTVA || !currentDossierId) {
      alert("Erreur: Journaux (VTE) ou comptes (701, 411, 4431) manquants.");
      return;
    }

    const totalHT = facture.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0);
    const totalTVA = facture.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire * l.tauxTVA / 100, 0);
    const totalTTC = totalHT + totalTVA;
    const libelle = `Facture ${facture.numero} - ${facture.clientNom}`;

    addLigneEcriture({
      dossierId: currentDossierId,
      journalId: journalVente.id,
      date: facture.date,
      numeroPiece: facture.numero,
      reference: facture.numero,
      compteGeneralId: compteClientCollectif.id,
      libelle,
      debit: totalTTC,
      credit: 0,
      validee: false
    });

    addLigneEcriture({
      dossierId: currentDossierId,
      journalId: journalVente.id,
      date: facture.date,
      numeroPiece: facture.numero,
      reference: facture.numero,
      compteGeneralId: compteVente.id,
      libelle,
      debit: 0,
      credit: totalHT,
      validee: false
    });

    if (totalTVA > 0) {
      addLigneEcriture({
        dossierId: currentDossierId,
        journalId: journalVente.id,
        date: facture.date,
        numeroPiece: facture.numero,
        reference: facture.numero,
        compteGeneralId: compteTVA.id,
        libelle: "TVA collectée 18%",
        debit: 0,
        credit: totalTVA,
        validee: false
      });
    }

    setFactures(prev => prev.map(f => f.id === facture.id ? { ...f, statut: 'Comptabilisée' } : f));
    alert("Écriture comptable générée avec succès !");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 h-full flex flex-col p-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Receipt size={28} />
             </div>
             Facturation & Order-to-Cash
          </h1>
          <p className="text-slate-500 font-medium mt-2">Gérez vos ventes et automatisez vos écritures comptables.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs flex items-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={18} />
            NOUVELLE FACTURE
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">
           <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900">Édition de Facture</h2>
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-black text-xs text-slate-500">
                 DRAFT - {format(new Date(), 'yyyy-MM')}
              </div>
           </div>
           
           <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12 flex-1 overflow-auto">
              <div className="lg:col-span-2 space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sélection Client</label>
                       <select 
                         className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                         onChange={e => {
                           const t = tiers.find(x => x.id === e.target.value);
                           if (t) setForm({ ...form, clientId: t.id, clientNom: t.intitule, clientAdresse: t.adresse || '' });
                         }}
                         value={form.clientId}
                       >
                         <option value="">Choisir un client...</option>
                         {tiers.map(t => <option key={t.id} value={t.id}>{t.numero} - {t.intitule}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Document</label>
                       <input type="date" className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Détail des prestations</label>
                       <button onClick={addLigne} className="text-xs font-black text-indigo-600 uppercase flex items-center gap-1 hover:underline">
                          <Plus size={14} /> Ajouter une ligne
                       </button>
                    </div>
                    <div className="space-y-4">
                       {(form.lignes || []).map((l) => (
                         <div key={l.id} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-6">
                               <input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Description..." value={l.description} onChange={e => updateLigne(l.id, 'description', e.target.value)} />
                            </div>
                            <div className="col-span-2">
                               <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-black text-sm text-center" value={l.quantite} onChange={e => updateLigne(l.id, 'quantite', +e.target.value)} />
                            </div>
                            <div className="col-span-2">
                               <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-black text-sm text-right" value={l.prixUnitaire} onChange={e => updateLigne(l.id, 'prixUnitaire', +e.target.value)} />
                            </div>
                            <div className="col-span-1 text-right font-black text-slate-900 text-xs">
                               {(l.quantite * l.prixUnitaire).toLocaleString()}
                            </div>
                            <div className="col-span-1 text-right">
                               <button onClick={() => removeLigne(l.id)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                                  <Trash2 size={16} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="space-y-8 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                 <div className="space-y-4">
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Résumé Financier</h3>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-500">Sous-total HT</span>
                          <span className="text-lg font-black text-slate-900">{totaux.totalHT.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-500">TVA (18%)</span>
                          <span className="text-lg font-black text-slate-900">{totaux.totalTVA.toLocaleString()}</span>
                       </div>
                       <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                          <span className="text-sm font-black text-indigo-600 uppercase">Total TTC</span>
                          <span className="text-3xl font-black text-indigo-600">{totaux.totalTTC.toLocaleString()} <span className="text-xs uppercase font-medium">{currentDossier?.devisePrincipale}</span></span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-4 pt-8">
                    <button onClick={saveFacture} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                       <CheckCircle size={18} /> ENREGISTRER LE BROUILLON
                    </button>
                    <button onClick={() => setShowForm(false)} className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all uppercase tracking-widest">
                       ANNULER
                    </button>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
           <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex gap-4">
                 <div className="px-5 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                       <Receipt size={16} />
                    </div>
                    <div>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Facturé</p>
                       <p className="text-sm font-black text-slate-900">{factures.reduce((s, f) => s + f.lignes.reduce((s2, l) => s2 + l.quantite * l.prixUnitaire * 1.18, 0), 0).toLocaleString()} {currentDossier?.devisePrincipale}</p>
                    </div>
                 </div>
              </div>
              <div className="relative">
                 <input className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold w-64 shadow-sm" placeholder="Rechercher facture..." />
                 <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
              </div>
           </div>

           <div className="flex-1 overflow-auto">
              <table className="w-full text-left">
                 <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-100">
                    <tr>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">N° Facture</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total TTC</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Statut</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {factures.length === 0 ? (
                      <tr><td colSpan={6} className="px-8 py-24 text-center text-slate-400 italic font-medium">Aucun document de vente enregistré.</td></tr>
                    ) : factures.map(f => (
                      <tr key={f.id} className="group hover:bg-slate-50 transition-colors">
                         <td className="px-8 py-5 font-black text-indigo-600">{f.numero}</td>
                         <td className="px-8 py-5 font-bold text-slate-900">{f.clientNom}</td>
                         <td className="px-8 py-5 text-sm font-medium text-slate-500">{format(new Date(f.date), 'dd MMM yyyy')}</td>
                         <td className="px-8 py-5 text-right font-black text-slate-900">{(f.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire * 1.18, 0)).toLocaleString()}</td>
                         <td className="px-8 py-5">
                            <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase">
                               {f.statut}
                            </span>
                          </td>
                         <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2">
                               <button title="Visualiser" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                  <Eye size={18} />
                               </button>
                               {f.statut === 'Brouillon' && (
                                 <button onClick={() => comptabiliserFacture(f)} title="Injection Comptable" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                                    <Send size={18} />
                                 </button>
                               )}
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
}
