import { useState } from 'react';
import { Settings, Save, Building, Calendar, Wallet, Landmark, AlertTriangle, Trash2, ShieldAlert, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ParametresSociete() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const dossiers = useStore(state => state.dossiers);
  const currentDossier = dossiers.find(d => d.id === currentDossierId);
  
  const updateDossier = useStore(state => state.updateDossier);
  const deleteDossier = useStore(state => state.deleteDossier);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const addJournal = useStore(state => state.addJournal);
  const deleteJournal = useStore(state => state.deleteJournal);
  const taxes = useStore(state => state.taxes).filter(t => t.dossierId === currentDossierId);
  const addTaxe = useStore(state => state.addTaxe);
  const updateTaxe = useStore(state => state.updateTaxe);
  const deleteTaxe = useStore(state => state.deleteTaxe);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);

  const [activeTab, setActiveTab] = useState('identification');
  const [formData, setFormData] = useState(currentDossier || {
    raisonSociale: '',
    adresse: '',
    ville: '',
    siret: '',
    codeNaf: '',
    dateDebutExercice: '',
    dateFinExercice: '',
    longueurComptes: 6,
    devisePrincipale: 'FCFA'
  });

  const handleSave = () => {
    if (currentDossierId) {
      updateDossier(currentDossierId, formData);
      alert("Paramètres enregistrés avec succès !");
    }
  };

  const handleDelete = () => {
    if (confirm("ATTENTION : Cette action est irréversible. Toutes les données du dossier seront supprimées. Voulez-vous continuer ?")) {
      if (currentDossierId) {
        deleteDossier(currentDossierId);
        window.location.href = '/ouvrir';
      }
    }
  };

  if (!currentDossier) return (
    <div className="h-[60vh] flex items-center justify-center text-slate-500 font-medium">
      Veuillez ouvrir un dossier pour accéder aux paramètres.
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-xl text-white">
              <Settings size={24} />
            </div>
            Configuration Expert
          </h1>
          <p className="text-slate-500 font-medium mt-1">Personnalisez votre environnement de travail Diamond Azure Elite.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
        >
          <Save size={18} />
          ENREGISTRER LES MODIFICATIONS
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-80 bg-slate-50 border-r border-slate-200 p-8 space-y-2">
          {[
            { id: 'identification', label: 'Identification', icon: <Building size={18} /> },
            { id: 'compta', label: 'Comptabilité', icon: <Calendar size={18} /> },
            { id: 'journaux', label: 'Journaux', icon: <Landmark size={18} /> },
            { id: 'fiscalite', label: 'Fiscalité', icon: <ShieldAlert size={18} /> },
            { id: 'danger', label: 'Zone Critique', icon: <Trash2 size={18} />, color: 'text-rose-600' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-md border border-slate-100' 
                  : `text-slate-500 hover:bg-slate-100 ${tab.color || ''}`
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-12 overflow-y-auto">
          {activeTab === 'identification' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-black text-slate-900">Identité de l'Entreprise</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Raison Sociale</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.raisonSociale}
                    onChange={e => setFormData({ ...formData, raisonSociale: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SIRET / IFU</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.siret || ''}
                    onChange={e => setFormData({ ...formData, siret: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresse Siège Social</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.adresse || ''}
                    onChange={e => setFormData({ ...formData, adresse: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compta' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-black text-slate-900">Préférences Comptables</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Début Exercice</label>
                  <input 
                    type="date" 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.dateDebutExercice}
                    onChange={e => setFormData({ ...formData, dateDebutExercice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fin Exercice</label>
                  <input 
                    type="date" 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.dateFinExercice}
                    onChange={e => setFormData({ ...formData, dateFinExercice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Longueur des Comptes</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.longueurComptes}
                    onChange={e => setFormData({ ...formData, longueurComptes: Number(e.target.value) })}
                  >
                    {[4, 5, 6, 7, 8, 10, 13].map(v => <option key={v} value={v}>{v} caractères</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Devise de Tenue</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.devisePrincipale}
                    onChange={e => setFormData({ ...formData, devisePrincipale: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'journaux' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">Structure des Journaux</h2>
                <button 
                  onClick={() => {
                    const code = prompt("Code du journal ?");
                    const intitule = prompt("Intitulé du journal ?");
                    if (code && intitule) addJournal({ dossierId: currentDossierId!, code, intitule, type: 'Général' });
                  }}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs"
                >+ AJOUTER JOURNAL</button>
              </div>
              <div className="space-y-3">
                {journaux.map(j => (
                  <div key={j.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 shadow-sm border border-slate-100">{j.code}</div>
                      <div>
                        <p className="font-black text-slate-900">{j.intitule}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{j.type}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteJournal(j.id)}
                      className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fiscalite' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">Configuration Fiscale</h2>
                <button 
                  onClick={() => {
                    const code = prompt("Code taxe (ex: TVA18) ?");
                    const taux = Number(prompt("Taux (%) ?"));
                    if (code && !isNaN(taux)) addTaxe({ dossierId: currentDossierId!, code, intitule: `TVA ${taux}%`, taux, compteRattacheId: '' });
                  }}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs"
                >+ AJOUTER TAXE</button>
              </div>
              <div className="space-y-4">
                {taxes.map(t => (
                  <div key={t.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-emerald-600 shadow-sm text-xl">{t.taux}%</div>
                      <div>
                        <p className="font-black text-slate-900 text-lg">{t.code}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase">{t.intitule}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Compte de Taxe</p>
                        <select 
                          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                          value={t.compteRattacheId}
                          onChange={e => updateTaxe(t.id, { compteRattacheId: e.target.value })}
                        >
                          <option value="">Non rattaché</option>
                          {comptes.filter(c => c.numero.startsWith('445')).map(c => (
                            <option key={c.id} value={c.id}>{c.numero} - {c.intitule}</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        onClick={() => deleteTaxe(t.id)}
                        className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2rem] space-y-6">
                <div className="flex items-center gap-4 text-rose-600">
                  <AlertTriangle size={48} />
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Zone d'Extraction Critique</h3>
                    <p className="text-sm font-medium opacity-80">Suppression définitive du dossier comptable.</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Toutes les écritures, le plan comptable, les tiers et les journaux liés à ce dossier seront définitivement effacés de la base de données Diamond Azure. Cette opération est irréversible.
                </p>
                <button 
                  onClick={handleDelete}
                  className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all uppercase tracking-[0.2em]"
                >
                  SUPPRIMER LE DOSSIER : {currentDossier.raisonSociale}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
