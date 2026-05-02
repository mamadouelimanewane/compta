import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { CheckSquare, AlertTriangle, CheckCircle, Circle, Lock, Unlock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CheckItem {
  id: string;
  label: string;
  description: string;
  categorie: 'journaux' | 'etats' | 'fiscalite' | 'validation';
  obligatoire: boolean;
  checked: boolean;
  route?: string;
}

const CHECKLIST_INITIALE: Omit<CheckItem, 'checked'>[] = [
  { id: '1', label: 'Brouillard imprimé / vérifié', description: 'Toutes les écritures du mois ont été contrôlées dans le brouillard.', categorie: 'journaux', obligatoire: true },
  { id: '2', label: 'Journaux validés', description: 'Les journaux Achats, Ventes, Banque ont été imprimés et archivés.', categorie: 'journaux', obligatoire: true },
  { id: '3', label: 'Balance des comptes éditée', description: 'La balance de contrôle montre les soldes cohérents pour tous les comptes.', categorie: 'etats', obligatoire: true },
  { id: '4', label: 'Grand-Livre des comptes édité', description: 'Le grand-livre détaillé a été produit et vérifié.', categorie: 'etats', obligatoire: true },
  { id: '5', label: 'Rapprochement bancaire effectué', description: 'Le solde banque comptable correspond au relevé bancaire.', categorie: 'etats', obligatoire: true },
  { id: '6', label: 'Lettrage des tiers effectué', description: 'Les comptes clients (411) et fournisseurs (401) sont lettrés.', categorie: 'etats', obligatoire: false },
  { id: '7', label: 'TVA calculée et vérifiée', description: 'La déclaration de TVA du mois a été calculée et validée.', categorie: 'fiscalite', obligatoire: true },
  { id: '8', label: 'Écritures d\'inventaire saisies', description: 'Dotations aux amortissements, provisions et régularisations enregistrées.', categorie: 'fiscalite', obligatoire: false },
  { id: '9', label: 'Résultat provisoire calculé', description: 'Le compte de résultat provisoire a été édité et présenté à la direction.', categorie: 'validation', obligatoire: true },
  { id: '10', label: 'Validation par le responsable', description: 'La clôture a été approuvée par le responsable comptable ou la direction.', categorie: 'validation', obligatoire: true },
];

const CATEGORIE_LABELS: Record<string, string> = {
  journaux: '📒 Journaux',
  etats: '📊 États Comptables',
  fiscalite: '🧾 Fiscalité',
  validation: '✅ Validation Finale',
};

export default function ClotureMensuelle() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);

  const [periode, setPeriode] = useState(format(new Date(), 'yyyy-MM'));
  const [checklist, setChecklist] = useState<CheckItem[]>(CHECKLIST_INITIALE.map(item => ({ ...item, checked: false })));
  const [cloturee, setCloturee] = useState(false);

  const stats = useMemo(() => {
    const [year, month] = periode.split('-');
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;
    const lignesMois = lignesEcriture.filter(l => l.date >= startDate && l.date <= endDate);
    const journauxActifs = new Set(lignesMois.map(l => l.journalId)).size;
    return { nbEcritures: lignesMois.length, nbJournaux: journauxActifs };
  }, [lignesEcriture, periode]);

  const toggle = (id: string) => {
    if (cloturee) return;
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const checkedCount = checklist.filter(i => i.checked).length;
  const totalCount = checklist.length;
  const obligatoiresOk = checklist.filter(i => i.obligatoire).every(i => i.checked);
  const progress = Math.round((checkedCount / totalCount) * 100);

  const cloturer = () => {
    if (!obligatoiresOk) {
      alert('Vous devez cocher tous les éléments OBLIGATOIRES avant de clôturer le mois.');
      return;
    }
    setCloturee(true);
  };

  const categories = ['journaux', 'etats', 'fiscalite', 'validation'] as const;

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <CheckSquare className="mr-2 text-primary" />
          Workflow de Clôture Mensuelle
        </h1>
        {!cloturee ? (
          <button
            onClick={cloturer}
            disabled={!obligatoiresOk}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center shadow-sm transition-colors ${obligatoiresOk ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            <Lock size={14} className="mr-2" /> Clôturer le mois
          </button>
        ) : (
          <button onClick={() => { setCloturee(false); setChecklist(prev => prev.map(i => ({ ...i, checked: false }))); }} className="px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-medium flex items-center hover:bg-amber-600">
            <Unlock size={14} className="mr-2" /> Réouvrir
          </button>
        )}
      </div>

      {/* Header Info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Période à clôturer</label>
          <input type="month" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary" value={periode} onChange={e => { setPeriode(e.target.value); setCloturee(false); setChecklist(prev => prev.map(i => ({ ...i, checked: false }))); }} disabled={cloturee} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-xs text-slate-500 uppercase">Écritures du mois</p>
          <p className="text-2xl font-bold text-slate-900">{stats.nbEcritures}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-xs text-slate-500 uppercase">Journaux mouvementés</p>
          <p className="text-2xl font-bold text-slate-900">{stats.nbJournaux} / {journaux.length}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-slate-800">Progression de la clôture</h2>
          <span className={`text-lg font-bold ${progress === 100 ? 'text-emerald-600' : 'text-indigo-600'}`}>{progress}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-slate-500 mt-2">{checkedCount} / {totalCount} tâches effectuées · {checklist.filter(i => i.obligatoire && !i.checked).length} obligatoires restantes</p>
      </div>

      {cloturee && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center">
          <div className="p-3 bg-emerald-100 rounded-full mr-4"><CheckCircle className="text-emerald-600" size={28} /></div>
          <div>
            <h3 className="font-bold text-emerald-900 text-lg">Mois clôturé avec succès !</h3>
            <p className="text-emerald-700 text-sm">
              La période {format(new Date(periode + '-01'), 'MMMM yyyy', { locale: fr })} est clôturée pour <strong>{currentDossier?.raisonSociale}</strong>.
              Les écritures de ce mois sont maintenant verrouillées.
            </p>
          </div>
        </div>
      )}

      {/* Checklist by category */}
      <div className="space-y-4 flex-1">
        {categories.map(cat => {
          const items = checklist.filter(i => i.categorie === cat);
          const catDone = items.filter(i => i.checked).length;
          return (
            <div key={cat} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 text-sm">{CATEGORIE_LABELS[cat]}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catDone === items.length ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{catDone} / {items.length}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {items.map(item => (
                  <div key={item.id} onClick={() => toggle(item.id)} className={`px-5 py-3.5 flex items-start space-x-4 transition-colors ${!cloturee ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'} ${item.checked ? 'bg-emerald-50/30' : ''}`}>
                    <div className="mt-0.5 flex-shrink-0">
                      {item.checked
                        ? <CheckCircle size={20} className="text-emerald-500" />
                        : <Circle size={20} className="text-slate-300" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className={`font-medium text-sm ${item.checked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.label}</p>
                        {item.obligatoire && <span className="text-xs bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-semibold">Obligatoire</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                    </div>
                    {!item.checked && item.obligatoire && <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
