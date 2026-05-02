import { FileText, Printer } from 'lucide-react';

export default function Brouillard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <FileText className="mr-2 text-primary" />
          Brouillard comptable
        </h1>
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 print:hidden flex items-center"
        >
          <Printer size={16} className="mr-2" /> Imprimer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 print:hidden">
        <h2 className="text-lg font-medium mb-4">Critères d'édition</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Journal</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-md">
              <option value="ALL">Tous les journaux</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date de début</label>
            <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date de fin</label>
            <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md" />
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700">
              Générer
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[500px] flex items-center justify-center text-slate-500 print:border-none print:shadow-none">
        Sélectionnez vos critères et cliquez sur Générer pour afficher le brouillard.
      </div>
    </div>
  );
}
