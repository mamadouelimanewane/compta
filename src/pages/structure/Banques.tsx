import { Building } from 'lucide-react';

export default function Banques() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Building className="mr-2 text-primary" />
          Banques
        </h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700">
          Nouveau
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 text-center text-slate-500">
          <p className="mb-4">Aucune banque paramétrée.</p>
        </div>
      </div>
    </div>
  );
}
