import { FileText, Plus } from 'lucide-react';

export default function ModelesReglement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <FileText className="mr-2 text-primary" />
          Modèles de règlement
        </h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center">
          <Plus size={16} className="mr-2" /> Nouveau modèle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Intitulé</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Conditions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">Comptant</td>
              <td className="px-4 py-3 text-sm text-slate-600">100% à 0 jour</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">30 jours nets</td>
              <td className="px-4 py-3 text-sm text-slate-600">100% à 30 jours nets</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">60 jours Fin de Mois</td>
              <td className="px-4 py-3 text-sm text-slate-600">100% à 60 jours fin de mois civil</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">3 fois sans frais</td>
              <td className="px-4 py-3 text-sm text-slate-600">33,33% à 30j / 33,33% à 60j / 33,34% à 90j</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
