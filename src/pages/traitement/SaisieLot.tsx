import { Upload, FileDown, CheckCircle } from 'lucide-react';

export default function SaisieLot() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Upload className="mr-2 text-primary" />
          Saisie par lot (Import)
        </h1>
        <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 flex items-center">
          <FileDown size={16} className="mr-2" /> Modèle d'import
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center space-y-6">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 hover:bg-slate-50 transition-colors cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Cliquez ou glissez un fichier ici</h3>
          <p className="text-slate-500 mt-1">Formats acceptés : CSV, TXT (Format SAGE)</p>
        </div>

        <div className="text-left bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start">
          <CheckCircle className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-medium text-blue-900">Informations sur l'import</h4>
            <p className="text-sm text-blue-800 mt-1">
              L'importation par lot permet d'intégrer massivement des écritures comptables provenant de logiciels tiers (Paie, Gestion Commerciale).
              Le fichier doit comporter au minimum les colonnes : Journal, Date, N° Pièce, Compte Général, Libellé, Débit, Crédit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
