import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Building2, Calendar, Settings, ArrowRight, Save } from 'lucide-react';
import { format } from 'date-fns';
import { PLAN_OHADA } from '../../utils/planOhada';

export default function NouveauDossier() {
  const navigate = useNavigate();
  const createDossier = useStore(state => state.createDossier);
  const addCompte = useStore(state => state.addCompte);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    raisonSociale: '',
    adresse: '',
    codePostal: '',
    ville: '',
    siret: '',
    codeNaf: '',
    dateDebutExercice: format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'),
    dateFinExercice: format(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd'),
    longueurComptes: 8,
    devisePrincipale: 'FCFA',
    importOhada: true
  });

  const handleCreate = () => {
    const dossierData = { ...formData };
    delete (dossierData as any).importOhada;
    
    const newDossier = createDossier(dossierData);

    if (formData.importOhada) {
      PLAN_OHADA.forEach(compte => {
        const paddedNumero = compte.numero.padEnd(formData.longueurComptes, '0');
        addCompte({
          dossierId: newDossier.id,
          numero: paddedNumero,
          intitule: compte.intitule,
          type: compte.type as 'Détail' | 'Total',
          nature: compte.nature as any,
          saisieAnalytique: false,
          saisieEcheance: false,
          lettrageAutomatique: true
        });
      });
    }

    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-primary px-6 py-4 border-b border-indigo-800">
          <h2 className="text-xl font-semibold text-white">Assistant de création de fichier comptable</h2>
          <p className="text-indigo-200 text-sm mt-1">Étape {step} sur 3</p>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-lg font-medium text-slate-800 border-b border-slate-100 pb-2">
                <Building2 className="text-primary" />
                <h3>Identification de la société</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Raison sociale *</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.raisonSociale}
                    onChange={e => setFormData({...formData, raisonSociale: e.target.value})}
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SIRET / Identifiant fiscal</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.siret}
                      onChange={e => setFormData({...formData, siret: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Code NAF/APE</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.codeNaf}
                      onChange={e => setFormData({...formData, codeNaf: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                    value={formData.adresse}
                    onChange={e => setFormData({...formData, adresse: e.target.value})}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <input 
                        type="text" 
                        placeholder="Code postal"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.codePostal}
                        onChange={e => setFormData({...formData, codePostal: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        placeholder="Ville"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.ville}
                        onChange={e => setFormData({...formData, ville: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-lg font-medium text-slate-800 border-b border-slate-100 pb-2">
                <Calendar className="text-primary" />
                <h3>Exercice comptable</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Début de l'exercice *</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.dateDebutExercice}
                    onChange={e => setFormData({...formData, dateDebutExercice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fin de l'exercice *</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.dateFinExercice}
                    onChange={e => setFormData({...formData, dateFinExercice: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-lg font-medium text-slate-800 border-b border-slate-100 pb-2">
                <Settings className="text-primary" />
                <h3>Paramètres comptables</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Longueur des comptes *</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.longueurComptes}
                    onChange={e => setFormData({...formData, longueurComptes: parseInt(e.target.value)})}
                  >
                    {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(len => (
                      <option key={len} value={len}>{len} caractères</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Entre 3 et 13 caractères.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Devise principale *</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.devisePrincipale}
                    onChange={e => setFormData({...formData, devisePrincipale: e.target.value})}
                  >
                    <option value="FCFA">FCFA (Franc CFA)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="USD">USD (Dollar US)</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center space-x-3 text-sm text-slate-700 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-50 transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    checked={formData.importOhada}
                    onChange={e => setFormData({...formData, importOhada: e.target.checked})}
                  />
                  <div>
                    <span className="block font-medium text-indigo-900">Importer le plan comptable SYSCOHADA</span>
                    <span className="block text-xs text-indigo-700/70 mt-0.5">Précharge les comptes standards (Classes 1 à 9) avec la longueur de compte définie.</span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <button 
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 disabled:opacity-50"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Précédent
          </button>
          
          {step < 3 ? (
            <button 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2 disabled:opacity-50"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !formData.raisonSociale}
            >
              <span>Suivant</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center space-x-2"
              onClick={handleCreate}
            >
              <Save size={16} />
              <span>Créer le fichier</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
