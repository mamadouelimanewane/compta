import { useStore } from '../../store/useStore';
import { Calendar, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function FinExercice() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const dossiers = useStore(state => state.dossiers);
  const currentDossier = dossiers.find(d => d.id === currentDossierId);
  
  const [etape, setEtape] = useState(1);
  const [genererANouveaux, setGenererANouveaux] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Calendar className="mr-2 text-primary" />
          Fin d'exercice
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-medium text-slate-800">Assistant de clôture d'exercice</h2>
          <p className="text-slate-500 text-sm mt-1">Exercice actuel : {currentDossier?.dateDebutExercice} au {currentDossier?.dateFinExercice}</p>
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
                    <li>Le résultat doit être affecté dans les paramètres.</li>
                  </ul>
                </div>
              </div>
              <button 
                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 mt-4"
                onClick={() => setEtape(2)}
              >
                Suivant : Paramètres du nouvel exercice
              </button>
            </div>
          )}

          {etape === 2 && (
            <div className="space-y-6">
              <h3 className="font-medium text-slate-800">Création du nouvel exercice</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date de début</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date de fin</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-primary focus:ring-primary" 
                    checked={genererANouveaux}
                    onChange={(e) => setGenererANouveaux(e.target.checked)}
                  />
                  <span className="text-slate-700 font-medium">Générer les écritures d'À-nouveaux</span>
                </label>
                <p className="text-slate-500 text-sm ml-6 mt-1">
                  Les soldes des comptes de Bilan (classes 1 à 5) seront reportés sur le journal d'À-nouveaux du nouvel exercice.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                  onClick={() => setEtape(1)}
                >
                  Précédent
                </button>
                <button 
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700"
                  onClick={() => setEtape(3)}
                >
                  Lancer la clôture
                </button>
              </div>
            </div>
          )}

          {etape === 3 && (
            <div className="text-center py-8 space-y-4">
              <div className="inline-block p-4 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-medium text-slate-800">Clôture simulée avec succès</h3>
              <p className="text-slate-600">
                Le nouvel exercice a été créé. Les écritures d'à-nouveaux ont été générées et l'ancien exercice est désormais verrouillé.
              </p>
              <button 
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 mt-4"
                onClick={() => setEtape(1)}
              >
                Terminer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
