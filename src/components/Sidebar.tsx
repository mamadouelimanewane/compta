import { Link } from 'react-router-dom';
import { FileText, Users, Building, BookOpen, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm hidden md:flex print:hidden">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Accès Rapide</h2>
        <div className="space-y-1">
          <Link to="/traitement/saisie-journal" className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
            <FileText size={16} className="text-slate-400" />
            <span>Saisie des journaux</span>
          </Link>
          <Link to="/structure/plan-comptable" className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
            <BookOpen size={16} className="text-slate-400" />
            <span>Plan comptable</span>
          </Link>
          <Link to="/structure/plan-tiers" className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
            <Users size={16} className="text-slate-400" />
            <span>Plan tiers</span>
          </Link>
          <Link to="#" className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
            <Building size={16} className="text-slate-400" />
            <span>Banques</span>
          </Link>
          <Link to="#" className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
            <Settings size={16} className="text-slate-400" />
            <span>Paramètres société</span>
          </Link>
        </div>
      </div>
      
      <div className="p-4 flex-1">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">États</h2>
        <div className="space-y-1">
          <Link to="/etat/grand-livre" className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
            <div className="w-4 h-4 rounded border border-slate-300"></div>
            <span>Grand livre</span>
          </Link>
          <Link to="/etat/balance" className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
            <div className="w-4 h-4 rounded border border-slate-300"></div>
            <span>Balance</span>
          </Link>
          <Link to="#" className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-slate-400 cursor-not-allowed">
            <div className="w-4 h-4 rounded border border-slate-200"></div>
            <span>Brouillard</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
