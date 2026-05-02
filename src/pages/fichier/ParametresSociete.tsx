import { Settings, Save } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ParametresSociete() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const dossiers = useStore(state => state.dossiers);
  const currentDossier = dossiers.find(d => d.id === currentDossierId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Settings className="mr-2 text-primary" />
          Paramètres de la société
        </h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center">
          <Save size={16} className="mr-2" /> Enregistrer
        </button>
      </div>

      {currentDossier ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex">
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2">
            <button className="w-full text-left px-3 py-2 bg-slate-200 font-medium text-slate-800 rounded">Identification</button>
            <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-100 rounded">Préférences</button>
            <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-100 rounded">Fiscalité</button>
            <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-100 rounded">Ajustement Lettrage</button>
            <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-100 rounded">Communication</button>
            <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-100 rounded">Options</button>
          </div>
          <div className="flex-1 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Identification de l'entreprise</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Raison sociale</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50" value={currentDossier.raisonSociale} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Activité (NAF/APE)</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary" placeholder="Code NAF" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse complète</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary" placeholder="Numéro et voie" value={currentDossier.adresse || ''} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code postal</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary" value={currentDossier.codePostal || ''} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary" value={currentDossier.ville || ''} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SIRET / Identifiant</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary" placeholder="Numéro SIRET" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">N° TVA Intracommunautaire</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary" placeholder="FRXX..." />
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mt-8">Paramètres comptables</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date début exercice</label>
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50" value={currentDossier.dateDebutExercice} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date fin exercice</label>
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50" value={currentDossier.dateFinExercice} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Longueur des comptes</label>
                <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50" value={currentDossier.longueurComptes} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monnaie de tenue de compte</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50" value={currentDossier.devisePrincipale} readOnly />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
          Veuillez ouvrir un dossier comptable.
        </div>
      )}
    </div>
  );
}
