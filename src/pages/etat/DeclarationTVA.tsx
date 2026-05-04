import { format } from 'date-fns';
import ExportActions from '../../components/ExportActions';

export default function DeclarationTVA() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);

  const [periode, setPeriode] = useState(format(new Date(), 'yyyy-MM'));

  const statsTVA = useMemo(() => {
    // Basic rules OHADA/French TVA
    // 4452: TVA Due Intracommunautaire
    // 4456: TVA Déductible
    // 4457: TVA Collectée
    
    let tvaCollectee = 0;
    let tvaDeductible = 0;
    let caHT = 0;

    const [year, month] = periode.split('-');
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    lignesEcriture.filter(l => l.date >= startDate && l.date <= endDate).forEach(ligne => {
      const compte = comptes.find(c => c.id === ligne.compteGeneralId);
      if (!compte) return;

      if (compte.numero.startsWith('4457')) {
        tvaCollectee += ligne.credit - ligne.debit;
      } else if (compte.numero.startsWith('4456')) {
        tvaDeductible += ligne.debit - ligne.credit;
      } else if (compte.numero.startsWith('7')) {
        caHT += ligne.credit - ligne.debit;
      }
    });

    const tvaNette = tvaCollectee - tvaDeductible;

    return {
      caHT: Math.max(0, caHT),
      tvaCollectee: Math.max(0, tvaCollectee),
      tvaDeductible: Math.max(0, tvaDeductible),
      tvaAPayer: tvaNette > 0 ? tvaNette : 0,
      creditTVA: tvaNette < 0 ? Math.abs(tvaNette) : 0
    };
  }, [lignesEcriture, comptes, periode]);

  const exportData = useMemo(() => [
    { Libelle: "Chiffre d'affaires HT", Montant: statsTVA.caHT },
    { Libelle: "TVA Collectée", Montant: statsTVA.tvaCollectee },
    { Libelle: "TVA Déductible", Montant: statsTVA.tvaDeductible },
    { Libelle: "TVA à Payer", Montant: statsTVA.tvaAPayer },
    { Libelle: "Crédit de TVA", Montant: statsTVA.creditTVA },
  ], [statsTVA]);

  const formatDevise = (montant: number) => {
    return montant.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Calculator className="mr-2 text-primary" />
          Déclaration de TVA (Automatisée)
        </h1>
        <ExportActions 
          data={exportData} 
          filename={`tva_${periode}`} 
          title="Déclaration de TVA" 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-wrap gap-4 items-end print:hidden">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Période de déclaration (Mois)</label>
          <input 
            type="month" 
            className="px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
          />
        </div>
        <div className="flex-1 text-right">
          <p className="text-sm text-slate-500">Régime d'imposition</p>
          <p className="font-medium text-slate-800">Réel Normal</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 print:border-none print:shadow-none">
        <div className="text-center mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold uppercase">{currentDossier?.raisonSociale}</h2>
          <h3 className="text-lg font-semibold text-slate-700 mt-2">DÉCLARATION DE TAXE SUR LA VALEUR AJOUTÉE</h3>
          <p className="text-slate-500 text-sm mt-1">Période : {format(new Date(periode + '-01'), 'MMMM yyyy')}</p>
        </div>

        <div className="space-y-8">
          {/* Cadre A */}
          <div className="border border-slate-800 rounded-sm">
            <div className="bg-slate-800 text-white font-bold px-4 py-2 text-sm uppercase">
              A - Montant des opérations réalisées
            </div>
            <div className="p-4 flex justify-between items-center hover:bg-slate-50">
              <span className="font-medium">01 - Ventes, prestations de services (Chiffre d'affaires HT)</span>
              <span className="font-bold text-lg">{formatDevise(statsTVA.caHT)}</span>
            </div>
          </div>

          {/* Cadre B */}
          <div className="border border-slate-800 rounded-sm">
            <div className="bg-slate-800 text-white font-bold px-4 py-2 text-sm uppercase">
              B - Décompte de la TVA à payer
            </div>
            <div className="divide-y divide-slate-200">
              <div className="p-4 flex justify-between items-center hover:bg-slate-50">
                <span className="font-medium">08 - TVA Brute Collectée</span>
                <span className="font-bold text-lg text-rose-700">{formatDevise(statsTVA.tvaCollectee)}</span>
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-slate-50">
                <span className="font-medium">20 - TVA Déductible sur autres biens et services</span>
                <span className="font-bold text-lg text-emerald-700">{formatDevise(statsTVA.tvaDeductible)}</span>
              </div>
              <div className="p-4 flex justify-between items-center bg-slate-50">
                <span className="font-bold uppercase">28 - TVA Nette Due</span>
                <span className="font-bold text-xl text-rose-800">{formatDevise(statsTVA.tvaAPayer)}</span>
              </div>
              <div className="p-4 flex justify-between items-center bg-emerald-50">
                <span className="font-bold uppercase text-emerald-900">25 - Crédit de TVA</span>
                <span className="font-bold text-xl text-emerald-700">{formatDevise(statsTVA.creditTVA)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-indigo-50 text-indigo-800 rounded-lg">
            <CheckCircle className="mr-3 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="font-medium">Calcul automatisé validé</p>
              <p className="text-sm opacity-90 mt-1">
                Les montants ont été calculés à partir du solde des comptes de racine 4457 (Collectée), 4456 (Déductible) et 7 (Produits) sur la période indiquée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
