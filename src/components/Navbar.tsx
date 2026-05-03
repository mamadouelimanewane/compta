import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  ShieldCheck, Search, Bell, Settings, LogOut, ChevronDown, 
  Menu, X, Sparkles, Moon, Sun, Globe, Database, Command
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentDossierId = useStore(state => state.currentDossierId);
  const dossiers = useStore(state => state.dossiers);
  const setCurrentDossier = useStore(state => state.setCurrentDossier);
  const currentDossier = dossiers.find(d => d.id === currentDossierId);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-[100] px-8 py-4 bg-black border-b border-white/10 shadow-2xl transition-all duration-500">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Search Bar Elite */}
          <div className="relative group hidden lg:block">
            <input 
              type="text" 
              placeholder="Commande rapide (Ctrl + K)"
              className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold w-80 shadow-inner text-white focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
            />
            <Command size={16} className="absolute left-4 top-3.5 text-slate-500" />
          </div>
        </div>

        <div className="flex items-center gap-6">
           {/* Regional Compliance Badge */}
           <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Globe size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">OHADA / UEMOA CONFORM</span>
           </div>

           {/* Notifications */}
           <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-black"></span>
           </button>

           {/* Dossier Selector / Status */}
           <div className="h-10 w-px bg-white/10"></div>

           <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/ouvrir')}>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Dossier Actif</p>
                 <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors">
                    {currentDossier?.raisonSociale || "Aucun dossier"}
                 </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-105">
                 {currentDossier?.raisonSociale?.substring(0, 2).toUpperCase() || <Database size={20} />}
              </div>
              <ChevronDown size={14} className="text-slate-500" />
           </div>

           <button 
             onClick={(e) => { e.stopPropagation(); setCurrentDossier(null); navigate('/ouvrir'); }}
             className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
             title="Fermer Dossier"
           >
              <LogOut size={18} />
           </button>
        </div>
      </div>
    </nav>
  );
}
