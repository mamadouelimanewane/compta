import { format } from 'date-fns';
import ExportActions from '../../components/ExportActions';

export default function LiasseFiscale() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const dossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-xl">
                <FileText size={32} />
             </div>
             Liasse Fiscale (DSF OHADA)
          </h1>
          <p className="text-slate-500 font-medium mt-2">Déclaration Statistique et Fiscale - Système Normal (SYSCOHADA Révisé).</p>
        </div>
        <ExportActions 
          data={[{ Info: 'Liasse Fiscale OHADA', Dossier: dossier?.raisonSociale, Date: format(new Date(), 'yyyy-MM-dd') }]} 
          filename={`liasse_fiscale_${format(new Date(), 'yyyy-MM-dd')}`} 
          title="Liasse Fiscale (DSF OHADA)" 
        />
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border-2 border-emerald-100 bg-emerald-50 rounded-2xl">
               <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-emerald-500" size={24} />
                  <h3 className="text-lg font-black text-slate-900">Bilan (Actif & Passif)</h3>
               </div>
               <p className="text-sm text-slate-600">Généré automatiquement à partir des classes 1 à 5 de votre balance générale.</p>
               <button className="mt-4 text-xs font-bold text-emerald-600 uppercase tracking-widest">Aperçu Bilan &rarr;</button>
            </div>
            
            <div className="p-6 border-2 border-indigo-100 bg-indigo-50 rounded-2xl">
               <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-indigo-500" size={24} />
                  <h3 className="text-lg font-black text-slate-900">Compte de Résultat</h3>
               </div>
               <p className="text-sm text-slate-600">Généré à partir des classes 6, 7 et 8. Inclut les soldes significatifs de gestion.</p>
               <button className="mt-4 text-xs font-bold text-indigo-600 uppercase tracking-widest">Aperçu Résultat &rarr;</button>
            </div>

            <div className="p-6 border border-slate-100 rounded-2xl opacity-75">
               <div className="flex items-center gap-3 mb-4">
                  <Database className="text-slate-400" size={24} />
                  <h3 className="text-lg font-black text-slate-900">TAFIRE</h3>
               </div>
               <p className="text-sm text-slate-600">Tableau Financier des Ressources et des Emplois. Calcul automatique des flux de trésorerie.</p>
            </div>

            <div className="p-6 border border-slate-100 rounded-2xl opacity-75">
               <div className="flex items-center gap-3 mb-4">
                  <FileText className="text-slate-400" size={24} />
                  <h3 className="text-lg font-black text-slate-900">Notes Annexes</h3>
               </div>
               <p className="text-sm text-slate-600">Génération des 36 notes justificatives requises par le référentiel OHADA.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
