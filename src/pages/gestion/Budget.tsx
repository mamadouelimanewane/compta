import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { BarChart2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MOIS = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];

interface LigneBudget {
  mois: number; // 0-11
  categorie: string;
  type: 'Produit' | 'Charge';
  budgetMontant: number;
}

const CATEGORIES_PRODUITS = ["Chiffre d'affaires", "Autres produits"];
const CATEGORIES_CHARGES = ["Achats de marchandises", "Charges de personnel", "Charges externes", "Dotations amortissements", "Impôts et taxes"];

export default function Budget() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);

  const annee = new Date().getFullYear();

  const [budgets, setBudgets] = useState<LigneBudget[]>(() => {
    // Initialize with default budget
    const initial: LigneBudget[] = [];
    MOIS.forEach((_, i) => {
      CATEGORIES_PRODUITS.forEach(cat => initial.push({ mois: i, categorie: cat, type: 'Produit', budgetMontant: 0 }));
      CATEGORIES_CHARGES.forEach(cat => initial.push({ mois: i, categorie: cat, type: 'Charge', budgetMontant: 0 }));
    });
    return initial;
  });
  
  const [activeTab, setActiveTab] = useState<'saisie' | 'comparatif'>('comparatif');

  // Calculate real amounts from ledger
  const reelParMois = useMemo(() => {
    const result: Record<number, { produits: number; charges: number }> = {};
    for (let i = 0; i < 12; i++) result[i] = { produits: 0, charges: 0 };

    lignesEcriture.forEach(ligne => {
      const compte = comptes.find(c => c.id === ligne.compteGeneralId);
      if (!compte) return;
      const mois = new Date(ligne.date).getMonth();
      if (compte.numero.startsWith('7')) result[mois].produits += ligne.credit - ligne.debit;
      if (compte.numero.startsWith('6')) result[mois].charges += ligne.debit - ligne.credit;
    });

    return result;
  }, [lignesEcriture, comptes]);

  const chartData = MOIS.map((mois, i) => ({
    mois,
    'Budget Produits': budgets.filter(b => b.mois === i && b.type === 'Produit').reduce((s, b) => s + b.budgetMontant, 0),
    'Réel Produits': Math.max(0, reelParMois[i]?.produits || 0),
    'Budget Charges': budgets.filter(b => b.mois === i && b.type === 'Charge').reduce((s, b) => s + b.budgetMontant, 0),
    'Réel Charges': Math.max(0, reelParMois[i]?.charges || 0),
  }));

  const totalBudgetProduits = budgets.filter(b => b.type === 'Produit').reduce((s, b) => s + b.budgetMontant, 0);
  const totalBudgetCharges = budgets.filter(b => b.type === 'Charge').reduce((s, b) => s + b.budgetMontant, 0);
  const totalReelProduits = Object.values(reelParMois).reduce((s, v) => s + Math.max(0, v.produits), 0);
  const totalReelCharges = Object.values(reelParMois).reduce((s, v) => s + Math.max(0, v.charges), 0);

  const ecartProduits = totalReelProduits - totalBudgetProduits;
  const ecartCharges = totalReelCharges - totalBudgetCharges;

  const updateBudget = (mois: number, categorie: string, type: 'Produit' | 'Charge', value: number) => {
    setBudgets(prev => prev.map(b => b.mois === mois && b.categorie === categorie && b.type === type ? { ...b, budgetMontant: value } : b));
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <BarChart2 className="mr-2 text-primary" />
          Contrôle de Gestion — Budget {annee}
        </h1>
        <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'comparatif' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`} onClick={() => setActiveTab('comparatif')}>Tableau de Bord</button>
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'saisie' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`} onClick={() => setActiveTab('saisie')}>Saisie du Budget</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Budget Produits', val: totalBudgetProduits, icon: <TrendingUp size={20} />, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Réel Produits', val: totalReelProduits, icon: <TrendingUp size={20} />, color: 'text-emerald-700 bg-emerald-100' },
          { label: 'Budget Charges', val: totalBudgetCharges, icon: <TrendingDown size={20} />, color: 'text-rose-600 bg-rose-50' },
          { label: 'Réel Charges', val: totalReelCharges, icon: <TrendingDown size={20} />, color: 'text-rose-700 bg-rose-100' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${kpi.color}`}>{kpi.icon}</div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-xl font-bold text-slate-900">{kpi.val.toLocaleString('fr-FR', { minimumFractionDigits: 0 })}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {ecartCharges > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 flex items-center">
          <AlertTriangle size={18} className="mr-3 flex-shrink-0" />
          <span className="font-medium">Alerte dépassement :</span>&nbsp;Les charges réelles dépassent le budget de&nbsp;<strong>{ecartCharges.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {' '} FCFA</strong>. Veuillez analyser les postes de dépenses.
        </div>
      )}
      {ecartProduits < 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg px-4 py-3 flex items-center">
          <AlertTriangle size={18} className="mr-3 flex-shrink-0" />
          <span className="font-medium">Sous-performance commerciale :</span>&nbsp;Le chiffre d'affaires réel est en dessous du budget de&nbsp;<strong>{Math.abs(ecartProduits).toLocaleString('fr-FR')} FCFA</strong>.
        </div>
      )}

      {activeTab === 'comparatif' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex-1">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Comparatif Budget vs Réel — Mensuel ({annee})</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => typeof v === 'number' ? v.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : String(v ?? 0)} />
              <Legend />
              <Bar dataKey="Budget Produits" fill="#c7d2fe" radius={[4,4,0,0]} />
              <Bar dataKey="Réel Produits" fill="#6366f1" radius={[4,4,0,0]} />
              <Bar dataKey="Budget Charges" fill="#fecdd3" radius={[4,4,0,0]} />
              <Bar dataKey="Réel Charges" fill="#f43f5e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'saisie' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-auto flex-1">
          <table className="w-full text-sm min-w-[1200px]">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase w-48">Catégorie</th>
                {MOIS.map(m => <th key={m} className="px-2 py-3 text-center text-xs font-semibold text-slate-500 uppercase w-20">{m}</th>)}
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase w-28">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={14} className="px-4 py-2 bg-emerald-50 text-emerald-800 font-semibold text-xs uppercase">PRODUITS</td></tr>
              {CATEGORIES_PRODUITS.map(cat => {
                const total = budgets.filter(b => b.categorie === cat && b.type === 'Produit').reduce((s, b) => s + b.budgetMontant, 0);
                return (
                  <tr key={cat} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-1.5 text-slate-700 text-xs font-medium">{cat}</td>
                    {MOIS.map((_, i) => {
                      const b = budgets.find(b => b.mois === i && b.categorie === cat && b.type === 'Produit');
                      return <td key={i} className="px-1 py-1"><input type="number" className="w-full px-2 py-1 border border-slate-200 rounded text-right text-xs focus:ring-1 focus:ring-primary" value={b?.budgetMontant || 0} onChange={e => updateBudget(i, cat, 'Produit', +e.target.value)} /></td>;
                    })}
                    <td className="px-4 py-1.5 text-right font-bold text-emerald-700">{total.toLocaleString('fr-FR')}</td>
                  </tr>
                );
              })}
              <tr><td colSpan={14} className="px-4 py-2 bg-rose-50 text-rose-800 font-semibold text-xs uppercase">CHARGES</td></tr>
              {CATEGORIES_CHARGES.map(cat => {
                const total = budgets.filter(b => b.categorie === cat && b.type === 'Charge').reduce((s, b) => s + b.budgetMontant, 0);
                return (
                  <tr key={cat} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-1.5 text-slate-700 text-xs font-medium">{cat}</td>
                    {MOIS.map((_, i) => {
                      const b = budgets.find(b => b.mois === i && b.categorie === cat && b.type === 'Charge');
                      return <td key={i} className="px-1 py-1"><input type="number" className="w-full px-2 py-1 border border-slate-200 rounded text-right text-xs focus:ring-1 focus:ring-primary" value={b?.budgetMontant || 0} onChange={e => updateBudget(i, cat, 'Charge', +e.target.value)} /></td>;
                    })}
                    <td className="px-4 py-1.5 text-right font-bold text-rose-700">{total.toLocaleString('fr-FR')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
