import { PieChart, Plus } from 'lucide-react';

export default function PlanAnalytique() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <PieChart className="mr-2 text-primary" />
          Plan Analytique
        </h1>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center">
          <Plus size={16} className="mr-2" /> Nouvelle section
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 text-center text-slate-500">
          <p>Aucune section analytique définie. Commencez par créer un plan analytique.</p>
        </div>
      </div>
    </div>
  );
}
