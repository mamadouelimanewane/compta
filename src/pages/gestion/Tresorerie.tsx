import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Banknote, AlertCircle, CheckCircle, Clock, Send } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock echéances basées sur les lignes d'écritures tiers ouvertes
type Echeance = {
  id: string;
  type: 'client' | 'fournisseur';
  tiers: string;
  reference: string;
  date: string;
  dateEcheance: string;
  montant: number;
  statut: 'ouvert' | 'partiellement_regle' | 'regle';
  joursRetard: number;
};

export default function Tresorerie() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const comptesTiers = useStore(state => state.comptesTiers).filter(t => t.dossierId === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);

  const [activeTab, setActiveTab] = useState<'encaissements' | 'decaissements' | 'relances'>('encaissements');

  const devise = currentDossier?.devisePrincipale || 'FCFA';
  const today = format(new Date(), 'yyyy-MM-dd');

  // Calculate trésorerie nette
  const tresoNette = useMemo(() => {
    let total = 0;
    lignesEcriture.forEach(l => {
      const c = comptes.find(c => c.id === l.compteGeneralId);
      if (c?.numero.startsWith('5')) total += l.debit - l.credit;
    });
    return total;
  }, [lignesEcriture, comptes]);

  // Build mock échéances from tiers entries (comptes 411 = client, 401 = fournisseur)
  const echeances = useMemo<Echeance[]>(() => {
    const result: Echeance[] = [];

    lignesEcriture.forEach(l => {
      const c = comptes.find(c => c.id === l.compteGeneralId);
      if (!c) return;

      const isClient = c.numero.startsWith('411');
      const isFourn = c.numero.startsWith('401');
      if (!isClient && !isFourn) return;

      const solde = isClient ? (l.debit - l.credit) : (l.credit - l.debit);
      if (solde <= 0) return;

      const tiers = comptesTiers.find(t => t.id === l.compteTiersId);
      const echeanceDate = new Date(l.date);
      echeanceDate.setDate(echeanceDate.getDate() + 30); // Default 30j
      const echeanceDateStr = format(echeanceDate, 'yyyy-MM-dd');
      const joursRetard = differenceInDays(new Date(), echeanceDate);

      result.push({
        id: l.id,
        type: isClient ? 'client' : 'fournisseur',
        tiers: tiers?.intitule || c.intitule,
        reference: l.numeroPiece || '-',
        date: l.date,
        dateEcheance: echeanceDateStr,
        montant: Math.abs(solde),
        statut: joursRetard > 0 ? 'ouvert' : 'ouvert',
        joursRetard: Math.max(0, joursRetard),
      });
    });

    return result;
  }, [lignesEcriture, comptes, comptesTiers]);

  const encaissements = echeances.filter(e => e.type === 'client');
  const decaissements = echeances.filter(e => e.type === 'fournisseur');
  const relances = encaissements.filter(e => e.joursRetard > 0);

  const totalEncaissements = encaissements.reduce((s, e) => s + e.montant, 0);
  const totalDecaissements = decaissements.reduce((s, e) => s + e.montant, 0);

  const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2 });

  const getRetardBadge = (jours: number) => {
    if (jours === 0) return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">À venir</span>;
    if (jours <= 15) return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">{jours}j de retard</span>;
    return <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold">{jours}j de retard</span>;
  };

  const getRelanceNiveau = (jours: number) => {
    if (jours < 15) return { niveau: 'Relance 1 (Amiable)', color: 'text-blue-700' };
    if (jours < 30) return { niveau: 'Relance 2 (Formelle)', color: 'text-amber-700' };
    return { niveau: 'Relance 3 (Mise en demeure)', color: 'text-rose-700' };
  };

  const genererRelance = (e: Echeance) => {
    const relance = getRelanceNiveau(e.joursRetard);
    const texte = `LETTRE DE RELANCE — ${relance.niveau.toUpperCase()}

Monsieur/Madame,

Sauf erreur ou omission de notre part, nous constatons que la facture ${e.reference} d'un montant de ${fmt(e.montant)} ${devise} arrivée à échéance le ${format(new Date(e.dateEcheance), 'dd MMMM yyyy', { locale: fr })} demeure impayée à ce jour.

Nous vous prions de bien vouloir procéder à son règlement dans les meilleurs délais.

Cordialement,
${currentDossier?.raisonSociale}`;
    
    const blob = new Blob([texte], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relance_${e.tiers}_${e.reference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Banknote className="mr-2 text-primary" />
          Module Trésorerie & Relances
        </h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Solde de Trésorerie</p>
          <p className={`text-3xl font-bold ${tresoNette >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmt(tresoNette)}</p>
          <p className="text-xs text-slate-400 mt-1">{devise} — {today}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
          <p className="text-xs font-semibold text-emerald-700 uppercase mb-1">À Encaisser (Clients)</p>
          <p className="text-3xl font-bold text-emerald-800">{fmt(totalEncaissements)}</p>
          <p className="text-xs text-emerald-600 mt-1">{encaissements.length} créance(s) ouverte(s)</p>
        </div>
        <div className="bg-rose-50 rounded-xl border border-rose-200 p-5">
          <p className="text-xs font-semibold text-rose-700 uppercase mb-1">À Décaisser (Fournisseurs)</p>
          <p className="text-3xl font-bold text-rose-800">{fmt(totalDecaissements)}</p>
          <p className="text-xs text-rose-600 mt-1">{decaissements.length} dette(s) ouverte(s)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-1">
        {[
          { id: 'encaissements', label: `Encaissements clients (${encaissements.length})`, icon: <CheckCircle size={14} /> },
          { id: 'decaissements', label: `Décaissements fournisseurs (${decaissements.length})`, icon: <Clock size={14} /> },
          { id: 'relances', label: `Relances en retard (${relances.length})`, icon: <AlertCircle size={14} />, alert: relances.length > 0 },
        ].map(tab => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
            {tab.alert && <span className="ml-2 w-2 h-2 bg-rose-500 rounded-full"></span>}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-auto">
        {activeTab !== 'relances' ? (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Tiers</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Référence</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date pièce</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Échéance</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Montant</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(activeTab === 'encaissements' ? encaissements : decaissements).length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-slate-400">Aucune écriture ouverte sur des comptes de tiers.</td></tr>
              ) : (activeTab === 'encaissements' ? encaissements : decaissements).map(e => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{e.tiers}</td>
                  <td className="px-4 py-3 text-slate-600">{e.reference}</td>
                  <td className="px-4 py-3 text-slate-600">{format(new Date(e.date), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3 text-slate-600">{format(new Date(e.dateEcheance), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">{fmt(e.montant)}</td>
                  <td className="px-4 py-3">{getRetardBadge(e.joursRetard)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-rose-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Référence</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Montant</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Retard</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Niveau de relance</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {relances.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-emerald-600 font-medium">✅ Aucune relance à effectuer. Tous les clients sont à jour !</td></tr>
              ) : relances.map(e => {
                const relance = getRelanceNiveau(e.joursRetard);
                return (
                  <tr key={e.id} className="hover:bg-rose-50/50">
                    <td className="px-4 py-3 font-medium text-slate-800">{e.tiers}</td>
                    <td className="px-4 py-3 text-slate-600">{e.reference}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">{fmt(e.montant)}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold">{e.joursRetard}j</span></td>
                    <td className={`px-4 py-3 text-sm font-semibold ${relance.color}`}>{relance.niveau}</td>
                    <td className="px-4 py-3 flex items-center space-x-2">
                      <button onClick={() => genererRelance(e)} title="Générer lettre de relance" className="flex items-center px-3 py-1.5 bg-rose-600 text-white rounded-md text-xs font-medium hover:bg-rose-700 transition-colors">
                        <Send size={12} className="mr-1" /> Générer Relance
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
