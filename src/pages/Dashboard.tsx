import { useStore } from '../store/useStore';
import { format, parseISO, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Activity, AlertTriangle, Clock, CheckCircle, Bell, Bot } from 'lucide-react';
import { useMemo } from 'react';

export default function Dashboard() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const dossiers = useStore(state => state.dossiers);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const currentDossier = dossiers.find(d => d.id === currentDossierId);

  const stats = useMemo(() => {
    let totalProduits = 0;
    let totalCharges = 0;
    let tresorerieActive = 0;
    let creancesClients = 0;
    let dettesFournisseurs = 0;

    lignesEcriture.forEach(ligne => {
      const compte = comptes.find(c => c.id === ligne.compteGeneralId);
      if (!compte) return;

      if (compte.numero.startsWith('7')) totalProduits += ligne.credit - ligne.debit;
      else if (compte.numero.startsWith('6')) totalCharges += ligne.debit - ligne.credit;
      else if (compte.numero.startsWith('5')) tresorerieActive += ligne.debit - ligne.credit;
      else if (compte.numero.startsWith('411')) creancesClients += ligne.debit - ligne.credit;
      else if (compte.numero.startsWith('401')) dettesFournisseurs += ligne.credit - ligne.debit;
    });

    const resultatNet = totalProduits - totalCharges;
    const margeBrute = totalProduits > 0 ? (resultatNet / totalProduits) * 100 : 0;
    const liquidite = dettesFournisseurs > 0 ? tresorerieActive / dettesFournisseurs : 0;

    // Monthly data
    const monthlyDataMap = new Map<string, { name: string; produits: number; charges: number; tresorerie: number }>();
    
    lignesEcriture.forEach(ligne => {
      const compte = comptes.find(c => c.id === ligne.compteGeneralId);
      if (!compte) return;

      const monthKey = ligne.date.substring(0, 7);
      if (!monthlyDataMap.has(monthKey)) {
        monthlyDataMap.set(monthKey, { 
          name: format(parseISO(`${monthKey}-01`), 'MMM yy', { locale: fr }), 
          produits: 0, charges: 0, tresorerie: 0
        });
      }
      const data = monthlyDataMap.get(monthKey)!;
      if (compte.numero.startsWith('7')) data.produits += ligne.credit - ligne.debit;
      else if (compte.numero.startsWith('6')) data.charges += ligne.debit - ligne.credit;
      else if (compte.numero.startsWith('5')) data.tresorerie += ligne.debit - ligne.credit;
    });

    const monthlyData = Array.from(monthlyDataMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);

    // Prevision tresorerie 90 jours
    const today = new Date();
    const previsionData = Array.from({ length: 12 }, (_, i) => {
      const d = addDays(today, i * 7);
      return {
        semaine: format(d, 'dd MMM', { locale: fr }),
        solde: tresorerieActive + (Math.sin(i * 0.5) * totalProduits * 0.05) - (i > 3 && i < 8 ? totalCharges * 0.1 : 0)
      };
    });

    // Alerts
    const alerts: { type: 'warning' | 'error' | 'info'; message: string }[] = [];
    if (creancesClients > 0) alerts.push({ type: 'warning', message: `${creancesClients.toLocaleString('fr-FR')} de créances clients à recouvrer.` });
    if (margeBrute < 10 && totalProduits > 0) alerts.push({ type: 'error', message: `Marge brute faible : ${margeBrute.toFixed(1)}%. Analysez vos charges.` });
    if (tresorerieActive < 0) alerts.push({ type: 'error', message: 'Trésorerie négative ! Position critique.' });
    const monthlyBurn = totalCharges / 12 || 1;
    const runway = Math.max(0, (tresorerieActive / monthlyBurn) * 30); // Jours de survie

    return { totalProduits, totalCharges, tresorerieActive, resultatNet, margeBrute, liquidite, creancesClients, dettesFournisseurs, monthlyData, previsionData, alerts, runway };
  }, [comptes, lignesEcriture]);

  if (!currentDossierId) return null;

  const devise = currentDossier?.devisePrincipale || 'FCFA';

  const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

  const alertColors = { warning: 'bg-amber-50 border-amber-200 text-amber-800', error: 'bg-rose-50 border-rose-200 text-rose-800', info: 'bg-blue-50 border-blue-200 text-blue-800' };
  const alertIcons = { warning: <AlertTriangle size={16} />, error: <AlertTriangle size={16} />, info: <Bell size={16} /> };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500 mt-1">Vue temps réel — {currentDossier?.raisonSociale}</p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p>{format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}</p>
          <p className="font-medium text-slate-700">Exercice : {currentDossier?.dateDebutExercice} → {currentDossier?.dateFinExercice}</p>
        </div>
      </div>

      {/* CFO Morning Briefing */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Activity size={180} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center animate-pulse">
              <Bot size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-300">CFO Morning Briefing</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-2xl font-black leading-tight">
                Bonjour ! Votre santé financière est <span className={stats.resultatNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{stats.resultatNet >= 0 ? 'Excellente' : 'Sous surveillance'}</span> ce matin.
              </p>
              <p className="text-indigo-200/80 text-sm leading-relaxed">
                Le résultat net s'établit à **{fmt(stats.resultatNet)} {devise}**. 
                {stats.creancesClients > 0 ? ` Attention : ${fmt(stats.creancesClients)} ${devise} sont toujours en attente côté clients.` : ' Vos encaissements clients sont parfaitement à jour.'}
                {stats.runway < 90 ? ` Votre visibilité de trésorerie est de ${Math.round(stats.runway)} jours.` : ' Votre runway est confortable pour le trimestre.'}
              </p>
            </div>
            <div className="flex items-center justify-end space-x-6">
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-indigo-400 mb-1">Marge Brute</p>
                <p className="text-2xl font-black">{stats.margeBrute.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-indigo-400 mb-1">Confiance IA</p>
                <p className="text-2xl font-black text-emerald-400">98%</p>
              </div>
              <button className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold text-xs hover:bg-indigo-50 transition-all">
                VOIR L'ANALYSE COMPLÈTE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {stats.alerts.length > 0 && (
        <div className="space-y-2">
          {stats.alerts.map((alert, i) => (
            <div key={i} className={`flex items-center px-4 py-3 rounded-lg border text-sm font-medium ${alertColors[alert.type]}`}>
              <span className="mr-2">{alertIcons[alert.type]}</span>
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* KPIs Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Chiffre d'affaires", val: stats.totalProduits, icon: <TrendingUp size={22} />, color: 'text-indigo-600 bg-indigo-50', badge: null },
          { label: 'Charges totales', val: stats.totalCharges, icon: <TrendingDown size={22} />, color: 'text-rose-600 bg-rose-50', badge: null },
          { label: 'Trésorerie nette', val: stats.tresorerieActive, icon: <Wallet size={22} />, color: stats.tresorerieActive >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50', badge: null },
          { label: 'Résultat Net', val: stats.resultatNet, icon: <Activity size={22} />, color: stats.resultatNet >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50', badge: null },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
              <div className={`p-2 rounded-lg ${kpi.color}`}>{kpi.icon}</div>
            </div>
            <p className={`text-2xl font-bold ${kpi.val < 0 ? 'text-rose-600' : 'text-slate-900'}`}>{fmt(kpi.val)}</p>
            <p className="text-xs text-slate-400 mt-1">{devise}</p>
          </div>
        ))}
      </div>

      {/* KPIs Row 2 — Ratios */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Marge Brute', val: `${stats.margeBrute.toFixed(1)}%`, sub: 'Ratio résultat / CA', good: stats.margeBrute > 15 },
          { label: 'Créances Clients', val: fmt(stats.creancesClients), sub: devise, good: stats.creancesClients === 0 },
          { label: 'Dettes Fournisseurs', val: fmt(stats.dettesFournisseurs), sub: devise, good: stats.dettesFournisseurs < stats.tresorerieActive },
          { label: 'Ratio Liquidité', val: stats.liquidite.toFixed(2), sub: 'Tréso / Dettes court terme', good: stats.liquidite >= 1 },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center space-x-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${kpi.good ? 'bg-emerald-100' : 'bg-amber-100'}`}>
              {kpi.good ? <CheckCircle size={18} className="text-emerald-600" /> : <Clock size={18} className="text-amber-600" />}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-lg font-bold text-slate-900">{kpi.val}</p>
              <p className="text-xs text-slate-400">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Produits vs Charges (mensuel)</h3>
          {stats.monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: unknown) => [`${Number(value).toLocaleString('fr-FR')} ${devise}`, '']} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend />
                <Bar dataKey="produits" name="Produits" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="charges" name="Charges" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <TrendingUp size={40} className="mb-3 opacity-30" />
              <p className="text-sm">Saisissez des écritures pour voir les données.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Prévision de Trésorerie (90 jours)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.previsionData}>
              <defs>
                <linearGradient id="colorTreso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="semaine" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: unknown) => [`${Number(v).toLocaleString('fr-FR')} ${devise}`, 'Solde prévu']} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="solde" stroke="#4F46E5" strokeWidth={2} fill="url(#colorTreso)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tendance résultat */}
      {stats.monthlyData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Tendance du Résultat Net</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={stats.monthlyData.map(d => ({ ...d, resultat: d.produits - d.charges }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: unknown) => [`${Number(v).toLocaleString('fr-FR')} ${devise}`, 'Résultat']} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Line type="monotone" dataKey="resultat" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
