import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  ShieldCheck, Search, Bell, Settings, LogOut, ChevronDown, 
  Menu, X, Sparkles, Moon, Sun, Globe, Database, Command,
  ChevronRight
} from 'lucide-react';

function MenuDropdown({ label, items }: { label: string, items: { label: string, path: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white hover:text-indigo-400 transition-colors py-2">
        {label}
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl py-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[200]">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { navigate(item.path); setIsOpen(false); }}
              className="w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-200 hover:text-white hover:bg-white/5 transition-all flex items-center justify-between group"
            >
              {item.label}
              <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentDossierId = useStore(state => state.currentDossierId);
  const dossiers = useStore(state => state.dossiers);
  const setCurrentDossier = useStore(state => state.setCurrentDossier);
  const currentDossier = dossiers.find(d => d.id === currentDossierId);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-[100] px-8 py-4 bg-black border-b border-white/10 shadow-2xl transition-all duration-500">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-12">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo Elite */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter">DIAWDI</h1>
          </div>

          {/* Sage-Style Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <MenuDropdown 
              label="Fichier" 
              items={[
                { label: 'Nouveau', path: '/nouveau' },
                { label: 'Ouvrir', path: '/ouvrir' },
                { label: 'Fermer', path: '/ouvrir' },
                { label: 'Configuration', path: '/parametres' },
                { label: 'Importer', path: '/fichier/importer' },
                { label: 'Exporter', path: '/fichier/exporter' },
                { label: 'Communication', path: '/fichier/communication' },
                { label: 'Imprimer', path: '/fichier/imprimer' },
                { label: 'À propos de...', path: '/fichier/informations' },
              ]} 
            />
            <MenuDropdown 
              label="Édition" 
              items={[
                { label: 'Annuler', path: '#' },
                { label: 'Couper / Copier / Coller', path: '#' },
                { label: 'Rechercher', path: '/traitement/recherche-ecritures' },
              ]} 
            />
            <MenuDropdown 
              label="Structure" 
              items={[
                { label: 'Plan Comptable Général', path: '/structure/plan-comptable' },
                { label: 'Plan Tiers', path: '/structure/plan-tiers' },
                { label: 'Plan Analytique', path: '/structure/plan-analytique' },
                { label: 'Codes Journaux', path: '/structure/codes-journaux' },
                { label: 'Taux de Taxes', path: '/structure/taux-taxes' },
                { label: 'Banques', path: '/structure/banques' },
                { label: 'Modèles de Saisie', path: '/structure/modeles-saisie' },
                { label: 'Modèles de Règlement', path: '/structure/modeles-reglement' },
                { label: 'Immobilisations', path: '/structure/immobilisations' },
                { label: 'Paramètres Société', path: '/parametres' },
              ]} 
            />
            <MenuDropdown 
              label="Traitement" 
              items={[
                { label: 'Saisie par Pièce', path: '/traitement/saisie-piece' },
                { label: 'Saisie par Journal', path: '/traitement/saisie-journal' },
                { label: 'Saisie par Lot', path: '/traitement/saisie-lot' },
                { label: 'Interrogation Tiers', path: '/traitement/interrogation-tiers' },
                { label: 'Lettrage', path: '/traitement/lettrage' },
                { label: 'Rapprochement Bancaire', path: '/traitement/rapprochement' },
                { label: 'Clôture Mensuelle', path: '/traitement/cloture-mensuelle' },
                { label: 'Fin d\'Exercice', path: '/traitement/fin-exercice' },
                { label: 'Gestion de Trésorerie', path: '/gestion/tresorerie' },
                { label: 'Audit & Révision', path: '/intelligence/audit-integrite' },
                { label: 'Coûts Industriels', path: '/gestion/cout-industriel' },
              ]} 
            />
            <MenuDropdown 
              label="État" 
              items={[
                { label: 'Balance des Comptes', path: '/etat/balance' },
                { label: 'Grand Livre', path: '/etat/grand-livre' },
                { label: 'Bilan', path: '/etat/bilan' },
                { label: 'Compte de Résultat', path: '/etat/compte-resultat' },
                { label: 'Brouillard des Saisies', path: '/etat/brouillard' },
                { label: 'Journaux', path: '/etat/journaux' },
                { label: 'États Analytiques', path: '/etat/analytique' },
                { label: 'Déclaration TVA', path: '/etat/declaration-tva' },
                { label: 'Liasse Fiscale (DSF)', path: '/etat/liasse-fiscale' },
                { label: 'Analyse Financière', path: '/etat/analyse-financiere' },
              ]} 
            />
            <MenuDropdown 
              label="Fenêtre" 
              items={[
                { label: 'Personnalisation', path: '/fenetre/personnalisation' },
                { label: 'Navigation', path: '/fenetre/navigation' },
                { label: 'Gestion des Droits', path: '/admin/utilisateurs' },
              ]} 
            />
            <MenuDropdown 
              label="Aide" 
              items={[
                { label: 'Aide en ligne', path: '/aide/en-ligne' },
              ]} 
            />
          </div>

          {/* Search Bar Elite */}
          <div className="relative group hidden xl:block">
            <input 
              type="text" 
              placeholder="Commande rapide..."
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold w-64 text-white focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
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
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-black/95 backdrop-blur-xl z-[90] animate-in fade-in slide-in-from-top-4 duration-300 p-8 overflow-y-auto">
          <div className="space-y-8 pb-20">
            {[
              { label: "Fichier", items: ["Nouveau", "Ouvrir", "Exporter", "Importer"] },
              { label: "Traitement", items: ["Saisie Journal", "Lettrage", "Trésorerie", "Audit"] },
              { label: "États", items: ["Balance", "Bilan", "Liasse Fiscale", "Analyse Financière"] },
            ].map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] border-b border-white/5 pb-2">{section.label}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {section.items.map((item, iidx) => (
                    <button 
                      key={iidx}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-left text-sm font-black text-slate-300 hover:text-white transition-colors flex items-center gap-3 uppercase tracking-widest"
                    >
                      <ChevronRight size={14} className="text-indigo-600" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
