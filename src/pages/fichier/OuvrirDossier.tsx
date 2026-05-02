import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { FolderOpen, Plus, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function OuvrirDossier() {
  const navigate = useNavigate();
  const dossiers = useStore(state => state.dossiers);
  const setCurrentDossier = useStore(state => state.setCurrentDossier);

  const handleOpen = (id: string) => {
    setCurrentDossier(id);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Ouvrir un fichier comptable</h1>
        <button 
          onClick={() => navigate('/nouveau')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Nouveau fichier</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {dossiers.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500">
            <FolderOpen size={48} className="text-slate-300 mb-4" />
            <p className="text-lg font-medium">Aucun fichier comptable trouvé</p>
            <p className="text-sm mt-1">Créez votre premier dossier pour commencer.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Raison sociale</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Exercice</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">SIRET</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dossiers.map(dossier => (
                <tr key={dossier.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{dossier.raisonSociale}</div>
                    <div className="text-sm text-slate-500">{dossier.ville || 'Localité non renseignée'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">
                      Du {format(new Date(dossier.dateDebutExercice), 'dd MMM yyyy', { locale: fr })}
                    </div>
                    <div className="text-sm text-slate-700">
                      Au {format(new Date(dossier.dateFinExercice), 'dd MMM yyyy', { locale: fr })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {dossier.siret || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleOpen(dossier.id)}
                      className="px-3 py-1.5 bg-slate-100 text-primary hover:bg-indigo-50 hover:text-indigo-700 font-medium rounded-md flex items-center space-x-1 ml-auto transition-colors"
                    >
                      <Lock size={14} className="mr-1" />
                      <span>Ouvrir</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
