import { Percent } from 'lucide-react';

export default function TauxTaxes() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Percent className="mr-2 text-primary" />
          Taux de taxes
        </h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700">
          Nouveau
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Code Taxe</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Intitulé</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Compte Rattaché</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Taux (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-2 text-sm font-medium">TVA18</td>
              <td className="px-4 py-2 text-sm">TVA Normale (18%)</td>
              <td className="px-4 py-2 text-sm">44520000</td>
              <td className="px-4 py-2 text-sm text-right">18.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
