import { Copy, Plus } from 'lucide-react';

export default function ModelesSaisie() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Copy className="mr-2 text-primary" />
          Modèles de saisie
        </h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center">
          <Plus size={16} className="mr-2" /> Nouveau modèle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Intitulé du modèle</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type de journal</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Raccourci</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Lignes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2 font-medium text-slate-800">Achats intracommunautaires</td>
              <td className="px-4 py-2 text-sm text-slate-600">Achat</td>
              <td className="px-4 py-2"><span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-mono">CTRL+SHIFT+AI</span></td>
              <td className="px-4 py-2 text-sm text-slate-600">3</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2 font-medium text-slate-800">Facture achats matières</td>
              <td className="px-4 py-2 text-sm text-slate-600">Achat</td>
              <td className="px-4 py-2"><span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-mono">CTRL+SHIFT+FAM</span></td>
              <td className="px-4 py-2 text-sm text-slate-600">2</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2 font-medium text-slate-800">Facture vente produits</td>
              <td className="px-4 py-2 text-sm text-slate-600">Vente</td>
              <td className="px-4 py-2"><span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-mono">CTRL+SHIFT+FVP</span></td>
              <td className="px-4 py-2 text-sm text-slate-600">2</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2 font-medium text-slate-800">Loyer Abonnement</td>
              <td className="px-4 py-2 text-sm text-slate-600">Achat</td>
              <td className="px-4 py-2"><span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-mono">CTRL+SHIFT+LA</span></td>
              <td className="px-4 py-2 text-sm text-slate-600">2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
