import { useStore } from '../../store/useStore';
import { Activity } from 'lucide-react';
import { useMemo } from 'react';

export default function Bilan() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const dossiers = useStore(state => state.dossiers);
  const currentDossier = dossiers.find(d => d.id === currentDossierId);

  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);

  const stats = useMemo(() => {
    let actifImmobilise = 0;
    let actifCirculant = 0;
    let tresorerieActif = 0;
    
    let capitauxPropres = 0;
    let dettesFinancieres = 0;
    let passifCirculant = 0;
    let tresoreriePassif = 0;
    
    let totalProduits = 0;
    let totalCharges = 0;

    // Calculate balances per account
    const balances = new Map<string, number>();
    
    lignesEcriture.forEach(ligne => {
      const compte = comptes.find(c => c.id === ligne.compteGeneralId);
      if (!compte) return;
      
      const currentBalance = balances.get(compte.numero) || 0;
      // Balance convention: Debit is positive for Actif/Charges, Credit is positive for Passif/Produits
      // Let's just track net balance (Debit - Credit)
      balances.set(compte.numero, currentBalance + (ligne.debit - ligne.credit));
    });

    balances.forEach((solde, numero) => {
      // Classe 1: Capitaux propres et emprunts (Passif) - Solde créditeur normal (donc solde < 0)
      if (numero.startsWith('1')) {
        if (numero.startsWith('16')) dettesFinancieres += Math.abs(solde);
        else capitauxPropres += Math.abs(solde);
      }
      // Classe 2: Immobilisations (Actif) - Solde débiteur normal
      else if (numero.startsWith('2')) {
        actifImmobilise += Math.max(0, solde);
      }
      // Classe 3: Stocks (Actif)
      else if (numero.startsWith('3')) {
        actifCirculant += Math.max(0, solde);
      }
      // Classe 4: Tiers (Actif ou Passif selon le solde)
      else if (numero.startsWith('4')) {
        if (solde > 0) actifCirculant += solde; // Créance (Actif)
        else passifCirculant += Math.abs(solde); // Dette (Passif)
      }
      // Classe 5: Trésorerie
      else if (numero.startsWith('5')) {
        if (solde > 0) tresorerieActif += solde; // Caisse/Banque positive
        else tresoreriePassif += Math.abs(solde); // Découvert
      }
      // Classe 6 & 7: Résultat
      else if (numero.startsWith('6')) {
        totalCharges += solde; // Charges (Débit)
      }
      else if (numero.startsWith('7')) {
        totalProduits += Math.abs(solde); // Produits (Crédit)
      }
    });

    const resultatNet = totalProduits - totalCharges;
    // Résultat ajouté aux capitaux propres
    capitauxPropres += resultatNet;

    const totalActif = actifImmobilise + actifCirculant + tresorerieActif;
    const totalPassif = capitauxPropres + dettesFinancieres + passifCirculant + tresoreriePassif;

    return {
      actifImmobilise,
      actifCirculant,
      tresorerieActif,
      totalActif,
      capitauxPropres,
      dettesFinancieres,
      passifCirculant,
      tresoreriePassif,
      totalPassif,
      resultatNet
    };
  }, [comptes, lignesEcriture]);

  const formatDevise = (montant: number) => {
    return montant.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Activity className="mr-2 text-primary" />
          Bilan Comptable
        </h1>
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 print:hidden"
        >
          Imprimer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 print:border-none print:shadow-none">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold uppercase">{currentDossier?.raisonSociale}</h2>
          <h3 className="text-lg font-semibold text-slate-700 mt-2">BILAN ACTIF ET PASSIF</h3>
          <p className="text-slate-500 text-sm">Exercice clos le {currentDossier?.dateFinExercice}</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Actif */}
          <div>
            <h4 className="font-bold text-lg border-b-2 border-slate-800 pb-2 mb-4">ACTIF</h4>
            <div className="space-y-4">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Actif Immobilisé (Classe 2)</span>
                <span>{formatDevise(stats.actifImmobilise)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Actif Circulant (Classes 3 & 4)</span>
                <span>{formatDevise(stats.actifCirculant)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Trésorerie Actif (Classe 5)</span>
                <span>{formatDevise(stats.tresorerieActif)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-300 pt-2 mt-4">
                <span>TOTAL ACTIF</span>
                <span>{formatDevise(stats.totalActif)}</span>
              </div>
            </div>
          </div>

          {/* Passif */}
          <div>
            <h4 className="font-bold text-lg border-b-2 border-slate-800 pb-2 mb-4">PASSIF</h4>
            <div className="space-y-4">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Capitaux Propres (Classe 1)</span>
                <span>{formatDevise(stats.capitauxPropres)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-700 text-sm pl-4 text-emerald-600">
                <span>Dont Résultat Net de l'exercice</span>
                <span>{formatDevise(stats.resultatNet)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Dettes Financières (Classe 1)</span>
                <span>{formatDevise(stats.dettesFinancieres)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Passif Circulant (Classe 4)</span>
                <span>{formatDevise(stats.passifCirculant)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Trésorerie Passif (Classe 5)</span>
                <span>{formatDevise(stats.tresoreriePassif)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-300 pt-2 mt-4">
                <span>TOTAL PASSIF</span>
                <span>{formatDevise(stats.totalPassif)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Verification Check */}
        {Math.abs(stats.totalActif - stats.totalPassif) > 0.01 && (
          <div className="mt-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-sm font-medium text-center print:hidden">
            ⚠️ Attention : L'Actif et le Passif ne sont pas équilibrés. Écart : {formatDevise(Math.abs(stats.totalActif - stats.totalPassif))}. Veuillez vérifier vos écritures ou les comptes d'attente.
          </div>
        )}
      </div>
    </div>
  );
}
