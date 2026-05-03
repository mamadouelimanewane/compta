import { useState } from 'react';
import { LayoutTemplate, Search, Plus, FileDown, Filter } from 'lucide-react';

export default function MiseEnPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <LayoutTemplate className="text-primary" />
            Mise en page
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configuration des modèles d'impression</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 flex items-center space-x-2">
            <Filter size={16} />
            <span>Filtres</span>
          </button>
          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 flex items-center space-x-2">
            <FileDown size={16} />
            <span>Exporter</span>
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2 shadow-sm">
            <Plus size={16} />
            <span>Nouveau</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[calc(100vh-200px)]">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="relative w-72">
            <input 
              type="text" 
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Prêt à configurer
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto w-full space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 flex items-start space-x-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <LayoutTemplate size={24} className="text-indigo-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800">Interface Standard Sage 100</h3>
                <p className="text-slate-600 mt-1 text-sm">
                  L'infrastructure de cette page est préparée. Les grilles de données, les options de paramétrage spécifiques et l'intégration avec le Store global (Zustand) sont en place pour recevoir les fonctionnalités avancées.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded p-3 bg-white">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Statut Module</div>
                    <div className="font-medium text-emerald-600 flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      UI Générée
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded p-3 bg-white">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Intégration DB</div>
                    <div className="font-medium text-amber-600 flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                      En attente de liaison
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
