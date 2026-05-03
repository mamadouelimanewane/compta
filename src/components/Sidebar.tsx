import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, Users, Building, BookOpen, Settings, LayoutDashboard, 
  Zap, ArrowRightLeft, Database, PieChart, ShieldCheck, Sparkles,
  Target, Activity, Factory, Landmark, Lock, Globe, Eye,
  CreditCard, Truck, ShoppingCart, BarChart3, ClipboardList,
  History, Download, Upload, Server, TrendingUp
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const sections = [
    {
      title: "Navigation Centrale",
      items: [
        { label: 'Espace de Travail', path: '/', icon: <LayoutDashboard size={18} /> },
        { label: 'Saisie IA Joule', path: '/traitement/saisie-ia', icon: <Zap size={18} />, premium: true },
        { label: 'Saisie Journal', path: '/traitement/saisie-journal', icon: <BookOpen size={18} /> },
      ]
    },
    {
      title: "Cycles Commerciaux",
      items: [
        { label: 'Ventes & Facturation', path: '/vente/facturation', icon: <CreditCard size={18} /> },
        { label: 'Achats & P2P', path: '/achat/procure-to-pay', icon: <ShoppingCart size={18} /> },
        { label: 'Gestion des Tiers', path: '/structure/tiers', icon: <Users size={18} /> },
      ]
    },
    {
      title: "Comptabilité & Reporting",
      items: [
        { label: 'Journaux d''Écritures', path: '/etat/journaux', icon: <ClipboardList size={18} /> },
        { label: 'Balance des Comptes', path: '/etat/balance', icon: <BarChart3 size={18} /> },
        { label: 'Grand Livre Détaillé', path: '/etat/grand-livre', icon: <Database size={18} /> },
        { label: 'Brouillard Comptable', path: '/etat/brouillard', icon: <History size={18} /> },
      ]
    },
    {
      title: "Intelligence & Synthèse",
      items: [
        { label: 'Bilan Patrimonial', path: '/etat/bilan', icon: <Building size={18} />, premium: true },
        { label: 'Compte de Résultat', path: '/etat/compte-resultat', icon: <TrendingUp size={18} />, premium: true },
        { label: 'Intelligence Hub', path: '/intelligence/statistiques', icon: <Eye size={18} /> },
        { label: 'Contrôle Budgétaire', path: '/gestion/budget', icon: <Target size={18} /> },
      ]
    },
    {
      title: "Industrie & Actifs",
      items: [
        { label: 'Industrial Costing', path: '/production/costing', icon: <Factory size={18} /> },
        { label: 'Immobilisations', path: '/structure/immobilisations', icon: <Landmark size={18} /> },
        { label: 'Trésorerie & Banque', path: '/gestion/tresorerie', icon: <Activity size={18} /> },
      ]
    },
    {
      title: "Gouvernance & Flux",
      items: [
        { label: 'UEMOA Compliance', path: '/uemoa/compliance', icon: <Globe size={18} /> },
        { label: 'Clôture & Scellage', path: '/traitement/cloture-mensuelle', icon: <ShieldCheck size={18} /> },
        { label: 'Security & Backup', path: '/admin/security', icon: <Lock size={18} /> },
        { label: 'Échanges de Données', path: '/fichier/importer', icon: <Upload size={18} /> },
      ]
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-80 bg-white border-r border-slate-100 flex flex-col shadow-2xl hidden md:flex print:hidden relative z-50 overflow-hidden">
      <div className="p-8 pb-4">
         <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
               <ShieldCheck size={24} strokeWidth={3} />
            </div>
            <div>
               <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">DIAWDI</h1>
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Azure Elite ERP</p>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-10 custom-scrollbar">
         {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
               <h2 className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 mt-4">{section.title}</h2>
               <div className="space-y-0.5">
                  {section.items.map(item => (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      className={`group flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 ${
                        isActive(item.path) 
                        ? 'bg-slate-900 text-white shadow-xl translate-x-2' 
                        : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`${isActive(item.path) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`}>
                          {item.icon}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-wide ${isActive(item.path) ? 'text-white' : 'text-slate-700'}`}>
                           {item.label}
                        </span>
                      </div>
                      {item.premium && !isActive(item.path) && (
                        <Sparkles size={10} className="text-amber-500 animate-pulse" />
                      )}
                    </Link>
                  ))}
               </div>
            </div>
         ))}
      </div>

      <div className="p-6 border-t border-slate-50 bg-slate-50/50">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm group cursor-pointer hover:border-indigo-200 transition-all">
           <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Users size={16} />
           </div>
           <div className="overflow-hidden">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Session Active</p>
              <p className="text-[10px] font-black text-slate-900 truncate">ADMIN_ELITE_PROD</p>
           </div>
        </div>
      </div>
    </aside>
  );
}

