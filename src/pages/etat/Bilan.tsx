import ExportActions from '../../components/ExportActions';

export default function Bilan() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);

  const stats = useMemo(() => {
    let actifImmo = 0; let actifCirc = 0; let tresoActif = 0;
    let capitauxPropres = 0; let dettesFin = 0; let passifCirc = 0; let tresoPassif = 0;
    let totalProduits = 0; let totalCharges = 0;

    lignes.forEach(ligne => {
      const c = comptes.find(compte => compte.id === ligne.compteGeneralId || compte.numero === ligne.compteGeneralId);
      if (!c) return;
      const solde = ligne.debit - ligne.credit;

      if (c.numero.startsWith('1')) {
        if (c.numero.startsWith('16')) dettesFin += -solde;
        else capitauxPropres += -solde;
      }
      else if (c.numero.startsWith('2')) actifImmo += solde;
      else if (c.numero.startsWith('3')) actifCirc += solde;
      else if (c.numero.startsWith('4')) {
        if (solde > 0) actifCirc += solde;
        else passifCirc += -solde;
      }
      else if (c.numero.startsWith('5')) {
        if (solde > 0) tresoActif += solde;
        else tresoPassif += -solde;
      }
      else if (c.numero.startsWith('6')) totalCharges += solde;
      else if (c.numero.startsWith('7')) totalProduits += -solde;
    });

    const resultatNet = totalProduits - totalCharges;
    const statsObj = {
      actifImmo, actifCirc, tresoActif, totalActif: actifImmo + actifCirc + tresoActif,
      capitauxPropres, dettesFin, passifCirc, tresoPassif, totalPassif: capitauxPropres + dettesFin + passifCirc + tresoPassif,
      resultatNet
    };
    
    // For capitaux propres display we need the updated value
    statsObj.capitauxPropres += resultatNet;
    
    return statsObj;
  }, [comptes, lignes]);

  const exportData = useMemo(() => [
    { Poste: 'ACTIF IMMOBILISE', Montant: stats.actifImmo },
    { Poste: 'ACTIF CIRCULANT', Montant: stats.actifCirc },
    { Poste: 'TRESORERIE ACTIF', Montant: stats.tresoActif },
    { Poste: 'TOTAL ACTIF', Montant: stats.totalActif },
    { Poste: 'CAPITAUX PROPRES', Montant: stats.capitauxPropres },
    { Poste: 'DETTES FINANCIERES', Montant: stats.dettesFin },
    { Poste: 'PASSIF CIRCULANT', Montant: stats.passifCirc },
    { Poste: 'TRESORERIE PASSIF', Montant: stats.tresoPassif },
    { Poste: 'TOTAL PASSIF', Montant: stats.totalPassif },
    { Poste: 'RESULTAT NET', Montant: stats.resultatNet },
  ], [stats]);

  const formatCcy = (v: number) => v.toLocaleString('fr-FR', { minimumFractionDigits: 0 });

  return (
    <div className="space-y-12 p-4 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Landmark size={32} />
             </div>
             Bilan de Situation
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Vision patrimoniale certifiée OHADA — Clôture Provisoire.</p>
        </div>
        <ExportActions 
          data={exportData} 
          filename={`bilan_${format(new Date(), 'yyyy-MM-dd')}`} 
          title="Bilan de Situation" 
        />
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden print:border-none print:shadow-none">
         <div className="bg-slate-900 p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10"><Sparkles size={120} /></div>
            <h2 className="text-3xl font-black tracking-tight uppercase">{currentDossier?.raisonSociale}</h2>
            <p className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px] mt-4">État de Synthèse Patrimoniale — Exercice {new Date().getFullYear()}</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-slate-50">
            {/* ACTIF */}
            <div className="p-16 space-y-12">
               <div className="flex justify-between items-center border-b-4 border-slate-900 pb-4">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">ACTIF</h3>
                  <div className="px-4 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black tracking-widest">EMPLOIS</div>
               </div>
               
               <div className="space-y-10">
                  <div className="flex justify-between items-end group">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Actif Immobilisé</p>
                        <p className="text-sm font-bold text-slate-700">Immos Corporelles & Incorporelles</p>
                     </div>
                     <p className="text-2xl font-black text-slate-900">{formatCcy(stats.actifImmo)}</p>
                  </div>
                  <div className="flex justify-between items-end group">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Actif Circulant</p>
                        <p className="text-sm font-bold text-slate-700">Stocks, Créances Clients & Tiers</p>
                     </div>
                     <p className="text-2xl font-black text-slate-900">{formatCcy(stats.actifCirc)}</p>
                  </div>
                  <div className="flex justify-between items-end group">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trésorerie Actif</p>
                        <p className="text-sm font-bold text-slate-700">Disponibilités & Banques (+)</p>
                     </div>
                     <p className="text-2xl font-black text-indigo-600">{formatCcy(stats.tresoActif)}</p>
                  </div>
               </div>

               <div className="pt-10 border-t border-slate-900 mt-20 flex justify-between items-center">
                  <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Total Actif</span>
                  <span className="text-4xl font-black text-slate-900">{formatCcy(stats.totalActif)}</span>
               </div>
            </div>

            {/* PASSIF */}
            <div className="p-16 space-y-12 bg-slate-50/30">
               <div className="flex justify-between items-center border-b-4 border-slate-900 pb-4">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">PASSIF</h3>
                  <div className="px-4 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black tracking-widest">RESSOURCES</div>
               </div>

               <div className="space-y-10">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Capitaux Propres</p>
                        <p className="text-sm font-bold text-slate-700">Capital, Réserves & Résultat</p>
                     </div>
                     <div className="text-right">
                        <p className="text-2xl font-black text-slate-900">{formatCcy(stats.capitauxPropres)}</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 italic">Dont Résultat : {formatCcy(stats.resultatNet)}</p>
                     </div>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dettes Financières</p>
                        <p className="text-sm font-bold text-slate-700">Emprunts & Dettes à LT</p>
                     </div>
                     <p className="text-2xl font-black text-slate-900">{formatCcy(stats.dettesFin)}</p>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Passif Circulant</p>
                        <p className="text-sm font-bold text-slate-700">Dettes Fournisseurs, Fiscales & Sociales</p>
                     </div>
                     <p className="text-2xl font-black text-slate-900">{formatCcy(stats.passifCirc)}</p>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trésorerie Passif</p>
                        <p className="text-sm font-bold text-slate-700">Concours Bancaires & Découverts</p>
                     </div>
                     <p className="text-2xl font-black text-rose-600">{formatCcy(stats.tresoPassif)}</p>
                  </div>
               </div>

               <div className="pt-10 border-t border-slate-900 mt-10 flex justify-between items-center">
                  <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Total Passif</span>
                  <span className="text-4xl font-black text-slate-900">{formatCcy(stats.totalPassif)}</span>
               </div>
            </div>
         </div>

         <div className="bg-slate-900 p-8 flex justify-center">
            <div className="flex items-center gap-6 text-white">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${Math.abs(stats.totalActif - stats.totalPassif) < 1 ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}>
                  <ShieldCheck size={24} />
               </div>
               <div>
                  <p className="text-xs font-black uppercase tracking-widest">{Math.abs(stats.totalActif - stats.totalPassif) < 1 ? 'BILAN ÉQUILIBRÉ & CERTIFIÉ' : 'ÉCART DE BILAN DÉTECTÉ'}</p>
                  <p className="text-[10px] font-black text-white/40 italic uppercase tracking-widest">Intégrité de structure vérifiée par DIAWDI Seal</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

