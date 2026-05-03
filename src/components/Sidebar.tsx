import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, Users, Building, BookOpen, Settings, LayoutDashboard, 
  Zap, ArrowRightLeft, Database, PieChart, ShieldCheck, Sparkles,
  Target, Activity, Factory, Landmark, Lock, Globe, Eye
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const sections = [
    {
      title: "Navigation Centrale",
      items: [
        { label: 'Espace de Travail', path: '/', icon: <LayoutDashboard size={18} /> },
        { label: 'Saisie IA Joule', path: '/traitement/saisie-ia', icon: <Zap size={18} />, premium: true },
      ]
    },
    {
      title: "Intelligence Executive (Confidentiel)",
      items: [
        { label: 'Statistiques Globales', path: '/intelligence/statistiques', icon: <Eye size={18} />, premium: true },
        { label: 'Intelligence War Room', path: '/intelligence/war-room', icon: <Activity size={18} /> },
        { label: 'Contrôle Budgétaire', path: '/gestion/budget', icon: <Target size={18} /> },
        { label: 'États Analytiques', path: '/etat/analytique', icon: <PieChart size={18} /> },
      ]
    },
    {
      title: "Gestion & Industrie",
      items: [
        { label: 'Immobilisations', path: '/structure/immobilisations', icon: <Landmark size={18} /> },
        { label: 'Industrial Costing', path: '/production/costing', icon: <Factory size={18} /> },
        { label: 'Procure-to-Pay', path: '/achat/procure-to-pay', icon: <ArrowRightLeft size={18} /> },
      ]
    },
    {
      title: "Audit & Gouvernance",
      items: [
        { label: 'UEMOA Compliance', path: '/uemoa/compliance', icon: <Globe size={18} /> },
        { label: 'Audit Diamond Seal', path: '/intelligence/audit-integrite', icon: <ShieldCheck size={18} /> },
        { label: 'Security Hub', path: '/admin/security', icon: <Lock size={18} /> },
      ]
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-80 bg-white border-r border-slate-100 flex flex-col shadow-2xl hidden md:flex print:hidden relative z-50 overflow-hidden">
      <div className="p-8 pb-4">
         <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
               <ShieldCheck size={24} strokeWidth={3} />
            </div>
            <div>
               <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">DIAMOND</h1>
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Azure Elite ERP</p>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-10 custom-scrollbar">
         {sections.map((section, idx) => (
           <div key={idx} className="space-y-2">
              <h2 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">{section.title}</h2>
              <div className="space-y-1">
                 {section.items.map(item => (
                   <Link 
                     key={item.path}
                     to={item.path} 
                     className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                       isActive(item.path) 
                       ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-2' 
                       : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
                     }`}
                   >
                     <div className="flex items-center gap-3">
                       <span className={`${isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`}>
                         {item.icon}
                       </span>
                       <span className={`text-[10px] font-black uppercase tracking-wide ${isActive(item.path) ? 'text-white' : 'text-slate-700'}`}>
                          {item.label}
                       </span>
                     </div>
                     {item.premium && !isActive(item.path) && (
                       <Sparkles size={12} className="text-amber-500 animate-pulse" />
                     )}
                   </Link>
                 ))}
              </div>
           </div>
         ))}
      </div>

      <div className="p-8 border-t border-slate-50 bg-slate-50/50">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm group cursor-pointer hover:border-indigo-200 transition-all">
           <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Users size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session</p>
              <p className="text-xs font-black text-slate-900">ADMIN_ELITE</p>
           </div>
        </div>
      </div>
    </aside>
  );
}

