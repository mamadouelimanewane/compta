import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Save, Upload, Download, X, Moon, Sun, Receipt, TrendingUp, ShoppingCart, Brain, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  
  const currentDossierId = useStore(state => state.currentDossierId);
  const dossiers = useStore(state => state.dossiers);
  const setCurrentDossier = useStore(state => state.setCurrentDossier);
  
  const currentDossier = dossiers.find(d => d.id === currentDossierId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleFermer = () => {
    setCurrentDossier(null);
    setActiveMenu(null);
    navigate('/ouvrir');
  };

  const handleBackup = () => {
    const data = localStorage.getItem('compta-storage');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sauvegarde_compta_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    setIsBackupModalOpen(false);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          // Validate JSON broadly
          JSON.parse(content); 
          localStorage.setItem('compta-storage', content);
          window.location.reload(); // Reload to hydrate Zustand state
        } catch (err) {
          alert("Fichier de sauvegarde invalide.");
        }
      };
      reader.readAsText(file);
    }
  };

  const exportFEC = () => {
    if (!currentDossierId) {
      alert("Veuillez d'abord ouvrir un dossier.");
      return;
    }
    
    // Format FEC: JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|CompAuxNum|CompAuxLib|PieceRef|PieceDate|EcritureLib|Debit|Credit|EcritureLet|DateLet|ValidDate|Montantdevise|Idevise
    const state = useStore.getState();
    const lignes = state.lignesEcriture.filter(l => l.dossierId === currentDossierId);
    const comptes = state.comptes.filter(c => c.dossierId === currentDossierId);
    const journaux = state.journaux.filter(j => j.dossierId === currentDossierId);
    
    let content = "JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|CompAuxNum|CompAuxLib|PieceRef|PieceDate|EcritureLib|Debit|Credit|EcritureLet|DateLet|ValidDate|Montantdevise|Idevise\n";
    
    lignes.forEach((ligne, index) => {
      const compte = comptes.find(c => c.id === ligne.compteGeneralId);
      const journal = journaux.find(j => j.id === ligne.journalId);
      
      const dateFormatted = ligne.date.replace(/-/g, ''); // YYYYMMDD
      
      const row = [
        journal?.code || '',
        journal?.intitule || '',
        index + 1,
        dateFormatted,
        compte?.numero || '',
        compte?.intitule || '',
        '', // CompAuxNum
        '', // CompAuxLib
        ligne.numeroPiece || '',
        dateFormatted,
        ligne.libelle || '',
        ligne.debit.toFixed(2).replace('.', ','),
        ligne.credit.toFixed(2).replace('.', ','),
        '', // EcritureLet
        '', // DateLet
        dateFormatted, // ValidDate
        '', // Montantdevise
        ''  // Idevise
      ];
      content += row.join('|') + '\n';
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FEC_${state.dossiers.find(d => d.id === currentDossierId)?.siret || 'export'}_${new Date().getFullYear()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <nav className="bg-primary text-white px-4 py-2 flex items-center justify-between border-b border-indigo-800 select-none print:hidden" ref={menuRef}>
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-bold text-lg tracking-tight hover:text-indigo-200 transition-colors">SAARI SAGE</Link>
          <div className="flex space-x-1 text-sm relative">
            
            <div className="relative">
              <button 
                className={`px-3 py-1 rounded transition-colors ${activeMenu === 'fichier' ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`}
                onClick={() => toggleMenu('fichier')}
              >
                Fichier
              </button>
              {activeMenu === 'fichier' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-slate-800">
                  <Link to="/nouveau" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Nouveau...</Link>
                  <Link to="/ouvrir" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Ouvrir...</Link>
                  {currentDossier && (
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 border-t border-slate-100 mt-1 pt-1" onClick={handleFermer}>Fermer</button>
                  )}
                  <div className="border-t border-slate-100 my-1"></div>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100" onClick={() => { setActiveMenu(null); setIsBackupModalOpen(true); }}>Sauvegarde / Restauration...</button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 text-emerald-700 font-medium flex items-center" onClick={() => { setActiveMenu(null); exportFEC(); }}>
                    Exporter FEC (Norme DGFiP)
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/parametres" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>À propos de...</Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100">Quitter</button>
                </div>
              )}
            </div>

            <button className="px-3 py-1 hover:bg-indigo-800 rounded">Édition</button>
            
            {/* Intelligence Room */}
            <div className="relative">
              <button 
                className={`px-3 py-1 rounded transition-colors flex items-center bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/40 border border-indigo-500/30 ${activeMenu === 'intelligence' ? 'bg-indigo-500/50' : ''}`}
                onClick={() => toggleMenu('intelligence')}
              >
                <Brain size={14} className="mr-1.5 text-indigo-300" /> Intelligence
              </button>
              {activeMenu === 'intelligence' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-md shadow-2xl py-1 z-50 text-slate-100">
                  <Link to="/intelligence/war-room" className="block px-4 py-2 text-sm hover:bg-slate-800 flex items-center" onClick={() => setActiveMenu(null)}>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></div>
                    Diamond Intelligence Center
                  </Link>
                  <Link to="/intelligence/audit-integrite" className="block px-4 py-2 text-sm hover:bg-slate-800 flex items-center" onClick={() => setActiveMenu(null)}>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    Diamond Seal (Audit d'Intégrité)
                  </Link>
                </div>
              )}
            </div>

            {/* UEMOA Specifics */}
            <div className="relative">
              <button 
                className={`px-3 py-1 rounded transition-colors flex items-center border border-emerald-500/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20 ${activeMenu === 'uemoa' ? 'bg-emerald-500/40' : ''}`}
                onClick={() => toggleMenu('uemoa')}
              >
                <Globe size={14} className="mr-1.5 text-emerald-400" /> UEMOA / Sénégal
              </button>
              {activeMenu === 'uemoa' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-md shadow-2xl py-1 z-50 text-slate-100">
                  <Link to="/uemoa/compliance" className="block px-4 py-2 text-sm hover:bg-slate-800 flex items-center" onClick={() => setActiveMenu(null)}>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    Liasse Fiscale DSF (OHADA)
                  </Link>
                  <Link to="/uemoa/compliance" className="block px-4 py-2 text-sm hover:bg-slate-800 flex items-center" onClick={() => setActiveMenu(null)}>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    Impôts & Retenues (VRS/BRC)
                  </Link>
                  <div className="border-t border-slate-700 my-1"></div>
                  <Link to="/uemoa/compliance" className="block px-4 py-2 text-sm hover:bg-slate-800 flex items-center" onClick={() => setActiveMenu(null)}>
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    Mobile Money Engine
                  </Link>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                className={`px-3 py-1 rounded transition-colors ${activeMenu === 'structure' ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`}
                onClick={() => toggleMenu('structure')}
              >
                Structure
              </button>
              {activeMenu === 'structure' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-slate-800">
                  <Link to="/structure/plan-comptable" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Plan comptable</Link>
                  <Link to="/structure/plan-tiers" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Plan tiers</Link>
                  <Link to="/structure/taux-taxes" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Taux de taxes</Link>
                  <Link to="/structure/codes-journaux" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Codes journaux</Link>
                  <Link to="/structure/banques" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Banques</Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/structure/plan-analytique" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Plan analytique</Link>
                  <Link to="/structure/modeles-saisie" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Modèles de saisie</Link>
                  <Link to="/structure/modeles-reglement" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Modèles de règlement</Link>
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                className={`px-3 py-1 rounded transition-colors ${activeMenu === 'traitement' ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`}
                onClick={() => toggleMenu('traitement')}
              >
                Traitement
              </button>
              {activeMenu === 'traitement' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-slate-800">
                  <Link to="/traitement/saisie-journal" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Saisie des journaux</Link>
                  <Link to="/traitement/saisie-piece" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Saisie par pièce</Link>
                  <Link to="/traitement/saisie-lot" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Saisie par lot (Import)</Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/traitement/saisie-ia" className="block px-4 py-2 text-sm bg-gradient-to-r from-indigo-50 to-emerald-50 hover:from-indigo-100 hover:to-emerald-100 font-medium text-indigo-800" onClick={() => setActiveMenu(null)}>
                    <span className="flex items-center">✨ Saisie Intelligente (OCR IA)</span>
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/traitement/lettrage" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Interrogation et Lettrage</Link>
                  <Link to="/traitement/interrogation-tiers" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Interrogation Tiers</Link>
                  <Link to="/traitement/rapprochement" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Rapprochement bancaire</Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/traitement/cloture" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Clôture des journaux</Link>
                  <Link to="/traitement/cloture-mensuelle" className="block px-4 py-2 text-sm hover:bg-slate-100 font-medium text-indigo-700" onClick={() => setActiveMenu(null)}>✅ Workflow Clôture Mensuelle</Link>
                  <Link to="/traitement/fin-exercice" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Fin d'exercice</Link>
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                className={`px-3 py-1 rounded transition-colors ${activeMenu === 'etat' ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`}
                onClick={() => toggleMenu('etat')}
              >
                État
              </button>
              {activeMenu === 'etat' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-slate-800">
                  <Link to="/etat/brouillard" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Brouillard</Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/etat/grand-livre" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Grand-Livre des Comptes</Link>
                  <Link to="/etat/balance" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Balance des Comptes</Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/etat/bilan" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Bilan</Link>
                  <Link to="/etat/compte-resultat" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Compte de résultat</Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/etat/declaration-tva" className="block px-4 py-2 text-sm hover:bg-slate-100 text-emerald-700 font-medium" onClick={() => setActiveMenu(null)}>Déclaration TVA (Automatique)</Link>
                </div>
              )}
            </div>
          </div>

          {/* Gestion Commerciale & Budget */}
          <div className="flex space-x-1 text-sm ml-2 border-l border-indigo-700 pl-2">
            <div className="relative">
              <button
                className={`px-3 py-1 rounded transition-colors flex items-center text-xs ${activeMenu === 'vente' ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`}
                onClick={() => toggleMenu('vente')}
              >
                <Receipt size={12} className="mr-1" /> Facturation
              </button>
              {activeMenu === 'vente' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-slate-800">
                  <Link to="/vente/facturation" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Gestion des Factures</Link>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                className={`px-3 py-1 rounded transition-colors flex items-center text-xs ${activeMenu === 'gestion' ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`}
                onClick={() => toggleMenu('gestion')}
              >
                <TrendingUp size={12} className="mr-1" /> Gestion
              </button>
              {activeMenu === 'gestion' && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-slate-800">
                  <Link to="/gestion/budget" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Contrôle Budgétaire</Link>
                  <Link to="/gestion/tresorerie" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Trésorerie & Relances</Link>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className={`px-3 py-1 rounded transition-colors flex items-center text-xs ${activeMenu === 'achat' ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`}
                onClick={() => toggleMenu('achat')}
              >
                <ShoppingCart size={12} className="mr-1" /> Achats
              </button>
              {activeMenu === 'achat' && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-slate-800">
                  <Link to="/achat/procure-to-pay" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Procure-to-Pay (Commandes)</Link>
                </div>
              )}
            </div>

            {/* Admin Menu */}
            <div className="relative">
              <button
                className={`px-3 py-1 rounded transition-colors flex items-center text-xs ${activeMenu === 'admin' ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`}
                onClick={() => toggleMenu('admin')}
              >
                🛡️ Admin
              </button>
              {activeMenu === 'admin' && (
                <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-slate-800">
                  <Link to="/admin/utilisateurs" className="block px-4 py-2 text-sm hover:bg-slate-100" onClick={() => setActiveMenu(null)}>Utilisateurs & Drôits</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 text-sm">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-indigo-800 transition-colors"
            title={isDark ? 'Mode Clair' : 'Mode Nuit'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {currentDossier ? (
            <>
              <span className="text-indigo-200 truncate max-w-xs" title={currentDossier.raisonSociale}>{currentDossier.raisonSociale}</span>
              <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center font-bold">
                {currentDossier.raisonSociale.substring(0, 2).toUpperCase()}
              </div>
            </>
          ) : (
            <span className="text-indigo-300 italic">Aucun fichier ouvert</span>
          )}
        </div>
      </nav>

      {/* Modal Sauvegarde/Restauration */}
      {isBackupModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Sauvegarde et Restauration</h3>
              <button onClick={() => setIsBackupModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 flex items-center">
                  <Download className="mr-2 text-primary" size={18} />
                  Sauvegarder les données
                </h4>
                <p className="text-sm text-slate-500">
                  Télécharge l'intégralité de la base de données (dossiers, écritures, comptes) dans un fichier JSON sur votre ordinateur.
                </p>
                <button 
                  onClick={handleBackup}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 flex justify-center items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Exporter la sauvegarde</span>
                </button>
              </div>

              <div className="border-t border-slate-200 pt-6 space-y-3">
                <h4 className="font-medium text-slate-900 flex items-center">
                  <Upload className="mr-2 text-emerald-600" size={18} />
                  Restaurer les données
                </h4>
                <p className="text-sm text-slate-500">
                  Importe un fichier de sauvegarde précédemment créé. <strong className="text-rose-600">Attention : Cette action remplacera toutes les données actuelles.</strong>
                </p>
                
                <input 
                  type="file" 
                  accept=".json"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleRestore}
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 flex justify-center items-center space-x-2"
                >
                  <Upload size={16} />
                  <span>Importer une sauvegarde</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
