import { useStore } from '../../store/useStore';
import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export default function CompteResultat() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const dossiers = useStore(state => state.dossiers);
  const currentDossier = dossiers.find(d => d.id === currentDossierId);
  
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);

  const stats = useMemo(() => {
    let totalProduits = 0;
    let totalCharges = 0;

    lignesEcriture.forEach(ligne => {
      const compte = comptes.find(c => c.id === ligne.compteGeneralId);
      if (!compte) return;

      if (compte.numero.startsWith('7')) {
        totalProduits += (ligne.credit - ligne.debit);
      } else if (compte.numero.startsWith('6')) {
        totalCharges += (ligne.debit - ligne.credit);
      }
    });

    const resultatNet = totalProduits - totalCharges;

    return { totalProduits, totalCharges, resultatNet };
  }, [comptes, lignesEcriture]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <TrendingUp className="mr-2 text-primary" />
          Compte de résultat
        </h1>
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 print:hidden"
        >
          Imprimer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 print:border-none print:shadow-none max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold uppercase">{currentDossier?.raisonSociale}</h2>
          <h3 className="text-lg font-semibold text-slate-700 mt-2">COMPTE DE RÉSULTAT</h3>
          <p className="text-slate-500 text-sm">Exercice clos le {currentDossier?.dateFinExercice}</p>
        </div>

        <div className="space-y-6">
          {/* Produits */}
          <div>
            <h4 className="font-bold text-lg border-b-2 border-emerald-600 pb-2 mb-4 text-emerald-800">PRODUITS (Classe 7)</h4>
            <div className="space-y-3">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Chiffre d'affaires</span>
                <span>{stats.totalProduits.toLocaleString('fr-FR')} {currentDossier?.devisePrincipale}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700 border-t border-slate-200 pt-2 mt-2">
                <span>TOTAL DES PRODUITS</span>
                <span>{stats.totalProduits.toLocaleString('fr-FR')} {currentDossier?.devisePrincipale}</span>
              </div>
            </div>
          </div>

          {/* Charges */}
          <div>
            <h4 className="font-bold text-lg border-b-2 border-rose-600 pb-2 mb-4 text-rose-800">CHARGES (Classe 6)</h4>
            <div className="space-y-3">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Total des charges d'exploitation</span>
                <span>{stats.totalCharges.toLocaleString('fr-FR')} {currentDossier?.devisePrincipale}</span>
              </div>
              <div className="flex justify-between font-bold text-rose-700 border-t border-slate-200 pt-2 mt-2">
                <span>TOTAL DES CHARGES</span>
                <span>{stats.totalCharges.toLocaleString('fr-FR')} {currentDossier?.devisePrincipale}</span>
              </div>
            </div>
          </div>

          {/* Resultat */}
          <div className="mt-8 pt-6 border-t-4 border-slate-800">
            <div className="flex justify-between items-center text-xl font-bold">
              <span className="uppercase">RÉSULTAT NET</span>
              <span className={stats.resultatNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                {stats.resultatNet.toLocaleString('fr-FR')} {currentDossier?.devisePrincipale}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
