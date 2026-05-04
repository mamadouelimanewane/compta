import { useStore } from '../../store/useStore';
import { Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { format, parseISO, addYears } from 'date-fns';

export default function FinExercice() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const dossiers = useStore(state => state.dossiers);
  const currentDossier = dossiers.find(d => d.id === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  
  const createDossier = useStore(state => state.createDossier);
  const addCompte = useStore(state => state.addCompte);
  const addLigneEcriture = useStore(state => state.addLigneEcriture);

  const [etape, setEtape] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [genererANouveaux, setGenererANouveaux] = useState(true);

  const handleCloture = () => {
    if (!currentDossier) return;
    setIsProcessing(true);

    setTimeout(() => {
      const startDate = parseISO(currentDossier.dateDebutExercice);
      const endDate = parseISO(currentDossier.dateFinExercice);
      
      const newDossier = createDossier({
        raisonSociale: currentDossier.raisonSociale,
        adresse: currentDossier.adresse,
        ville: currentDossier.ville,
        siret: currentDossier.siret,
        codeNaf: currentDossier.codeNaf,
        dateDebutExercice: format(addYears(startDate, 1), 'yyyy-MM-dd'),
        dateFinExercice: format(addYears(endDate, 1), 'yyyy-MM-dd'),
        longueurComptes: currentDossier.longueurComptes,
        devisePrincipale: currentDossier.devisePrincipale
      });

      comptes.forEach(compte => {
        addCompte({
          dossierId: newDossier.id,
          numero: compte.numero,
          intitule: compte.intitule,
          nature: compte.nature,
          type: compte.type,
          saisieAnalytique: compte.saisieAnalytique,
          saisieEcheance: compte.saisieEcheance,
          lettrageAutomatique: compte.lettrageAutomatique
        });
      });

      if (genererANouveaux) {
        const balances = new Map<string, number>();
        lignesEcriture.forEach(l => {
          const compte = comptes.find(c => c.id === l.compteGeneralId);
          if (compte && (compte.numero.startsWith('1') || compte.numero.startsWith('2') || compte.numero.startsWith('3') || compte.numero.startsWith('4') || compte.numero.startsWith('5'))) {
            const current = balances.get(compte.numero) || 0;
            balances.set(compte.numero, current + (l.debit - l.credit));
          }
        });

        let totalProduits = 0;
        let totalCharges = 0;
        lignesEcriture.forEach(l => {
          const compte = comptes.find(c => c.id === l.compteGeneralId);
          if (compte) {
            if (compte.numero.startsWith('7')) totalProduits += (l.credit - l.debit);
            if (compte.numero.startsWith('6')) totalCharges += (l.debit - l.credit);
          }
        });
        const resultValue = totalProduits - totalCharges;

        const newJournaux = useStore.getState().journaux.filter(j => j.dossierId === newDossier.id);
        const ranJournal = newJournaux.find(j => j.code === 'RAN');
        const newComptes = useStore.getState().comptes.filter(c => c.dossierId === newDossier.id);

        if (ranJournal) {
          balances.forEach((solde, numero) => {
            const newCompte = newComptes.find(c => c.numero === numero);
            if (newCompte && Math.abs(solde) > 0.001) {
              addLigneEcriture({
                dossierId: newDossier.id,
                journalId: ranJournal.id,
                date: newDossier.dateDebutExercice,
                numeroPiece: "AN-" + format(startDate, 'yyyy'),
                reference: "REPORT A NOUVEAU",
                compteGeneralId: newCompte.id,
                libelle: "Report à nouveau " + numero,
                debit: solde > 0 ? solde : 0,
                credit: solde < 0 ? Math.abs(solde) : 0,
                validee: true
              });
            }
          });

          const resultCompte = newComptes.find(c => c.numero === '131000');
          if (resultCompte && Math.abs(resultValue) > 0.001) {
            addLigneEcriture({
              dossierId: newDossier.id,
              journalId: ranJournal.id,
              date: newDossier.dateDebutExercice,
              numeroPiece: "AN-" + format(startDate, 'yyyy'),
              reference: "RESULTAT EXERCICE",
              compteGeneralId: resultCompte.id,
              libelle: "Résultat net exercice précédent",
              debit: resultValue < 0 ? Math.abs(resultValue) : 0,
              credit: resultValue > 0 ? resultValue : 0,
              validee: true
            });
          }
        }
      }

      setIsProcessing(false);
      setEtape(3);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Calendar className="mr-2 text-indigo-600" />
          Fin d'exercice
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-medium text-slate-800">Assistant de clôture d'exercice</h2>
          <p className="text-slate-500 text-sm mt-1">Dossier : {currentDossier?.raisonSociale} ({currentDossier?.dateDebutExercice} au {currentDossier?.dateFinExercice})</p>
        </div>
        
        <div className="p-6 space-y-6">
          {etape === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 flex items-start">
                <AlertTriangle className="mr-3 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold mb-1">Pré-requis pour la clôture</p>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-amber-700">
                    <li>Tous les journaux de l'exercice doivent être imprimés.</li>
                    <li>La balance et le grand-livre doivent être édités.</li>
                    <li>Les écritures d'inventaire et les dotations doivent être enregistrées.</li>
                    <li>Le résultat doit être calculé et vérifié.</li>
                  </ul>
                </div>
              </div>
              <button 
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mt-4 shadow-sm"
                onClick={() => setEtape(2)}
              >
                Suivant : Paramètres du nouvel exercice
              </button>
            </div>
          )}

          {etape === 2 && (
            <div className="space-y-6">
              <h3 className="font-medium text-slate-800">Génération du nouvel exercice</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date de début</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50" 
                    readOnly 
                    value={currentDossier ? format(addYears(parseISO(currentDossier.dateDebutExercice), 1), 'yyyy-MM-dd') : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date de fin</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50" 
                    readOnly
                    value={currentDossier ? format(addYears(parseISO(currentDossier.dateFinExercice), 1), 'yyyy-MM-dd') : ''}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" 
                    checked={genererANouveaux}
                    onChange={(e) => setGenererANouveaux(e.target.checked)}
                  />
                  <span className="text-slate-900 font-semibold">Générer les écritures d'À-nouveaux</span>
                </label>
                <p className="text-blue-700 text-sm ml-6 mt-1">
                  Les soldes des comptes de Bilan seront automatiquement reportés sur le premier jour du nouvel exercice dans le journal "À-Nouveaux".
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                  onClick={() => setEtape(1)}
                  disabled={isProcessing}
                >
                  Précédent
                </button>
                <button 
                  className={`px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center space-x-2 shadow-md transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleCloture}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Traitement en cours...</span>
                    </>
                  ) : (
                    <span>Lancer la clôture et l'ouverture</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {etape === 3 && (
            <div className="text-center py-8 space-y-4">
              <div className="inline-block p-4 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <CheckCircle2 size={48} className="animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Exercice clôturé avec succès !</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Le nouvel exercice a été créé et activé. Les écritures de report à nouveau ont été générées automatiquement dans le journal RAN.
              </p>
              <div className="pt-6">
                <button 
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-transform hover:scale-105 active:scale-95"
                  onClick={() => setEtape(1)}
                >
                  Terminer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
